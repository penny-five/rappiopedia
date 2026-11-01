#!/usr/bin/env python3
"""Rappiopedia image processor: source images -> small local WebP files.

Usage:
  python -m pip install Pillow
  python scripts/process_images.py --download --update-data
  python scripts/process_images.py --update-data  # use assets/source-images/<id>.*
"""
from __future__ import annotations

import argparse
from io import BytesIO
import json
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.request

try:
    from PIL import Image, ImageOps, UnidentifiedImageError
except ImportError:
    raise SystemExit("Pillow missing. Install with: python -m pip install Pillow")

ROOT = Path(__file__).resolve().parents[1]
NETWORK = ROOT / "src" / "data" / "network.json"
SOURCES = ROOT / "assets" / "source-images"
OUTPUT = ROOT / "public" / "images"
ALLOWED_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif")
MAX_INPUT_BYTES = 12 * 1024 * 1024
Image.MAX_IMAGE_PIXELS = 25_000_000


def fetch_image(url: str) -> bytes:
    if not url.startswith(("https://", "http://")):
        raise ValueError("Expected an HTTP(S) image URL")
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; RappiopediaImageMankeli/1.0)",
            "Accept": "image/avif,image/webp,image/png,image/jpeg,image/*",
        },
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=20) as response:
                if response.status != 200:
                    raise ValueError(f"HTTP {response.status}")
                data = response.read(MAX_INPUT_BYTES + 1)
                if len(data) > MAX_INPUT_BYTES:
                    raise ValueError("Source file exceeds 12 MiB")
                return data
        except urllib.error.HTTPError as exc:
            if exc.code not in (429, 500, 502, 503, 504) or attempt == 2:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError("Image download failed")


def optimize_image(raw: bytes, max_width=720, max_height=720, max_kb=160) -> bytes:
    """Return WebP bytes capped by max_kb; fail rather than save an oversized file."""
    with Image.open(BytesIO(raw)) as original:
        if original.width * original.height > Image.MAX_IMAGE_PIXELS:
            raise ValueError("Source dimensions exceed image pixel limit")
        image = ImageOps.exif_transpose(original)
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        last_size = 0
        for step in range(5):
            if step:
                image.thumbnail((max(120, int(image.width * .82)),
                                 max(120, int(image.height * .82))),
                                Image.Resampling.LANCZOS)
            for quality in (82, 74, 66, 58, 48, 38, 30):
                out = BytesIO()
                image.save(out, format="WEBP", quality=quality, method=6)
                blob = out.getvalue()
                last_size = len(blob)
                if last_size <= max_kb * 1024:
                    return blob
        raise ValueError(f"Image would still be {last_size} bytes (max {max_kb} KiB)")


def source_file(node_id: str) -> Path | None:
    for ext in ALLOWED_EXT:
        path = SOURCES / (node_id + ext)
        if path.is_file():
            return path
    return None


def run(args) -> int:
    data = json.loads(NETWORK.read_text(encoding="utf-8"))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    success, cached, errors = [], [], []
    for node in data["nodes"]:
        node_id = node["id"]
        if not re.fullmatch(r"[a-zA-Z0-9_-]+", node_id):
            errors.append(f"{node_id}: invalid filename id")
            continue
        url = node.get("imageSource") or node.get("image") or ""
        if not url:
            continue
        destination = OUTPUT / f"{node_id}.webp"
        new_image = f"images/{node_id}.webp"
        if destination.is_file() and not args.force:
            if args.update_data and node.get("image") != new_image:
                if url.startswith(("https://", "http://")):
                    node["imageSource"] = url
                node["image"] = new_image
            cached.append(node_id)
            continue
        try:
            local = source_file(node_id)
            if local is not None:
                raw = local.read_bytes()
            elif args.download and url.startswith(("https://", "http://")):
                raw = fetch_image(url)
            else:
                raise ValueError("No local source image (use --download to fetch from URL)")
            result = optimize_image(raw, args.max_width, args.max_height, args.max_kb)
            if not args.dry_run:
                destination.write_bytes(result)
                if args.update_data:
                    if url.startswith(("https://", "http://")):
                        node["imageSource"] = url
                    node["image"] = new_image
            success.append(f"{node_id} ({len(result)//1024} KiB)")
        except (OSError, ValueError, urllib.error.URLError, UnidentifiedImageError, Image.DecompressionBombError) as exc:
            errors.append(f"{node_id}: {type(exc).__name__}: {exc}")
            # Do not leave a broken external hotlink in the published graph.
            # Keep the original URL for a later retry.
            if args.update_data and not args.dry_run and url.startswith(("https://", "http://")):
                node["imageSource"] = url
                node.pop("image", None)
    if args.update_data and not args.dry_run:
        NETWORK.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                           encoding="utf-8")
    for name in success:
        print("OK  ", name)
    for name in cached:
        print("SKIP", name, "(already optimized)")
    for message in errors:
        print("FAIL", message, file=sys.stderr)
    print(f"Processed: {len(success)}, existing: {len(cached)}, errors: {len(errors)}")
    if errors and args.fail_on_errors:
        return 1
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Resize source photos into WebP files for Rappiopedia")
    parser.add_argument("--download", action="store_true", help="Fetch source URLs if local file is missing")
    parser.add_argument("--update-data", action="store_true", help="Write local paths to network.json after success")
    parser.add_argument("--force", action="store_true", help="Re-encode even if image already exists")
    parser.add_argument("--dry-run", action="store_true", help="Do not write output images or data")
    parser.add_argument("--fail-on-errors", action="store_true", help="Exit nonzero if any source fails")
    parser.add_argument("--max-width", type=int, default=720)
    parser.add_argument("--max-height", type=int, default=720)
    parser.add_argument("--max-kb", type=int, default=160)
    args = parser.parse_args()
    if min(args.max_width, args.max_height, args.max_kb) < 32:
        parser.error("Minimum supported size is 32")
    return run(args)


if __name__ == "__main__":
    raise SystemExit(main())

import io
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from process_images import optimize_image
from PIL import Image
import contextlib
import json
import struct
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest.mock import patch
import zlib
import process_images



class ImageMankeliTests(unittest.TestCase):
    def test_converts_to_small_webp(self):
        im = Image.new("RGB", (2000, 1400), (134, 134, 134))
        buf = io.BytesIO()
        im.save(buf, format="PNG")
        out = optimize_image(buf.getvalue(), 720, 720, 150)
        self.assertTrue(out.startswith(b"RIFF"))
        self.assertLessEqual(len(out), 150 * 1024)
        result = Image.open(io.BytesIO(out))
        self.assertEqual(result.format, "WEBP")
        self.assertLessEqual(result.width, 720)
        self.assertLessEqual(result.height, 720)

    def test_rejects_invalid_image(self):
        with self.assertRaises(Exception):
            optimize_image(b"Not an image")

    def test_decompression_bomb_skips_source_and_continues(self):
        # Alter a valid tiny PNG header to declare >50 million pixels without
        # allocating or decompressing a giant image in the test runner.
        png = io.BytesIO()
        Image.new("RGB", (1, 1), (30, 40, 50)).save(png, format="PNG")
        oversized = bytearray(png.getvalue())
        oversized[16:24] = struct.pack(">II", 8192, 8192)
        oversized[29:33] = struct.pack(">I", zlib.crc32(oversized[12:29]))
        with self.assertRaises(Image.DecompressionBombError):
            optimize_image(bytes(oversized))

        with TemporaryDirectory() as directory:
            base = Path(directory)
            network = base / "network.json"
            network.write_text(json.dumps({"nodes": [
                {"id": "oversized", "image": "images/oversized.webp",
                 "imageSource": "https://example.org/oversized.png"},
                {"id": "normal", "image": "images/normal.webp",
                 "imageSource": "https://example.org/normal.png"}
            ]}), encoding="utf-8")
            args = SimpleNamespace(download=True, update_data=True, force=False,
                                   dry_run=False, max_width=720, max_height=720,
                                   max_kb=160, fail_on_errors=False)
            stderr = io.StringIO()
            with (
                patch.object(process_images, "NETWORK", network),
                patch.object(process_images, "OUTPUT", base / "images"),
                patch.object(process_images, "SOURCES", base / "sources"),
                patch.object(process_images, "fetch_image",
                             side_effect=lambda url: bytes(oversized) if "oversized" in url else png.getvalue()),
                contextlib.redirect_stderr(stderr),
            ):
                self.assertEqual(process_images.run(args), 0)

            saved = json.loads(network.read_text(encoding="utf-8"))["nodes"]
            self.assertNotIn("image", saved[0])
            self.assertEqual(saved[0]["imageSource"], "https://example.org/oversized.png")
            self.assertEqual(saved[1]["image"], "images/normal.webp")
            self.assertTrue((base / "images" / "normal.webp").is_file())
            self.assertIn("DecompressionBombError", stderr.getvalue())


if __name__ == "__main__":
    unittest.main()

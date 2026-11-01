---
name: rappiopedia-images
description: Find, verify and publish missing or incorrect photos for people in Rappiopedia. Use for portrait/image collection, broken or wrong portraits, and image backlogs; optional starting person.
---

# Rappiopedia person-image research

**Outcome:** publish verified, correctly attributed photographs for existing person nodes in this run. A list of suggestions alone is not enough when repository edits are available. The user can specify a person or delegate the whole missing-image backlog.

## Read the existing implementation

- Read `AGENTS.md`, `docs/CONTENT_AUTHORING.md` (Images), `src/data/network.json`, `scripts/process_images.py`, `.github/workflows/deploy.yml`.
- Run `npm run images:candidates` (or `npm run images:candidates -- --all`) to see person nodes with no picture and sourced pictures still waiting to be generated. Prefer featured/central people, then continue through the backlog.
- Each person has a unique `id`; reuse it. Do not create duplicate nodes merely to attach a portrait.
- This workflow can also fix wrong photos. Inspect `imageSource` and existing `public/images/<id>.webp` before trusting the existing assignment. For example, Sami Kieksi's previous Findance image URL contained `tapausaarnio-tv` and did not correspond to the intended subject; it was replaced with his named Wikimedia Commons award portrait.

## Find a photo and check the caption

1. Search the person's full name, artist/stream nickname and aliases, preferably with `kuva`, `pressikuva`, `portrait`, `Wikimedia Commons`, or a named publisher. Search image results **and** the image's source page.
2. Prefer a clear, recognizable single-person portrait, photo from their own public content, or a labeled publisher/press photo. Media photos may work as well as Commons. Where several people are in a photo, verify who is who from the caption before selecting a crop.
3. Confirm that the **source page explicitly connects the picture to the intended person**, not just that the search result or file name contains their name. Never identify a real person's photo from facial resemblance alone; don't invent portraits or attach a different person with a similar name. If uncertain, skip and record the candidate for later.
4. Copy the **direct image file URL** (not the article page URL) and preserve the article/photo page separately for future checking when useful. Do not put a generic search-result URL into `imageSource`.
5. Keep the specific photographer or publisher and any Commons attribution/license in `imageCredit`. The photo's real origin must remain traceable.

## Publish the image

In `src/data/network.json`, edit the existing person node:

```json
{
  "id": "person-id",
  "image": "images/person-id.webp",
  "imageSource": "https://example.com/photo.jpg",
  "imageCredit": "Photographer / publisher"
}
```

- `image` is the optimized site path, `imageSource` is the **downloadable image URL**, `imageCredit` is the original credit. Preserve the node's other properties, notes, relationships and article.
- Store processed assets at `public/images/<id>.webp`, never an arbitrarily renamed source image. The existing `scripts/process_images.py` scales and compresses photos (720 px and at most 160 KiB by default). To process locally: `python -m pip install Pillow && npm run images`.
- The GitHub Pages workflow also runs the processor before building; new `imageSource` URLs become optimized assets in the deploy artifact. **If the file already exists, it is cached.** When fixing an actually wrong old image, remove that tracked `public/images/<id>.webp` or explicitly regenerate it with `--force` so the bad picture cannot linger. Only delete the specific wrong file.
- If a source cannot be downloaded, try a stable direct photo URL from the verified publication instead of falsely treating it as a finished photo. Never leave an old incorrect portrait in use as a fallback.

## Validate and finish

- Check JSON syntax; every `image` field must match the correct ID. Ensure `imageSource` points to an actual image, and that `imageCredit` names its publisher/photographer.
- Run `npm test` and `npm run build` when available. Also run `npm run images` locally, inspect any failures, check representative WebP output, and verify a sample of portraits in both the encyclopedia infobox and Rappioverse.
- Report *exactly* which images were added/replaced, how many of the person nodes remain without sources, whether binary assets were actually generated, and a commit/PR link. Clearly distinguish a recorded URL from a successfully generated, deployed WebP.
- On a focused request, fix that person's image first. On an open-ended request, choose the next high-impact missing people yourself and complete a batch without asking for a seed.

import io
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from process_images import optimize_image
from PIL import Image


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


if __name__ == "__main__":
    unittest.main()

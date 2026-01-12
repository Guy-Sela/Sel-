"""Generate chevron favicon assets (PNG set + ICO).

Run (from Selà repo root):
  .venv/bin/python helpers/favicon_gold.py --variant silver

Outputs:
  helpers/favicons/experiments/chevron_{variant}_[size].png
  helpers/favicons/experiments/favicon_{variant}.ico
"""

import argparse
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    raise ImportError("Pillow is required. Try: python3 -m pip install pillow")

OUTPUT_DIR = Path(__file__).resolve().parent / "favicons" / "experiments"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Color variants (fill, stroke)
VARIANTS = {
    "gold": ((255, 196, 87, 255), (227, 165, 53, 255)),
    "silver": ((232, 232, 238, 255), (178, 178, 190, 255)),
    "white": ((255, 255, 255, 255), (210, 210, 210, 255)),
}

# U+276F chevron outline (Zapf Dingbats), scaled to fit a 128 viewBox.
GLYPH_PTS = [
    (985.0, 711.0),
    (440.0, 0.0),
    (57.0, 0.0),
    (602.0, 711.0),
    (57.0, 1421.0),
    (440.0, 1421.0),
]


def make_points(W: int):
    """Map glyph points to pixel space.

    We use the same transform as the SVG:
      translate(64,64) scale(0.056,-0.056) translate(-521,-710.5)

    Then scale from 128 space up to W.
    """

    s = 0.056
    tx, ty = -521.0, -710.5

    vb_pts = []
    for x, y in GLYPH_PTS:
        vx = (x + tx) * s + 64.0
        vy = (y + ty) * (-s) + 64.0
        vb_pts.append((vx, vy))

    def map128(pt):
        x, y = pt
        return (x * (W / 128.0), y * (W / 128.0))

    return [map128(p) for p in vb_pts]


def render(size: int, fill=(255, 196, 87, 255), stroke=(227, 165, 53, 255), stroke_w=2):
    """Render a single chevron with transparent background."""

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pts = make_points(size)

    # Draw stroke under the fill for crisp edges.
    draw.polygon(pts, fill=None, outline=stroke, width=max(1, int(stroke_w * size / 128.0)))
    draw.polygon(pts, fill=fill)
    return img


def main():
    parser = argparse.ArgumentParser(description="Generate chevron favicon PNGs + ICO.")
    parser.add_argument(
        "--variant",
        choices=sorted(VARIANTS.keys()),
        default="gold",
        help="Color variant to generate.",
    )
    args = parser.parse_args()

    fill, stroke = VARIANTS[args.variant]

    sizes = [512, 256, 192, 180, 128, 64, 48, 32, 16]
    base = render(1024, fill=fill, stroke=stroke)  # oversample for downsampling quality

    for s in sizes:
        img = base.resize((s, s), Image.Resampling.LANCZOS)
        img.save(OUTPUT_DIR / f"chevron_{args.variant}_{s}.png")

    # ICO with common sizes
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)]
    base.save(OUTPUT_DIR / f"favicon_{args.variant}.ico", sizes=ico_sizes)


if __name__ == "__main__":
    main()

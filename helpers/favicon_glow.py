"""
Generates a "Glowing Chevron" favicon (shape-based glow).
Usage: .venv/bin/python favicon_glow.py
"""
from pathlib import Path
try:
    from PIL import Image, ImageDraw, ImageFilter, ImageChops
except ImportError:
    raise ImportError("Please run with .venv/bin/python")

OUTPUT_DIR = Path(__file__).resolve().parent / "favicons" / "experiments"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def generate_shape_glow():
    # Render at high res for quality
    SIZE = 512
    # Chevron path data (Zapf Dingbats U+276F)
    glyph_pts = [
        (985.0, 711.0), (440.0, 0.0), (57.0, 0.0),
        (602.0, 711.0), (57.0, 1421.0), (440.0, 1421.0),
    ]
    
    # Scale to fit in 512x512 with padding for glow
    # (Leaving ~20% padding for the glow to radiate)
    scale_f = (SIZE * 0.75) / 1421.0
    
    tx = -521.0
    ty = -710.5
    
    def transform(pt):
        x, y = pt
        # Centering transform
        px = (x + tx) * scale_f + (SIZE / 2.0)
        py = (y + ty) * (-scale_f) + (SIZE / 2.0)
        return (px, py)

    poly = [transform(p) for p in glyph_pts]

    # 1. Draw the Chevron Mask (White shape)
    base_img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(base_img)
    draw.polygon(poly, fill=(255, 255, 255, 255))
    
    # 2. Create the Glow Layers
    # Strategy: Create a gold copy, blur it heavily, composite behind.
    
    # Layer 1: Wide, soft amber glow
    glow_wide = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow_wide)
    gdraw.polygon(poly, fill=(255, 190, 85, 100)) # Amber, semi-transparent
    glow_wide = glow_wide.filter(ImageFilter.GaussianBlur(radius=SIZE * 0.12))
    
    # Layer 2: Medium, brighter gold glow
    glow_mid = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    mdraw = ImageDraw.Draw(glow_mid)
    mdraw.polygon(poly, fill=(255, 215, 120, 160)) # Gold
    glow_mid = glow_mid.filter(ImageFilter.GaussianBlur(radius=SIZE * 0.06))
    
    # Layer 3: Tight, intense hot core
    glow_tight = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(glow_tight)
    tdraw.polygon(poly, fill=(255, 240, 180, 255)) # Light gold
    glow_tight = glow_tight.filter(ImageFilter.GaussianBlur(radius=SIZE * 0.02))

    # 3. Composite
    # Start with transparent
    final = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    # Add wide glow
    final = Image.alpha_composite(final, glow_wide)
    # Add mid glow
    final = Image.alpha_composite(final, glow_mid)
    # Add tight glow
    final = Image.alpha_composite(final, glow_tight)
    # Add the crisp white chevron on top
    final = Image.alpha_composite(final, base_img)
    
    # Save Master
    final.save(OUTPUT_DIR / "chevron_shape_glow_512.png")
    
    # Save resized versions
    for s in [256, 192, 48, 32, 16]:
        final.resize((s, s), Image.Resampling.LANCZOS).save(
            OUTPUT_DIR / f"chevron_shape_glow_{s}.png"
        )

if __name__ == "__main__":
    generate_shape_glow()


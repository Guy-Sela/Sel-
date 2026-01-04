"""
Extract an outlined SVG `<path>` for the Unicode glyph U+276F (❯) using fontTools.

Why: terminal glyphs are font-dependent; this gives you a deterministic chevron outline
without relying on Inkscape or GUI tools.

Usage (recommended):
  /Users/admin/Desktop/Selà/.venv/bin/python glyph_u276f_to_svg.py

This writes:
  - /Users/admin/Desktop/Selà/u276f-outline.svg (simple outline + ringGlow)
  - /Users/admin/Desktop/Selà/favicon-chevron-golden.svg (radial halo ring + pure white chevron)

Note: U+276F is "Heavy Right-Pointing Angle Quotation Mark Ornament"
See: https://www.compart.com/en/unicode/U+276F
"""

from __future__ import annotations

from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen


U276F = 0x276F  # ❯


def _find_glyph_name_for_unicode(font: TTFont, codepoint: int) -> str | None:
    for sub in font["cmap"].tables:
        if sub.isUnicode() and sub.cmap and codepoint in sub.cmap:
            return sub.cmap[codepoint]
    return None


def extract_u276f_outline_svg(
    *,
    font_path: str,
    out_path: str,
    viewbox_size: int = 128,
    margin: int = 12,
    ring_glow: bool = True,
) -> None:
    font = TTFont(font_path)
    glyph_name = _find_glyph_name_for_unicode(font, U276F)
    if not glyph_name:
        raise SystemExit(f"U+276F not found in: {font_path}")

    glyph_set = font.getGlyphSet()
    glyph = glyph_set[glyph_name]

    # SVG path commands
    pen = SVGPathPen(glyph_set)
    glyph.draw(pen)
    d = pen.getCommands()

    # Bounds
    bpen = BoundsPen(glyph_set)
    glyph.draw(bpen)
    if not bpen.bounds:
        raise SystemExit("No bounds for glyph")
    xmin, ymin, xmax, ymax = bpen.bounds
    w = xmax - xmin
    h = ymax - ymin

    size = float(viewbox_size)
    scale = min((size - 2 * margin) / w, (size - 2 * margin) / h)
    cx_g = (xmin + xmax) / 2
    cy_g = (ymin + ymax) / 2

    # Flip Y because font coords are Y-up, SVG is Y-down
    transform = (
        f"translate({size/2:.6f} {size/2:.6f}) "
        f"scale({scale:.6f} {-scale:.6f}) "
        f"translate({-cx_g:.6f} {-cy_g:.6f})"
    )

    filter_block = ""
    halo_path = ""
    if ring_glow:
        filter_block = """
  <defs>
    <filter id="ringGlow" x="-70%" y="-70%" width="240%" height="240%" color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="10" result="dilated"/>
      <feGaussianBlur in="dilated" stdDeviation="10" result="blurred"/>
      <feComposite in="blurred" in2="SourceAlpha" operator="out" result="ring"/>
      <feFlood flood-color="#FFBE55" flood-opacity="0.95" result="gold"/>
      <feComposite in="gold" in2="ring" operator="in" result="coloredRing"/>
      <feGaussianBlur in="coloredRing" stdDeviation="1.5" result="softRing"/>
      <feMerge><feMergeNode in="softRing"/></feMerge>
    </filter>
  </defs>
""".rstrip(
            "\n"
        )
        halo_path = f'  <path d="{d}" transform="{transform}" fill="#FFFFFF" filter="url(#ringGlow)"/>\n'

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {viewbox_size} {viewbox_size}" '
        f'fill="none" aria-label="U+276F outlined">\n'
        f"{filter_block}\n"
        f"{halo_path}"
        f'  <path d="{d}" transform="{transform}" fill="#FFFFFF"/>\n'
        f"</svg>\n"
    )

    Path(out_path).write_text(svg)

def write_favicon_svg_with_radial_ring(
    *,
    d: str,
    transform: str,
    out_path: str,
) -> None:
    """
    Write a favicon-ready SVG:
    - pure white chevron
    - round/radial-gradient halo, masked to exist only around the chevron (ring, not backlight)
    """
    # Halo circle radius = frame radius (64) - padding.
    padding = 6
    halo_r = 64 - padding

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" aria-label="Selà chevron (U+276F) with radial halo ring">
  <defs>
    <radialGradient id="haloGrad" gradientUnits="userSpaceOnUse" cx="64" cy="64" r="{halo_r}">
      <stop offset="0%" stop-color="#FFD9A6" stop-opacity="0.90"/>
      <stop offset="35%" stop-color="#FFBE55" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#FFBE55" stop-opacity="0"/>
    </radialGradient>

    <filter id="ringAlpha" x="-70%" y="-70%" width="240%" height="240%" color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="10" result="dilated"/>
      <feGaussianBlur in="dilated" stdDeviation="10" result="blurred"/>
      <feComposite in="blurred" in2="SourceAlpha" operator="out" result="ring"/>
      <feGaussianBlur in="ring" stdDeviation="1.2" result="softRing"/>
    </filter>

    <mask id="haloRingMask">
      <rect width="128" height="128" fill="black"/>
      <path d="{d}" transform="{transform}" fill="white" filter="url(#ringAlpha)"/>
    </mask>
  </defs>

  <circle cx="64" cy="64" r="{halo_r}" fill="url(#haloGrad)" mask="url(#haloRingMask)"/>
  <path d="{d}" transform="{transform}" fill="#FFFFFF"/>
</svg>
'''
    Path(out_path).write_text(svg)


if __name__ == "__main__":
    # Best guess for U+276F on macOS: Zapf Dingbats includes it.
    # 1) Write the simple outline SVG (kept for inspection/debugging).
    extract_u276f_outline_svg(
        font_path="/System/Library/Fonts/ZapfDingbats.ttf",
        out_path="/Users/admin/Desktop/Selà/u276f-outline.svg",
        ring_glow=True,
    )
    # 2) Write the actual favicon candidate with radial halo ring (not behind the chevron fill).
    # Recompute the path+transform once for reuse:
    font = TTFont("/System/Library/Fonts/ZapfDingbats.ttf")
    glyph_name = _find_glyph_name_for_unicode(font, U276F)
    if not glyph_name:
        raise SystemExit("U+276F not found in ZapfDingbats.ttf")
    glyph_set = font.getGlyphSet()
    glyph = glyph_set[glyph_name]
    pen = SVGPathPen(glyph_set)
    glyph.draw(pen)
    d = pen.getCommands()
    bpen = BoundsPen(glyph_set)
    glyph.draw(bpen)
    xmin, ymin, xmax, ymax = bpen.bounds
    w = xmax - xmin
    h = ymax - ymin
    margin = 12
    size = 128.0
    scale = min((size - 2 * margin) / w, (size - 2 * margin) / h)
    cx_g = (xmin + xmax) / 2
    cy_g = (ymin + ymax) / 2
    transform = (
        f"translate({size/2:.6f} {size/2:.6f}) "
        f"scale({scale:.6f} {-scale:.6f}) "
        f"translate({-cx_g:.6f} {-cy_g:.6f})"
    )
    write_favicon_svg_with_radial_ring(
        d=d,
        transform=transform,
        out_path="/Users/admin/Desktop/Selà/favicon-chevron-golden.svg",
    )

    print("Wrote /Users/admin/Desktop/Selà/u276f-outline.svg")
    print("Wrote /Users/admin/Desktop/Selà/favicon-chevron-golden.svg")



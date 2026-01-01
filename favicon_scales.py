"""
Favicon/logo generator experiments (16x16).

How to run (macOS Big Sur note: `python` may be Python 2.7):

  # Preferred: use the repo venv (has Pillow)
  /Users/admin/Desktop/Selà/.venv/bin/python /Users/admin/Desktop/Selà/favicon_scales.py

  # Or, if your system python3 has Pillow installed:
  python3 favicon_scales.py

Outputs are written to: `favicons/experiments/`
"""

try:
    from PIL import Image, ImageDraw
except ImportError as e:
    raise ImportError(
        "Pillow (PIL) is required. If you're on macOS and `python` is Python 2, "
        "run with `python3 favicon_scales.py` (and ensure Pillow is installed for that python3)."
    )
import colorsys
from pathlib import Path
import random
import itertools

SIZE = 16
IMG_SIZE = (SIZE, SIZE)

OUTPUT_DIR = Path(__file__).resolve().parent / "favicons" / "experiments"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def hsv_to_rgb8(h, s, v):
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
    return (int(r * 255), int(g * 255), int(b * 255))

def diag_t(x, y):
    # 0 at top-left, 1 at bottom-right
    return (x + y) / (2 * (SIZE - 1))

def sat_falloff(t, power):
    # 1 at t=0 (fully saturated), 0 at t=1 (white possible when v=1)
    return 1.0 - (t**power)

def neighbors4(x, y):
    if x > 0:
        yield (x - 1, y)
    if x < SIZE - 1:
        yield (x + 1, y)
    if y > 0:
        yield (x, y - 1)
    if y < SIZE - 1:
        yield (x, y + 1)


def _greedy_assign(candidates, score_fn, restarts=5, seed=1337, fixed=None):
    """
    Greedy "maximize neighbor contrast" assignment.
    - candidates: iterable of unique values/colors (len must be SIZE*SIZE)
    - score_fn(a, b) -> numeric contrast score between two assigned values
    Returns a dict[(x,y)] -> value
    """
    rng0 = random.Random(seed)
    positions = [(x, y) for y in range(SIZE) for x in range(SIZE)]

    def total_score(assign):
        s = 0.0
        for y in range(SIZE):
            for x in range(SIZE):
                a = assign[(x, y)]
                if x + 1 < SIZE:
                    s += score_fn(a, assign[(x + 1, y)])
                if y + 1 < SIZE:
                    s += score_fn(a, assign[(x, y + 1)])
        return s

    best = None
    best_score = None

    fixed = fixed or {}

    for _ in range(restarts):
        rng = random.Random(rng0.random())
        remaining = list(candidates)
        rng.shuffle(remaining)

        assign = {}
        # Apply fixed assignments (e.g. pinned corners)
        for pos, val in fixed.items():
            assign[pos] = val
            remaining.remove(val)

        if not assign:
            start_pos = rng.choice(positions)
            assign[start_pos] = remaining.pop()

        while len(assign) < SIZE * SIZE:
            # choose most constrained (most assigned neighbors)
            best_pos = None
            best_pos_k = -1
            for (x, y) in positions:
                if (x, y) in assign:
                    continue
                k = 0
                for nx, ny in neighbors4(x, y):
                    if (nx, ny) in assign:
                        k += 1
                if k > best_pos_k:
                    best_pos_k = k
                    best_pos = (x, y)
                elif k == best_pos_k and rng.random() < 0.25:
                    best_pos = (x, y)

            x, y = best_pos
            neigh = [assign[(nx, ny)] for (nx, ny) in neighbors4(x, y) if (nx, ny) in assign]

            best_idx = 0
            best_val_score = None
            # evaluate all remaining candidates for this pixel
            for i, cand in enumerate(remaining):
                sc = 0.0
                for nval in neigh:
                    sc += score_fn(cand, nval)
                if best_val_score is None or sc > best_val_score:
                    best_val_score = sc
                    best_idx = i
            assign[(x, y)] = remaining.pop(best_idx)

        sc = total_score(assign)
        if best_score is None or sc > best_score:
            best = assign
            best_score = sc

    return best

def _greedy_assign_grid(width, height, candidates, score_fn, restarts=5, seed=1337, fixed=None):
    """
    Same idea as _greedy_assign, but for an arbitrary grid size (width x height).
    fixed: dict[(x,y)] -> candidate value
    """
    rng0 = random.Random(seed)
    fixed = fixed or {}

    positions = [(x, y) for y in range(height) for x in range(width)]

    def neighbors4_xy(x, y):
        if x > 0:
            yield (x - 1, y)
        if x < width - 1:
            yield (x + 1, y)
        if y > 0:
            yield (x, y - 1)
        if y < height - 1:
            yield (x, y + 1)

    def total_score(assign):
        s = 0.0
        for y in range(height):
            for x in range(width):
                a = assign[(x, y)]
                if x + 1 < width:
                    s += score_fn(a, assign[(x + 1, y)])
                if y + 1 < height:
                    s += score_fn(a, assign[(x, y + 1)])
        return s

    best = None
    best_score = None

    for _ in range(restarts):
        rng = random.Random(rng0.random())
        remaining = list(candidates)
        rng.shuffle(remaining)

        assign = {}
        for pos, val in fixed.items():
            assign[pos] = val
            remaining.remove(val)

        if not assign:
            start_pos = rng.choice(positions)
            assign[start_pos] = remaining.pop()

        while len(assign) < width * height:
            # pick most constrained (most assigned neighbors)
            best_pos = None
            best_k = -1
            for (x, y) in positions:
                if (x, y) in assign:
                    continue
                k = 0
                for nx, ny in neighbors4_xy(x, y):
                    if (nx, ny) in assign:
                        k += 1
                if k > best_k:
                    best_k = k
                    best_pos = (x, y)
                elif k == best_k and rng.random() < 0.25:
                    best_pos = (x, y)

            x, y = best_pos
            neigh = [assign[(nx, ny)] for (nx, ny) in neighbors4_xy(x, y) if (nx, ny) in assign]

            best_idx = 0
            best_val_score = None
            for i, cand in enumerate(remaining):
                sc = 0.0
                for nval in neigh:
                    sc += score_fn(cand, nval)
                if best_val_score is None or sc > best_val_score:
                    best_val_score = sc
                    best_idx = i
            assign[(x, y)] = remaining.pop(best_idx)

        sc = total_score(assign)
        if best_score is None or sc > best_score:
            best = assign
            best_score = sc

    return best


# ---------- Linear (row-by-row) ----------
def linear_image():
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            v = y * SIZE + x  # 0..255
            px[x, y] = (v, v, v)

    img.save(OUTPUT_DIR / "linear.png")


# ---------- Diagonal interpolation ----------
def diagonal_image():
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            t = (x + y) / (2 * (SIZE - 1))
            v = round(255 * t)
            px[x, y] = (v, v, v)

    img.save(OUTPUT_DIR / "diagonal.png")


# ---------- Hilbert curve ----------
def rot(n, x, y, rx, ry):
    if ry == 0:
        if rx == 1:
            x = n - 1 - x
            y = n - 1 - y
        x, y = y, x
    return x, y


def hilbert_index(x, y, n):
    d = 0
    s = n // 2
    while s > 0:
        rx = 1 if (x & s) else 0
        ry = 1 if (y & s) else 0
        d += s * s * ((3 * rx) ^ ry)
        x, y = rot(s, x, y, rx, ry)
        s //= 2
    return d


def hilbert_image():
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            v = hilbert_index(x, y, SIZE)
            px[x, y] = (v, v, v)

    img.save(OUTPUT_DIR / "hilbert.png")


# ---------- HSV / rainbow variants ----------
def hue_only():
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            i = y * SIZE + x
            h = i / 256.0
            t = diag_t(x, y)
            px[x, y] = hsv_to_rgb8(h, 1.0 - t, t)

    img.save(OUTPUT_DIR / "rainbow_hue.png")


def hue_value():
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            h = x / (SIZE - 1)
            t = diag_t(x, y)
            px[x, y] = hsv_to_rgb8(h, 1.0 - t, t)

    img.save(OUTPUT_DIR / "rainbow_hv.png")


def hue_value_vivid():
    """
    Like hue_value(), but keeps saturation high for most of the image.
    Saturation only drops close to bottom-right so we can still hit pure white there.
    """
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            h = x / (SIZE - 1)
            t = diag_t(x, y)  # brightness ramp TL->BR
            s = sat_falloff(t, 4)  # stays vivid longer; still reaches 0 at BR
            px[x, y] = hsv_to_rgb8(h, s, t)

    img.save(OUTPUT_DIR / "rainbow_hv_vivid.png")


def diagonal_vivid():
    """
    Vivid diagonal rainbow:
    - hue runs along the TL->BR diagonal
    - brightness runs along the same diagonal (TL black, BR white)
    - saturation stays high until near BR
    """
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            t = diag_t(x, y)
            h = t
            s = sat_falloff(t, 4)
            px[x, y] = hsv_to_rgb8(h, s, t)

    img.save(OUTPUT_DIR / "rainbow_diag_vivid.png")


def hilbert_hue():
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            h = hilbert_index(x, y, SIZE) / 256.0
            t = diag_t(x, y)
            px[x, y] = hsv_to_rgb8(h, 1.0 - t, t)

    img.save(OUTPUT_DIR / "rainbow_hilbert.png")

def hilbert_vivid():
    """
    Vivid Hilbert rainbow:
    - hue is Hilbert-shuffled
    - brightness is diagonal (TL black, BR white)
    - saturation stays high until near BR
    """
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            t = diag_t(x, y)
            h = hilbert_index(x, y, SIZE) / 256.0
            s = sat_falloff(t, 4)
            px[x, y] = hsv_to_rgb8(h, s, t)

    img.save(OUTPUT_DIR / "rainbow_hilbert_vivid.png")

def hv_gamma():
    """
    Brightness curve experiment (gamma):
    value = t**gamma, saturation fades to 0 at the end so BR can still be white.
    """
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    gamma = 0.7  # <1 brightens earlier; >1 keeps it darker longer
    for y in range(SIZE):
        for x in range(SIZE):
            h = x / (SIZE - 1)
            t = diag_t(x, y)
            v = t**gamma
            s = sat_falloff(t, 4)
            px[x, y] = hsv_to_rgb8(h, s, v)

    img.save(OUTPUT_DIR / "rainbow_hv_gamma07.png")


def hv_sat_falloff():
    """
    Saturation falloff experiment:
    keeps saturation even longer (higher power), then drops near BR.
    """
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            h = x / (SIZE - 1)
            t = diag_t(x, y)
            v = t
            s = sat_falloff(t, 8)
            px[x, y] = hsv_to_rgb8(h, s, v)

    img.save(OUTPUT_DIR / "rainbow_hv_sat8.png")


def hv_2d_mapping():
    """
    2D mapping experiment:
    - hue: left->right
    - saturation: top->bottom (more saturated on top)
    - value: TL->BR diagonal (pins TL black, BR white)
    """
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            h = x / (SIZE - 1)
            v = diag_t(x, y)
            s = 1.0 - (y / (SIZE - 1))
            px[x, y] = hsv_to_rgb8(h, s, v)

    img.save(OUTPUT_DIR / "rainbow_2d_hsv.png")


# ---------- "Opposite of Hilbert" (maximize local contrast) ----------
def max_contrast_bw():
    """
    Maximum local contrast (4-neighbor) in the simplest sense:
    black/white checkerboard so every orthogonal neighbor flips.
    """
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            v = 255 if ((x + y) & 1) else 0
            px[x, y] = (v, v, v)

    img.save(OUTPUT_DIR / "contrast_checker_bw.png")


def max_contrast_color():
    """
    Color version of max local contrast: complementary hues on a checkerboard.
    (red vs cyan by default).
    """
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            h = 0.0 if ((x + y) & 1) else 0.5  # complementary hues
            px[x, y] = hsv_to_rgb8(h, 1.0, 1.0)

    img.save(OUTPUT_DIR / "contrast_checker_color.png")

def max_contrast_unique_gray():
    """
    256 unique grayscale values (0..255), arranged to maximize 4-neighbor contrast.
    """
    def score(a: int, b: int) -> int:
        return abs(a - b)

    assign = _greedy_assign(list(range(256)), score, restarts=5, seed=2026)

    img = Image.new("RGB", IMG_SIZE)
    px = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            v = assign[(x, y)]
            px[x, y] = (v, v, v)
    img.save(OUTPUT_DIR / "contrast_unique_gray.png")


def max_contrast_unique_color():
    """
    256 unique RGB colors, arranged to maximize 4-neighbor contrast.
    Palette is a simple 8x8x4 RGB cube (256 total colors).
    """
    r_levels = [round(255 * i / 7) for i in range(8)]
    g_levels = [round(255 * i / 7) for i in range(8)]
    b_levels = [round(255 * i / 3) for i in range(4)]
    palette = [(r, g, b) for r in r_levels for g in g_levels for b in b_levels]

    def score(a, b) -> int:
        # squared Euclidean distance in RGB
        dr = a[0] - b[0]
        dg = a[1] - b[1]
        db = a[2] - b[2]
        return dr * dr + dg * dg + db * db

    assign = _greedy_assign(palette, score, restarts=5, seed=2027)

    img = Image.new("RGB", IMG_SIZE)
    px = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            px[x, y] = assign[(x, y)]
    img.save(OUTPUT_DIR / "contrast_unique_color.png")

def max_contrast_unique_color_pinned_bw():
    """
    Like max_contrast_unique_color(), but pins:
    - top-left to black
    - bottom-right to white
    """
    r_levels = [round(255 * i / 7) for i in range(8)]
    g_levels = [round(255 * i / 7) for i in range(8)]
    b_levels = [round(255 * i / 3) for i in range(4)]
    palette = [(r, g, b) for r in r_levels for g in g_levels for b in b_levels]

    def score(a, b) -> int:
        dr = a[0] - b[0]
        dg = a[1] - b[1]
        db = a[2] - b[2]
        return dr * dr + dg * dg + db * db

    fixed = {
        (0, 0): (0, 0, 0),
        (SIZE - 1, SIZE - 1): (255, 255, 255),
    }
    assign = _greedy_assign(palette, score, restarts=5, seed=2028, fixed=fixed)

    img = Image.new("RGB", IMG_SIZE)
    px = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            px[x, y] = assign[(x, y)]
    img.save(OUTPUT_DIR / "contrast_unique_color_bw.png")

def favicon_legible_blocks():
    """
    Favicon-friendly high-contrast "mosaic":
    Use 4x4 big blocks (each block is 4x4 pixels) so it stays legible at 16x16.
    Produces a color and grayscale version, both pinned TL black / BR white.
    """
    blocks = 4  # 4x4 blocks -> each block is 4x4 pixels
    block_px = SIZE // blocks

    # --- Grayscale: 16 distinct values ---
    gray_vals = [round(255 * i / (blocks * blocks - 1)) for i in range(blocks * blocks)]
    fixed_gray = {(0, 0): 0, (blocks - 1, blocks - 1): 255}

    def score_gray(a: int, b: int) -> int:
        return abs(a - b)

    gray_assign = _greedy_assign_grid(blocks, blocks, gray_vals, score_gray, restarts=20, seed=3030, fixed=fixed_gray)

    img = Image.new("RGB", IMG_SIZE)
    px = img.load()
    for by in range(blocks):
        for bx in range(blocks):
            v = gray_assign[(bx, by)]
            for y in range(by * block_px, (by + 1) * block_px):
                for x in range(bx * block_px, (bx + 1) * block_px):
                    px[x, y] = (v, v, v)
    img.save(OUTPUT_DIR / "favicon_blocks_gray.png")

    # --- Color: 16 distinct colors (4x4 palette in RGB) ---
    levels = [0, 85, 170, 255]
    palette16 = [(r, g, b) for r in levels for g in levels for b in [0]][:16]
    # Ensure white exists (we'll swap it in if needed)
    if (255, 255, 255) not in palette16:
        palette16[-1] = (255, 255, 255)
    if (0, 0, 0) not in palette16:
        palette16[0] = (0, 0, 0)

    fixed_col = {(0, 0): (0, 0, 0), (blocks - 1, blocks - 1): (255, 255, 255)}

    def score_rgb(a, b) -> int:
        dr = a[0] - b[0]
        dg = a[1] - b[1]
        db = a[2] - b[2]
        return dr * dr + dg * dg + db * db

    col_assign = _greedy_assign_grid(blocks, blocks, palette16, score_rgb, restarts=50, seed=3031, fixed=fixed_col)

    img = Image.new("RGB", IMG_SIZE)
    px = img.load()
    for by in range(blocks):
        for bx in range(blocks):
            c = col_assign[(bx, by)]
            for y in range(by * block_px, (by + 1) * block_px):
                for x in range(bx * block_px, (bx + 1) * block_px):
                    px[x, y] = c
    img.save(OUTPUT_DIR / "favicon_blocks_color.png")

def favicon_blocks_2x2():
    """
    Ultra-legible 2x2 block favicon (each block is 8x8 pixels).
    Produces a grayscale and color version, both pinned TL black / BR white.
    """
    blocks = 2
    block_px = SIZE // blocks  # 8

    # --- Grayscale (4 values) ---
    gray_vals = [0, 85, 170, 255]
    fixed_gray = {(0, 0): 0, (blocks - 1, blocks - 1): 255}

    def score_gray(a: int, b: int) -> int:
        return abs(a - b)

    gray_assign = _greedy_assign_grid(blocks, blocks, gray_vals, score_gray, restarts=50, seed=4040, fixed=fixed_gray)

    img = Image.new("RGB", IMG_SIZE)
    px = img.load()
    for by in range(blocks):
        for bx in range(blocks):
            v = gray_assign[(bx, by)]
            for y in range(by * block_px, (by + 1) * block_px):
                for x in range(bx * block_px, (bx + 1) * block_px):
                    px[x, y] = (v, v, v)
    img.save(OUTPUT_DIR / "favicon_blocks2_gray.png")

    # --- Color (4 colors) ---
    # Keep it simple + high-contrast: black, white, red, cyan.
    palette4 = [(0, 0, 0), (255, 255, 255), (255, 0, 0), (0, 255, 255)]
    fixed_col = {(0, 0): (0, 0, 0), (blocks - 1, blocks - 1): (255, 255, 255)}

    def score_rgb(a, b) -> int:
        dr = a[0] - b[0]
        dg = a[1] - b[1]
        db = a[2] - b[2]
        return dr * dr + dg * dg + db * db

    col_assign = _greedy_assign_grid(blocks, blocks, palette4, score_rgb, restarts=50, seed=4041, fixed=fixed_col)

    img = Image.new("RGB", IMG_SIZE)
    px = img.load()
    for by in range(blocks):
        for bx in range(blocks):
            c = col_assign[(bx, by)]
            for y in range(by * block_px, (by + 1) * block_px):
                for x in range(bx * block_px, (bx + 1) * block_px):
                    px[x, y] = c
    img.save(OUTPUT_DIR / "favicon_blocks2_color.png")

def accent_grave_favicon():
    """
    White-on-black grave accent ( ` ) like in "à", drawn oversized for favicon legibility.
    """
    img = Image.new("RGB", IMG_SIZE, (0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw a thick diagonal stroke resembling a grave accent.
    # (Grave leans left: top-right -> bottom-left)
    draw.line([(11, 2), (5, 11)], fill=(255, 255, 255), width=4)

    img.save(OUTPUT_DIR / "accent_grave_16.png")

def chevron_golden_favicon():
    """
    Centered chevron (❯) in white with a subtle golden halo.
    Symbolism:
    - chevron: prompt / forward motion / code
    - glow: awareness / consciousness
    """
    from PIL import ImageChops, ImageEnhance, ImageFilter

    # Key idea: render high-res (anti-aliased), then export multiple sizes.
    # 16x16 will always look "pixelated" when zoomed; judge it at 100%.
    scale = 64  # 16*64 = 1024px master render (extra oversampling for smoother edges)
    W = SIZE * scale
    H = SIZE * scale

    # Transparent background by default (plays nicer across browsers/themes).
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    # Use the extracted U+276F outline (same as `u276f-outline.svg` / `favicon-chevron-golden.svg`)
    # Glyph path (Zapf Dingbats): M985 711 440 0 H57 L602 711 L57 1421 H440 Z
    glyph_pts = [
        (985.0, 711.0),
        (440.0, 0.0),
        (57.0, 0.0),
        (602.0, 711.0),
        (57.0, 1421.0),
        (440.0, 1421.0),
    ]
    # Scaling down to ~80px height (oversampled to W/H) to ensure padding.
    # 80 / 1421 = 0.0563 approx 0.056
    s = 0.056
    tx, ty = -521.0, -710.5
    def glyph_to_viewbox(p):
        x, y = p
        x = (x + tx) * s + 64.0
        y = (y + ty) * (-s) + 64.0
        return (x, y)
    vb_pts = [glyph_to_viewbox(p) for p in glyph_pts]

    def map128(pt):
        x, y = pt
        return (x * (W / 128.0), y * (H / 128.0))
    poly = [map128(p) for p in vb_pts]

    # Draw chevron into an alpha mask so edges anti-alias cleanly after downsampling.
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    md.polygon(poly, fill=255)

    # --- Halo: Circular Annulus (Ring) ---
    # "consider the chevron is inside a circle, only outside the circle should the halo be seen"
    import math
    
    # 1. Geometry
    # Chevron furthest corners (back tips) are at radius ~48px.
    # We use 50 to ensure the halo starts completely "outside" the chevron.
    inner_r_vb = 50
    outer_r_vb = 64
    
    inner_r_px = inner_r_vb * (W / 128.0)
    outer_r_px = outer_r_vb * (W / 128.0)
    
    cx = cy = W / 2.0
    
    # 2. Draw the annular gradient
    halo_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = halo_layer.load()
    
    # Pre-calculate colors to save time in loop
    gold_inner = (255, 217, 166) # FFD9A6
    gold_outer = (255, 190, 85)  # FFBE55
    
    for y in range(H):
        dy = y - cy
        for x in range(W):
            dx = x - cx
            d = math.sqrt(dx * dx + dy * dy)
            
            # Mask out the inner circle (Transparency Area)
            if d < inner_r_px:
                px[x, y] = (0, 0, 0, 0)
                continue
                
            # If outside frame circle, clip
            if d > outer_r_px:
                px[x, y] = (0, 0, 0, 0)
                continue
                
            # Calculate intensity in the band
            # normalized distance t: 0.0 at inner_r, 1.0 at outer_r
            t = (d - inner_r_px) / (outer_r_px - inner_r_px)
            
            # Intensity curve: start strong (1.0), fade out
            intensity = (1.0 - t) ** 0.8
            alpha = int(255 * intensity * 0.95) # max alpha 0.95
            
            # Interpolate color
            r = int(gold_inner[0] * (1-t) + gold_outer[0] * t)
            g = int(gold_inner[1] * (1-t) + gold_outer[1] * t)
            b = int(gold_inner[2] * (1-t) + gold_outer[2] * t)
            
            px[x, y] = (r, g, b, alpha)

    # 3. Composite: Base (Transp) + Halo + Chevron (White)
    comp = Image.alpha_composite(base, halo_layer)
    
    # Draw testing border (1px at 128 scale => scale factor thickness)
    border_draw = ImageDraw.Draw(comp)
    border_w = max(1, int(W / 128.0))
    border_draw.rectangle([0, 0, W-1, H-1], outline=(128, 128, 128, 128), width=border_w)

    # Main chevron: white fill using the mask as alpha (keeps edges smooth)
    chev = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    chev.putalpha(mask)
    comp = Image.alpha_composite(comp, chev)

    # Save clean previews (not pixelated) for review
    try:
        resample = Image.Resampling.LANCZOS
    except AttributeError:
        resample = Image.LANCZOS

    # Save clean previews (downsampled from the oversampled master)
    comp.resize((512, 512), resample=resample).convert("RGBA").save(OUTPUT_DIR / "chevron_u276f_goldglow_512.png")
    comp.resize((256, 256), resample=resample).convert("RGBA").save(OUTPUT_DIR / "chevron_u276f_goldglow_256.png")

    # Export favicon-ish raster sizes for testing (still don't wire anything)
    for s in (16, 32, 48, 192):
        comp.resize((s, s), resample=resample).convert("RGBA").save(
            OUTPUT_DIR / "chevron_u276f_goldglow_{0}.png".format(s)
        )

    # Keep the historical name as the default "current candidate" 16x16.
    comp.resize((16, 16), resample=resample).convert("RGBA").save(OUTPUT_DIR / "chevron_golden.png")


def golden_illumination_favicon():
    """
    Golden Illumination: code meets consciousness.
    A radiant glow emanating from center—like a neural spark or cursor blink.
    Dark void at edges, warm gold/amber core, with subtle hue shift toward white at the brightest point.
    """
    import math
    
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()
    
    cx, cy = SIZE / 2 - 0.5, SIZE / 2 - 0.5  # center
    max_dist = math.sqrt(cx**2 + cy**2)  # corner distance
    
    # Golden palette: deep amber (h≈0.08) to bright gold (h≈0.12) to near-white
    for y in range(SIZE):
        for x in range(SIZE):
            dist = math.sqrt((x - cx)**2 + (y - cy)**2)
            t = dist / max_dist  # 0 at center, 1 at corners
            
            # Inverse: center is bright, edges are dark
            brightness = 1.0 - t
            
            # Hue: gold-amber range (0.08 to 0.14), shifting slightly toward orange at edges
            h = 0.10 + 0.04 * t
            
            # Saturation: lower at center (approaching white-gold), higher at mid-range
            # Creates a "glowing" effect—the core is almost white-hot
            if brightness > 0.7:
                s = 0.3 + 0.5 * (1.0 - brightness) / 0.3  # fade toward white at core
            else:
                s = 0.8 - 0.3 * (1.0 - brightness)  # stays saturated, then dims
            
            # Value: radial falloff with slight gamma for punch
            v = brightness ** 0.6
            
            px[x, y] = hsv_to_rgb8(h, max(0, min(1, s)), v)
    
    img.save(OUTPUT_DIR / "golden_illumination.png")


def golden_sela_favicon():
    """
    Selà mark with golden illumination: 
    A grave accent (`) glowing gold on dark, like a cursor or consciousness spark.
    """
    import math
    
    img = Image.new("RGB", IMG_SIZE, (8, 6, 12))  # near-black with slight purple tint (night)
    draw = ImageDraw.Draw(img)
    px = img.load()
    
    # First: draw radial golden glow behind the accent
    cx, cy = 7.5, 7  # glow center (slightly above image center, where accent sits)
    max_dist = 10.0
    
    for y in range(SIZE):
        for x in range(SIZE):
            dist = math.sqrt((x - cx)**2 + (y - cy)**2)
            t = min(1.0, dist / max_dist)
            
            # Soft golden glow falloff
            glow = (1.0 - t**1.5) * 0.6  # intensity
            
            if glow > 0.01:
                h = 0.10  # gold
                s = 0.7
                v = glow
                r, g, b = hsv_to_rgb8(h, s, v)
                # Blend with background
                bg = px[x, y]
                px[x, y] = (
                    min(255, bg[0] + r),
                    min(255, bg[1] + g),
                    min(255, bg[2] + b),
                )
    
    # Draw the grave accent stroke in bright gold/white
    # Thick diagonal: top-right to bottom-left
    draw.line([(10, 3), (5, 10)], fill=(255, 215, 80), width=3)
    # Highlight core for "illuminated" look
    draw.line([(9, 4), (6, 9)], fill=(255, 250, 200), width=1)
    
    img.save(OUTPUT_DIR / "golden_sela.png")


def golden_pulse_favicon():
    """
    Animated-feel static: concentric golden rings, like a signal or pulse.
    Represents both transmission (code) and awareness (consciousness).
    """
    import math
    
    img = Image.new("RGB", IMG_SIZE, (5, 3, 8))  # deep purple-black
    px = img.load()
    
    cx, cy = SIZE / 2 - 0.5, SIZE / 2 - 0.5
    
    for y in range(SIZE):
        for x in range(SIZE):
            dist = math.sqrt((x - cx)**2 + (y - cy)**2)
            
            # Create ring pattern with sine wave
            ring = (math.sin(dist * 1.2) + 1) / 2  # 0..1 oscillation
            
            # Distance falloff
            falloff = max(0, 1.0 - dist / 10)
            
            intensity = ring * falloff
            
            # Gold hue, varying saturation by ring position
            h = 0.11  # warm gold
            s = 0.6 + 0.3 * ring
            v = intensity ** 0.7
            
            if v > 0.02:
                px[x, y] = hsv_to_rgb8(h, s, v)
    
    img.save(OUTPUT_DIR / "golden_pulse.png")


def max_contrast_gray_bitreverse():
    """
    Alternative heuristic (from your snippet):
    map 0..255 through 8-bit bit-reversal, then lay out row-wise.
    """
    def bit_reverse8(x):
        return int(("{0:08b}".format(x))[::-1], 2)

    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    values = [bit_reverse8(v) for v in range(SIZE * SIZE)]
    for idx, (y, x) in enumerate(itertools.product(range(SIZE), range(SIZE))):
        v = values[idx]
        px[x, y] = (v, v, v)

    img.save(OUTPUT_DIR / "contrast_gray_bitreverse.png")


def max_contrast_color_farthest_hue():
    """
    Alternative heuristic (from your snippet):
    create 256 hues and order them by repeatedly picking the hue farthest
    from the previous hue on the color wheel, then lay out row-wise.
    """
    hues = [i / (SIZE * SIZE) for i in range(SIZE * SIZE)]

    shuffled_hues = []
    available = hues.copy()
    last = None
    while available:
        if last is None:
            h = available.pop(0)
        else:
            def hue_dist(a: float, b: float) -> float:
                d = abs(a - b)
                return min(d, 1.0 - d)

            h = max(available, key=lambda x: hue_dist(x, last))
            available.remove(h)

        shuffled_hues.append(h)
        last = h

    img = Image.new("RGB", IMG_SIZE)
    px = img.load()
    for idx, (y, x) in enumerate(itertools.product(range(SIZE), range(SIZE))):
        h = shuffled_hues[idx]
        r, g, b = colorsys.hsv_to_rgb(h, 1.0, 1.0)
        px[x, y] = (int(r * 255), int(g * 255), int(b * 255))

    img.save(OUTPUT_DIR / "contrast_color_farthest_hue.png")


def hilbert_rainbow_bw():
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            # Brightness is forced along the diagonal:
            # - top-left: black
            # - bottom-right: white (requires low saturation as well as high value)
            t = diag_t(x, y)  # 0..1

            # Hue varies by Hilbert order to keep the spatial "shuffle" effect.
            h = hilbert_index(x, y, SIZE) / 256.0

            v = t
            s = 1.0 - t
            px[x, y] = hsv_to_rgb8(h, s, v)

    img.save(OUTPUT_DIR / "hilbert_rainbow_bw.png")


def hilbert_rainbow_bw_option_a():
    """
    Option A: Brightness follows Hilbert order (black → white along the curve).
    Hue varies across X (left → right) for an easy-to-read rainbow component.
    Note: the "white" endpoint will *not* necessarily be bottom-right.
    """
    img = Image.new("RGB", IMG_SIZE)
    px = img.load()

    for y in range(SIZE):
        for x in range(SIZE):
            h = x / (SIZE - 1)  # full rainbow across x
            v = hilbert_index(x, y, SIZE) / 255.0  # black → white along Hilbert
            s = 1.0 - v  # fade to white at the Hilbert endpoint
            px[x, y] = hsv_to_rgb8(h, s, v)

    img.save(OUTPUT_DIR / "hilbert_rainbow_bw_a.png")


# ---------- Run all ----------
if __name__ == "__main__":
    linear_image()
    diagonal_image()
    hilbert_image()
    hue_only()
    hue_value()
    hue_value_vivid()
    diagonal_vivid()
    hilbert_hue()
    hilbert_vivid()
    hilbert_rainbow_bw()
    hilbert_rainbow_bw_option_a()
    hv_gamma()
    hv_sat_falloff()
    hv_2d_mapping()
    max_contrast_bw()
    max_contrast_color()
    max_contrast_unique_gray()
    max_contrast_unique_color()
    max_contrast_unique_color_pinned_bw()
    max_contrast_gray_bitreverse()
    max_contrast_color_farthest_hue()
    favicon_legible_blocks()
    favicon_blocks_2x2()
    accent_grave_favicon()
    chevron_golden_favicon()
    golden_illumination_favicon()
    golden_sela_favicon()
    golden_pulse_favicon()



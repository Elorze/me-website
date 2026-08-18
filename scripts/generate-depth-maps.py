#!/usr/bin/env python3
"""
Generate approximate depth maps for the Guilin hero photos.

Uses image cues tailored to these sunrise landscapes:
- left rock frame = near
- valley mist / sky = far
- mountain silhouettes get mid depth by vertical position + haze

No heavy ML deps — good enough for 2.5D web parallax.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / "src" / "assets" / "images"


def _clamp(v: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return lo if v < lo else hi if v > hi else v


def estimate_depth(img: Image.Image) -> Image.Image:
    rgb = img.convert("RGB")
    w, h = rgb.size
    # Work at a moderate size for speed, then upscale smoothly
    max_side = 1280
    scale = min(1.0, max_side / max(w, h))
    sw, sh = max(1, int(w * scale)), max(1, int(h * scale))
    small = rgb.resize((sw, sh), Image.Resampling.LANCZOS)
    gray = ImageOps.grayscale(small)
    px = small.load()
    gx = gray.load()

    depth = Image.new("L", (sw, sh))
    dx = depth.load()

    for y in range(sh):
        ny = y / (sh - 1)
        for x in range(sw):
            nx = x / (sw - 1)
            r, g, b = px[x, y]
            lum = gx[x, y] / 255.0

            # Sky / bright mist → far (dark in depth map)
            warm = (r + g) / 2 / 255.0
            skyish = _clamp((warm - 0.55) * 2.2) * _clamp(1.2 - ny * 1.1)

            # Dark sharp rock / near mountains → near (bright in depth)
            dark = _clamp((0.42 - lum) * 2.4)

            # Left framing rock is closest
            left_near = _clamp((0.22 - nx) * 5.5) * _clamp((dark + 0.35))

            # Lower frame slightly nearer (valley / foothills)
            ground_near = _clamp((ny - 0.55) * 1.6) * 0.35

            # Distant peaks sit higher and in haze
            haze_far = _clamp((lum - 0.35) * 1.3) * _clamp(0.85 - ny)

            # Compose: 1 = near (white), 0 = far (black)
            near = 0.18
            near += dark * 0.42
            near += left_near * 0.55
            near += ground_near
            near -= skyish * 0.75
            near -= haze_far * 0.35
            # Soft center distance for open valley
            valley = math.exp(-((nx - 0.55) ** 2) / 0.18) * math.exp(-((ny - 0.55) ** 2) / 0.12)
            near -= valley * 0.12

            dx[x, y] = int(_clamp(near) * 255)

    depth = depth.filter(ImageFilter.GaussianBlur(radius=2.2))
    depth = depth.resize((w, h), Image.Resampling.BICUBIC)
    depth = depth.filter(ImageFilter.GaussianBlur(radius=1.2))
    return depth


def process_smoke_source(src: Path, dest: Path) -> None:
    im = Image.open(src).convert("RGB")
    # Convert to high-contrast luminance alpha plate (white smoke on black)
    gray = ImageOps.grayscale(im)
    # Boost mist visibility
    gray = ImageOps.autocontrast(gray, cutoff=2)
    gray.save(dest, optimize=True)
    print(f"wrote {dest}")


def main() -> None:
    pairs = [
        ("guilin-wide.jpg", "guilin-wide-depth.png"),
        ("guilin-tall.jpg", "guilin-tall-depth.png"),
    ]
    for src_name, out_name in pairs:
        src = IMG_DIR / src_name
        out = IMG_DIR / out_name
        print(f"depth: {src_name} → {out_name}")
        depth = estimate_depth(Image.open(src))
        depth.save(out, optimize=True)

    # Prefer generated smoke plate if present in cursor assets
    candidates = [
        Path(
            "/Users/elorze/.cursor/projects/Users-elorze-Documents-computing-cursor-me-website/assets/smoke-alpha-gen.png"
        ),
        IMG_DIR / "smoke-alpha-gen.png",
    ]
    smoke_src = next((p for p in candidates if p.exists()), None)
    if smoke_src:
        process_smoke_source(smoke_src, IMG_DIR / "smoke-alpha.png")
    else:
        print("no smoke source found — skip")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Draw PawSteps home-screen icons: a cream paw on the app's coral."""
import os
from PIL import Image, ImageDraw

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
CORAL = (224, 122, 95, 255)   # --primary #E07A5F
CREAM = (251, 245, 238, 255)  # --bg #FBF5EE

def paw(size):
    img = Image.new("RGBA", (size, size), CORAL)
    draw = ImageDraw.Draw(img)
    scale = size / 512.0

    def ellipse(cx, cy, rx, ry):
        box = [ (cx - rx) * scale, (cy - ry) * scale, (cx + rx) * scale, (cy + ry) * scale ]
        draw.ellipse(box, fill=CREAM)

    # Four toe beans sit above a clear gap, then the metacarpal pad.
    for cx, cy, rx, ry in (
        (132, 168, 40, 50),
        (214, 108, 44, 52),
        (314, 104, 44, 52),
        (396, 164, 38, 48),
    ):
        ellipse(cx, cy, rx, ry)
    ellipse(264, 348, 96, 74)
    return img

def main():
    base = paw(512)
    base.save(os.path.join(ROOT, "icon-512.png"), "PNG")
    base.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(ROOT, "icon-192.png"), "PNG")
    base.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(ROOT, "apple-touch-icon.png"), "PNG")
    print("wrote icon-512.png, icon-192.png, apple-touch-icon.png")

if __name__ == "__main__":
    main()

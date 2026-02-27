# Creative Coding

A series of visual experiments built with [p5.js](https://p5js.org), each one treating a single photograph as raw material.

All experiments run in the browser with no build step. Open `index.html` locally with a static server (e.g. `npx serve`) or visit the gallery page directly.

---

## The photo

Every experiment uses the same source image: a cream begonia shot on a Fujifilm camera, exported from the photographer's own library. The pixel data drives colours, particle positions, edge detection, and sorting — so each sketch is unique to this one photograph.

---

## Experiments

| # | Title | Concept |
|---|-------|---------|
| 01 | Pixel Scanner | RGB scan cursor sweeps the image with orbital data readout |
| 02 | Codified Image | Hex grid reveals the photo cell by cell with async scramble |
| 03 | Pixel Rain | Matrix-style columns coloured by image pixels |
| 04 | Edge Glow | Sobel edge detection powered up by a scan cursor |
| 05 | Voronoi Drift | Drifting seeds partition and recolour the image |
| 06 | Particle Burst | 5,000 spring particles — click to scatter |
| 07 | Waveform | Layered sine wave distortion across horizontal strips |
| 08 | Particle Field | Continuous hover repulsion, click to switch attract/vortex |
| 09 | Pixel Sort | Column sort cycling through luminance, channel, saturation |
| 10 | Flow Field | Perlin noise flow field, mouse tilts the direction |
| 11 | Kaleidoscope | Radial mirror with Lissajous pan and breathing zoom |
| 12 | Crystal Growth | BFS flood fill from 32 seeds, organic branching |
| 13 | Chromatic Glitch | RGB channel separation, slice tears, scanline flicker |
| 14 | Bokeh Field | Hover to bloom — discs grow and brighten under the cursor |
| 15 | Bubble Glass | Magnifying lens with iridescent image-sampled rim |

---

## Running locally

```bash
cd creative-coding
npx serve
# open http://localhost:3000
```

---

## Stack

- [p5.js](https://p5js.org) 1.9.0 via CDN
- Vanilla HTML/JS, no bundler
- `pixelDensity(1)` throughout for consistent canvas sizing

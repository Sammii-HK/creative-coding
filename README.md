# Creative Coding

A series of visual experiments built with [p5.js](https://p5js.org), each one treating a single photograph as raw material.

The visitor-facing gallery is static HTML, CSS and JavaScript. Its fifteen studies share navigation, responsive canvases, Lucide controls, search and categories. Motion starts paused; play it, inspect one frame, or focus the canvas to use the keyboard. The p5 runtime is self-hosted, so the sketches no longer depend on a CDN.

---

## The photo

Every experiment uses the same source image: a cream begonia shot on a Fujifilm camera, exported from the photographer's own library. The pixel data drives colours, particle positions, edge detection, and sorting, so each sketch is unique to this one photograph.

---

## Experiments

| # | Title | Concept |
|---|-------|---------|
| 01 | Pixel Scanner | RGB scan cursor sweeps the image with orbital data readout |
| 02 | Codified Image | Hex grid reveals the photo cell by cell with async scramble |
| 03 | Pixel Rain | Matrix-style columns coloured by image pixels |
| 04 | Edge Glow | Sobel edge detection powered up by a scan cursor |
| 05 | Voronoi Drift | Drifting seeds partition and recolour the image |
| 06 | Particle Burst | 5,000 spring particles, click to scatter |
| 07 | Waveform | Layered sine wave distortion across horizontal strips |
| 08 | Particle Field | Continuous hover repulsion, click to switch attract/vortex |
| 09 | Pixel Sort | Column sort cycling through luminance, channel, saturation |
| 10 | Flow Field | Perlin noise flow field, mouse tilts the direction |
| 11 | Kaleidoscope | Radial mirror with Lissajous pan and breathing zoom |
| 12 | Crystal Growth | BFS flood fill from 32 seeds, organic branching |
| 13 | Chromatic Glitch | RGB channel separation, slice tears, scanline flicker |
| 14 | Bokeh Field | Hover to bloom, discs grow and brighten under the cursor |
| 15 | Bubble Glass | Magnifying lens with iridescent image-sampled rim |

---

## Running locally

Use Node 24 for development checks. The checked-in runtime and gallery can also be served directly without Node.

```sh
npm ci --ignore-scripts
npm run build
npm test
npm run lint
npm start
# http://127.0.0.1:4824
```

`studies.json` is the gallery metadata source. `npm run build` refreshes the gallery and browser data. Use `npm run vendor:p5` or `npm run vendor:icons` after intentionally changing those locked dependencies. Normal lint verifies generated assets, JavaScript syntax and the original sketch source hashes.

Arrow keys move the study pointer; Space plays or pauses; Enter invokes the existing pointer action where provided. Clicking navigation or toolbar controls does not trigger the sketch's click action. Paused pointer actions redraw immediately. Leaving the page records a paused state rather than silently resuming motion.

---

## Stack

- [p5.js](https://p5js.org) 1.11.13, self-hosted with its licence
- Vanilla HTML/CSS/JavaScript, no runtime framework or bundler
- Lucide 1.67.0 controls and favicon, generated from the official components
- Node tests and JSDOM for the gallery, resource controls and actual p5 binding regression

All fifteen original inline sketch algorithms remain byte-identical to the recorded baseline. A shared binding repair restores Pixel Scanner's own saturation helper after p5's global binder replaces it; this corrects the intended colour ranking without rewriting that source. The p5 patch update and binding correction mean identical source hashes are not a claim of pixel-identical historical rendering.

See `docs/quality/product-review-20261120.md` for the desktop/phone evidence and limits. This batch is local and unreleased.

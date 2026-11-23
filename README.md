# Creative Coding

A series of visual experiments built with [p5.js](https://p5js.org), each one treating a single photograph as raw material.

The gallery is static HTML, CSS and JavaScript. All fifteen studies share navigation, responsive canvases, search and categories. Each one starts paused: play it, step through a frame at a time, or focus the canvas to use the keyboard.

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

The site runs as plain static files. Node 24 is only needed for the build, tests and checks.

```sh
npm ci --ignore-scripts
npm run build
npm test
npm run lint
npm start
# http://127.0.0.1:4824
```

`studies.json` is the gallery metadata source; `npm run build` regenerates the gallery and study data from it. Run `npm run vendor:p5` or `npm run vendor:icons` after updating those dependencies. `npm run lint` checks the generated files and that each sketch's code is unchanged.

On a study page, arrow keys move the pointer, Space plays or pauses, and Enter triggers the sketch's click action where it has one.

---

## Stack

- [p5.js](https://p5js.org) 1.11, self-hosted with its licence
- Vanilla HTML, CSS and JavaScript, no runtime framework or bundler
- [Lucide](https://lucide.dev) icons for controls and the favicon
- Node's test runner and JSDOM for the gallery and study controls

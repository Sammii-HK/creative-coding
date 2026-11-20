# Creative Coding product review, 20 November 2026

Local branch `codex/creative-coding-product-polish`, source base `1cff25f`. The owner's modified main-checkout `.gitignore` was preserved. No environment files, database, private notes, account, model, provider or deployment was used.

## Actual-tool changes

The fifteen p5 sketches now have a consistent, responsive shell and searchable/category-filtered gallery with shareable query state and a useful empty state. Every study has navigation, an explicit paused initial state, play/pause, one frame, restart, labelled canvas and keyboard guidance. Tool controls are 46px high at phone width; shared navigation and gallery category controls are at least 44px high. Lucide controls and favicon are generated from official components, with the licence retained.

The runtime is self-hosted p5 1.11.13, replacing the old CDN dependency. The cream-begonia source photograph is unchanged. All fifteen inline sketch algorithms retain their exact SHA256 baseline hashes. Normal lint checks those hashes, syntax, generated gallery/data, vendor freshness and the shared icon rules. Source hashes establish preserved sketch code, not scientific accuracy or pixel-identical historical output after the runtime update.

The shared shell handles actual interaction defects:

- Paused pointer clicks now redraw immediately, matching keyboard activation. Toolbar and navigation clicks do not activate the canvas action.
- Page visibility/departure stops animation and updates the displayed state, including page-cache navigation.
- Keyboard pointer movement uses bounded logical coordinates; Space changes motion and Enter invokes a sketch's existing pointer action.
- Pixel Scanner declared a global `saturation` helper that p5 also exports. A regression against the real vendored p5 binder reproduces the overwrite, then verifies the shell restores the exact original function and its red/grey results before original setup. No sketch algorithm was rewritten.

## Verification

- 23 tests passed: eleven shared icon regressions, nine original gallery/shell tests, two later lifecycle/pointer regressions and the actual p5 global-binding regression.
- Normal build and lint passed: all fifteen original sketch hashes, all inline JavaScript syntax, metadata, self-hosted runtime and generated Lucide assets checked. Icon lint has zero blocking findings and zero contextual review candidates in this project.
- Full and production dependency audits have zero findings.
- All fifteen real pages opened sequentially in Chrome at desktop 1144px and phone 390px, reusing one tab. Every page created its labelled canvas and reached the paused state. Document and scroll widths matched at both sizes; phone canvases were 334px wide inside their stages. Exact per-page DOM receipts are in `browser-review-20261120.json`.
- Actual selected controls were exercised: gallery search/category/empty-state clear/navigation; Particle Burst play/pause, arrow-key movement and Enter; Kaleidoscope pointer click and Enter each visibly changed the paused image immediately. Gallery phone targets measured 44px and study toolbar targets 46px.
- Captures were saved from the actual application. Observed gallery, Particle Burst and Kaleidoscope captures show real photographic sketch output. No generated illustration or fabricated result stands in for the tool. All thirty first-frame captures are retained locally under `.codex-artifacts/studies`; this is route/shell evidence, not an assertion that every possible interaction was exhaustively exercised.
- After these browser checks only the favicon metadata/asset was added; normal generated-asset checks and tests passed afterward. Page content and layout are unchanged by that addition.

## Limits

The browser pass covers initial rendering/containment for all fifteen studies and selected interactions. It does not certify every pointer combination, physical touch, screen reader, GPU/browser combination, long-session behaviour, algorithmic interpretation or performance. Some studies intentionally reveal more as frames advance; the first frame is not a finished artwork or benchmark. No scientific validation is claimed. This remains local and unreleased.

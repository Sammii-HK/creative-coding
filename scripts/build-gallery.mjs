import fs from "node:fs";
const studies = JSON.parse(fs.readFileSync("studies.json", "utf8"));
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const cards = studies
  .map(
    (study) =>
      `<a class="study-card" href="${escape(study.href)}" data-category="${escape(study.category)}" data-search="${escape([study.title, study.description, study.category].join(" ").toLowerCase())}"><div class="card-top"><span class="card-number">${String(study.number).padStart(2, "0")}</span><span>${escape(study.category)}</span></div><h2>${escape(study.title)}</h2><p>${escape(study.description)}</p><div class="card-bottom"><span>Open the study</span><span class="ui-icon" data-lucide="arrow-up-right"></span></div></a>`,
  )
  .join("\n");
const html = `<!doctype html>
<html lang="en-GB"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Creative coding studies by Sammii</title><meta name="description" content="Fifteen photographic studies in pixels, motion and geometry. Explore each sketch at your own pace."><link rel="stylesheet" href="gallery.css"><link rel="icon" href="icon.svg" type="image/svg+xml"><script src="study-icons.js" defer></script><script src="gallery.js" defer></script></head><body>
<a class="skip-link" href="#main">Skip to studies</a><header class="gallery-header"><a class="text-link" href="index.html"><span class="ui-icon" data-lucide="grid"></span>Creative coding</a><a class="text-link" href="https://sammii.dev">Sammii’s lab<span class="ui-icon" data-lucide="arrow-up-right"></span></a></header>
<main class="gallery-main" id="main"><section class="gallery-hero"><div><p class="eyebrow">A sketchbook in fifteen parts</p><h1>Fifteen ways<br>to look again.</h1></div><p class="gallery-intro">One photograph, reworked in pixels, motion and geometry. Open a study, slow it down, and follow what changes. Every canvas starts paused.</p></section>
<section aria-label="Find a study"><div class="gallery-tools"><label class="search-field"><span class="ui-icon" data-lucide="search"></span><span class="visually-hidden">Search studies</span><input id="study-search" type="search" placeholder="Find a technique or study…" autocomplete="off"></label><div class="category-controls" role="group" aria-label="Study category">${["All", "Pixels", "Particles", "Geometry"].map((category, index) => `<button type="button" data-category="${category}" aria-pressed="${index === 0}">${category}</button>`).join("")}</div></div><p class="gallery-count" role="status" id="study-count">15 studies to explore</p><div class="studies-grid">${cards}</div><p class="gallery-empty" id="empty-state" hidden>No studies match. Try another technique, or <button type="button" id="clear-search">clear the filters</button>.</p></section>
<footer class="gallery-footer"><p>One photograph, explored through fifteen visual studies.</p><a class="text-link" href="https://labs.sammii.dev">Explore the wider lab<span class="ui-icon" data-lucide="arrow-up-right"></span></a></footer></main></body></html>\n`;
const data =
  "// Generated from studies.json.\nwindow.CREATIVE_STUDIES = " +
  JSON.stringify(studies) +
  ";\n";
if (process.argv.includes("--check")) {
  if (fs.readFileSync("study-data.js", "utf8") !== data)
    throw new Error("Study data is stale. Run npm run build.");
  if (fs.readFileSync("index.html", "utf8") !== html)
    throw new Error("Gallery is stale. Run npm run build.");
} else {
  fs.writeFileSync("index.html", html);
  fs.writeFileSync("study-data.js", data);
}

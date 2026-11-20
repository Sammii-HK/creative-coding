import fs from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as lucide from "lucide-react";
const names = {
  "arrow-left": "ArrowLeft",
  "arrow-right": "ArrowRight",
  "arrow-up-right": "ArrowUpRight",
  play: "Play",
  pause: "Pause",
  "step-forward": "StepForward",
  "rotate-ccw": "RotateCcw",
  search: "Search",
  x: "X",
  grid: "Grid2X2",
};
const icons = Object.fromEntries(
  Object.entries(names).map(([key, name]) => [
    key,
    renderToStaticMarkup(
      createElement(lucide[name], {
        width: 18,
        height: 18,
        "aria-hidden": true,
        focusable: false,
      }),
    ),
  ]),
);
const source =
  "// Lucide1.67.0, ISC licence. Generated from official lucide-react components. https://lucide.dev\n(()=>{const icons=" +
  JSON.stringify(icons) +
  '; window.renderStudyIcons=(root=document)=>{for(const host of root.querySelectorAll("[data-lucide]"))host.innerHTML=icons[host.dataset.lucide]||"";};document.addEventListener("DOMContentLoaded",()=>window.renderStudyIcons());})();\n';
const favicon = icons.grid.replace('stroke="currentColor"', 'stroke="#7c462a"');
if (process.argv.includes("--check")) {
  if (fs.readFileSync("icon.svg", "utf8") !== favicon) throw new Error("Lucide favicon is stale.");
  if (fs.readFileSync("study-icons.js", "utf8") !== source)
    throw new Error("Lucide asset is stale. Run npm run vendor:icons.");
} else {
  fs.writeFileSync("study-icons.js", source);
  fs.writeFileSync("icon.svg", favicon);
  fs.copyFileSync(
    "node_modules/lucide-react/LICENSE",
    "vendor/lucide-LICENSE.txt",
  );
}

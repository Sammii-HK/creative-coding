import fs from "node:fs";
import crypto from "node:crypto";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
const studies = JSON.parse(fs.readFileSync("studies.json", "utf8"));
const manifest = JSON.parse(
  fs.readFileSync("studies-source-manifest.json", "utf8"),
);
if (
  studies.length !== 15 ||
  new Set(studies.map((study) => study.href)).size !== 15
)
  throw new Error("Study collection is incomplete or duplicated.");
for (const study of studies) {
  const source = fs.readFileSync(study.href, "utf8");
  if (
    !source.includes('name="viewport"') ||
    !source.includes('src="study-shell.js"') ||
    !source.includes('src="vendor/p5.min.js"')
  )
    throw new Error(`${study.href} is missing its responsive/local shell.`);
  if (/https?:\/\/cdn\./.test(source))
    throw new Error(`${study.href} still requires a CDN.`);
  const scripts = [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1])
    .filter((script) => script.trim());
  const hashes = scripts.map((script) => {
    new vm.Script(script, { filename: study.href });
    return crypto.createHash("sha256").update(script).digest("hex");
  });
  if (JSON.stringify(hashes) !== JSON.stringify(manifest[study.href]))
    throw new Error(`${study.href} changed a recorded sketch algorithm.`);
}
for (const script of [
  "study-shell.js",
  "study-icons.js",
  "gallery.js",
  "study-data.js",
])
  new vm.Script(fs.readFileSync(script, "utf8"), { filename: script });
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync("study-data.js", "utf8"), context);
if (JSON.stringify(context.window.CREATIVE_STUDIES) !== JSON.stringify(studies))
  throw new Error("Study data is stale.");
if (
  !fs
    .readFileSync("node_modules/p5/lib/p5.min.js")
    .equals(fs.readFileSync("vendor/p5.min.js"))
)
  throw new Error("Vendored p5 no longer matches the installed package.");
execFileSync(process.execPath, ["scripts/build-gallery.mjs", "--check"], {
  stdio: "inherit",
});
execFileSync(process.execPath, ["scripts/vendor-icons.mjs", "--check"], {
  stdio: "inherit",
});
console.log(
  "15 original sketch algorithms, local runtime, gallery, shell and data checks passed.",
);

import fs from "node:fs";
fs.mkdirSync("vendor", { recursive: true });
fs.copyFileSync("node_modules/p5/lib/p5.min.js", "vendor/p5.min.js");
fs.copyFileSync("node_modules/p5/license.txt", "vendor/p5-LICENSE.txt");

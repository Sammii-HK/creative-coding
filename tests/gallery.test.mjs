import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { JSDOM } from "jsdom";
const html = fs.readFileSync("index.html", "utf8"),
  script = fs.readFileSync("gallery.js", "utf8");
function fixture(query = "") {
  const dom = new JSDOM(html, {
    url: `https://example.test/index.html${query}`,
    runScripts: "outside-only",
  });
  dom.window.eval(script);
  return dom;
}
test("search combines with category filtering and restores URL state", () => {
  const dom = fixture("?q=drift&category=Geometry");
  const doc = dom.window.document;
  assert.equal(doc.querySelectorAll(".study-card:not([hidden])").length, 1);
  assert.match(
    doc.querySelector(".study-card:not([hidden])").textContent,
    /Voronoi/,
  );
  assert.equal(
    doc.querySelector("[aria-pressed=true]").textContent,
    "Geometry",
  );
  dom.window.close();
});
test("empty-state clearing restores all studies and puts focus back in the named search field", () => {
  const dom = fixture("?q=not-a-study");
  const doc = dom.window.document;
  assert.equal(doc.getElementById("empty-state").hidden, false);
  doc.getElementById("clear-search").click();
  assert.equal(doc.querySelectorAll(".study-card:not([hidden])").length, 15);
  assert.equal(doc.activeElement.id, "study-search");
  assert.equal(dom.window.location.search, "");
  dom.window.close();
});
test("category controls use pressed state and retain named keyboard-operable study links", () => {
  const dom = fixture();
  const doc = dom.window.document;
  [...doc.querySelectorAll(".category-controls button")]
    .find((button) => button.textContent === "Particles")
    .click();
  assert.equal(doc.querySelectorAll(".study-card:not([hidden])").length, 4);
  assert.equal(
    doc.querySelector("[aria-pressed=true]").textContent,
    "Particles",
  );
  assert.equal(doc.querySelectorAll("a.study-card[href]").length, 15);
  dom.window.close();
});

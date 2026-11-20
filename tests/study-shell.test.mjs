import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { JSDOM } from "jsdom";
const studies = JSON.parse(fs.readFileSync("studies.json", "utf8"));
const shell = fs.readFileSync("study-shell.js", "utf8");
function fixture(number = 6, canvas = true) {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: `https://example.test/experiment-${String(number).padStart(2, "0")}.html`,
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  const counts = { loop: 0, stop: 0, redraw: 0, action: 0, setup: 0 };
  window.CREATIVE_STUDIES = studies;
  window.renderStudyIcons = () => {};
  window.width = 900;
  window.height = 540;
  window.mouseX = 450;
  window.mouseY = 270;
  window.setup = () => {
    counts.setup++;
    if (canvas) {
      const element = window.document.createElement("canvas");
      window.document.body.append(element);
    }
  };
  window.loop = () => {
    counts.loop++;
  };
  window.noLoop = () => {
    counts.stop++;
  };
  window.redraw = () => {
    counts.redraw++;
  };
  window.mousePressed = () => {
    counts.action++;
  };
  window.eval(shell);
  window.setup();
  return {
    dom,
    window,
    counts,
    document: window.document,
    close: () => window.close(),
  };
}
test("study setup preserves the original hook, starts paused and mounts a labelled focusable canvas", () => {
  const f = fixture();
  assert.equal(f.counts.setup, 1);
  assert.equal(f.counts.loop, 0);
  assert.equal(f.counts.stop, 1);
  const canvas = f.document.querySelector(".study-stage canvas");
  assert.equal(canvas.tabIndex, 0);
  assert.match(canvas.getAttribute("aria-label"), /Particle Burst/);
  assert.match(f.document.querySelector("[role=status]").textContent, /paused/);
  f.close();
});
test("play, pause and single-frame controls use real p5 lifecycle methods without triggering pointer actions", () => {
  const f = fixture();
  const [play, step] = f.document.querySelectorAll("button");
  play.click();
  assert.equal(f.counts.loop, 1);
  assert.equal(play.getAttribute("aria-pressed"), "true");
  f.window.mousePressed({ target: play });
  assert.equal(f.counts.action, 0);
  step.click();
  assert.equal(f.counts.redraw, 1);
  assert.equal(play.getAttribute("aria-pressed"), "false");
  f.close();
});
test("canvas keyboard controls move bounded logical coordinates and expose existing pointer actions", () => {
  const f = fixture();
  const canvas = f.document.querySelector("canvas");
  const key = (value) =>
    canvas.dispatchEvent(
      new f.window.KeyboardEvent("keydown", {
        key: value,
        bubbles: true,
        cancelable: true,
      }),
    );
  key("ArrowRight");
  assert.equal(f.window.mouseX, 474);
  for (let i = 0; i < 50; i++) key("ArrowDown");
  assert.equal(f.window.mouseY, 540);
  key("Enter");
  assert.equal(f.counts.action, 1);
  key(" ");
  assert.equal(f.counts.loop, 1);
  f.close();
});
test("leaving the visible page pauses a running sketch instead of resuming automatically", () => {
  const f = fixture();
  f.document.querySelector("button").click();
  Object.defineProperty(f.document, "hidden", {
    value: true,
    configurable: true,
  });
  f.document.dispatchEvent(new f.window.Event("visibilitychange"));
  assert.match(f.document.querySelector("[role=status]").textContent, /paused/);
  assert.equal(f.counts.loop, 1);
  f.close();
});
test("first and last studies have valid gallery boundaries rather than broken neighbours", () => {
  for (const number of [1, 15]) {
    const f = fixture(number);
    const links = [...f.document.querySelectorAll(".study-footer a")];
    assert.ok(links.some((link) => link.getAttribute("href") === "index.html"));
    assert.ok(!links.some((link) => /experiment-(00|16)/.test(link.href)));
    f.close();
  }
});
test("missing canvas creation stays an explicit loading error with disabled controls", () => {
  const f = fixture(6, false);
  assert.match(
    f.document.querySelector("[role=status]").textContent,
    /could not create/,
  );
  assert.equal(f.document.querySelector("button").disabled, true);
  f.close();
});

test("page-cache departure records a paused UI as well as stopping the real loop", () => {
  const f = fixture();
  const play = f.document.querySelector("button");
  play.click();
  assert.equal(play.getAttribute("aria-pressed"), "true");
  f.window.dispatchEvent(new f.window.Event("pagehide"));
  assert.equal(play.getAttribute("aria-pressed"), "false");
  assert.match(f.document.querySelector("[role=status]").textContent, /paused/);
  assert.ok(f.counts.stop >= 2);
  f.close();
});

test("pointer actions redraw immediately while paused and ignore surrounding UI controls", () => {
  const f = fixture();
  const canvas = f.document.querySelector("canvas");
  const play = f.document.querySelector("button");
  f.window.mousePressed({ target: canvas });
  assert.equal(f.counts.action, 1);
  assert.equal(f.counts.redraw, 1);
  f.window.mousePressed({ target: play });
  assert.equal(f.counts.action, 1);
  assert.equal(f.counts.redraw, 1);
  play.click();
  f.window.mousePressed({ target: canvas });
  assert.equal(f.counts.action, 2);
  assert.equal(f.counts.redraw, 1);
  f.close();
});

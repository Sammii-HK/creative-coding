import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const studies = JSON.parse(fs.readFileSync('studies.json', 'utf8'));
const shell = fs.readFileSync('study-shell.js', 'utf8');
const runtime = fs.readFileSync('vendor/p5.min.js', 'utf8');
const helper = fs.readFileSync('experiment-01.html', 'utf8')
  .match(/^function saturation\([\s\S]*?^\}/m)?.[0];

test('restores the original study helper after the real p5 global binder overwrites it', () => {
  assert.ok(helper, 'The preserved study must still contain its own saturation helper.');
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://example.test/experiment-01.html',
    runScripts: 'outside-only',
  });
  try {
    const { window } = dom;
    // p5 explicitly skips automatic sketch initialisation under mocha. This
    // exercises its actual binding code without canvas, image or network work.
    window.mocha = {};
    window.eval(runtime);
    window.eval(helper);
    const original = window.saturation;
    assert.equal(original(255, 0, 0), 1);
    assert.equal(original(64, 64, 64), 0);
    window.CREATIVE_STUDIES = studies;
    window.renderStudyIcons = () => {};
    window.noLoop = () => {};
    window.loop = () => {};
    window.redraw = () => {};
    let observedInSetup;
    window.setup = () => {
      observedInSetup = window.saturation;
      assert.equal(window.saturation(255, 0, 0), 1);
      assert.equal(window.saturation(64, 64, 64), 0);
      window.document.body.append(window.document.createElement('canvas'));
    };
    window.eval(shell);
    const boundP5Helper = window.p5.prototype.saturation.bind({});
    const bind = window.p5.prototype._createFriendlyGlobalFunctionBinder({ globalObject: window });
    bind('saturation', boundP5Helper);
    assert.equal(window.saturation, boundP5Helper, 'The actual runtime reproduces the collision.');
    assert.notEqual(window.saturation, original);
    window.setup();
    assert.equal(observedInSetup, original, 'The original setup must see its own helper.');
    assert.equal(window.saturation, original, 'The draw path must retain the same helper identity.');
  } finally {
    dom.window.close();
  }
});

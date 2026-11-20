(() => {
  const studies = window.CREATIVE_STUDIES;
  const current = studies?.find((study) =>
    location.pathname.endsWith(study.href),
  );
  if (!current) return;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const icon = (name) => {
    const node = element("span", "ui-icon");
    node.dataset.lucide = name;
    return node;
  };
  const link = (href, label, name) => {
    const node = element("a", "text-link");
    node.href = href;
    if (name) node.append(icon(name));
    node.append(document.createTextNode(label));
    return node;
  };
  const header = element("header", "gallery-header");
  header.append(
    link("index.html", "Creative coding", "grid"),
    link("https://sammii.dev", "Sammii’s lab", "arrow-up-right"),
  );
  const main = element("main", "study-main");
  main.id = "main";
  const skip = link("#main", "Skip to study");
  skip.className = "skip-link";
  const heading = element("div", "study-heading");
  const intro = element("div");
  intro.append(
    element(
      "p",
      "eyebrow",
      `Study ${String(current.number).padStart(2, "0")} / ${String(studies.length).padStart(2, "0")} · ${current.category}`,
    ),
    element("h1", "", current.title),
    element("p", "study-description", current.description),
  );
  const stage = element("div", "study-stage");
  const status = element(
    "p",
    "study-status",
    "Loading the photograph and drawing the first frame…",
  );
  status.setAttribute("role", "status");
  const controls = element("div", "study-controls");
  const button = (label, name, callback) => {
    const node = element("button");
    node.type = "button";
    node.disabled = true;
    node.append(icon(name), element("span", "", label));
    node.addEventListener("click", callback);
    controls.append(node);
    return node;
  };
  let playing = false,
    ready = false;
  const motion = button("Play motion", "play", () => {
    if (!ready) return;
    playing = !playing;
    if (playing) window.loop();
    else window.noLoop();
    refresh();
  });
  const step = button("One frame", "step-forward", () => {
    if (!ready) return;
    playing = false;
    window.noLoop();
    window.redraw();
    refresh();
  });
  const restart = link(current.href, "Restart", "rotate-ccw");
  controls.append(restart);
  const refresh = () => {
    motion.querySelector("span:last-child").textContent = playing
      ? "Pause motion"
      : "Play motion";
    motion.querySelector("[data-lucide]").dataset.lucide = playing
      ? "pause"
      : "play";
    motion.setAttribute("aria-pressed", String(playing));
    status.textContent = playing
      ? "Motion playing. Pause whenever you like."
      : "Motion paused. Explore a frame at your own pace.";
    window.renderStudyIcons?.(controls);
  };
  heading.append(intro, controls);
  main.append(heading, status, stage);
  const help = element(
    "p",
    "study-help",
    "Focus the canvas to move the study’s pointer with the arrow keys. Space plays or pauses; Enter triggers the pointer action where the sketch provides one.",
  );
  help.id = "canvas-help";
  main.append(help);
  const footer = element("footer", "study-footer");
  const index = studies.indexOf(current);
  footer.append(
    index > 0
      ? link(studies[index - 1].href, studies[index - 1].title, "arrow-left")
      : link("index.html", "All studies", "grid"),
  );
  footer.append(element("span", "", `${current.number} of ${studies.length}`));
  footer.append(
    index < studies.length - 1
      ? link(studies[index + 1].href, studies[index + 1].title, "arrow-right")
      : link("index.html", "All studies", "grid"),
  );
  main.append(footer);
  document.body.classList.add("study-page");
  document.body.prepend(skip, header, main);
  window.renderStudyIcons?.(document);
  const readyTimer = setTimeout(() => {
    if (!ready)
      status.textContent =
        "The study is taking longer to load. Check the photograph and use Restart to try again.";
  }, 15000);
  // Pixel Scanner owns this helper; global p5 binding also exports a function with this name.
  const studySaturation =
    current.number === 1 && typeof window.saturation === "function"
      ? window.saturation
      : null;
  const originalSetup = window.setup;
  const originalMousePressed = window.mousePressed;
  if (typeof originalMousePressed === "function")
    window.mousePressed = function (event) {
      if (event?.target && event.target.tagName !== "CANVAS") return;
      const result = originalMousePressed.call(this, event);
      if (ready && !playing) window.redraw();
      return result;
    };
  window.setup = function () {
    if (studySaturation) window.saturation = studySaturation;
    originalSetup?.call(this);
    clearTimeout(readyTimer);
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      status.textContent =
        "The study could not create a canvas. Reload to try again.";
      return;
    }
    stage.append(canvas);
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "group");
    canvas.setAttribute("aria-label", `${current.title} interactive canvas`);
    canvas.setAttribute("aria-describedby", "canvas-help");
    canvas.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault();
        motion.click();
        return;
      }
      if (event.key === "Enter" && typeof originalMousePressed === "function") {
        event.preventDefault();
        originalMousePressed.call(window);
        if (!playing) window.redraw();
        return;
      }
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      const width = Number(window.width) || 900,
        height = Number(window.height) || 540;
      const x = Number.isFinite(window.mouseX) ? window.mouseX : width / 2,
        y = Number.isFinite(window.mouseY) ? window.mouseY : height / 2;
      window.mouseX = Math.max(
        0,
        Math.min(
          width,
          x +
            (event.key === "ArrowRight"
              ? 24
              : event.key === "ArrowLeft"
                ? -24
                : 0),
        ),
      );
      window.mouseY = Math.max(
        0,
        Math.min(
          height,
          y +
            (event.key === "ArrowDown"
              ? 24
              : event.key === "ArrowUp"
                ? -24
                : 0),
        ),
      );
      if (!playing) window.redraw();
    });
    window.noLoop();
    ready = true;
    motion.disabled = false;
    step.disabled = false;
    refresh();
  };
  window.addEventListener("pagehide", () => {
    clearTimeout(readyTimer);
    if (ready) {
      playing = false;
      window.noLoop();
      refresh();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && ready && playing) {
      playing = false;
      window.noLoop();
      refresh();
    }
  });
  window.addEventListener("error", () => {
    if (!ready)
      status.textContent =
        "The study could not finish loading. Check the image and reload to try again.";
  });
})();

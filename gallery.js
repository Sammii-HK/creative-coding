(() => {
  const input = document.getElementById("study-search");
  if (!input) return;
  const cards = [...document.querySelectorAll(".study-card")];
  const buttons = [...document.querySelectorAll(".category-controls button")];
  const categories = buttons.map((button) => button.dataset.category);
  const params = new URLSearchParams(location.search);
  input.value = params.get("q") || "";
  let selected = categories.includes(params.get("category"))
    ? params.get("category")
    : "All";
  const update = () => {
    const query = input.value.trim().toLowerCase();
    let count = 0;
    for (const card of cards) {
      card.hidden = !!(
        (query && !card.dataset.search.includes(query)) ||
        (selected !== "All" && card.dataset.category !== selected)
      );
      if (!card.hidden) count++;
    }
    for (const button of buttons)
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === selected),
      );
    document.getElementById("study-count").textContent =
      `${count} of ${cards.length} studies`;
    document.getElementById("empty-state").hidden = count > 0;
    document.querySelector(".studies-grid").hidden = count === 0;
    const url = new URL(location.href);
    query
      ? url.searchParams.set("q", input.value.trim())
      : url.searchParams.delete("q");
    selected === "All"
      ? url.searchParams.delete("category")
      : url.searchParams.set("category", selected);
    history.replaceState(null, "", url);
  };
  input.addEventListener("input", update);
  for (const button of buttons)
    button.addEventListener("click", () => {
      selected = button.dataset.category;
      update();
    });
  document.getElementById("clear-search").addEventListener("click", () => {
    input.value = "";
    selected = "All";
    update();
    input.focus();
  });
  update();
})();

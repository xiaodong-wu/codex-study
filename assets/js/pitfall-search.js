(function () {
  var input = document.getElementById("pitfall-search-input");
  if (!input) return;

  var count = document.getElementById("pitfall-search-count");
  var noResults = document.getElementById("pitfall-no-results");
  var groups = Array.prototype.slice.call(document.querySelectorAll(".pitfall-group"));
  var entries = Array.prototype.slice.call(document.querySelectorAll(".pitfall")).map(function (item) {
    return {
      item: item,
      text: normalize((item.getAttribute("data-keywords") || "") + " " + item.textContent)
    };
  });

  function normalize(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function updateHeading(group, visible) {
    var heading = group.previousElementSibling;
    if (heading && /^H[2-4]$/.test(heading.tagName)) {
      heading.hidden = !visible;
    }
  }

  function update() {
    var query = normalize(input.value);
    var tokens = query.split(" ").filter(Boolean);
    var active = tokens.length > 0;
    var visibleCount = 0;

    entries.forEach(function (entry) {
      var match = !active || tokens.every(function (token) {
        return entry.text.indexOf(token) !== -1;
      });

      entry.item.hidden = !match;
      if (match) visibleCount += 1;
      entry.item.open = active && match;
    });

    groups.forEach(function (group) {
      var hasVisibleItems = Array.prototype.some.call(group.querySelectorAll(".pitfall"), function (item) {
        return !item.hidden;
      });
      group.hidden = !hasVisibleItems;
      updateHeading(group, hasVisibleItems);
    });

    if (count) {
      count.textContent = active
        ? "找到 " + visibleCount + " 个相关问题。"
        : "当前收录 " + entries.length + " 个问题。";
    }

    if (noResults) {
      noResults.hidden = !active || visibleCount > 0;
    }
  }

  input.addEventListener("input", update);
  input.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      input.value = "";
      update();
      input.blur();
    }
  });

  var params = new URLSearchParams(window.location.search);
  var preset = params.get("q");
  if (preset) {
    input.value = preset;
  }
  update();
})();

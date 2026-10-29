// BRD page script: sidebar nav, in-page jumps and Requirement filters only.
// All content is in the HTML; with script off every view shows one after another.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var views = document.querySelectorAll("#screen .view");
  var links = document.querySelectorAll("#screen aside a[data-view]");

  function show(id) {
    var found = false;
    views.forEach(function (v) { var on = v.id === id; v.classList.toggle("on", on); if (on) found = true; });
    if (!found && views.length) { views[0].classList.add("on"); id = views[0].id; }
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-view") === id); });
  }

  // Shows the view holding the target (a view, a register row, a Source) and scrolls to it.
  function jump(hash, push) {
    var target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target || !target.closest("#screen")) { show(views.length ? views[0].id : ""); return; }
    var view = target.classList.contains("view") ? target : target.closest(".view");
    show(view.id);
    if (push) history.pushState(null, "", hash);
    if (target === view) window.scrollTo(0, 0);
    else target.scrollIntoView({ block: "center" });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("#screen a[href^='#']");
    if (!a) return;
    e.preventDefault();
    jump(a.getAttribute("href"), true);
  });
  window.addEventListener("popstate", function () { jump(location.hash, false); });

  var TESTS = {
    all: function () { return true; },
    must: function (c) { return c.getAttribute("data-priority") === "Must"; },
    "open-scope": function (c) { return c.getAttribute("data-open-scope") === "yes"; },
    "has-oi": function (c) { return c.getAttribute("data-has-oi") === "yes"; },
  };
  document.querySelectorAll("#screen .filters").forEach(function (bar) {
    var view = bar.closest(".view");
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-filter]");
      if (!b) return;
      var test = TESTS[b.getAttribute("data-filter")];
      bar.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      var shown = 0;
      view.querySelectorAll(".req").forEach(function (c) { var ok = test(c); c.hidden = !ok; if (ok) shown++; });
      var none = view.querySelector(".nomatch");
      if (none) none.classList.toggle("on", shown === 0);
    });
  });

  jump(location.hash, false);
})();

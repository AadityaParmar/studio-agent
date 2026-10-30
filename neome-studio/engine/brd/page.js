// BRD page script: sidebar nav, in-page jumps, Requirement filters and diagram zoom only.
// All content is in the HTML; with script off every view shows one after another.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var views = document.querySelectorAll("#screen .view");
  var links = document.querySelectorAll("#screen aside a[data-view]");
  var zooms = []; // diagram re-fit callbacks; a hidden view has no width until shown

  function show(id) {
    var found = false;
    views.forEach(function (v) { var on = v.id === id; v.classList.toggle("on", on); if (on) found = true; });
    if (!found && views.length) { views[0].classList.add("on"); id = views[0].id; }
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-view") === id); });
    zooms.forEach(function (f) { f(); });
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

  // Diagram zoom: buttons, Ctrl/⌘ + wheel (or pinch) around the pointer, drag to pan, full screen.
  // Zoom 1 = the whole diagram fits the box; the SVG is redrawn at the new width, so text stays sharp.
  document.querySelectorAll("#screen figure.diagram").forEach(function (fig) {
    var svg = fig.querySelector("svg");
    var vb = svg && svg.viewBox && svg.viewBox.baseVal;
    if (!vb || !vb.width || !vb.height) return;
    fig.classList.add("zoomable");
    var bar = document.createElement("div");
    bar.className = "zbar";
    bar.innerHTML =
      '<button type="button" data-z="out" title="Zoom out">−</button><span class="zpct"></span>' +
      '<button type="button" data-z="in" title="Zoom in">+</button><button type="button" data-z="fit">Fit</button>' +
      '<button type="button" data-z="full">Full screen</button><span class="zhint">Ctrl/⌘ + scroll to zoom · drag to move</span>';
    var view = document.createElement("div");
    view.className = "zview";
    fig.insertBefore(bar, svg);
    view.appendChild(svg);
    fig.appendChild(view);
    var pct = bar.querySelector(".zpct");
    var z = 1, MIN = 0.5, MAX = 12;

    function fitWidth() {
      var cs = getComputedStyle(view);
      var w = view.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var h = view.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      var maxH = parseFloat(cs.maxHeight);
      if (!document.fullscreenElement && maxH) h = maxH - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      return Math.max(50, Math.min(w, vb.width, (h * vb.width) / vb.height));
    }
    // ax, ay: point in the box (client px) that stays put while zooming.
    function zoomTo(next, ax, ay) {
      next = Math.min(MAX, Math.max(MIN, next));
      if (!view.clientWidth) return;
      var r = view.getBoundingClientRect();
      if (ax == null) { ax = r.width / 2; ay = r.height / 2; }
      var before = svg.getBoundingClientRect();
      var px = (view.scrollLeft + ax - (before.left - r.left + view.scrollLeft)) / before.width;
      var py = (view.scrollTop + ay - (before.top - r.top + view.scrollTop)) / before.height;
      z = next;
      svg.style.width = Math.round(fitWidth() * z) + "px";
      svg.style.height = "auto";
      var after = svg.getBoundingClientRect();
      view.scrollLeft = after.left - r.left + view.scrollLeft + px * after.width - ax;
      view.scrollTop = after.top - r.top + view.scrollTop + py * after.height - ay;
      pct.textContent = Math.round(z * 100) + "%";
    }
    zoomTo(1);
    zooms.push(function () { zoomTo(z); });

    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-z]");
      if (!b) return;
      var k = b.getAttribute("data-z");
      if (k === "in") zoomTo(z * 1.25);
      else if (k === "out") zoomTo(z / 1.25);
      else if (k === "fit") { zoomTo(1); view.scrollLeft = 0; view.scrollTop = 0; }
      else if (k === "full") {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (fig.requestFullscreen) fig.requestFullscreen();
      }
    });
    view.addEventListener("wheel", function (e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      var r = view.getBoundingClientRect();
      zoomTo(z * Math.exp(-e.deltaY * 0.002), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    var drag = null;
    view.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || e.target.closest("a")) return;
      drag = { x: e.clientX, y: e.clientY, l: view.scrollLeft, t: view.scrollTop };
      view.classList.add("drag");
      view.setPointerCapture(e.pointerId);
    });
    view.addEventListener("pointermove", function (e) {
      if (!drag) return;
      view.scrollLeft = drag.l - (e.clientX - drag.x);
      view.scrollTop = drag.t - (e.clientY - drag.y);
    });
    function stop() { drag = null; view.classList.remove("drag"); }
    view.addEventListener("pointerup", stop);
    view.addEventListener("pointercancel", stop);
    document.addEventListener("fullscreenchange", function () { if (document.fullscreenElement === fig || !document.fullscreenElement) zoomTo(z); });
  });

  window.addEventListener("resize", function () { zooms.forEach(function (f) { f(); }); });

  jump(location.hash, false);
})();

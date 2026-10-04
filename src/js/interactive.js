/* Margin of Error — interactive kit (dependency-free).
   Powers: [data-tabs] tabs/toggles, [data-ba] before/after sliders,
   and .chart[data-chart] mini charts. Safe to run on every page. */
(function () {
  // Tabs / toggles
  document.querySelectorAll("[data-tabs]").forEach(function (wrap) {
    var tabs = wrap.querySelectorAll(".tab");
    var panels = wrap.querySelectorAll(".tab-panel");
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest(".tab");
      if (!b) return;
      var id = b.getAttribute("data-tab");
      tabs.forEach(function (t) { t.classList.toggle("on", t === b); });
      panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== id; });
    });
  });

  // Before / after slider
  document.querySelectorAll("[data-ba]").forEach(function (ba) {
    var range = ba.querySelector('input[type="range"]');
    var before = ba.querySelector(".ba-before");
    function set(v) {
      if (before) before.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)";
      ba.style.setProperty("--pos", v + "%");
    }
    if (range) { set(range.value); range.addEventListener("input", function () { set(range.value); }); }
  });

  // Mini charts
  function chart(el) {
    var spec; try { spec = JSON.parse(el.getAttribute("data-chart")); } catch (e) { return; }
    var data = spec.data || [], type = spec.type || "bar";
    var max = spec.max || Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    var w = 640, h = 250, padL = 12, padR = 12, padT = 18, padB = 34;
    var iw = w - padL - padR, ih = h - padT - padB;
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet" role="img">';
    if (type === "line") {
      var n = data.length, step = n > 1 ? iw / (n - 1) : 0, pts = [];
      data.forEach(function (d, i) { pts.push([padL + i * step, padT + ih - ih * (d.value / max)]); });
      s += '<path class="ch-line" fill="none" d="' + pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ") + '"/>';
      pts.forEach(function (p, i) {
        s += '<circle class="ch-dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4"/>';
        s += '<text class="ch-lbl" x="' + p[0].toFixed(1) + '" y="' + (padT + ih + 18) + '" text-anchor="middle">' + data[i].label + '</text>';
      });
    } else {
      var m = data.length, gap = 16, bw = (iw - gap * (m - 1)) / m;
      data.forEach(function (d, i) {
        var bh = Math.max(2, ih * (d.value / max)), x = padL + i * (bw + gap), y = padT + ih - bh;
        s += '<rect class="ch-bar" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="3"/>';
        s += '<text class="ch-val" x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 7).toFixed(1) + '" text-anchor="middle">' + d.value + (spec.unit || "") + '</text>';
        s += '<text class="ch-lbl" x="' + (x + bw / 2).toFixed(1) + '" y="' + (padT + ih + 18) + '" text-anchor="middle">' + d.label + '</text>';
      });
    }
    s += "</svg>";
    el.innerHTML = s;
  }
  document.querySelectorAll(".chart[data-chart]").forEach(chart);
})();

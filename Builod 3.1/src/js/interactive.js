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

/* ===== Motion, share and reactions ===== */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  // 1. Headline flourish: split big headlines into words that settle in.
  var heads = document.querySelectorAll(".home-intro h1, .article-header h1, .page-title h1, .notfound h1");
  heads.forEach(function (h) {
    if (!reduce) {
      var text = h.textContent;
      var words = text.trim().split(/\s+/);
      h.setAttribute("aria-label", text.trim());
      h.innerHTML = words.map(function (w, i) {
        return '<span class="w" aria-hidden="true" style="--i:' + i + '">' + w.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }) + "</span>";
      }).join(" ");
    }
    h.classList.add("is-split");
  });

  // 2. Scroll reveals (elements are pre-hidden by CSS only when JS runs and motion is allowed).
  var targets = document.querySelectorAll(
    ".home-intro .eyebrow, .intro-copy, .section-block, .project-strip, .page-title > :not(h1), .filters, " +
    ".essay-list > .entry, .project-list > .project-item, .about-grid > *, .article-header > :not(h1), " +
    ".article-cover, .prose > *, .engage, .article-footer, .nf-actions"
  );
  function show(el) { el.classList.add("in"); }
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(show);
  } else {
    var groups = new Map();
    targets.forEach(function (el) {
      var p = el.parentElement, n = groups.get(p) || 0;
      if (el.matches(".entry, .project-item, .about-grid > *")) el.style.animationDelay = Math.min(n, 6) * 70 + "ms";
      groups.set(p, n + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    targets.forEach(function (el) { io.observe(el); });
    setTimeout(function () { targets.forEach(show); }, 4000);
  }

  // 3. Spotlight: a soft highlight that follows the pointer across cards.
  var spotSel = ".proj-teaser, .project-item, .entry, .tool, .chart, .tabs, .react, .share-btn, .btn";
  document.querySelectorAll(spotSel).forEach(function (el) { el.classList.add("spot"); });
  if (!reduce) {
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(".spot");
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  // 4. Share row.
  var eng = document.querySelector("[data-engage]");
  if (!eng) return;
  var title = eng.getAttribute("data-title") || document.title;
  var native = eng.querySelector('[data-share="native"]');
  if (native && navigator.share) {
    native.hidden = false;
    native.addEventListener("click", function () {
      navigator.share({ title: title, url: location.href }).catch(function () {});
    });
  }
  var copy = eng.querySelector('[data-share="copy"]');
  if (copy) copy.addEventListener("click", function () {
    var url = copy.getAttribute("data-url") || location.href, label = copy.querySelector(".copy-label");
    function done(ok) {
      label.textContent = ok ? "Copied" : "Press Ctrl+C";
      copy.classList.add("pop");
      setTimeout(function () { label.textContent = "Copy link"; copy.classList.remove("pop"); }, 1800);
    }
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });

  // 5. Reactions (shown only when the server says storage is configured).
  var wrap = eng.querySelector("[data-reactions]");
  var slug = eng.getAttribute("data-slug");
  if (!wrap || !slug || !window.fetch) return;
  var key = "moe-r:" + slug, mine = {};
  try { mine = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}
  function paint(counts) {
    wrap.querySelectorAll(".react").forEach(function (b) {
      var t = b.getAttribute("data-type"), on = !!mine[t];
      b.querySelector(".r-count").textContent = counts[t] || 0;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  fetch("/api/reactions?slug=" + encodeURIComponent(slug), { headers: { accept: "application/json" } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) { if (d && d.enabled && d.counts) { wrap.hidden = false; paint(d.counts); } })
    .catch(function () {});
  wrap.addEventListener("click", function (e) {
    var b = e.target.closest(".react");
    if (!b || b.disabled) return;
    var t = b.getAttribute("data-type"), delta = mine[t] ? -1 : 1;
    var countEl = b.querySelector(".r-count");
    mine[t] = delta > 0;
    countEl.textContent = Math.max(0, (parseInt(countEl.textContent, 10) || 0) + delta);
    b.classList.toggle("on", delta > 0);
    b.setAttribute("aria-pressed", delta > 0 ? "true" : "false");
    b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    b.disabled = true;
    try { localStorage.setItem(key, JSON.stringify(mine)); } catch (err) {}
    fetch("/api/reactions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: slug, type: t, delta: delta })
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.counts) paint(d.counts); })
      .catch(function () {})
      .then(function () { b.disabled = false; });
  });
})();

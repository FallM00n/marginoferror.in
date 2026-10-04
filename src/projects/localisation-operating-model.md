---
number: "01"
title: "Localisation operating model"
kicker: ["Concept study", "Operating design"]
dek: "A working model for carrying editorial intent across languages while keeping local judgement close to the audience."
cover: "/images/projects/localisation.jpg"
status: "Concept study"
date: 2026-01-10
---

Great localisation is not translation. It is carrying a show's intent across a border it was never built for, at a volume where no single person can watch everything. This is a working model for doing that without flattening local judgement into a spreadsheet.

*This page also doubles as a demo of the interactive blocks any project can use: toggles, a before/after slider, a live chart, a small tool, expandable notes, and an embed.*

## The demo and the operation

<div class="tabs" data-tabs>
  <div class="tab-row">
    <button class="tab on" data-tab="neat">The neat version</button>
    <button class="tab" data-tab="real">What actually happens</button>
  </div>
  <div class="tab-panel" data-panel="neat">
    <p>A script goes in, a translated script comes out, a voice actor reads it, and the episode ships. Clean, linear, demo-ready.</p>
  </div>
  <div class="tab-panel" data-panel="real" hidden>
    <p>The brief is half complete, the idiom has no equivalent, two reviewers disagree, the best actor is out sick, and the calendar does not move. The model has to hold up here, not in the demo.</p>
  </div>
</div>

## Where quality is decided

Quality is not a final checkpoint; it is a hundred small calls made early. Drag the slider: the left is a raw first pass, the right is the same scene after review.

<div class="ba" data-ba>
  <span class="ba-tag l">Raw pass</span>
  <span class="ba-tag r">Reviewed</span>
  <img src="/images/projects/localisation.jpg" alt="Reviewed scene">
  <img class="ba-before" src="/images/projects/localisation-before.jpg" alt="Raw first pass">
  <span class="ba-divider"></span>
  <input type="range" min="0" max="100" value="50" aria-label="Reveal before and after">
</div>

## What catches the dead takes

A take can pass every measurable check and still feel wrong. Here is how much of that gets caught by method, in rough terms.

<div class="chart" data-chart='{"type":"bar","unit":"%","max":100,"data":[{"label":"Manual","value":45},{"label":"Rubric","value":70},{"label":"Rubric + routing","value":92}]}'></div>

<p class="chart-cap">Share of genuinely-off takes caught, by method. Illustrative, not measured.</p>

## How much can one team actually hold?

The whole problem is volume. This little tool makes the trade-off concrete: move the sliders and watch how much of a week's catalogue a team can realistically spot-check.

<div class="tool" id="qc-tool">
  <h4>Coverage calculator</h4>
  <p class="tool-sub">Assuming roughly two minutes to spot-check one episode</p>
  <label>Episodes released per week <b><span id="qc-ep">600</span></b></label>
  <input type="range" id="qc-ep-r" min="50" max="2000" step="50" value="600">
  <label>Reviewers on the team <b><span id="qc-rev">4</span></b></label>
  <input type="range" id="qc-rev-r" min="1" max="20" step="1" value="4">
  <label>Review minutes per reviewer per day <b><span id="qc-min">180</span></b></label>
  <input type="range" id="qc-min-r" min="30" max="300" step="10" value="180">
  <div class="tool-out"><span class="big" id="qc-out">0%</span><span class="cap" id="qc-cap"></span></div>
</div>

<script>
(function(){
  var ep=document.getElementById("qc-ep-r"),rev=document.getElementById("qc-rev-r"),min=document.getElementById("qc-min-r");
  if(!ep) return;
  var PER_EP=2;
  function upd(){
    document.getElementById("qc-ep").textContent=(+ep.value).toLocaleString();
    document.getElementById("qc-rev").textContent=rev.value;
    document.getElementById("qc-min").textContent=min.value;
    var capacity=(+rev.value)*(+min.value)*5/PER_EP;
    var cov=Math.min(100, capacity/(+ep.value)*100);
    document.getElementById("qc-out").textContent=Math.round(cov)+"%";
    document.getElementById("qc-cap").textContent="of this week’s "+(+ep.value).toLocaleString()+" episodes get a human spot-check";
  }
  [ep,rev,min].forEach(function(s){s.addEventListener("input",upd);});
  upd();
})();
</script>

The honest answer is usually "not all of it," which is exactly why routing matters more than raw hours: send the humans to the takes the score cannot be trusted on.

## Open questions

<details class="expand"><summary>Who owns the exception?</summary><p>Median cases run themselves. The model lives or dies on who is allowed to decide when a rule should not apply, and how that decision travels back into the guidelines.</p></details>
<details class="expand"><summary>Where does context live?</summary><p>Translators and actors need the why, not just the line. The study tests whether a shared, lightweight context note reduces repeated mistakes without becoming a form nobody reads.</p></details>
<details class="expand"><summary>What do we actually measure?</summary><p>Not volume. Time-to-first-fix, repeat-defect rate, and how often a local reviewer overrides the rubric, because that override is the signal, not the noise.</p></details>

## See it in motion

<div class="embed">
  <iframe title="Prototype demo" srcdoc='<!doctype html><meta charset="utf-8"><style>html,body{margin:0;height:100%;font-family:system-ui,sans-serif;background:#1b1a18;color:#ece7de;display:grid;place-items:center}.card{text-align:center;padding:16px}.card b{color:#f0685c}.box{margin-top:14px;padding:14px 18px;border:1px solid #3a3630;border-radius:8px;transition:border-color .2s,transform .2s}.box:hover{border-color:#f0685c;transform:translateY(-3px)}</style><div class="card"><div>A self-contained <b>embed</b> slot.</div><div class="box">Hover me, or swap in a Figma or Loom URL</div></div>'></iframe>
</div>

<p class="kit-cap">An embed holds anything that lives in an iframe: a Figma prototype, a Loom walkthrough, a YouTube clip. This one is a tiny self-contained page so nothing external has to load.</p>

The point of the model is not control. It is giving good judgement somewhere to go, at a scale where instinct alone runs out.

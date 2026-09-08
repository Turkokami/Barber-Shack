/**
 * The flow engine. Renders STEPS from config.js, keeps answers in memory,
 * prices the job, and shows the estimate.
 *
 * No framework, no build step, no network call unless LEAD_DELIVERY is set to
 * webhook mode. Drop the folder on any static host and it runs.
 */

(function () {
  "use strict";

  var LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var TOTAL = STEPS.length;

  var state = { index: 0, answers: {}, done: false };

  var app = document.getElementById("app");
  var trustPanel = document.getElementById("trust");

  /* --- pricing ---------------------------------------------------------- */

  function sizeToSqFt(value) {
    var opt = STEPS.find(function (s) { return s.id === "size"; })
      .options.find(function (o) { return o.value === value; });
    return opt ? opt.sqft : 0;
  }

  function roundTo(n, step) { return Math.round(n / step) * step; }

  /**
   * base × material × condition × stories × lastCleaned × service,
   * presented as a ±SPREAD band whose low end is clamped to PRICING.MIN_JOB.
   */
  function priceQuote(a) {
    var base = PRICING.RATE_PER_SQFT * sizeToSqFt(a.size);
    var estimate =
      base *
      PRICING.material[a.material] *
      PRICING.condition[a.condition] *
      PRICING.stories[a.stories] *
      PRICING.lastCleaned[a.lastCleaned] *
      PRICING.service[a.service];

    // Clamp the LOW end, not the midpoint. Clamping before the spread would
    // still let the band dip under the minimum and quote a job we'd refuse.
    var low = Math.max(PRICING.MIN_JOB, roundTo(estimate * (1 - PRICING.SPREAD), PRICING.ROUND_TO));
    var high = Math.max(low + PRICING.ROUND_TO, roundTo(estimate * (1 + PRICING.SPREAD), PRICING.ROUND_TO));

    return { low: low, high: high };
  }

  var money = function (n) { return "$" + n.toLocaleString("en-US"); };

  /* --- helpers ---------------------------------------------------------- */

  function labelFor(stepId, value) {
    var step = STEPS.find(function (s) { return s.id === stepId; });
    if (!step || !step.options) return value;
    var opt = step.options.find(function (o) { return o.value === value; });
    return opt ? opt.label : value;
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  // Escape anything the customer typed before it re-enters the DOM.
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function answer(stepId, value) {
    state.answers[stepId] = value;
    state.index++;
    render();
  }

  /* --- chrome ----------------------------------------------------------- */

  function renderProgress(frag) {
    var completed = state.done ? TOTAL : state.index;

    var track = el("div", "progress-track");
    var fill = el("div", "progress-fill");
    fill.style.width = (completed / TOTAL) * 100 + "%";
    track.appendChild(fill);
    frag.appendChild(track);

    var count = el("div", "step-count");
    count.textContent = state.done
      ? "Your estimate"
      : "Step " + (state.index + 1) + " of " + TOTAL;
    frag.appendChild(count);

    // Announce step changes to screen readers without stealing focus.
    var live = el("p", "sr-only");
    live.setAttribute("role", "status");
    live.textContent = count.textContent;
    frag.appendChild(live);
  }

  function renderNav(frag) {
    var nav = el("div", "nav");

    var back = el("button", null, "← Back");
    back.type = "button";
    back.hidden = state.index === 0 || state.done;
    back.addEventListener("click", function () {
      if (state.index > 0) { state.index--; render(); }
    });

    var restart = el("button", null, "Restart");
    restart.type = "button";
    restart.addEventListener("click", function () {
      state = { index: 0, answers: {}, done: false };
      render();
    });

    nav.appendChild(back);
    nav.appendChild(restart);
    frag.appendChild(nav);
  }

  /* --- step renderers --------------------------------------------------- */

  function renderHeading(frag, step) {
    frag.appendChild(el("h1", null, step.title));
    if (step.subtitle) frag.appendChild(el("p", "subtitle", step.subtitle));
  }

  function renderList(frag, step) {
    var wrap = el("div", "options");
    step.options.forEach(function (opt, i) {
      var btn = el("button", "opt-row");
      btn.type = "button";
      btn.appendChild(el("span", "letter", LETTERS[i]));
      btn.appendChild(el("span", null, opt.label));
      btn.addEventListener("click", function () { answer(step.id, opt.value); });
      wrap.appendChild(btn);
    });
    frag.appendChild(wrap);
  }

  function renderCards(frag, step) {
    var grid = el("div", "options opt-grid");
    step.options.forEach(function (opt) {
      var btn = el("button", "opt-card");
      btn.type = "button";
      btn.innerHTML = ART[opt.art]();
      // A slash is a valid break point, and "Asphalt/Composition" is otherwise
      // one unbreakable token that overflows the card at every width.
      btn.appendChild(el("span", null, esc(opt.label).replace(/\//g, "/<wbr>")));
      btn.addEventListener("click", function () { answer(step.id, opt.value); });
      grid.appendChild(btn);
    });
    frag.appendChild(grid);
  }

  function renderText(frag, step) {
    var field = el("div", "field");

    var label = el("label", null, step.label);
    label.setAttribute("for", "field-" + step.id);

    var input = el("input");
    input.id = "field-" + step.id;
    input.type = step.inputType || "text";
    if (step.inputMode) input.inputMode = step.inputMode;
    if (step.autocomplete) input.autocomplete = step.autocomplete;
    input.value = state.answers[step.id] || "";

    var error = el("p", "error");
    error.setAttribute("role", "alert");

    var actions = el("div", "field-actions");
    var hint = el("span", "hint", "press <b>enter</b>");
    var ok = el("button", "btn-ok", "OK");
    ok.type = "submit";
    actions.appendChild(hint);
    actions.appendChild(ok);

    var form = el("form");
    form.noValidate = true;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = input.value;
      var problem = step.validate ? step.validate(value) : null;
      if (problem) {
        error.textContent = problem;
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      answer(step.id, value.trim());
    });

    field.appendChild(label);
    field.appendChild(input);
    field.appendChild(actions);
    field.appendChild(error);
    form.appendChild(field);
    frag.appendChild(form);

    // Focus the field so the keyboard opens straight away on mobile.
    requestAnimationFrame(function () { input.focus(); });
  }

  /* --- result ----------------------------------------------------------- */

  function renderResult(frag) {
    var a = state.answers;
    var q = priceQuote(a);
    var firstName = String(a.name || "").trim().split(/\s+/)[0];

    frag.appendChild(
      el("h1", null, firstName ? esc(firstName) + ", here's your estimate" : "Here's your estimate")
    );
    frag.appendChild(el("p", "result-eyebrow", labelFor("service", a.service)));
    frag.appendChild(el("p", "result-range", money(q.low) + " – " + money(q.high)));
    frag.appendChild(
      el(
        "p",
        "result-note",
        "Based on what you told us about your roof. We'll confirm the final price before any work begins — no surprises, no obligation."
      )
    );

    var rows = [
      ["Roof material", labelFor("material", a.material)],
      ["Service", labelFor("service", a.service)],
      ["Home size", labelFor("size", a.size)],
      ["Roof condition", labelFor("condition", a.condition)],
      ["Height", labelFor("stories", a.stories)],
      ["Last cleaned", labelFor("lastCleaned", a.lastCleaned)],
    ];

    var summary = el("dl", "summary");
    rows.forEach(function (row) {
      var r = el("div", "summary-row");
      r.appendChild(el("dt", null, row[0]));
      r.appendChild(el("dd", null, esc(row[1])));
      summary.appendChild(r);
    });
    frag.appendChild(summary);

    var call = el("a", "btn-call", "Call " + BUSINESS.phoneDisplay);
    call.href = "tel:" + BUSINESS.phoneTel;
    frag.appendChild(call);

    frag.appendChild(
      el(
        "p",
        "disclaimer",
        "This is an estimate, not a binding quote. Final pricing depends on an on-site look at " +
          "pitch, access, and roof condition. " +
          esc(BUSINESS.legalName) + " · " + esc(BUSINESS.serviceArea) + "."
      )
    );
  }

  /* --- lead delivery ---------------------------------------------------- */

  function deliverLead() {
    if (LEAD_DELIVERY.mode !== "webhook" || !LEAD_DELIVERY.endpoint) return;

    var q = priceQuote(state.answers);
    var payload = {
      submittedAt: new Date().toISOString(),
      estimateLow: q.low,
      estimateHigh: q.high,
      answers: state.answers,
      readable: STEPS.reduce(function (acc, s) {
        acc[s.id] = s.options ? labelFor(s.id, state.answers[s.id]) : state.answers[s.id];
        return acc;
      }, {}),
    };

    fetch(LEAD_DELIVERY.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(function (err) {
      // The customer already has their number on screen; a delivery failure
      // must not break the result. Log it for the console only.
      console.error("Lead delivery failed:", err);
    });
  }

  /* --- trust panel ------------------------------------------------------ */

  function renderTrust() {
    trustPanel.innerHTML =
      '<svg class="trust-badge" viewBox="0 0 120 140" role="img" aria-label="' +
      esc(TRUST.badgeTitle + " " + TRUST.badgeSubtitle) +
      '">' +
      '<path d="M60 4 L114 24 V74 C114 106 88 126 60 136 C32 126 6 106 6 74 V24 Z" fill="#131110" stroke="#f0a848" stroke-width="5"/>' +
      // Five ball-tipped points over a curved band — the logo's crown silhouette,
      // not a generic zigzag.
      '<path d="M33 66 L40 84 L46 55 L53 82 L60 46 L67 82 L74 55 L80 84 L87 66" fill="none" stroke="#f0a848" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<circle cx="33" cy="66" r="4.4" fill="#f0a848"/>' +
      '<circle cx="46" cy="55" r="4.8" fill="#f0a848"/>' +
      '<circle cx="60" cy="46" r="5.6" fill="#f0a848"/>' +
      '<circle cx="74" cy="55" r="4.8" fill="#f0a848"/>' +
      '<circle cx="87" cy="66" r="4.4" fill="#f0a848"/>' +
      '<path d="M34 84 Q60 92 86 84" fill="none" stroke="#f0a848" stroke-width="6" stroke-linecap="round"/>' +
      '<text x="60" y="27" text-anchor="middle" fill="#f0a848" font-family="Segoe UI, Roboto, Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="0.5">' +
      esc(TRUST.badgeTitle) +
      "</text>" +
      '<text x="60" y="99" text-anchor="middle" fill="#f0a848" font-family="Segoe UI, Roboto, Arial, sans-serif" font-size="7.6" font-weight="700" letter-spacing="0.2">' +
      esc(TRUST.badgeSubtitle) +
      "</text>" +
      "</svg>" +
      "<h2>" + TRUST.headline + "</h2>" +
      "<p>" + TRUST.body + "</p>";
  }

  /* --- keyboard --------------------------------------------------------- */

  document.addEventListener("keydown", function (e) {
    if (state.done || e.metaKey || e.ctrlKey || e.altKey) return;
    var step = STEPS[state.index];
    if (!step || step.type === "text") return;

    var i = LETTERS.indexOf(e.key.toUpperCase());
    if (i >= 0 && i < step.options.length) {
      e.preventDefault();
      answer(step.id, step.options[i].value);
    }
  });

  /* --- main render ------------------------------------------------------ */

  function render() {
    if (state.index >= TOTAL) {
      var firstRun = !state.done;
      state.done = true;
      if (firstRun) deliverLead();
    }

    var frag = document.createDocumentFragment();
    renderProgress(frag);

    if (state.done) {
      renderResult(frag);
      renderNav(frag);
    } else {
      var step = STEPS[state.index];
      renderHeading(frag, step);
      if (step.type === "cards") renderCards(frag, step);
      else if (step.type === "list") renderList(frag, step);
      else renderText(frag, step);
      renderNav(frag);
    }

    app.innerHTML = "";
    app.appendChild(frag);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  // Masthead is static; the trust panel and flow render on load.
  document.getElementById("brand-name").textContent = BUSINESS.name;
  document.getElementById("brand-sub").textContent = BUSINESS.tagline;
  renderTrust();
  render();
})();

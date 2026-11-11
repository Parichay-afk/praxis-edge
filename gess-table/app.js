/* Praxis Edge GESS 2026 touch table, v2: host-led conversations */
(function () {
  "use strict";
  const D = window.EDGE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const stage = $("#stage"), screensEl = $("#screens"), bar = $("#bar"), rail = $("#rail"), tray = $("#tray"), overlay = $("#overlay");
  const ink = $("#ink"), penbar = $("#penbar"), ctx = ink.getContext("2d");
  const IMG = n => (D.ext && D.ext[n]) || "img/image" + n + ".jpg";
  const TH = n => (D.ext && D.ext[n]) || "img/t/image" + n + ".jpg";   /* 720px copies for grids, strips and thumbnails */
  const IDLE_MS = 240000, COUNTDOWN = 12;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- icons ---------------- */
  const sv = (p, w = 2.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const I = {
    play: sv('<path d="M8 5l11 7-11 7z" fill="currentColor"/>', 2),
    back: sv('<path d="M15 5l-7 7 7 7"/>'), next: sv('<path d="M9 5l7 7-7 7"/>'), arrow: sv('<path d="M4 12h15M13 6l6 6-6 6"/>'),
    flip: sv('<path d="M4 9a8 8 0 0114-3l2 2M20 15a8 8 0 01-14 3l-2-2"/><path d="M20 4v4h-4M4 20v-4h4"/>', 2.4),
    restart: sv('<path d="M3 11l9-7 9 7M5 10v10h14V10"/>', 2.4),
    pen: sv('<path d="M4 20l4-1L19 8l-3-3L5 16z"/><path d="M14 6l3 3"/>', 2.4),
    lock: sv('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', 2.4),
    undo: sv('<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 010 12"/>', 2.4),
    trash: sv('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', 2.4),
    check: sv('<path d="M5 12.5l4.5 4.5L19 7"/>', 3.2), plus: sv('<path d="M12 5v14M5 12h14"/>', 3), x: sv('<path d="M6 6l12 12M18 6L6 18"/>', 3),
    save: sv('<path d="M7 3h10v18l-5-4-5 4z"/>', 2.4), send: sv('<path d="M4 12l16-8-6 16-3-6z"/><path d="M11 14l9-10"/>', 2.4),
    drag: sv('<path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/>', 2.8), grid: sv('<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>', 2.2)
  };
  const ICO = {
    k12: '<svg viewBox="0 0 84 84" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"><path d="M10 34L42 16l32 18"/><path d="M18 34v34h48V34"/><path d="M36 68V50h12v18"/></svg>',
    early: '<svg viewBox="0 0 84 84" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"><rect x="12" y="42" width="24" height="24"/><rect x="48" y="42" width="24" height="24"/><path d="M42 12l14 24H28z"/></svg>',
    higher: '<svg viewBox="0 0 84 84" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"><path d="M6 32l36-16 36 16-36 16z"/><path d="M22 40v16c0 6 9 12 20 12s20-6 20-12V40"/></svg>',
    training: '<svg viewBox="0 0 84 84" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"><rect x="12" y="18" width="60" height="40"/><path d="M30 70h24M42 58v12"/><path d="M26 44l10-10 8 8 14-14"/></svg>'
  };
  const COLORS = { mint: "#D7F2E6", peach: "#FFE3D8", sky: "#DCEAFF", butter: "#FFF1C4" };

  /* ---------------- state ---------------- */
  let S;
  const savedFlip = () => { try { return localStorage.getItem("edge-flip") === "1"; } catch (e) { return false; } };
  const blankForm = () => ({ name: "", email: "", school: "", role: "", note: "" });
  function fresh() {
    S = { type: null, needs: new Set(), suggested: new Set(), plan: [], route: null, hist: [], flipped: S ? S.flipped : savedFlip(), form: blankForm(), consent: true };
  }
  fresh();

  /* ---------------- scaling + flip ---------------- */
  let scale = 1;
  function fit() {
    scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `scale(${scale}) rotate(${S.flipped ? 180 : 0}deg)`;
  }
  addEventListener("resize", fit);
  const setFlip = v => { S.flipped = v; fit(); try { localStorage.setItem("edge-flip", v ? "1" : "0"); } catch (e) {} };
  function toStage(e) {
    const r = stage.getBoundingClientRect();
    let x = (e.clientX - r.left) / scale, y = (e.clientY - r.top) / scale;
    if (S.flipped) { x = 1920 - x; y = 1080 - y; }
    return { x, y };
  }
  function frac(e, el) {
    const r = el.getBoundingClientRect();
    let f = (e.clientX - r.left) / r.width;
    if (S.flipped) f = 1 - f;
    return Math.max(0, Math.min(1, f));
  }
  function stageTop(el) { let y = 0; while (el && el !== stage) { y += el.offsetTop; el = el.offsetParent; } return y; }

  /* ---------------- data helpers ---------------- */
  const div = id => D.divisions.find(d => d.id === id);
  const space = id => D.spaces.find(s => s.id === id);
  const typeLabel = () => (D.types.find(t => t.id === S.type) || {}).label || "";
  const logoImg = (id, cls) => { const s = D.schools[id]; return s && s.logo ? `<img class="${cls || ""}" src="logos/${s.logo}.png" alt="${esc(s.name)}">` : ""; };
  const logoOrName = id => logoImg(id) || `<span class="lname">${esc((D.schools[id] || {}).name || "")}</span>`;
  const spaceSchools = s => [...new Set(s.pairs.map(p => D.credit[p[1]]).concat(s.extras.map(n => D.credit[n])).filter(Boolean))];
  const quoteHtml = () => ""; /* testimonials are switched off on the table */
  function orderedSpaces() {
    const o = D.spaceOrder[S.type] || D.spaces.map(s => s.id);
    return o.map(space).filter(Boolean).concat(D.spaces.filter(s => o.indexOf(s.id) < 0));
  }
  function items(s) {
    const list = s.pairs.map(p => ({ kind: "pair", b: p[0], a: p[1] }));
    const vid = s.video && { kind: "video", src: s.video.src, poster: s.video.poster, a: null, school: s.video.school || null };
    if (vid && s.video.first) list.unshift(vid);
    s.extras.forEach(n => list.push({ kind: "img", a: n }));
    if (vid && !s.video.first) list.push(vid); /* otherwise the video is the last thing in the section */
    return list;
  }
  function schoolProjects(sid) {
    const out = [];
    D.spaces.forEach(s => items(s).forEach((it, i) => {
      if (it.a && D.credit[it.a] === sid) out.push({ space: s.id, i, a: it.a, name: s.name });
      else if (it.kind === "video" && it.school === sid) out.push({ space: s.id, i, a: null, poster: it.poster, name: s.name + " video" });
    }));
    return out;
  }
  function recomputeSuggested() {
    S.suggested = new Set();
    D.needs.filter(n => S.needs.has(n.id)).forEach(n => n.divs.forEach(d => S.suggested.add(d)));
  }

  /* ---------------- plan ---------------- */
  const inPlan = key => S.plan.some(p => p.key === key);
  function togglePlanItem(item) {
    if (inPlan(item.key)) { S.plan = S.plan.filter(p => p.key !== item.key); renderTray(); return false; }
    S.plan.push(item); renderTray(true); return true;
  }
  function saveBtn(item, label) {
    const on = inPlan(item.key);
    const id = "sv" + Math.random().toString(36).slice(2, 8);
    SAVE[id] = item;
    return `<button class="savebtn ${on ? "on" : ""}" data-act="save" data-sv="${id}" data-lbl="${esc(label || "Save to plan")}">${on ? I.check + "Saved to plan" : I.save + (label || "Save to plan")}</button>`;
  }
  const SAVE = {};
  function refreshSaveBtns() {
    $$(".savebtn", current || document).forEach(b => {
      const it = SAVE[b.dataset.sv]; if (!it) return;
      const on = inPlan(it.key), lbl = b.dataset.lbl || "Save to plan";
      b.classList.toggle("on", on); b.innerHTML = on ? I.check + "Saved to plan" : I.save + lbl;
    });
  }
  function renderTray(bump) {
    const n = S.plan.length;
    tray.innerHTML = `
      <div class="tr-head"><span class="eyebrow">Their plan</span><b class="tr-n ${bump ? "bump" : ""}">${n}</b></div>
      <div class="tr-list scroll-y">
        ${n ? S.plan.map((p, i) => `<div class="tcard ${bump && i === n - 1 ? "new" : ""}">
            ${p.img ? `<img src="${p.img}" alt="">` : `<span class="tsw" style="background:${p.color || "#EEE9FC"}"><i class="diamond"></i></span>`}
            <span class="tt"><small>${esc(p.group)}</small>${esc(p.title)}</span>
            <button class="tx" data-act="unsave" data-key="${esc(p.key)}">${I.x}</button></div>`).join("")
          : `<div class="tr-empty"><span class="diamond"></span><p>Tap <b>Save to plan</b> on anything you talk about. It all goes into one email at the end.</p></div>`}
      </div>
      <button class="tr-send" data-act="review" ${n ? "" : "disabled"}>${I.send}Review and send</button>`;
    if (bump) { const l = $(".tr-list", tray); if (l) l.scrollTop = l.scrollHeight; }
    refreshSaveBtns();
  }

  /* ---------------- navigation ---------------- */
  let current = null;
  const FULL = ["attract", "sent"];
  function go(route, opts = {}) {
    if (S.route && !opts.noHist && S.route !== route && !FULL.includes(S.route.split(":")[0])) S.hist.push(S.route);
    S.route = route;
    const [name, a, b] = route.split(":");
    const R = { attract: vAttract, hello: vHello, tour: vTour, spaces: vSpaces, space: vSpace, div: vDiv, schools: vSchools, review: vReview, sent: vSent }[name];
    stage.classList.toggle("full", FULL.includes(name));
    stage.classList.toggle("wide", name === "review");
    const el = document.createElement("section");
    el.className = "screen s-" + name;
    R(el, a, b);
    screensEl.appendChild(el);
    const old = current; current = el;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("on")));
    if (old) { old.classList.remove("on"); setTimeout(() => old.remove(), 280); }
    hideKb(); clearInk(); setPen(false);
    renderBar(); renderRail(); refreshSaveBtns();
  }
  function back() {
    let r = S.hist.pop();
    while (r && r === S.route && S.hist.length) r = S.hist.pop();
    if (r && r.startsWith("tour:")) S.tourStep = +r.split(":")[1] || 0;
    go(r || "hello", { noHist: true });
  }
  function reset() { fresh(); closeModal(); renderTray(); go("attract", { noHist: true }); }

  /* ---------------- top bar ---------------- */
  function renderBar() {
    const ctxBits = [typeLabel()].concat(D.needs.filter(n => S.needs.has(n.id)).map(n => n.label)).filter(Boolean);
    bar.innerHTML = `
      <div class="logo-hit" id="logoHit"><img class="logo" src="brand/logo.png" alt="Praxis Edge"></div>
      <div class="ctx">${ctxBits.length ? `<span class="ctx-l">Talking with</span>${ctxBits.slice(0, 3).map(b => `<span class="ctx-c">${esc(b)}</span>`).join("")}${ctxBits.length > 3 ? `<span class="ctx-c">+${ctxBits.length - 3}</span>` : ""}` : `<span class="ctx-l">New conversation</span><span class="ctx-c ghost">Tell us about your school</span>`}</div>`;
  }

  /* ---------------- left rail ---------------- */
  const RAIL = [["tour", "Meet Praxis Edge"], ["hello", "Your school"], ["spaces", "Campus Design"], ["brand", "Branding"], ["enrolment", "Enrollment Support"], ["comms", "Comms & PR"], ["schools", "Schools we work with"]];
  function railActive() {
    const [n, a] = (S.route || "").split(":");
    if (n === "space" || n === "spaces") return "spaces";
    if (n === "div") return a;
    return n;
  }
  function renderRail() {
    const act = railActive();
    rail.innerHTML = `<div class="r-qr"><img src="brand/qr.svg" alt=""><span>Scan for<br><b>${D.qrUrl}</b></span></div>
      <div class="r-list">${RAIL.map(([id, label], i) => {
        const d = div(id), sug = S.suggested.has(id);
        return `<button class="ritem ${act === id ? "on" : ""}" data-act="nav" data-id="${id}">
          <span class="rn">0${i + 1}</span><span class="rl">${label}</span>
          ${d ? `<span class="rsw" style="background:${COLORS[d.color]}"></span>` : ""}${sug ? `<span class="rsug">Suggested</span>` : ""}</button>`;
      }).join("")}</div>
      <div class="r-ctl">
        <button class="rbtn" data-act="back" ${S.hist.length ? "" : "disabled"}>${I.back}<span>Back</span></button>
        <button class="rbtn pen ${penOn ? "on" : ""}" data-act="pen">${I.pen}<span>${penOn ? "Drawing" : "Draw"}</span></button>
        <button class="rbtn" data-act="flip">${I.flip}<span>Flip</span></button>
        <button class="rbtn" data-act="restart">${I.restart}<span>Home</span></button>
        <button class="rbtn" data-act="lock">${I.lock}<span>Lock</span></button>
      </div>`;
  }

  /* ---------------- screens ---------------- */
  function vAttract(el) {
    const pics = [2, 92, 69, 132, 34, 141, 83, 167, 44, 113, 57, 124];
    const colA = pics.filter((_, i) => i % 2 === 0), colB = pics.filter((_, i) => i % 2);
    const col = arr => arr.concat(arr).map(n => `<img src="${TH(n)}" alt="" decoding="async">`).join("");
    el.innerHTML = `
      <div class="doodle"></div>
      <button class="att-lock" id="attLock">${I.lock}<span>Lock</span></button>
      <div class="mosaic"><div class="mcol">${col(colA)}</div><div class="mcol">${col(colB)}</div></div>
      <div class="att-left">
        <img src="brand/logo-reversed.png" alt="Praxis Edge">
        <h1>Pull up a chair.<br><em>Let’s talk about your school.</em></h1>
        <p>We will walk you through how schools across the UAE get chosen: their brand, their campus and their admissions. Ask anyone on the team, or touch to explore.</p>
        <div class="att-cta"><div class="ring"><i></i><i></i><b></b></div><span>Touch to start</span></div>
        <button class="att-alt" id="attAlt">Just exploring? <b>See what we do in two minutes</b>${I.arrow}</button>
      </div>
      <div class="ticker"><span class="tk-l">Trusted by</span><div class="tk-win"><div class="tk-run" style="animation-duration:${Math.round((D.ticker || D.logoWall).length * 2.6)}s">${(D.ticker || D.logoWall).concat(D.ticker || D.logoWall).map(id => `<span class="tk-logo">${logoOrName(id)}</span>`).join("")}</div></div></div>`;
    $("#attAlt", el).addEventListener("pointerup", e => { e.stopPropagation(); requestFs(); go("tour:0"); });
    $("#attLock", el).addEventListener("pointerup", e => { e.stopPropagation(); setLock(true); });
    el.addEventListener("pointerup", () => { requestFs(); go("hello"); }, { once: true });
  }

  function vHello(el) {
    el.innerHTML = `
      <div class="hello">
        <div class="hello-l">
          <span class="eyebrow">Let’s talk</span>
          <h2 class="h-l">Tell us about your school</h2>
          <div class="sec"><h4>Who are we talking to?</h4>
            <div class="types">${D.types.map(t => `<button class="ttile ${S.type === t.id ? "sel" : ""}" data-act="type" data-id="${t.id}"><span class="ti">${ICO[t.id]}</span><b>${t.label}</b><small>${t.note}</small></button>`).join("")}</div></div>
          <div class="sec"><h4>What is on your mind this year?</h4>
            <div class="needs">${D.needs.map(n => `<button class="nchip ${S.needs.has(n.id) ? "sel" : ""}" data-act="need" data-id="${n.id}"><span class="nb">${I.check}</span>${n.label}</button>`).join("")}</div></div>
          <button class="hello-tour" data-act="nav" data-id="tour"><span class="diamond"></span><span><b>Not sure yet?</b> Start with a two-minute tour of what we do</span>${I.arrow}</button>
        </div>
        <div class="hello-r" id="startCol"></div>
      </div>`;
    renderStart(el);
  }
  function renderStart(el) {
    const col = $("#startCol", el); if (!col) return;
    const ids = ["spaces", "brand", "enrolment", "comms"];
    const order = ids.filter(i => S.suggested.has(i)).concat(ids.filter(i => !S.suggested.has(i)));
    col.innerHTML = `<h4>${S.suggested.size ? "Where we would start" : "How we can help"}</h4>
      ${order.map(id => { const d = div(id), sug = S.suggested.has(id); return `<button class="startc ${d.color} ${sug ? "sug" : ""}" data-act="nav" data-id="${id}">
        ${sug ? `<span class="tag">Suggested</span>` : ""}<b>${d.name}</b><span>${d.line}</span><i>${I.arrow}</i></button>`; }).join("")}
      <button class="startc ghost" data-act="nav" data-id="schools"><b>Schools we work with</b><span>A few of the 50+ schools, universities and nurseries we have worked with.</span><i>${I.arrow}</i></button>`;
  }

  /* ---------------- Meet Praxis Edge: a five-step tour for people who just want to know what we do ---------------- */
  const TOUR = ["Who we are", "What we do", "Proof", "How we work", "What next"];
  const TOUR_DIVS = ["spaces", "brand", "enrolment", "comms"];
  function tourToPlan() {
    TOUR_DIVS.forEach(id => { const d = div(id), key = "div:" + id; if (!inPlan(key)) S.plan.push({ key, group: "Service", title: d.name, sub: d.plan, color: COLORS[d.color] }); });
    renderTray(true);
  }
  function vTour(el, step) {
    const n = Math.max(0, Math.min(TOUR.length - 1, +step || 0));
    S.tourStep = n;
    const pairs = D.spaces.reduce((t, s) => t + s.pairs.length, 0);
    let body = "";
    if (n === 0) body = `
      <div class="tu-who">
        <div class="tu-col">
          <h2 class="h-l">We help schools get chosen.</h2>
          <p class="lead">Praxis Edge is the education team at Praxis Advertising. We design the campus, build the brand, tell the story and help fill the seats, for schools, nurseries and universities.</p>
          <div class="tu-facts">
            <div class="stat"><b>1999</b><span>Praxis Advertising founded in Dubai</span></div>
            <div class="stat"><b>50+</b><span>schools, universities and nurseries worked with</span></div>
            <div class="stat"><b>UAE + MENA</b><span>from Dubai and Abu Dhabi to Casablanca</span></div>
            <div class="stat"><b>1 partner</b><span>design, production and installation, end to end</span></div>
          </div>
        </div>
        <div class="tu-pics"><img src="${TH(2)}" alt="" decoding="async"><img src="${TH(92)}" alt="" decoding="async"><img src="${TH(69)}" alt="" decoding="async"></div>
      </div>`;
    if (n === 1) body = `
      <h2 class="h-l">Four ways we help a school grow</h2>
      <div class="tu-divs">${TOUR_DIVS.map(id => {
        const d = div(id), bits = id === "spaces" ? orderedSpaces().slice(0, 4).map(x => x.name) : (d.services || []).slice(0, 3).map(x => x[0]);
        return `<button class="tu-div bg-${d.color}" data-act="nav" data-id="${id}">
          <b>${d.name}</b><span class="tu-dl">${d.line}</span>
          <span class="tu-db">${bits.map(b => `<i>${esc(b)}</i>`).join("")}</span>
          <span class="tu-go">See the work${I.arrow}</span></button>`; }).join("")}</div>`;
    if (n === 2) body = `
      <div class="tu-proof">
        <div class="tu-col">
          <h2 class="h-l">50+ schools, universities and nurseries</h2>
          <div class="tu-logos">${(D.ticker || D.logoWall).map(id => `<span class="tu-lg">${logoOrName(id)}</span>`).join("")}</div>
        </div>
        <div class="tu-col tu-nums">
          <div class="stat"><b>${pairs}</b><span>campus before and afters on this table</span></div>
          <div class="stat"><b>1000+</b><span>projects delivered across MENA</span></div>
          <div class="stat"><b>800+</b><span>Praxians ready to take on their next project</span></div>
          <button class="big-btn ghost" data-act="nav" data-id="spaces">See the before and afters${I.arrow}</button>
        </div>
      </div>`;
    if (n === 3) body = `
      <h2 class="h-l">One partner, from first idea to opening day</h2>
      <p class="lead tu-lead">No juggling a designer, a printer, an installer and a PR agency. One team carries the idea all the way through.</p>
      <div class="tu-steps">${[["Listen", "We meet your leaders, staff, students and parents to find what makes your school different."],
        ["Plan", "A clear brief: what to say, which spaces to change and how to reach the right families."],
        ["Design", "Brand, campaigns and spaces designed together, so it all feels like one school."],
        ["Deliver", "We produce, install and launch it, managing every detail on site."]].map((x, k) =>
        `<div class="tu-step"><span class="sn">0${k + 1}</span><b>${x[0]}</b><span>${x[1]}</span></div>`).join("")}</div>
      <div class="tu-inhouse"><span class="diamond"></span>Design, production and installation, all under one roof</div>
      <div class="tu-band">${[34, 44, 83, 167].map(x => `<img src="${TH(x)}" alt="" decoding="async">`).join("")}</div>`;
    if (n === 4) body = `
      <h2 class="h-l">Where would you like to go from here?</h2>
      <div class="tu-qr"><img src="brand/qr.svg" alt=""><span>Or scan to keep exploring at <b>${D.qrUrl}</b></span></div>
      <div class="tu-next">
        <button class="tu-opt sun" data-act="tour-email"><b>Email me this overview</b><span>What we do, with links to the work, sent to your inbox.</span><i>${I.send}</i></button>
        <button class="tu-opt" data-act="hello"><b>Talk about my school</b><span>A few quick questions and we will show you what fits.</span><i>${I.arrow}</i></button>
        <button class="tu-opt" data-act="nav" data-id="spaces"><b>Look around the work</b><span>${pairs} campus before and afters, room by room.</span><i>${I.arrow}</i></button>
      </div>`;
    el.innerHTML = `<div class="tour">
        <div class="tu-head"><span class="eyebrow">Meet Praxis Edge</span></div>
        <div class="tu-body stag">${body}</div>
        <div class="tu-foot">
          ${n > 0 ? `<button class="big-btn ghost" data-act="tstep" data-id="${n - 1}">${I.back}Back</button>` : `<span class="tu-sp"></span>`}
          <div class="tu-nav">${TOUR.map((t, k) => `<button class="tn ${k === n ? "on" : ""} ${k < n ? "done" : ""}" data-act="tstep" data-id="${k}"><span>0${k + 1}</span>${t}</button>`).join("")}</div>
          ${n < TOUR.length - 1 ? `<button class="big-btn" data-act="tstep" data-id="${n + 1}">Next${I.arrow}</button>` : `<span class="tu-sp"></span>`}
        </div></div>`;
    /* swipe left or right to move through the tour */
    let sx = null;
    el.addEventListener("pointerdown", e => { sx = toStage(e).x; });
    el.addEventListener("pointerup", e => {
      if (sx == null || penOn) return; const dx = toStage(e).x - sx; sx = null;
      if (Math.abs(dx) > 160) { const m = n + (dx < 0 ? 1 : -1); if (m >= 0 && m < TOUR.length) go("tour:" + m, { noHist: true }); }
    });
  }

  function vSpaces(el) {
    const d = div("spaces");
    el.innerHTML = `
      <div class="phead"><div><span class="eyebrow">Campus Design</span><h2 class="h-l">Which space shall we look at?</h2></div></div>
      <div class="sp-grid stag">
        ${orderedSpaces().map(s => `<button class="sp" data-act="space" data-id="${s.id}">
          <img src="${TH(s.cover)}" alt="" decoding="async">
          <span class="cap"><b>${s.name}</b><span>${s.pairs.length} before and afters</span></span></button>`).join("")}
      </div>
      <div class="sp-foot">${askHtml(d)}${saveBtn({ key: "div:spaces", group: "Service", title: d.name, sub: d.plan, color: COLORS[d.color] }, "Save Campus Design")}</div>`;
  }
  function askHtml(d) {
    return d.ask ? `<div class="ask"><span class="ask-l">Ask</span>${d.ask.map(q => `<span class="ask-q">${q}</span>`).join("")}</div>` : "";
  }

  /* Videos: start them ourselves; if the browser holds back or the cached copy fails,
     retry once straight from the network, then offer a big Play button. */
  function startVideo(box) {
    const v = $("video", box), btn = $(".vplay", box); if (!v) return;
    const show = () => { if (btn && v.isConnected && v.paused) btn.hidden = false; };
    let retried = false;
    v.addEventListener("playing", () => { if (btn) btn.hidden = true; });
    v.addEventListener("error", () => {
      if (retried) return show();
      retried = true; v.src = v.getAttribute("src").split("?")[0] + "?net=" + Date.now(); v.load();
      const p = v.play(); if (p && p.catch) p.catch(show);
    });
    const p = v.play(); if (p && p.catch) p.catch(show);
    setTimeout(() => { if (v.paused || v.readyState < 2) show(); }, 5000);
  }
  function vSpace(el, id, idx) {
    const s = space(id), list = items(s);
    let i = Math.max(0, Math.min(list.length - 1, +idx || 0));
    el.innerHTML = `
      <div class="vhead">
        <div class="vt"><span class="eyebrow">Campus Design</span><h2>${s.name}</h2></div>
      </div>
      <div class="compare" id="cmp"></div>
      <div class="vinfo">
        <div class="vnav"><button class="sq" data-act="spaces" title="All spaces">${I.grid}</button><button class="sq" data-act="vprev">${I.back}</button><span class="pg" id="pg"></span><button class="sq" data-act="vnext">${I.next}</button></div>
        <div class="credit" id="credit"></div>
        <div id="vsave"></div>
      </div>
      <div class="strip scroll-x" id="strip">
        ${list.map((it, k) => `<button data-act="vgo" data-i="${k}"><img src="${it.kind === "video" ? it.poster : TH(it.a)}" alt="" decoding="async">${it.kind === "pair" ? "" : `<span class="k">${it.kind === "video" ? "VIDEO" : "PHOTO"}</span>`}</button>`).join("")}
      </div>`;
    const cmp = $("#cmp", el);
    let x = 50, touched = false, sweepRaf;
    const paint = () => cmp.style.setProperty("--x", x + "%");
    function sweep() {
      cancelAnimationFrame(sweepRaf);
      const t0 = performance.now() + 450;
      const step = t => { if (touched) return; const p = (t - t0) / 2400; if (p < 0) { sweepRaf = requestAnimationFrame(step); return; } if (p > 1) { x = 50; paint(); return; } x = 50 + Math.sin(p * Math.PI * 2) * 30; paint(); sweepRaf = requestAnimationFrame(step); };
      sweepRaf = requestAnimationFrame(step);
    }
    function show(k) {
      i = (k + list.length) % list.length;
      const it = list[i];
      $("#pg", el).textContent = it.kind === "pair" ? `${list.slice(0, i + 1).filter(x => x.kind === "pair").length} of ${s.pairs.length}` : it.kind === "video" ? "Video" : "Photo";
      $$("#strip button", el).forEach((b, n) => b.classList.toggle("cur", n === i));
      const cur = $(`#strip button[data-i="${i}"]`, el); if (cur) cur.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
      cmp.classList.toggle("single", it.kind !== "pair");
      if (it.kind === "pair") {
        cmp.innerHTML = `<img class="after" src="${IMG(it.a)}" alt=""><img class="before" src="${IMG(it.b)}" alt="">
          <span class="lbl b">BEFORE</span><span class="lbl a">AFTER</span>
          <div class="handle"><div class="grip">${I.drag}</div></div>`;
        x = 50; paint(); if (!touched) sweep();
        [list[i + 1], list[i - 1]].forEach(n => { if (n && n.kind === "pair") { new Image().src = IMG(n.a); new Image().src = IMG(n.b); } });
      } else if (it.kind === "video") {
        cmp.innerHTML = `<video src="${it.src}" poster="${it.poster}" autoplay muted loop playsinline preload="auto"></video><button class="vplay" data-act="vplay" hidden>${I.play}<span>Play video</span></button>`;
        startVideo(cmp);
      } else cmp.innerHTML = `<img src="${IMG(it.a)}" alt="">`;
      const cid = it.a ? D.credit[it.a] : (it.school || null), school = cid ? D.schools[cid] : null;
      const cr = $("#credit", el);
      cr.innerHTML = school ? `${school.logo ? `<span class="cl">${logoImg(cid)}</span>` : ""}<span class="cn"><small>Project for</small>${esc(school.name)}</span>${quoteHtml(cid)}` : `<span class="cn"><small>${esc(s.name)}</small>${esc(s.blurb)}</span>`;
      const thumbSrc = it.kind === "video" ? it.poster : TH(it.a);
      $("#vsave", el).innerHTML = saveBtn({ key: `space:${id}:${it.a || "video"}`, group: "Campus Design · " + s.name, title: school ? `${s.name} like ${school.name.replace(/^GEMS /, "")}` : `${s.name} idea`, sub: s.blurb, img: thumbSrc, client: school ? school.name : "" }, "Save this example");
      S.route = "space:" + id + ":" + i;
    }
    cmp.addEventListener("pointerdown", e => {
      if (cmp.classList.contains("single")) return;
      touched = true; cmp.setPointerCapture(e.pointerId); x = frac(e, cmp) * 100; paint();
    });
    cmp.addEventListener("pointermove", e => { if (cmp.hasPointerCapture(e.pointerId)) { x = frac(e, cmp) * 100; paint(); } });
    el._show = show; el._i = () => i;
    show(i);
  }

  function divSide(d) {
    return `<aside class="dv-l">
        <span class="swatch" style="background:${COLORS[d.color]}"></span>
        <h2 class="h-l">${d.name}</h2><p class="lead">${d.intro}</p>
        <div class="svc">${(d.services || []).map(s => `<div><i></i><p><b>${s[0]}</b><span>${s[1]}</span></p></div>`).join("")}</div>
        ${saveBtn({ key: "div:" + d.id, group: "Service", title: d.name, sub: d.plan, color: COLORS[d.color] }, "Save " + d.name)}
      </aside>`;
  }
  function stepsHtml(title, st) {
    return `<div class="card steps-card"><h3>${title}</h3><div class="steps">${st.map((x, k) => `<div><span class="sn">0${k + 1}</span><b>${x[0]}</b><span>${x[1]}</span></div>`).join("")}</div></div>`;
  }
  function vDiv(el, id) {
    const d = div(id);
    if (id === "spaces") return vSpaces(el);
    let main = "";
    if (id === "brand") {
      const c = d.cases[0];
      main = stepsHtml("How we build a school brand", [["Discover", "Parents, staff and students tell us what you stand for."], ["Define", "Positioning and a story only you can tell."], ["Design", "Identity, voice and the system around it."], ["Deliver", "Rolled out across print, digital and campus."]]) +
        `<div class="card bg-peach"><div class="case-top"><span class="client">${c.client}</span>${logoImg(c.school, "case-logo")}</div>
          <h3>${c.title}</h3><p>${c.body}</p><div class="result"><span class="diamond"></span>${c.result}</div>
          ${saveBtn({ key: "case:cfd", group: "Branding · Case study", title: c.title, sub: c.result, client: D.schools.cfd.name, color: COLORS.peach })}</div>`;
    } else if (id === "enrolment") {
      const a = d.cases[0], b = d.cases[1];
      main = `<div class="card bg-sky"><div class="case-top"><span class="client">${a.client}</span>${logoImg(a.school, "case-logo")}</div>
          <h3>${a.title}</h3><p>${a.body}</p>
          <div class="carousel scroll-x">${a.gallery.map(g => `<img src="${g}" alt="">`).join("")}</div>
          <div class="result"><span class="diamond"></span>${a.result}</div>
          ${saveBtn({ key: "case:iim", group: "Enrollment Support · Case study", title: a.title, sub: a.result, client: D.schools.iim.name, img: a.gallery[0] })}</div>
        <div class="card bg-lav"><div class="case-top"><span class="client">${b.client}</span>${logoImg(b.school, "case-logo")}</div>
          <h3>${b.title}</h3><p>${b.body}</p>
          <div class="stats">${b.stats.map(s => `<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("")}</div>
          ${saveBtn({ key: "case:drmi", group: "Enrollment Support · Case study", title: b.title, sub: b.stats.map(s => s[0] + " " + s[1]).join(", "), client: D.schools.drmi.name, color: COLORS.sky })}</div>
        ${funnelHtml()}`;
    } else if (id === "comms") {
      main = `<div class="card bg-butter statcard"><b class="big">${d.proof.stat}</b><div><span class="eyebrow">From our launch work</span><p>${d.proof.label}</p></div>${logoImg("drmi", "case-logo")}</div>` +
        stepsHtml("How a term with us works", [["Story audit", "We find the stories already hiding in your school."], ["Media plan", "The right outlets, voices and moments."], ["Launch", "Releases, interviews and content, placed."], ["Report", "Coverage, reach and sentiment, every month."]]) +
        `<div class="card bg-lav"><h3>Every school has stories worth telling</h3><p>A new building, a standout result, a student doing something remarkable. We find the stories, shape them and get them in front of the parents and press who matter.</p></div>`;
    }
    el.innerHTML = `<div class="dv">${divSide(d)}<div class="dv-r"><div class="dv-scroll scroll-y">${main}</div>${askHtml(d)}</div></div>`;
    if (id === "enrolment") bindFunnel(el);
  }

  /* funnel what-if */
  const F = { e: 80, t: 40, c: 35 };
  function funnelHtml() {
    const sl = (k, label, min, max, unit) => `<div class="sl"><label><span>${label}</span><span data-v="${k}"></span></label>
      <div class="range" data-k="${k}" data-min="${min}" data-max="${max}" data-unit="${unit}"><div class="track"></div><div class="fill"></div><div class="knob"></div></div></div>`;
    return `<div class="card funnel"><h3>Try your numbers together</h3><p class="hint">A quick what-if. Drag the diamonds.</p>
      ${sl("e", "Enquiries a month", 10, 400, "")}${sl("t", "Enquiries that book a tour", 5, 80, "%")}${sl("c", "Tours that enrol", 5, 80, "%")}
      <div class="fout"><div><span class="l">Families enrolling each year</span><span class="n" id="fN">0</span></div>
      <div class="up">Improve tours and enrolments by 5 points each and that is <b id="fUp">+0</b> more families a year.</div></div></div>`;
  }
  function bindFunnel(root) {
    const upd = () => {
      $$(".range", root).forEach(r => {
        const k = r.dataset.k, mn = +r.dataset.min, mx = +r.dataset.max, p = (F[k] - mn) / (mx - mn) * 100;
        $(".fill", r).style.width = p + "%"; $(".knob", r).style.left = p + "%";
        $(`[data-v="${k}"]`, root).textContent = F[k] + r.dataset.unit;
      });
      const base = Math.round(F.e * 12 * F.t / 100 * F.c / 100);
      const up = Math.round(F.e * 12 * Math.min(100, F.t + 5) / 100 * Math.min(100, F.c + 5) / 100) - base;
      $("#fN", root).textContent = base.toLocaleString("en");
      $("#fUp", root).textContent = "+" + up.toLocaleString("en");
    };
    $$(".range", root).forEach(r => {
      const set = e => { const mn = +r.dataset.min, mx = +r.dataset.max; F[r.dataset.k] = Math.round(mn + frac(e, r) * (mx - mn)); upd(); };
      r.addEventListener("pointerdown", e => { r.setPointerCapture(e.pointerId); set(e); });
      r.addEventListener("pointermove", e => { if (r.hasPointerCapture(e.pointerId)) set(e); });
    });
    upd();
  }

  function vSchools(el, sel) {
    sel = sel || "gwa";
    el.innerHTML = `
      <div class="phead"><div><span class="eyebrow">Proof</span><h2 class="h-l">Schools we work with</h2></div><p class="lead" style="max-width:460px;text-align:right">Tap a logo to see what we did for them.</p></div>
      <div class="spanel" id="spanel"></div>
      <div class="lgrid">${D.logoWall.map(id => `<button class="lt ${id === sel ? "sel" : ""}" data-act="school" data-id="${id}">${logoOrName(id)}</button>`).join("")}</div>`;
    renderSchool(el, sel);
  }
  function renderSchool(el, sid) {
    const p = $("#spanel", el), s = D.schools[sid], proj = schoolProjects(sid), list = (D.projects && D.projects[sid]) || [];
    $$(".lt", el).forEach(b => b.classList.toggle("sel", b.dataset.id === sid));
    const caseFor = (list.find(x => x.caseFor) || {}).caseFor;
    const pjImg = pj => pj.a ? TH(pj.a) : pj.poster;
    const firstImg = proj.length ? pjImg(proj[0]) : (sid === "iim" ? div("enrolment").cases[0].gallery[0] : "");
    p.innerHTML = `<div class="sp-l"><div class="sp-body scroll-y"><span class="eyebrow">${esc(s.name)}</span>
        ${list.map((x, k) => `<div class="proj">
          <h3>${esc(x.title)}</h3>
          <p>${esc(x.summary)}</p>
          ${x.stat ? `<div class="pstat"><b>${esc(x.stat[0])}</b><span>${esc(x.stat[1])}</span></div>` : ""}
          ${x.scope ? `<div class="scope">${x.scope.map(c => `<span>${esc(c)}</span>`).join("")}</div>` : ""}
        </div>`).join("")}
        ${quoteHtml(sid)}</div>
        ${list.length ? `<div class="prow">${list.map((x, k) => saveBtn({ key: "proj:" + sid + ":" + k, group: "Project \u00b7 " + s.name, title: x.title, sub: x.summary, client: s.name, img: k === 0 ? firstImg : "", color: "#EEE9FC" }, list.length > 1 ? "Save project " + (k + 1) : "Save this project")).join("")}
          ${caseFor ? `<button class="big-btn ghost" data-act="nav" data-id="${caseFor}">Case study ${I.arrow}</button>` : ""}</div>` : ""}</div>
      <div class="sp-r scroll-x">${proj.map(pj => `<button class="pj" data-act="openproj" data-space="${pj.space}" data-i="${pj.i}"><img src="${pjImg(pj)}" alt=""><span>${pj.name}</span></button>`).join("") || `<div class="pj-empty">${logoImg(sid, "pj-logo")}<span>Photos from this project are not on the table yet. Ask us to show you more.</span></div>`}</div>`;
    refreshSaveBtns();
  }

  /* ---------------- review + send ---------------- */
  function vReview(el) {
    const f = S.form;
    el.innerHTML = `
      <div class="rv">
        <div class="rv-l">
          <span class="eyebrow">${esc(typeLabel() || "Their plan")}</span>
          <h2 class="h-l">Here is what we covered</h2>
          <div class="rv-list scroll-y">${S.plan.length ? S.plan.map(p => `<div class="rcard">
              ${p.img ? `<img src="${p.img}" alt="">` : `<span class="tsw" style="background:${p.color || "#EEE9FC"}"><i class="diamond"></i></span>`}
              <span class="tt"><small>${esc(p.group)}</small><b>${esc(p.title)}</b><span>${esc(p.client ? "Project for " + p.client : p.sub || "")}</span></span>
              <button class="tx" data-act="unsave" data-key="${esc(p.key)}">${I.x}</button></div>`).join("")
            : `<div class="tr-empty"><p>Nothing saved yet. Go back and tap <b>Save to plan</b> on anything you talked about.</p></div>`}</div>
          ${fieldHtml("note", "Notes from our chat (optional)", "e.g. Reception refresh before the September intake")}
        </div>
        <div class="form">
          <h3>Where should we send it?</h3>
          <p>The plan goes to their inbox right now, with a copy to the Praxis Edge team.</p>
          ${fieldHtml("name", "Full name", "Their name")}
          ${fieldHtml("email", "Email", "name@school.ae")}
          ${fieldHtml("school", "School or institution", "Institution name")}
          ${fieldHtml("role", "Role (optional)", "Principal, Head of Admissions...")}
          <button class="consent ${S.consent ? "on" : ""}" data-act="consent"><i>${I.check}</i><span>Happy for Praxis Edge to follow up about this plan.</span></button>
          <button class="big-btn sun" data-act="send" ${S.plan.length ? "" : "disabled"}>${I.send}Send the plan</button>
        </div>
      </div>`;
    Object.keys(f).forEach(k => { const sp = $(`[data-field="${k}"] span`, el); if (sp) sp.textContent = f[k]; });
  }
  const fieldHtml = (k, label, ph) => `<button class="field" data-act="field" data-field="${k}"><small>${label}</small><span data-ph="${esc(ph)}"></span></button>`;

  function vSent(el, mode) {
    const first = esc((S.lastName || "").split(" ")[0]);
    el.innerHTML = `<div class="sent">
      <span class="tag">${mode === "queued" ? "Saved, sending soon" : "Plan sent"}</span>
      <h2 class="h-xl">Thank you${first ? ", " + first : ""}.</h2>
      <p class="lead">${mode === "queued" ? "We are offline for a moment. Your plan is saved and will send automatically as soon as we reconnect." : `Your plan is on its way to <b>${esc(S.lastEmail || "")}</b>. It has a link to book a follow-up call, or just reply and we will pick up where we left off.`}</p>
      <img class="qr" src="brand/qr.svg" alt=""><p class="lead small">Scan to keep exploring at ${D.qrUrl}</p>
      <button class="big-btn" data-act="restart-now">Start a new conversation</button></div>`;
    clearTimeout(vSent.t); vSent.t = setTimeout(() => { if ((S.route || "").startsWith("sent")) reset(); }, 30000);
  }

  /* ---------------- leads, outbox, sending ---------------- */
  const LS = "edge_gess_leads_v1", OB = "edge_gess_outbox_v1";
  const getJ = k => { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } };
  const setJ = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  function markLead(id, status) { const L = getJ(LS); L.forEach(l => { if (l.id === id) l.status = status; }); setJ(LS, L); }

  function thumb(src) {
    return new Promise(res => {
      if (!src) return res(null);
      const im = new Image();
      im.onload = () => {
        try {
          /* 400px is sharp at the 200px email size on retina screens and keeps each photo around 25KB */
          const w = Math.min(400, im.naturalWidth), h = Math.round(w * im.naturalHeight / im.naturalWidth);
          const c = document.createElement("canvas"); c.width = w; c.height = Math.min(h, Math.round(w * 0.87));
          const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
          g.drawImage(im, 0, 0, w, h);
          res({ data: c.toDataURL("image/jpeg", 0.72).split(",")[1], w: c.width, h: c.height });
        } catch (e) { res(null); }
      };
      im.onerror = () => res(null);
      im.src = src;
    });
  }
  async function logoB64() {
    return new Promise(res => {
      const im = new Image();
      im.onload = () => { try { const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext("2d"); g.fillStyle = "#2E0088"; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0); res(c.toDataURL("image/png").split(",")[1]); } catch (e) { res(null); } };
      im.onerror = () => res(null); im.src = "brand/logo-reversed.png";
    });
  }
  /* the website page each saved item points to in the email */
  function linkFor(key) {
    const W = D.site || {}, k = String(key || "").split(":");
    if (k[0] === "div") return (W.division || {})[k[1]] || "/";
    if (k[0] === "space") return W.spaceExamples || "/spaces";
    if (k[0] === "case" || k[0] === "proj") { const slug = (W.work || {})[k[1]]; return slug ? "/work/" + slug : "/work"; }
    return "/";
  }
  async function buildPayload(job) {
    const images = [];
    const itemsOut = [];
    for (let k = 0; k < job.items.length; k++) {
      const it = job.items[k], o = { group: it.group, title: it.title, sub: it.sub, client: it.client, color: it.color, link: it.link };
      if (it.img && images.length < 11) { const b = await thumb(it.img); if (b) { o.cid = "img" + k; o.ih = Math.round(200 * b.h / b.w); images.push({ cid: o.cid, data: b.data }); } }
      itemsOut.push(o);
    }
    const lg = await logoB64(); if (lg) images.push({ cid: "pxe-logo", data: lg });
    return { id: job.id, token: D.sendToken, name: job.name, email: job.email, school: job.school, role: job.role, note: job.note, type: job.type || "", challenges: job.challenges || "", consent: job.consent || "", items: itemsOut, images };
  }
  async function post(job) {
    const payload = await buildPayload(job);
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000);
    try {
      /* text/plain keeps this a simple request (no preflight), which Google Apps Script needs */
      const r = await fetch(D.sendEndpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), signal: ctl.signal, redirect: "follow" });
      clearTimeout(t);
      const j = await r.json().catch(() => ({}));
      return r.ok && j.ok;
    } catch (e) { clearTimeout(t); return false; }
  }
  let flushing = false;
  async function flush() {
    if (flushing) return; flushing = true;
    try {
      let q = getJ(OB);
      for (const job of q.slice()) {
        if (!navigator.onLine || !D.sendEndpoint) break;
        if (await post(job)) { q = getJ(OB).filter(j => j.id !== job.id); setJ(OB, q); markLead(job.id, "sent"); }
      }
    } finally { flushing = false; }
  }
  setInterval(flush, 45000);
  addEventListener("online", flush);

  async function submit() {
    const f = S.form, okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim());
    let bad = false;
    if (!f.name.trim()) { $('[data-field="name"]').classList.add("err"); bad = true; }
    if (!okEmail) { $('[data-field="email"]').classList.add("err"); bad = true; }
    if (bad) { toast(!okEmail && f.name.trim() ? "Please check the email address" : "Please add a name and email"); return; }
    const job = {
      id: "gess-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7), time: new Date().toISOString(),
      name: f.name.trim(), email: f.email.trim(), school: f.school.trim(), role: f.role.trim(), note: f.note.trim(),
      items: S.plan.map(p => ({ group: p.group, title: p.title, sub: p.sub, client: p.client, color: p.color, img: p.img, link: linkFor(p.key) })),
      type: typeLabel() || "", challenges: D.needs.filter(n => S.needs.has(n.id)).map(n => n.label).join("; "), consent: S.consent ? "yes" : "no"
    };
    const L = getJ(LS);
    L.push({ id: job.id, time: job.time, name: job.name, email: job.email, institution: job.school, role: job.role, type: typeLabel(),
      challenges: D.needs.filter(n => S.needs.has(n.id)).map(n => n.label).join("; "), plan: S.plan.map(p => p.title).join("; "),
      note: job.note, consent: S.consent ? "yes" : "no", status: "sending" });
    setJ(LS, L);
    S.lastName = job.name; S.lastEmail = job.email;
    const btn = $('[data-act="send"]'); if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Sending'; }
    let ok = false;
    if (navigator.onLine && D.sendEndpoint) ok = await post(job);
    if (ok) markLead(job.id, "sent");
    else { const q = getJ(OB); q.push(job); setJ(OB, q); markLead(job.id, "queued"); }
    go("sent:" + (ok ? "sent" : "queued"));
  }

  /* ---------------- keyboard ---------------- */
  let kb, kbLayer = "abc", kbShift = false;
  const ROWS = {
    abc: [["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","del"],["123","@","space",".",".com","next"]],
    num: [["1","2","3","4","5","6","7","8","9","0"],["-","_","+","(",")","'","&","/","#"],["abc","!",",","?",".ae","del"],["abc","@","space",".",".com","next"]]
  };
  const FIELD_ORDER = ["name", "email", "school", "role"];
  const FIELD_LABEL = { name: "Full name", email: "Email", school: "School or institution", role: "Role", note: "Notes from our chat" };
  function buildKb() {
    kb = document.createElement("div"); kb.id = "kb"; stage.appendChild(kb);
    kb.addEventListener("pointerdown", e => { const b = e.target.closest("button"); if (!b) return; e.preventDefault(); key(b.dataset.k); });
  }
  function drawKb() {
    const f = kbField;
    const lab = k => ({ shift: "Shift", del: "⌫", "123": "123", abc: "ABC", space: "Space", next: (f === "role" || f === "note") ? "Done" : "Next" }[k] || (kbShift && k.length === 1 ? k.toUpperCase() : k));
    const cls = k => k === "space" ? "xw" : k === "next" ? "w act" : ["shift", "del", "123", "abc", ".com", ".ae"].includes(k) ? "w mod" + (k === "shift" && kbShift ? " lit" : "") : "";
    kb.innerHTML = `<div class="kbhead"><span>${FIELD_LABEL[f] || ""}</span><button class="w mod hide" data-k="close">Hide</button></div>` +
      ROWS[kbLayer].map(r => `<div class="row">${r.map(k => `<button class="${cls(k)}" data-k="${k}">${lab(k)}</button>`).join("")}</div>`).join("");
  }
  let kbField = null, kbPhys = false;
  function showKb(field) {
    if (!kb) buildKb();
    kbField = field;
    kbLayer = "abc";
    kbShift = ["name", "school", "note", "role"].includes(field) && !S.form[field];
    $$(".field").forEach(x => x.classList.toggle("focus", x.dataset.field === field));
    drawKb();
    if (kbPhys) return; /* a physical keyboard is in use: keep the screen clear */
    kb.classList.add("on");
    requestAnimationFrame(() => {
      const fe = $(`[data-field="${field}"]`); if (!fe || !current) return;
      current.style.transform = "";
      const bottom = stageTop(fe) + fe.offsetHeight, limit = 1080 - kb.offsetHeight - 24;
      current.classList.add("kb-shift"); current.style.transform = bottom > limit ? `translateY(${limit - bottom}px)` : "";
    });
  }
  function hideKb() {
    if (kb) kb.classList.remove("on");
    if (current) current.style.transform = "";
    $$(".field").forEach(x => x.classList.remove("focus"));
    kbField = null;
  }
  function key(k) {
    poke();
    const f = kbField; if (!f) return;
    if (k === "close") return hideKb();
    if (k === "shift") { kbShift = !kbShift; return drawKb(); }
    if (k === "123") { kbLayer = "num"; return drawKb(); }
    if (k === "abc") { kbLayer = "abc"; return drawKb(); }
    if (k === "next") { if (f === "note") return hideKb(); const n = FIELD_ORDER[FIELD_ORDER.indexOf(f) + 1]; return n ? showKb(n) : hideKb(); }
    let v = S.form[f];
    if (k === "del") v = v.slice(0, -1);
    else if (k === "space") v += " ";
    else { let c = kbShift ? k.toUpperCase() : k; if (f === "email") c = c.toLowerCase(); v += c; if (kbShift) kbShift = false; }
    if (f !== "email" && (v === "" || v.endsWith(" ") && f !== "note")) kbShift = true;
    if (f === "note" && (v === "" || /[.!?]\s$/.test(v))) kbShift = true;
    S.form[f] = v.slice(0, f === "note" ? 280 : 80);
    const fe = $(`[data-field="${f}"]`);
    if (fe) { const sp = $("span", fe); sp.textContent = S.form[f]; sp.scrollLeft = 9999; fe.classList.remove("err"); }
    drawKb();
  }

  /* A physical (Bluetooth or USB) keyboard types into the same fields.
     The first key press tucks the on-screen keyboard away; tapping a field brings it back. */
  function typeText(f, c) {
    let v = S.form[f] + (f === "email" ? c.toLowerCase() : c);
    S.form[f] = v.slice(0, f === "note" ? 280 : 80);
    const fe = $(`[data-field="${f}"]`);
    if (fe) { const sp = $("span", fe); sp.textContent = S.form[f]; sp.scrollLeft = 9999; fe.classList.remove("err"); }
  }
  addEventListener("keydown", e => {
    if (locked) { e.preventDefault(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    let f = kbField;
    if (!f) {
      if (!$('[data-field="name"]', current || document)) return; /* only on the form screen */
      if (e.key.length !== 1 && e.key !== "Tab") return;
      kbPhys = true; f = FIELD_ORDER.find(k => !S.form[k]) || "name"; showKb(f);
    }
    if (!kbPhys) { kbPhys = true; if (kb) kb.classList.remove("on"); if (current) current.style.transform = ""; }
    poke();
    const order = FIELD_ORDER.concat($('[data-field="note"]') ? ["note"] : []);
    const step = d => { const n = order[order.indexOf(f) + d]; if (n) showKb(n); else if (d > 0) hideKb(); };
    if (e.key === "Backspace") { S.form[f] = S.form[f].slice(0, -1); typeText(f, ""); }
    else if (e.key === "Tab") step(e.shiftKey ? -1 : 1);
    else if (e.key === "Enter") step(1);
    else if (e.key === "Escape") hideKb();
    else if (e.key === "ArrowDown") step(1);
    else if (e.key === "ArrowUp") step(-1);
    else if (e.key.length === 1) typeText(f, e.key);
    else return;
    e.preventDefault();
  });

  /* ---------------- touch lock ----------------
     Covers the whole screen so brushes, palms and leaning arms do nothing.
     To unlock, hold ONE finger on the lock bar for 2 seconds; a second touch
     anywhere, or sliding off, cancels the hold. */
  let locked = false;
  const lockEl = document.createElement("div");
  lockEl.id = "lock";
  lockEl.innerHTML = `<div class="lk-badge"><i class="lk-fill"></i>${I.lock}<span><b>Screen locked</b><small>Hold here for 2 seconds to unlock</small></span></div>`;
  stage.appendChild(lockEl);
  const badge = $(".lk-badge", lockEl), touches = new Set();
  let holdT = null, holdId = null, hx = 0, hy = 0;
  function setLock(v) {
    locked = v; lockEl.classList.toggle("on", v); cancelHold(); touches.clear();
    if (v) { if (penOn) setPen(false); if (kbField) hideKb(); toast("Screen locked"); } else { poke(); toast("Unlocked"); }
  }
  function cancelHold() { clearTimeout(holdT); holdT = null; holdId = null; badge.classList.remove("hold"); }
  const swallow = e => { e.stopPropagation(); if (e.cancelable) e.preventDefault(); };
  ["click", "dblclick", "touchstart", "touchmove", "touchend", "wheel", "contextmenu"].forEach(t => lockEl.addEventListener(t, swallow, { passive: false }));
  lockEl.addEventListener("pointerdown", e => {
    swallow(e); touches.add(e.pointerId);
    const onBadge = badge.contains(e.target);
    if (touches.size > 1 || !onBadge) {
      cancelHold();
      if (!onBadge) { badge.classList.remove("nudge"); void badge.offsetWidth; badge.classList.add("nudge"); }
      return;
    }
    holdId = e.pointerId; hx = e.clientX; hy = e.clientY;
    try { lockEl.setPointerCapture(e.pointerId); } catch (x) {}
    badge.classList.add("hold");
    holdT = setTimeout(() => { if (touches.size === 1 && holdId !== null) setLock(false); }, 2000);
  });
  lockEl.addEventListener("pointermove", e => { swallow(e); if (e.pointerId === holdId && Math.hypot(e.clientX - hx, e.clientY - hy) > 40) cancelHold(); });
  const lift = e => { swallow(e); touches.delete(e.pointerId); if (e.pointerId === holdId) cancelHold(); };
  lockEl.addEventListener("pointerup", lift); lockEl.addEventListener("pointercancel", lift);

  /* ---------------- pen (discussion only, clears on navigation) ---------------- */
  let penOn = false, strokes = [], live = {}, penTool = "coral";
  const TOOLS = { coral: { c: "#FF6F5B", w: 9, a: 1 }, ink: { c: "#2E0088", w: 9, a: 1 }, glow: { c: "#F5C542", w: 38, a: .45 } };
  function setPen(v) {
    penOn = v; stage.classList.toggle("pen-on", v);
    penbar.innerHTML = v ? `<span class="pb-l">Draw to explain</span>
      ${Object.keys(TOOLS).map(t => `<button class="pb-c ${t} ${t === penTool ? "on" : ""}" data-act="tool" data-id="${t}"><i style="background:${TOOLS[t].c}"></i>${t === "glow" ? "Highlight" : t === "ink" ? "Purple" : "Coral"}</button>`).join("")}
      <button class="pb-b" data-act="undo">${I.undo}Undo</button><button class="pb-b" data-act="clearink">${I.trash}Clear</button>
      <button class="pb-b done" data-act="pen">${I.check}Done</button>` : "";
    const pb = $(".rbtn.pen", rail); if (pb) { pb.classList.toggle("on", v); pb.innerHTML = I.pen + `<span>${v ? "Drawing" : "Draw"}</span>`; }
  }
  function clearInk() { strokes = []; live = {}; ctx.clearRect(0, 0, ink.width, ink.height); stage.classList.remove("inked"); }
  function drawStroke(s) {
    const t = TOOLS[s.tool]; if (s.pts.length < 1) return;
    ctx.save(); ctx.globalAlpha = t.a; ctx.strokeStyle = t.c; ctx.lineWidth = t.w; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (s.tool === "glow") ctx.globalCompositeOperation = "multiply";
    ctx.beginPath(); ctx.moveTo(s.pts[0][0], s.pts[0][1]);
    for (let k = 1; k < s.pts.length - 1; k++) { const mx = (s.pts[k][0] + s.pts[k + 1][0]) / 2, my = (s.pts[k][1] + s.pts[k + 1][1]) / 2; ctx.quadraticCurveTo(s.pts[k][0], s.pts[k][1], mx, my); }
    const l = s.pts[s.pts.length - 1]; ctx.lineTo(l[0], l[1]); ctx.stroke(); ctx.restore();
  }
  function redraw() { ctx.clearRect(0, 0, ink.width, ink.height); strokes.forEach(drawStroke); Object.values(live).forEach(drawStroke); }
  const inkPt = e => { const p = toStage(e); return [p.x, p.y - 88]; };
  ink.addEventListener("pointerdown", e => { if (!penOn) return; ink.setPointerCapture(e.pointerId); live[e.pointerId] = { tool: penTool, pts: [inkPt(e)] }; poke(); });
  ink.addEventListener("pointermove", e => { const s = live[e.pointerId]; if (!s) return; s.pts.push(inkPt(e)); redraw(); });
  const endInk = e => { const s = live[e.pointerId]; if (!s) return; delete live[e.pointerId]; if (s.pts.length === 1) s.pts.push([s.pts[0][0] + .1, s.pts[0][1]]); strokes.push(s); redraw(); stage.classList.add("inked"); };
  ink.addEventListener("pointerup", endInk); ink.addEventListener("pointercancel", endInk);

  /* ---------------- actions ---------------- */
  stage.addEventListener("click", e => {
    const t = e.target.closest("[data-act]"); if (!t) return;
    const act = t.dataset.act, id = t.dataset.id;
    switch (act) {
      case "flip": setFlip(!S.flipped); break;
      case "back": if (S.hist.length) back(); break;
      case "lock": setLock(true); break;
      case "vplay": { const v = $("video", current); if (v) { v.muted = true; v.play().catch(() => { v.controls = true; }); } break; }
      case "restart": confirmRestart(); break;
      case "restart-now": reset(); break;
      case "hello": go("hello"); break;
      case "nav": go(id === "tour" ? "tour:" + (S.tourStep || 0) : id === "hello" ? "hello" : id === "spaces" ? "spaces" : id === "schools" ? "schools" : "div:" + id); break;
      case "tstep": go("tour:" + id, { noHist: true }); break;
      case "tour-email": tourToPlan(); go("review"); break;
      case "spaces": go("spaces"); break;
      case "space": go("space:" + id + ":0"); break;
      case "openproj": go("space:" + t.dataset.space + ":" + t.dataset.i); break;
      case "school": renderSchool(current, id); S.route = "schools:" + id; break;
      case "type": S.type = S.type === id ? null : id; $$(".ttile", current).forEach(b => b.classList.toggle("sel", b.dataset.id === S.type)); renderBar(); break;
      case "need": S.needs.has(id) ? S.needs.delete(id) : S.needs.add(id); t.classList.toggle("sel"); recomputeSuggested(); renderStart(current); renderRail(); renderBar(); break;
      case "save": { const it = SAVE[t.dataset.sv]; if (!it) break; if (togglePlanItem(it)) toast("Saved to their plan"); break; }
      case "unsave": S.plan = S.plan.filter(p => p.key !== t.dataset.key); renderTray(); if ((S.route || "") === "review") go("review", { noHist: true }); break;
      case "review": go("review"); break;
      case "vprev": current._show(current._i() - 1); break;
      case "vnext": current._show(current._i() + 1); break;
      case "vgo": current._show(+t.dataset.i); break;
      case "field": kbPhys = false; showKb(t.dataset.field); break;
      case "consent": S.consent = !S.consent; t.classList.toggle("on", S.consent); break;
      case "send": hideKb(); submit(); break;
      case "pen": setPen(!penOn); break;
      case "tool": penTool = id; setPen(true); break;
      case "undo": strokes.pop(); redraw(); break;
      case "clearink": clearInk(); break;
    }
  });

  function confirmRestart() {
    if (!S.plan.length && !S.type && !S.needs.size) return reset();
    const m = openModal(`<div class="mbox"><span class="eyebrow">New conversation</span><h3 class="h-m">Start fresh?</h3>
      <p class="lead">This clears the current plan${S.plan.length ? ` (${S.plan.length} saved ${S.plan.length === 1 ? "item" : "items"})` : ""}. Anything already sent is safe.</p>
      <div class="row"><button class="big-btn" data-m="yes">Start fresh</button><button class="big-btn ghost" data-m="no">Keep going</button></div></div>`, "confirm");
    m.addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (!b) return; if (b.dataset.m === "yes") reset(); else closeModal(); });
  }

  /* ---------------- toast, modal, idle, ripple ---------------- */
  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.innerHTML = "<i></i>" + msg;
    stage.appendChild(t); requestAnimationFrame(() => t.classList.add("on"));
    setTimeout(() => { t.classList.remove("on"); setTimeout(() => t.remove(), 400); }, 2200);
  }
  let last = Date.now(), modalEl = null, cdT = null;
  function poke() { last = Date.now(); }
  document.addEventListener("pointermove", e => { if (e.pointerType === "mouse") document.body.classList.remove("touching"); });
  stage.addEventListener("pointerdown", e => {
    if (locked) return;
    poke();
    document.body.classList.toggle("touching", e.pointerType !== "mouse");
    if (modalEl && modalEl.dataset.kind === "idle") closeModal();
    if (penOn) return;
    const p = toStage(e), r = document.createElement("div");
    r.className = "ripple"; r.style.left = p.x + "px"; r.style.top = p.y + "px"; stage.appendChild(r); setTimeout(() => r.remove(), 650);
  }, true);
  document.addEventListener("contextmenu", e => e.preventDefault());
  setInterval(() => {
    const name = (S.route || "").split(":")[0];
    if (locked || name === "attract" || name === "sent" || modalEl) return;
    const limit = S.plan.length || (S.form && (S.form.name || S.form.email)) ? IDLE_MS * 2 : IDLE_MS;
    if (Date.now() - last > limit) idleModal();
  }, 1000);
  function idleModal() {
    let n = COUNTDOWN;
    openModal(`<div class="mbox"><span class="eyebrow">Still talking?</span><h3 class="h-m">Touch anywhere to carry on.</h3><p class="lead">Otherwise the table resets for the next conversation in</p><span class="cd" id="cd">${n}</span></div>`, "idle");
    cdT = setInterval(() => { n--; const c = $("#cd"); if (c) c.textContent = n; if (n <= 0) { clearInterval(cdT); reset(); } }, 1000);
  }
  function openModal(html, kind) {
    closeModal();
    modalEl = document.createElement("div"); modalEl.className = "modal"; modalEl.dataset.kind = kind; modalEl.innerHTML = html;
    overlay.appendChild(modalEl); requestAnimationFrame(() => modalEl.classList.add("on"));
    return modalEl;
  }
  function closeModal() { clearInterval(cdT); if (modalEl) { const m = modalEl; m.classList.remove("on"); setTimeout(() => m.remove(), 300); modalEl = null; poke(); } }


  /* ---------------- staff panel ----------------
     No touch gesture opens it, so visitors can never bring it up by accident.
     Staff open it on the table's browser with the address ending in #staff. */
  function staffFromUrl() {
    if (location.hash !== "#staff") return;
    history.replaceState(null, "", location.pathname + location.search);
    setTimeout(adminPanel, 300);
  }
  addEventListener("hashchange", staffFromUrl);
  function csv(rows) {
    const cols = ["time", "name", "email", "institution", "role", "type", "challenges", "plan", "note", "consent", "status"];
    const q = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
    return [cols.join(",")].concat(rows.map(r => cols.map(c => q(r[c])).join(","))).join("\r\n");
  }
  function download(name, text, type) {
    const b = new Blob([text], { type }), a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function adminPanel() {
    const L = getJ(LS), Q = getJ(OB);
    const m = openModal(`<div class="mbox admin"><span class="eyebrow">Staff panel</span><h3 class="h-m">Plans on this device</h3>
      <div class="stats" style="width:100%"><div class="stat"><b>${L.length}</b><span>plans captured</span></div><div class="stat"><b>${L.filter(l => l.status === "sent").length}</b><span>emails sent</span></div><div class="stat"><b>${Q.length}</b><span>waiting to send</span></div></div>
      <p class="lead" id="svc">Checking the email service…</p>
      <div class="row">
        <button class="big-btn" data-a="csv">Download CSV</button>
        <button class="big-btn ghost" data-a="retry">Send waiting now</button>
        <button class="big-btn ghost" data-a="close">Close</button>
      </div>
      <button class="link" data-a="clear">Clear all (hold 3 seconds)</button></div>`, "admin");
    if (!D.sendEndpoint) { setTimeout(() => { const s = $("#svc"); if (s) s.textContent = "Email is not connected yet. Plans are saved on this device and will send once it is."; }, 0); }
    else fetch(D.sendEndpoint, { method: "GET", redirect: "follow" }).then(r => r.json()).then(j => { $("#svc").textContent = j.configured ? "Email service is ready. Plans send live." : "Email service is online but not set up yet. Plans are saved and will send once it is."; })
      .catch(() => { $("#svc").textContent = navigator.onLine ? "Email service not reachable. Plans are saved and will retry." : "This device is offline. Plans are saved and will send when it reconnects."; });
    const stamp = () => new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
    m.addEventListener("click", e => {
      const a = e.target.closest("[data-a]"); if (!a) return;
      if (a.dataset.a === "csv") download("praxis-edge-gess-plans-" + stamp() + ".csv", "﻿" + csv(getJ(LS)), "text/csv");
      if (a.dataset.a === "retry") { flush(); toast("Trying to send waiting plans"); }
      if (a.dataset.a === "close") closeModal();
    });
    const clr = $('[data-a="clear"]', m); let ct;
    clr.addEventListener("pointerdown", () => { ct = setTimeout(() => {
      download("praxis-edge-gess-plans-before-clear-" + stamp() + ".json", JSON.stringify({ leads: getJ(LS), outbox: getJ(OB) }, null, 2), "application/json");
      setJ(LS, []); closeModal(); toast("Plans cleared. A backup file downloaded first.");
    }, 3000); });
    ["pointerup", "pointerleave"].forEach(ev => clr.addEventListener(ev, () => clearTimeout(ct)));
  }

  /* ---------------- device niceties ---------------- */
  function requestFs() { const d = document.documentElement; if (!document.fullscreenElement && d.requestFullscreen) d.requestFullscreen().catch(() => {}); }
  async function wake() { try { if ("wakeLock" in navigator) await navigator.wakeLock.request("screen"); } catch (e) {} }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") wake(); });
  if ("serviceWorker" in navigator && /^https:|localhost/.test(location.href)) navigator.serviceWorker.register("sw.js").catch(() => {});

  fit(); wake(); renderTray(); go("attract", { noHist: true }); setTimeout(flush, 5000); staffFromUrl();
  window.__edge = { go, S, reset, setFlip, setPen, submit, getJ };
})();

/* Mohammad Adib Watfa · portfolio interactions */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  };

  /* ---------- theme ---------- */
  const saved = store.get("aw-theme");
  if (saved === "light" || (!saved && window.matchMedia("(prefers-color-scheme: light)").matches)) document.body.classList.add("light");
  $("#themeToggle").addEventListener("click", () => {
    const light = document.body.classList.toggle("light");
    store.set("aw-theme", light ? "light" : "dark");
  });

  /* ---------- menu ---------- */
  const menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  const closeMenu = () => { navLinks.classList.remove("open"); menuBtn.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); };
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$("a", navLinks).forEach(a => a.addEventListener("click", closeMenu));

  /* ---------- dates ---------- */
  const now = new Date();
  $("#year").textContent = now.getFullYear();
  $("#todayDate").textContent = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const start = new Date(2025, 3, 1);
  let months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth() + 1;
  const y = Math.floor(months / 12), m = months % 12;
  const dur = [y ? `${y} yr${y > 1 ? "s" : ""}` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ");
  $("#tenure").textContent = `Apr 2025 – now · ${dur}`;
  $("#tenure2").textContent = `· ${dur}`;

  /* ---------- scroll progress + active link ---------- */
  const bar = $("#scrollBar");
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = `${(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const navAnchors = $$(".nav-links a");
  const secObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
  }), { rootMargin: "-40% 0px -55% 0px" });
  $$("main section[id]").forEach(s => secObs.observe(s));

  /* ---------- reveal + count-up ---------- */
  const countUp = el => {
    const to = +el.dataset.to; if (reduced) { el.textContent = to.toLocaleString("en-US"); return; }
    const t0 = performance.now(), d = 1400;
    const step = t => { const p = Math.min(1, (t - t0) / d), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = v.toLocaleString("en-US"); if (p < 1) requestAnimationFrame(step); };
    el.textContent = "0"; requestAnimationFrame(step);
  };
  const revObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    $$(".count", e.target).forEach(countUp);
    revObs.unobserve(e.target);
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`; revObs.observe(el); });

  /* ---------- rotating headline ---------- */
  const phrases = ["tested Python services", "production Document AI", "results you can measure", "APIs other teams build on"];
  const rot = $("#rotator");
  if (!reduced) {
    let pi = 0, ci = phrases[0].length, deleting = true;
    const tick = () => {
      const word = phrases[pi];
      if (deleting) { ci--; if (ci <= 0) { deleting = false; pi = (pi + 1) % phrases.length; } }
      else { ci++; if (ci >= phrases[pi].length) { deleting = true; rot.textContent = phrases[pi]; return setTimeout(tick, 2400); } }
      rot.textContent = (deleting ? word : phrases[pi]).slice(0, ci);
      setTimeout(tick, deleting ? 32 : 58);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- hero neural field ---------- */
  (function neural() {
    const cv = $("#neuralCanvas"); if (!cv || reduced) return;
    const ctx = cv.getContext("2d");
    let W, H, pts = [], mouse = { x: -999, y: -999 }, running = true, dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (W * H) / 16000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: Math.random() * 1.6 + .6 }));
    };
    const color = () => document.body.classList.contains("light") ? "2,132,199" : "46,216,255";
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const c = color();
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 160) { p.x += dx * .006; p.y += dy * .006; }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) { ctx.strokeStyle = `rgba(${c},${(1 - d / 130) * .22})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const p = pts[i], md = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        ctx.fillStyle = `rgba(${c},${md < 160 ? .9 : .45})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    const hero = $(".hero");
    hero.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
    hero.addEventListener("pointerleave", () => { mouse = { x: -999, y: -999 }; });
    new IntersectionObserver(es => { const v = es[0].isIntersecting; if (v && !running) { running = true; draw(); } else if (!v) running = false; }).observe(hero);
    window.addEventListener("resize", resize); resize(); draw();
  })();

  /* ---------- system diagrams ---------- */
  const SYSTEMS = [
    {
      kicker: "01 · Document AI · in production", title: "Work-order PDF to typed JSON",
      desc: "A package comes in from the client ERP, every page is classified without an LLM, only the right pages reach the vision model, and validated JSON goes back.",
      zones: [{ x: 575, y: 20, w: 375, h: 130, label: "WORKER" }],
      nodes: {
        erp: [20, 40, "Client ERP", "PDF + order type", "Sends a scanned work-order package of up to 72 pages and the order type."],
        api: [210, 40, "FastAPI", "upload · status", "Accepts the file, creates a job and lets the ERP poll its status and per-page progress."],
        redis: [400, 40, "Redis", "queue · progress", "Holds the job queue and the live progress of each page."],
        worker: [590, 40, "Celery worker", "one job per order", "Runs the pipeline in the background with exponential-backoff retries on temporary failures."],
        render: [780, 40, "PyMuPDF", "render pages", "Turns each PDF page into an image for classification and extraction."],
        router: [780, 180, "OpenCV router", "0 LLM calls", "Header-template matching classifies 100% of pages without calling a model, so maps and attachments never cost a request."],
        skip: [780, 320, "Skipped pages", "15–29 per package", "GIS maps and attachments are dropped before extraction.", "muted"],
        vlm: [590, 180, "Gemini VLM", "JSON-schema output", "Reads only the pages that hold fields and returns JSON constrained by the type's schema.", "ai"],
        norm: [400, 180, "Normalize + rules", "cross-field checks", "Deterministic normalization of dates, numbers and codes, then validation rules across fields."],
        out: [210, 180, "Typed JSON", "94% accuracy", "The structured result goes back into the ERP: about 70 seconds for a 14-page, 52-field order."],
        spec: [400, 320, "Spec catalog", "15 types I added", "Each work-order type is a spec: its fields, generated prompts and rules. I grew it from 1 to 15 types."]
      },
      edges: [["erp", "api"], ["api", "redis"], ["redis", "worker"], ["worker", "render"], ["render", "router"], ["router", "skip", 1], ["router", "vlm"], ["vlm", "norm"], ["norm", "out"], ["out", "erp"], ["spec", "vlm", 1], ["spec", "norm", 1]]
    },
    {
      kicker: "02 · Tool inspection · live on DGX Spark", title: "One photo, a verdict for every tool",
      desc: "A field photo is split into tools, each tool is scored for surface and shape defects, and a local vision-language model gives the final verdict.",
      zones: [{ x: 385, y: 20, w: 375, h: 270, label: "NVIDIA DGX SPARK · LOCAL INFERENCE" }],
      nodes: {
        photo: [20, 40, "Field photo", "website or /api/v1", "A worksite photo with many tools, sent from the web app or the public API."],
        api: [210, 40, "FastAPI + Celery", "jobs · API keys", "Receives the photo, runs the job in the background and stores the run."],
        sam: [400, 40, "SAM 3", "one mask per tool", "Segments every tool so each one is scored on its own. A 20 px defect gets about 13x more model coverage.", "ai"],
        clip: [590, 40, "AnomalyCLIP", "heatmap + score", "Zero-shot anomaly map from the ICLR 2024 model: no defect examples needed.", "ai"],
        calib: [780, 40, "Calibration", "median + k·MAD", "Threshold learned from known-good tools. k = 2 found 16 of 20 defects with 0 of 30 false alarms."],
        shape: [780, 180, "Shape checks", "bend · missing · width", "Compares the SAM 3 outline with a smooth version of the same tool, catching bent or broken tools a texture model cannot see."],
        judge: [590, 180, "Qwen3-VL-8B judge", "rules per tool type", "A local vision-language model with rules per tool type, tested over 1,950+ runs.", "ai"],
        verdict: [400, 180, "Verdict", "fit · inspect · remove · retake", "Each tool gets one of four verdicts; a blurry or cut-off tool gets “retake”."],
        ui: [210, 180, "React UI", "Arabic + English", "Region lab, History and Find, in both languages."],
        odoo: [20, 180, "Odoo team", "/api/v1", "The same results through a public API with API keys."],
        db: [210, 320, "PostgreSQL", "run history", "Every run is stored so it can be reviewed and searched later.", "muted"]
      },
      edges: [["photo", "api"], ["api", "sam"], ["sam", "clip"], ["clip", "calib"], ["calib", "shape"], ["shape", "judge"], ["judge", "verdict"], ["verdict", "ui"], ["verdict", "odoo"], ["api", "db", 1]]
    },
    {
      kicker: "03 · Assessment platform · 200 students", title: "A timed test that grades itself",
      desc: "Students take an Arabic test in the browser; the server owns the timer, scores the answers and exports results in the hiring team's own template.",
      zones: [],
      nodes: {
        student: [20, 40, "Student browser", "200 students", "Used at a Metamas hiring event to screen 200 university students."],
        nginx: [210, 40, "Nginx", "static + proxy", "Serves the React app and proxies the API, all in Docker."],
        react: [400, 40, "React (RTL)", "Arabic test UI", "Right-to-left interface with shuffled answers."],
        api: [590, 40, "FastAPI", "test API", "Starts sessions, saves answers and rejects duplicates."],
        timer: [780, 40, "Signed timer", "anti-cheat", "The server signs the start time, so refreshing or changing the clock does not add time."],
        db: [590, 180, "SQLite", "answers · backups", "Small, reliable storage with automatic backups."],
        score: [400, 180, "Auto-scoring", "28 of 30 questions", "Scores 5 traits automatically: 93% less manual grading.", "ai"],
        excel: [210, 180, "Excel export", "original template", "Results come out in the scoring sheet the team already used."],
        team: [20, 180, "Hiring team", "decides faster", "Reviews ranked results instead of grading by hand."]
      },
      edges: [["student", "nginx"], ["nginx", "react"], ["react", "api"], ["api", "timer"], ["api", "db"], ["db", "score"], ["score", "excel"], ["excel", "team"]]
    },
    {
      kicker: "04 · RAG · personal project", title: "Answers grounded in your documents",
      desc: "Documents are chunked and embedded once; each question retrieves the closest chunks and a local model answers only from them.",
      zones: [{ x: 385, y: 20, w: 565, h: 130, label: "INDEXING" }, { x: 385, y: 160, w: 565, h: 130, label: "ANSWERING" }],
      nodes: {
        docs: [20, 40, "Documents", "PDF · text", "Files uploaded to a project."],
        ingest: [210, 40, "Ingest + chunk", "FastAPI", "Validates files and splits them into overlapping chunks."],
        embed: [400, 40, "Embeddings", "local model", "Turns each chunk into a vector.", "ai"],
        qdrant: [590, 40, "Qdrant", "vector search", "Stores vectors for fast semantic search."],
        pg: [780, 40, "PostgreSQL", "PGVector · Alembic", "Projects, assets and chunk metadata, with migrations.", "muted"],
        q: [20, 180, "Question", "from the user", "A natural-language question about the documents."],
        api: [210, 180, "FastAPI", "/answer", "Embeds the question and runs retrieval."],
        retr: [400, 180, "Retrieve top-k", "semantic search", "Finds the chunks closest to the question."],
        llm: [590, 180, "Local LLM", "Ollama", "Writes the answer only from the retrieved chunks.", "ai"],
        ans: [780, 180, "Answer + sources", "grounded", "The answer with the chunks it came from."]
      },
      edges: [["docs", "ingest"], ["ingest", "embed"], ["embed", "qdrant"], ["ingest", "pg", 1], ["q", "api"], ["api", "retr"], ["qdrant", "retr"], ["retr", "llm"], ["llm", "ans"]]
    }
  ];
  const NW = 160, NH = 62;
  const svg = $("#sysSvg"), sysWrap = $(".systems"), tabs = $$(".sys-tab"), playBtn = $("#sysPlay");
  const SVGNS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const anchor = (a, b) => {
    const ax = a[0] + NW / 2, ay = a[1] + NH / 2, bx = b[0] + NW / 2, by = b[1] + NH / 2, dx = bx - ax, dy = by - ay;
    if (Math.abs(dy) < 10) return dx > 0 ? `M${a[0] + NW},${ay} L${b[0]},${by}` : `M${a[0]},${ay} L${b[0] + NW},${by}`;
    if (Math.abs(dx) < 10) return dy > 0 ? `M${ax},${a[1] + NH} L${bx},${b[1]}` : `M${ax},${a[1]} L${bx},${b[1] + NH}`;
    const sx = ax, sy = dy > 0 ? a[1] + NH : a[1], ex = bx, ey = dy > 0 ? b[1] : b[1] + NH, my = (sy + ey) / 2;
    return `M${sx},${sy} C${sx},${my} ${ex},${my} ${ex},${ey}`;
  };
  let cur = 0, timer = null, paused = false, selNode = null;
  const DUR = 11000;
  const showNode = (sys, id, g) => {
    $$(".n-g", svg).forEach(n => n.classList.remove("sel"));
    if (g) g.classList.add("sel");
    const n = sys.nodes[id];
    $("#sysNode").hidden = false; $("#sysNodeName").textContent = n[2]; $("#sysNodeDesc").textContent = n[4];
    selNode = id;
  };
  const render = i => {
    const s = SYSTEMS[i]; cur = i; selNode = null;
    svg.innerHTML = "";
    $("#sysKicker").textContent = s.kicker; $("#sysTitle").textContent = s.title; $("#sysDesc").textContent = s.desc; $("#sysNode").hidden = true;
    svg.setAttribute("aria-label", `Diagram: ${s.title}`);
    for (const z of s.zones) { el("rect", { x: z.x, y: z.y, width: z.w, height: z.h, rx: 18, class: "zone" }, svg); el("text", { x: z.x + 14, y: z.y + z.h - 8, class: "zone-label" }, svg).textContent = z.label; }
    const eg = el("g", {}, svg);
    s.edges.forEach(([f, t, dashed], k) => {
      const d = anchor(s.nodes[f], s.nodes[t]);
      el("path", { d, class: "e-path" }, eg);
      const fl = el("path", { d, class: "e-flow" + (dashed ? " dashed" : ""), id: `e${i}_${k}` }, eg);
      if (!dashed && !reduced) {
        const c = el("circle", { r: 3.5, class: "pulse" }, eg);
        const am = el("animateMotion", { dur: "2.4s", repeatCount: "indefinite", begin: `${(k * 0.35).toFixed(2)}s` }, c);
        el("mpath", { href: `#e${i}_${k}` }, am);
      }
    });
    for (const id in s.nodes) {
      const [x, y, label, sub, , kind] = s.nodes[id];
      const g = el("g", { class: `n-g ${kind || ""}`, tabindex: 0, role: "button", "aria-label": `${label}: ${sub}` }, svg);
      el("rect", { x, y, width: NW, height: NH, rx: 12, class: "n-box", ...(kind === "muted" ? { "stroke-dasharray": "4 4" } : {}) }, g);
      if (kind === "ai") el("text", { x: x + NW - 10, y: y + 14, "text-anchor": "end", class: "n-tag" }, g).textContent = "AI";
      el("text", { x: x + 14, y: y + 27, class: "n-label" }, g).textContent = label;
      el("text", { x: x + 14, y: y + 45, class: "n-sub" }, g).textContent = sub;
      const pick = () => { showNode(s, id, g); stop(); };
      g.addEventListener("click", pick);
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    }
    tabs.forEach((t, k) => { t.classList.toggle("active", k === i); t.setAttribute("aria-selected", String(k === i)); t.style.setProperty("--dur", `${DUR}ms`); });
    // restart the progress animation
    const act = tabs[i]; act.classList.remove("active"); void act.offsetWidth; act.classList.add("active");
  };
  const schedule = () => { clearTimeout(timer); if (!paused && !reduced) timer = setTimeout(() => { render((cur + 1) % SYSTEMS.length); schedule(); }, DUR); };
  const stop = () => { paused = true; clearTimeout(timer); sysWrap.classList.add("paused"); playBtn.textContent = "Play"; playBtn.setAttribute("aria-pressed", "true"); };
  const play = () => { paused = false; sysWrap.classList.remove("paused"); playBtn.textContent = "Pause"; playBtn.setAttribute("aria-pressed", "false"); render(cur); schedule(); };
  tabs.forEach((t, k) => t.addEventListener("click", () => { render(k); if (!paused) schedule(); }));
  playBtn.addEventListener("click", () => paused ? play() : stop());
  render(0);
  if (reduced) stop();
  new IntersectionObserver(es => { if (es[0].isIntersecting) { if (!paused) schedule(); } else clearTimeout(timer); }).observe(sysWrap);

  /* ---------- story toggles + card glow ---------- */
  $$(".story-btn").forEach(b => b.addEventListener("click", () => {
    const st = b.nextElementSibling, open = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", String(!open)); st.hidden = open; b.textContent = open ? "Read the story" : "Hide the story";
  }));
  $$(".work-card").forEach(c => c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect(); c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));

  /* ---------- calibration lab ---------- */
  (function lab() {
    const grid = $("#labGrid"); if (!grid) return;
    const RES = { 1: [19, 8, "k = 1 catches almost every defect, but 8 good parts are flagged too: inspectors stop trusting the alarm."], 2: [16, 0, "k = 2 is the setting I shipped: 16 of 20 defects, no false alarms."], 3: [3, 0, "k = 3, the textbook choice, raises no false alarms but misses 17 of 20 defects."] };
    // fixed shuffled layout: 30 good, 20 defective
    const order = []; for (let i = 0; i < 30; i++) order.push(["good", i]); for (let i = 0; i < 20; i++) order.push(["bad", i]);
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const dots = order.map(([t, idx]) => { const d = document.createElement("i"); d.className = t; d.dataset.idx = idx; grid.appendChild(d); return d; });
    const update = k => {
      const [rec, fa, note] = RES[k];
      dots.forEach(d => { const idx = +d.dataset.idx; d.classList.toggle("flag", d.classList.contains("bad") ? idx < rec : idx < fa); });
      $("#kOut").textContent = k; $("#recallOut").textContent = `${rec} / 20`; $("#faOut").textContent = `${fa} / 30`; $("#kNote").textContent = note;
    };
    const sl = $("#kSlider"); sl.addEventListener("input", () => update(+sl.value)); update(2);
  })();

  /* ---------- second brain graph ---------- */
  (function brain() {
    const cv = $("#brainCanvas"); if (!cv) return;
    const ctx = cv.getContext("2d"); const dpr = Math.min(2, window.devicePixelRatio || 1);
    const groups = [
      ["AnomalyCLIP", 7], ["Document AI", 6], ["Aleppo Assessment", 4], ["Metamas Portal", 4], ["Personal", 6], ["Shared rules", 3]
    ];
    const nodes = [{ id: 0, label: "START HERE", r: 9, hub: true, g: -1 }], links = [];
    groups.forEach(([name, kids], gi) => {
      const pid = nodes.length; nodes.push({ id: pid, label: name, r: 6.5, g: gi }); links.push([0, pid, 90]);
      for (let k = 0; k < kids; k++) { const cid = nodes.length; nodes.push({ id: cid, r: 3, g: gi }); links.push([pid, cid, 38 + Math.random() * 20]); }
    });
    // a few cross links: shared rules touch every project
    const sharedId = nodes.findIndex(n => n.label === "Shared rules");
    nodes.forEach(n => { if (n.label && !n.hub && n.id !== sharedId) links.push([sharedId, n.id, 150]); });
    let W, H, drag = null, visible = true;
    const resize = () => {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes.forEach((n, i) => { if (n.x == null) { const a = (i / nodes.length) * Math.PI * 2; n.x = W / 2 + Math.cos(a) * 80 + Math.random() * 10; n.y = H / 2 + Math.sin(a) * 80; n.vx = 0; n.vy = 0; } });
    };
    const palette = () => {
      const light = document.body.classList.contains("light");
      return { link: light ? "rgba(10,20,40,.14)" : "rgba(255,255,255,.1)", text: light ? "#0b1424" : "#eef3fb", g: light ? ["#0284c7", "#6d5df5", "#059669", "#d97706", "#db2777", "#475569"] : ["#2ed8ff", "#8c7cff", "#34d399", "#fbbf24", "#f472b6", "#94a3b8"] };
    };
    const stepSim = () => {
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]; let dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy || .01; const f = 900 / d2, d = Math.sqrt(d2);
        dx /= d; dy /= d; a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
      }
      for (const [s, t, len] of links) { const a = nodes[s], b = nodes[t]; const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, f = (d - len) * .012; a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f; }
      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * .0018; n.vy += (H / 2 - n.y) * .0018;
        if (n === drag) continue;
        n.vx *= .82; n.vy *= .82; n.x += n.vx; n.y += n.vy;
        n.x = Math.max(12, Math.min(W - 12, n.x)); n.y = Math.max(12, Math.min(H - 12, n.y));
      }
    };
    const t0 = performance.now();
    const draw = () => {
      if (!visible) return;
      stepSim();
      const p = palette(), t = (performance.now() - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (const [s, tt, len] of links) { const a = nodes[s], b = nodes[tt]; ctx.strokeStyle = len === 150 ? p.link.replace(/[\d.]+\)$/, "0.05)") : p.link; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      // travelling sparks on hub links
      links.filter(l => l[0] === 0).forEach(([s, tt], k) => { const a = nodes[s], b = nodes[tt], f = ((t * .35 + k / 6) % 1); ctx.fillStyle = p.g[k % 6]; ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, 2, 0, 6.283); ctx.fill(); });
      for (const n of nodes) {
        const col = n.hub ? p.text : p.g[n.g % 6];
        ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = n.label ? 14 : 0;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
        if (n.label) { ctx.fillStyle = p.text; ctx.font = `${n.hub ? 700 : 600} ${n.hub ? 12 : 11}px Inter, sans-serif`; ctx.textAlign = "center"; ctx.fillText(n.label, n.x, n.y - n.r - 7); }
      }
      requestAnimationFrame(draw);
    };
    const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    cv.addEventListener("pointerdown", e => { const m = pos(e); let best = null, bd = 24; for (const n of nodes) { const d = Math.hypot(n.x - m.x, n.y - m.y); if (d < bd) { bd = d; best = n; } } if (best) { drag = best; cv.setPointerCapture(e.pointerId); } });
    cv.addEventListener("pointermove", e => { if (!drag) return; const m = pos(e); drag.x = m.x; drag.y = m.y; drag.vx = drag.vy = 0; });
    const end = () => { drag = null; }; cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
    new IntersectionObserver(es => { const v = es[0].isIntersecting; if (v && !visible) { visible = true; draw(); } else if (!v) visible = false; }).observe(cv);
    window.addEventListener("resize", resize); resize();
    if (reduced) { for (let i = 0; i < 300; i++) stepSim(); visible = true; draw(); visible = false; } else draw();
  })();

  /* ---------- stack → projects ---------- */
  const PROJ = { docai: ["Document Intelligence", "#work"], anomaly: ["Tool Inspection & Anomaly Detection", "#work"], assess: ["Talent Assessment Platform", "#work"], rag: ["RAG Application", "#work"] };
  const usedList = $("#usedList"), cards = $$(".work-card[data-proj]");
  $$("#stackGrid .pills button").forEach(b => b.addEventListener("click", () => {
    const on = !b.classList.contains("on");
    $$("#stackGrid .pills button").forEach(x => x.classList.remove("on"));
    cards.forEach(c => c.classList.remove("hl", "dim"));
    if (!on) { usedList.innerHTML = '<li class="muted">Select a highlighted tool.</li>'; return; }
    b.classList.add("on");
    const ps = b.dataset.p.split(" ");
    usedList.innerHTML = "";
    ps.forEach(p => { const li = document.createElement("li"); const a = document.createElement("a"); a.href = PROJ[p][1]; a.innerHTML = `<span></span><span aria-hidden="true">↗</span>`; a.firstChild.textContent = PROJ[p][0]; li.appendChild(a); usedList.appendChild(li); });
    cards.forEach(c => { const hit = ps.includes(c.dataset.proj); c.classList.toggle("hl", hit); c.classList.toggle("dim", !hit); });
  }));

  /* ---------- copy email ---------- */
  const toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); document.body.appendChild(toast);
  const say = msg => { toast.textContent = msg; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1800); };
  $("#copyEmail").addEventListener("click", async e => {
    const mail = e.currentTarget.dataset.email;
    try { await navigator.clipboard.writeText(mail); say("Email copied"); } catch (err) { say(mail); }
  });
})();

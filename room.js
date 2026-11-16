(() => {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function el(tag, props = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    kids.flat().forEach((c) => c != null && e.append(c));
    return e;
  }
  function svg(tag, attrs = {}) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }
  function rng(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const link = (label, url, cls) => el("a", { href: url, target: "_blank", rel: "noopener", class: cls, text: label });

  // ---------- header ----------
  $("#siteName").textContent = S.name;
  document.title = `${S.name}'s room`;

  // ---------- scene: clickable items + glowing lights over the room image ----------
  // Coordinates are in image pixels (the room image is 1670 x 942).
  // Add #debug to the page address to see the outlines while adjusting them.
  const HOTS = [
    { id: "board", name: "Corkboard: about me", tag: "corkboard · about me", at: [280, 128],
      pts: "126,146 432,146 432,372 126,372" },
    { id: "laptop", name: "Laptop: projects", tag: "laptop · projects", at: [1090, 448],
      pts: "1082,462 1160,484 1134,582 1020,592 1008,566 1046,552" },
    { id: "boombox", name: "Boombox: mixtapes", tag: "boombox · mixtapes", at: [1368, 362],
      pts: "1298,412 1318,384 1420,382 1440,410 1440,462 1298,462" },
    { id: "diary", name: "Diary: blog", tag: "diary · blog", at: [1118, 760],
      pts: "1030,800 1110,776 1196,790 1204,848 1128,856 1052,872" },
    { id: "phone", name: "Phone: contact", tag: "phone · contact", at: [1050, 588],
      pts: "1040,598 1084,606 1080,640 1096,668 1082,688 1062,676 1010,666 1014,644" },
  ];
  const LIGHTS = {
    gWarm: { r: 30, at: [[25,128],[150,122],[213,108],[283,78],[337,103],[402,97],[487,133],[568,107],[82,217],[450,197],[522,252],[615,178],[832,57],[918,80],[1060,75],[1113,100],[993,182],[1190,235],[1350,82],[1468,62],[1628,117],[1522,215]] },
    gOrange: { r: 34, at: [[713,128],[778,135],[858,135],[935,115],[1090,120],[1193,122],[1275,128],[1388,130],[1462,118],[663,243]] },
  };
  (function buildScene() {
    const W = 1670, H = 942, r = rng(9), glows = $("#glows"), hots = $("#hots"), clips = $("#clips");
    const glow = (x, y, rad, fill, cls = "glow") => {
      const c = svg("circle", { cx: x, cy: y, r: rad, fill: `url(#${fill})`, class: cls });
      c.style.animationDelay = `${(-r() * 4).toFixed(2)}s`; c.style.animationDuration = `${(2.2 + r() * 2.6).toFixed(2)}s`;
      glows.append(c);
    };
    for (const [fill, g] of Object.entries(LIGHTS)) g.at.forEach(([x, y]) => glow(x, y, g.r, fill));
    glow(140, 478, 120, "gPink", "glow slow");    // bedside lamp
    glow(1266, 420, 70, "gOrange", "glow slow");  // little lamp on the sill
    glow(1105, 525, 85, "gPink", "glow screen");  // laptop screen
    const debug = location.hash === "#debug";
    HOTS.forEach((h) => {
      const xy = h.pts.split(" ").map((p) => p.split(",").map(Number));
      const cx = xy.reduce((s, p) => s + p[0], 0) / xy.length, cy = xy.reduce((s, p) => s + p[1], 0) / xy.length;
      const cp = svg("clipPath", { id: `clip-${h.id}` }); cp.append(svg("polygon", { points: h.pts })); clips.append(cp);
      const g = svg("g", { class: "hot", "data-open": h.id, tabindex: 0, role: "button", "aria-label": h.name });
      const art = svg("g", { class: "art" }); art.style.transformOrigin = `${cx}px ${cy}px`;
      art.append(svg("image", { href: "images/room.webp", width: W, height: H, "clip-path": `url(#clip-${h.id})` }));
      g.append(art);
      if (h.id === "boombox") {
        const n = svg("g", { class: "notes" });
        [["♪", 1448, 380], ["♫", 1470, 350]].forEach(([t, x, y]) => { const e = svg("text", { x, y }); e.textContent = t; n.append(e); });
        g.append(n);
      }
      const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]);
      const sp = svg("text", { class: "spark", x: Math.max(...xs) - 4, y: Math.min(...ys) + 6 }); sp.textContent = "✦";
      const tag = svg("text", { class: "tag", x: h.at[0], y: h.at[1], "text-anchor": "middle" }); tag.textContent = h.tag;
      g.append(sp, tag);
      if (debug) g.append(svg("polygon", { points: h.pts, fill: "#0f03", stroke: "#0a0", "stroke-width": 2 }));
      hots.append(g);
    });
  })();

  // ---------- opening / closing ----------
  const open = (id) => { const d = $(`#dlg-${id}`); if (d && !d.open) d.showModal(); };
  $$("[data-open]").forEach((t) => {
    t.addEventListener("click", () => open(t.dataset.open));
    if (t.classList.contains("hot"))
      t.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(t.dataset.open); } });
  });
  // hovering a guide button lights up the matching thing in the room
  $$(".guide [data-open]").forEach((b) => {
    const hot = $(`.hot[data-open="${b.dataset.open}"]`);
    const on = () => hot.classList.add("lit"), off = () => hot.classList.remove("lit");
    b.addEventListener("mouseenter", on); b.addEventListener("focus", on);
    b.addEventListener("mouseleave", off); b.addEventListener("blur", off);
  });
  $$("dialog").forEach((d) => {
    d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
  });

  // ---------- laptop: projects ----------
  (function projects() {
    const tabs = $("#projTabs"), panel = $("#projPanel");
    function show(i) {
      const p = S.projects[i];
      $$("button", tabs).forEach((b, j) => b.setAttribute("aria-selected", j === i));
      panel.classList.toggle("noimg", !p.image);
      panel.replaceChildren(
        ...(p.image ? [el("div", { class: "shot" }, el("img", { src: p.image, alt: `${p.name} screenshot`, loading: "lazy" }))] : []),
        el("div", {},
          el("h3", { text: p.name }),
          el("div", { class: "yr", text: p.year }),
          el("p", { text: p.blurb }),
          p.points?.length ? el("ul", {}, p.points.map((t) => el("li", { text: t }))) : null,
          p.tags?.length ? el("ul", { class: "chips" }, p.tags.map((t) => el("li", { text: t }))) : null,
          p.links?.length ? el("div", { class: "links" }, p.links.map((l) => link(l.label + " ↗", l.url))) : null
        )
      );
    }
    S.projects.forEach((p, i) => tabs.append(el("button", { role: "tab", text: p.name, onclick: () => show(i) })));
    if (S.projects.length) show(0);
  })();

  // ---------- diary: entries listed on the drawn pages, full post on a pulled-out sheet ----------
  (function diary() {
    const list = $("#postList"), peek = $("#postPeek"), sheet = $("#sheet"), body = $("#postBody");
    function read(i) {
      const p = S.posts[i];
      body.replaceChildren(el("time", { text: p.date }), el("h3", {}, el("span", { text: p.title })), ...p.body.map((t) => el("p", { text: t })));
      sheet.hidden = false; sheet.scrollTop = 0; $("#sheetBack").focus();
    }
    function show(i) {
      const p = S.posts[i];
      $$("button", list).forEach((b, j) => b.setAttribute("aria-current", j === i));
      peek.replaceChildren(
        el("time", { text: p.date }), el("h3", { text: p.title }), el("p", { class: "ex", text: p.body[0] || "" }),
        el("button", { class: "readit", onclick: () => read(i) }, "read this page →"));
    }
    S.posts.forEach((p, i) => list.append(el("li", {}, el("button", { onclick: () => show(i), ondblclick: () => read(i) }, el("small", { text: p.date }), p.title))));
    $("#sheetBack").addEventListener("click", () => (sheet.hidden = true));
    $("#dlg-diary").addEventListener("close", () => (sheet.hidden = true));
    if (S.posts.length) show(0);
    else {
      list.append(el("li", {}, el("button", { disabled: "" }, el("small", { text: "no entries yet" }), "coming soon ♥")));
      peek.replaceChildren(el("h3", { text: "coming soon" }), el("p", { class: "ex", text: "I'm still writing my first technical posts. Check back soon!" }));
    }
  })();

  // ---------- corkboard: each pinned thing on the drawing opens a note ----------
  (function board() {
    const A = S.about, note = $("#note"), pins = $("#pins"), clips = $("#pinClips");
    const PINS = [
      { id: "about", tag: "about me", at: [520, 196], pts: "338,252 652,196 698,412 386,466",
        make: () => [el("h2", { id: "t-board", text: `hi, i'm ${S.name}!` }), el("p", { class: "tagline", text: S.tagline }), el("p", { text: A.bio })] },
      { id: "skills", tag: "skills", at: [392, 632], pts: "312,432 494,450 470,596 290,584",
        make: () => [el("h2", { text: "skills" }), el("ul", { class: "chips" }, A.skills.map((t) => el("li", { text: t })))] },
      { id: "xp", tag: "experience", at: [616, 852], pts: "528,540 712,532 696,810 520,810",
        make: () => [el("h2", { text: "experience" }), el("ul", {}, A.experience.map((x) => el("li", {}, el("b", { text: x.role }), ` @ ${x.place}`, el("small", { text: x.when }), x.note)))] },
      { id: "edu", tag: "education", at: [1100, 204], pts: "998,218 1228,228 1192,494 964,484",
        make: () => [el("h2", { text: "education" }), el("ul", {}, A.education.map((x) => el("li", {}, el("b", { text: x.school }), el("small", { text: x.when }), x.detail)))] },
      { id: "cv", tag: "résumé", at: [1060, 906], pts: "898,568 1244,570 1230,862 878,854",
        make: () => [el("h2", { text: "résumé" }), A.resumeUrl ? link("download my résumé ↓", A.resumeUrl, "dl") : el("p", { text: "PDF coming soon. Until then, snoop around the board!" })] },
      { id: "facts", tag: "fun facts", at: [392, 912], pts: "282,676 504,676 494,870 290,870",
        make: () => [el("h2", { text: "fun facts" }), (A.facts || []).length ? el("ul", { class: "facts" }, A.facts.map((t) => el("li", { text: t }))) : el("p", { text: "coming soon ♥ (the cat is keeping my secrets for now)" })] },
    ];
    function show(p) {
      $$(".pin", pins).forEach((g) => g.classList.toggle("on", g.dataset.pin === p.id));
      note.className = `note n-${p.id}`; note.replaceChildren(...p.make());
    }
    PINS.forEach((p) => {
      const xy = p.pts.split(" ").map((s) => s.split(",").map(Number));
      const cx = xy.reduce((s, q) => s + q[0], 0) / xy.length, cy = xy.reduce((s, q) => s + q[1], 0) / xy.length;
      const cp = svg("clipPath", { id: `pin-${p.id}` }); cp.append(svg("polygon", { points: p.pts })); clips.append(cp);
      const g = svg("g", { class: "pin", "data-pin": p.id, tabindex: 0, role: "button", "aria-label": p.tag });
      const art = svg("g", { class: "art" }); art.style.transformOrigin = `${cx}px ${cy}px`;
      art.append(svg("image", { href: "images/corkboard.webp", width: 1536, height: 1024, "clip-path": `url(#pin-${p.id})` }));
      const t = svg("text", { x: p.at[0], y: p.at[1], "text-anchor": "middle" }); t.textContent = p.tag;
      g.append(art, t);
      g.addEventListener("click", () => show(p));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(p); } });
      pins.append(g);
    });
    show(PINS[0]);
  })();

  // ---------- phone: contact (menu drawn on the phone's screen) ----------
  S.contact.slice(0, 5).forEach((c, i) => {
    const y = 36 + i * 38;
    const a = svg("a", { href: c.url, target: "_blank", rel: "noopener", "aria-label": `${c.label}: ${c.value}` });
    const t = svg("text", { x: 12, y: y + 25 }); t.textContent = c.label.toUpperCase().slice(0, 10);
    a.append(svg("rect", { x: 4, y, width: 168, height: 34, rx: 5 }), t);
    const hint = () => ($("#contactHint").textContent = c.value);
    a.addEventListener("mouseenter", hint); a.addEventListener("focus", hint);
    $("#contactList").append(a);
  });

  // ---------- boombox: mixtapes ----------
  (function boombox() {
    const audio = $("#audio"), tapesEl = $("#tapes"), tracksEl = $("#tracks");
    const np = $("#nowplaying"), npText = $("#npText"), npToggle = $("#npToggle"), bPlay = $("#bPlay");
    let tape = -1, track = 0, playing = false, ctx = null, timer = null;

    // little generated tune, used when a track has no audio file
    function synthStart(seed) {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
      const r = rng(seed), scale = [0, 2, 4, 7, 9, 12, 14, 16];
      const root = 196 * 2 ** (Math.floor(r() * 6) / 12), bpm = 84 + Math.floor(r() * 40);
      const mel = Array.from({ length: 16 }, () => (r() < 0.68 ? scale[Math.floor(r() * scale.length)] : null));
      const bass = [0, 0, [5, 7, -3][Math.floor(r() * 3)], [7, 5][Math.floor(r() * 2)]];
      let step = 0;
      const note = (f, type, vol, dur) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
      };
      const tick = () => {
        const n = mel[step % 16];
        if (n != null) note(root * 2 * 2 ** (n / 12), "triangle", 0.11, 0.32);
        if (step % 4 === 0) note((root / 2) * 2 ** (bass[(step / 4) % 4] / 12), "sine", 0.16, 0.55);
        step++;
      };
      tick(); timer = setInterval(tick, 60000 / bpm / 2);
    }
    function silence() { clearInterval(timer); timer = null; audio.pause(); }

    function render() {
      document.body.classList.toggle("playing", playing);
      const t = S.mixtapes[tape], tr = (t?.tracks || [])[track], pl = t?.playlist;
      $("#lcd1").textContent = pl ? t.name : tr ? tr.title : "pick a tape";
      $("#lcd2").textContent = pl ? "on spotify ♥" : tr ? tr.artist : "♥ ♥ ♥";
      $("#spot").hidden = !pl;
      bPlay.classList.toggle("on", playing); bPlay.setAttribute("aria-label", playing ? "Pause" : "Play");
      npToggle.textContent = playing ? "⏸" : "▶"; npToggle.setAttribute("aria-label", playing ? "Pause" : "Play");
      np.hidden = !tr; if (tr) npText.textContent = `${t.name} · ${tr.title}`;
      $$(".tape", tapesEl).forEach((b, i) => b.setAttribute("aria-pressed", i === tape));
      tracksEl.replaceChildren(...(t ? (t.tracks || []).map((x, i) =>
        el("li", { class: i === track ? "on" : null }, el("button", { text: `${x.title} — ${x.artist}${!x.src && x.link ? " ↗" : ""}`, onclick: () => play(tape, i) }))) : []));
    }
    // Spotify playlist tapes: Spotify's own player sits inside the boombox,
    // and the drawn play button and the room's lights follow it.
    let spotCtrl = null, spotFor = -1;
    function loadSpotify(ti) {
      if (spotFor === ti) return;
      spotFor = ti;
      const url = S.mixtapes[ti].playlist, id = (url.match(/playlist\/([A-Za-z0-9]+)/) || [])[1];
      $("#spotLink").href = url;
      if (!id) return;
      const uri = `spotify:playlist:${id}`;
      if (spotCtrl) return spotCtrl.loadUri(uri);
      const make = (API) => API.createController($("#spotEmbed"), { uri, width: "100%", height: 352 }, (ctrl) => {
        spotCtrl = ctrl;
        ctrl.addListener("playback_update", (e) => {
          playing = !e.data.isPaused;
          document.body.classList.toggle("playing", playing);
          bPlay.classList.toggle("on", playing);
        });
      });
      if (window.SpotifyIframeApi) make(window.SpotifyIframeApi);
      else {
        window.onSpotifyIframeApiReady = (API) => { window.SpotifyIframeApi = API; make(API); };
        document.head.append(el("script", { src: "https://open.spotify.com/embed/iframe-api/v1", async: "" }));
      }
    }
    function play(ti, tri) {
      silence();
      if (S.mixtapes[ti].playlist) { tape = ti; track = 0; playing = false; render(); loadSpotify(ti); return; }
      if (spotCtrl && playing) spotCtrl.pause();
      tape = ti; track = tri; playing = true;
      const tr = S.mixtapes[tape].tracks[track], seed = tape * 97 + track * 13 + 5;
      if (!tr.src && tr.link) { playing = false; render(); window.open(tr.link, "_blank", "noopener"); return; }
      if (tr.src) { audio.src = tr.src; audio.play().catch(() => synthStart(seed)); }
      else synthStart(seed);
      render();
    }
    function toggle() {
      if (tape < 0) return S.mixtapes.length && play(0, 0);
      if (S.mixtapes[tape].playlist) { if (spotCtrl) spotCtrl.togglePlay(); return; }
      if (playing) { silence(); playing = false; render(); } else play(tape, track);
    }
    function skip(d) {
      if (tape < 0 || S.mixtapes[tape].playlist) return;
      const n = S.mixtapes[tape].tracks.length;
      play(tape, (track + d + n) % n);
    }
    audio.addEventListener("ended", () => skip(1));

    S.mixtapes.forEach((t, i) => tapesEl.append(
      el("button", { class: "tape", style: `--c:${t.color}`, "aria-pressed": "false", onclick: () => play(i, 0) },
        el("span", { class: "label" }, el("b", { text: t.name }), el("span", { text: t.note })),
        el("span", { class: "reels" }, el("i"), el("i")))));
    bPlay.addEventListener("click", toggle); npToggle.addEventListener("click", toggle);
    $("#bPrev").addEventListener("click", () => skip(-1)); $("#bNext").addEventListener("click", () => skip(1));
    $$(".bb").forEach((b) => b.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); b.dispatchEvent(new MouseEvent("click")); }
    }));
    render();
  })();
})();

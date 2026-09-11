import { useCallback, useEffect, useRef } from "react";

// ==========================================================================
// The inspiring.nk.studio archive, in DOM + CSS 3D (no WebGL, text stays crisp).
//  · cards live on an endless 2D grid that wraps in both directions
//  · each frame they're bent onto the inside of a curved surface: edges come
//    toward the camera, turn to face the centre and fall out of focus
//  · first time the wall is in view, cards fly in from a scattered cloud
//  · drag / swipe / horizontal wheel pans it; page scroll pushes it sideways
//    while the stage is pinned; a slow drift keeps it alive at rest
// ==========================================================================

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const mix = (a, b, t) => a + (b - a) * t;
// slow start so the scattered cloud reads before the cards rush into place
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const INTRO_MS = 2300;
const wrap = (v, m) => ((((v + m / 2) % m) + m) % m) - m / 2;

function seeded(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function useCurvedWall({ stageRef, trackRef, cursorRef, cardRefs, layout, onSeen }) {
  const cb = useRef({ onSeen });
  cb.current = { onSeen };
  const st = useRef(null);

  useEffect(() => {
    const stage = stageRef.current, track = trackRef.current, cursor = cursorRef.current;
    if (!stage || !track) return;
    const { cards, cols, rows } = layout;
    const n = cards.length;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

    const rnd = seeded(4242);
    const cloud = cards.map(() => ({
      x: (rnd() - 0.5) * 900, y: (rnd() - 0.5) * 640, z: -1600 - rnd() * 1800,
      rx: (rnd() - 0.5) * 170, ry: (rnd() - 0.5) * 170, rz: (rnd() - 0.5) * 100,
      delay: rnd() * 900,
    }));

    const s = (st.current = {
      W: 0, H: 0, cw: 0, ch: 0,
      dx: 0, dy: 0, x: 0, y: 0, swing: 0, fling: 0,
      dragging: false, moved: false, dist: 0, touch: false, lx: 0, ly: 0, lastDx: 0,
      px: 0, py: 0, cx: 0, cy: 0, cursorOn: false, hot: -1,
      introAt: reduce ? -1e9 : null, running: false,
      hoverT: new Float32Array(n), hover: new Float32Array(n), seen: new Uint8Array(n),
      blur: new Float32Array(n).fill(-1), op: new Float32Array(n).fill(-1), vis: new Uint8Array(n).fill(2),
    });

    const size = () => {
      s.W = stage.clientWidth; s.H = stage.clientHeight;
      const narrow = s.W < 700;
      const w = narrow ? 168 : 208, h = narrow ? 228 : 276;
      s.cw = w + (narrow ? 26 : 42);
      s.ch = h + (narrow ? 24 : 34);
      stage.style.setProperty("--card-w", `${w}px`);
      stage.style.setProperty("--card-h", `${h}px`);
      // phones: start centred on a column rather than on the gap between two
      if (!s.sized) { s.sized = true; s.dx = s.x = narrow ? s.cw / 2 : 0; }
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(stage);

    const frame = (t) => {
      if (!s.running) return;
      const worldW = cols * s.cw, worldH = rows * s.ch;

      // page scroll → sideways travel while the stage is pinned
      const r = track.getBoundingClientRect();
      const span = track.offsetHeight - s.H;
      const p = reduce || span <= 0 ? 0 : clamp(-r.top / span, 0, 1);
      if (!reduce && !s.dragging) { s.dx -= 0.2; s.dx += s.fling; s.fling *= 0.92; }
      const tx = s.dx - p * worldW * 0.5;
      const k = s.dragging ? 0.32 : 0.075;
      const vx = (tx - s.x) * k;
      s.x += vx;
      s.y += (s.dy - s.y) * k;
      if (!reduce) s.swing += (clamp(vx * 0.4, -10, 10) - s.swing) * 0.12;

      const since = s.introAt == null ? 0 : t - s.introAt;

      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const c = cards[i];
        const bx = (c.col - (cols - 1) / 2) * s.cw + c.jx;
        const by = (c.row - (rows - 1) / 2) * s.ch + c.jy;
        const sx = wrap(bx + s.x, worldW), sy = wrap(by + s.y, worldH);
        const nx = sx / (s.W / 2), ny = sy / (s.H / 2);
        const ax = Math.abs(nx), ay = Math.abs(ny);
        const kI = s.introAt == null ? 0 : easeInOut(clamp((since - cloud[i].delay) / INTRO_MS, 0, 1));

        if (kI >= 1 && (ax > 1.5 || ay > 1.55)) {
          if (s.vis[i] !== 0) { el.style.visibility = "hidden"; s.vis[i] = 0; }
          continue;
        }
        if (s.vis[i] !== 1) { el.style.visibility = "visible"; s.vis[i] = 1; }

        s.hover[i] += (s.hoverT[i] - s.hover[i]) * 0.16;
        const h = s.hover[i];
        let x = sx, y = sy - h * 8;
        let z = nx * nx * 210 + ny * ny * 70 + h * 80;
        let rx = ny * 9 * (1 - h * 0.6);
        let ry = -nx * 26 + s.swing;
        let rz = -nx * 4 + c.rz * (1 - h);
        let sc = 1;
        let blur = Math.max(0, ax - 0.68) * 10 + Math.max(0, ay - 0.8) * 9;
        let op = 1 - clamp((ax - 1.12) * 2.4, 0, 1);

        if (kI < 1) {
          const q = cloud[i];
          x = mix(q.x, x, kI); y = mix(q.y, y, kI); z = mix(q.z, z, kI);
          rx = mix(q.rx, rx, kI); ry = mix(q.ry, ry, kI); rz = mix(q.rz, rz, kI);
          sc = mix(0.4, 1, kI); blur = mix(1, blur, kI); op = mix(0.9, op, kI);
        }

        el.style.transform =
          `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) ` +
          `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        const b = Math.round(blur * 2) / 2;
        if (b !== s.blur[i]) { el.style.filter = b > 0 ? `blur(${b}px)` : "none"; s.blur[i] = b; }
        const o = Math.round(op * 20) / 20;
        if (o !== s.op[i]) { el.style.opacity = String(o); s.op[i] = o; }
      }

      if (cursor && s.cursorOn) {
        s.cx += (s.px - s.cx) * 0.24;
        s.cy += (s.py - s.cy) * 0.24;
        cursor.style.transform = `translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0)`;
      }
      requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        const was = s.running;
        s.running = e.isIntersecting;
        if (e.isIntersecting && s.introAt == null && e.intersectionRatio >= 0.3) s.introAt = performance.now();
        if (s.running && !was) requestAnimationFrame(frame);
      },
      { threshold: [0, 0.3, 0.6] }
    );
    io.observe(stage);

    // ---- drag / swipe ----
    const dragMove = (e) => {
      const ddx = e.clientX - s.lx, ddy = e.clientY - s.ly;
      s.lx = e.clientX; s.ly = e.clientY;
      s.dx += ddx * 1.15;
      if (!s.touch) s.dy += ddy * 1.15;
      s.lastDx = ddx;
      s.dist += Math.abs(ddx) + Math.abs(ddy);
      if (s.dist > 6) s.moved = true;
    };
    const up = () => {
      if (!s.dragging) return;
      s.dragging = false;
      // the click that ends a drag still sees moved=true; clear it afterwards so
      // keyboard Enter and later clicks open cards again
      setTimeout(() => { s.moved = false; }, 0);
      if (!reduce) s.fling = clamp(s.lastDx * 0.9, -40, 40);
      stage.classList.remove("is-dragging");
      removeEventListener("pointermove", dragMove);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
    };
    const down = (e) => {
      if (e.button !== 0 || e.target.closest(".rw-detail")) return;
      s.dragging = true; s.moved = false; s.dist = 0; s.lastDx = 0; s.fling = 0;
      s.touch = e.pointerType !== "mouse";
      s.lx = e.clientX; s.ly = e.clientY;
      stage.classList.add("is-dragging");
      addEventListener("pointermove", dragMove);
      addEventListener("pointerup", up);
      addEventListener("pointercancel", up);
    };

    // ---- hover + custom cursor ----
    const setHot = (i) => {
      if (i === s.hot) return;
      if (s.hot >= 0) s.hoverT[s.hot] = 0;
      s.hot = i;
      if (i >= 0) {
        s.hoverT[i] = 1;
        if (!s.seen[i]) { s.seen[i] = 1; cb.current.onSeen?.(i); }
      }
      cursor?.classList.toggle("on-card", i >= 0);
    };
    const hoverMove = (e) => {
      const r = stage.getBoundingClientRect();
      s.px = e.clientX - r.left; s.py = e.clientY - r.top;
      const inDetail = !!e.target.closest?.(".rw-detail");
      if (!s.cursorOn && !inDetail) { s.cursorOn = true; s.cx = s.px; s.cy = s.py; cursor?.classList.add("on"); }
      if (inDetail && s.cursorOn) { s.cursorOn = false; cursor?.classList.remove("on"); }
      if (s.dragging && s.moved) return setHot(-1);
      const card = e.target.closest?.("[data-card]");
      setHot(card ? +card.dataset.card : -1);
    };
    const leave = () => {
      s.cursorOn = false;
      cursor?.classList.remove("on", "on-card");
      setHot(-1);
    };

    // horizontal trackpad swipes pan the wall; vertical wheel stays page scroll
    const wheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && !e.target.closest(".rw-detail")) {
        e.preventDefault();
        s.dx -= e.deltaX;
      }
    };
    const key = (e) => {
      if (e.target.closest(".rw-detail")) return;
      const m = { ArrowLeft: [1, 0], ArrowRight: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (!m) return;
      e.preventDefault();
      s.dx += m[0] * s.cw; s.dy += m[1] * s.ch;
    };

    stage.addEventListener("pointerdown", down);
    if (fine) {
      stage.addEventListener("pointermove", hoverMove);
      stage.addEventListener("pointerleave", leave);
    }
    stage.addEventListener("wheel", wheel, { passive: false });
    stage.addEventListener("keydown", key);

    return () => {
      s.running = false;
      io.disconnect(); ro.disconnect(); up();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", hoverMove);
      stage.removeEventListener("pointerleave", leave);
      stage.removeEventListener("wheel", wheel);
      stage.removeEventListener("keydown", key);
    };
  }, [stageRef, trackRef, cursorRef, cardRefs, layout]);

  // bring a keyboard-focused card to the centre
  const focusCard = useCallback((i) => {
    const s = st.current;
    if (!s) return;
    const { cards, cols, rows } = layout;
    const c = cards[i];
    const sx = wrap((c.col - (cols - 1) / 2) * s.cw + c.jx + s.x, cols * s.cw);
    const sy = wrap((c.row - (rows - 1) / 2) * s.ch + c.jy + s.y, rows * s.ch);
    s.dx -= sx; s.dy -= sy;
  }, [layout]);

  const wasDrag = useCallback(() => !!st.current?.moved, []);

  const markSeen = useCallback((i) => {
    const s = st.current;
    if (s && !s.seen[i]) { s.seen[i] = 1; cb.current.onSeen?.(i); }
  }, []);

  return { focusCard, wasDrag, markSeen };
}

import { useCallback, useEffect, useRef } from "react";

// ==========================================================================
// The inspiring.nk.studio archive, in DOM + CSS 3D (text stays crisp).
//  · cards live on an endless grid that wraps in both directions
//  · each frame they're bent onto the inside of a curved surface: edges come
//    toward the camera and turn to face the centre
//  · cards fly in from a scattered cloud as the preloader dissolves
//  · drag / swipe / wheel pans it; a slow drift keeps it alive at rest
//
// Performance:
//  · per frame we only write transform (+ a quantised opacity) — no per-card
//    filter; the depth-of-field blur is two fixed backdrop-filter strips in CSS
//  · grid positions are cached per resize; off-screen cards are hidden, skipped
//  · motion is time-based, so it feels the same at 60, 120 or 144 Hz
//  · the loop only runs while the stage is on screen
// ==========================================================================

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const mix = (a, b, t) => a + (b - a) * t;
const wrap = (v, m) => ((((v + m / 2) % m) + m) % m) - m / 2;
// slow start so the scattered cloud reads before the cards rush into place
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const INTRO_MS = 2300;

function seeded(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function useCurvedWall({ stageRef, cursorRef, cardRefs, layout, onSeen }) {
  const cb = useRef({ onSeen });
  cb.current = { onSeen };
  const st = useRef(null);

  useEffect(() => {
    const stage = stageRef.current, cursor = cursorRef.current;
    if (!stage) return;
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
      W: 0, H: 0, cw: 0, ch: 0, sized: false,
      bx: new Float32Array(n), by: new Float32Array(n),
      dx: 0, dy: 0, x: 0, y: 0, swing: 0, fling: 0, flingY: 0,
      dragging: false, moved: false, dist: 0, lx: 0, ly: 0, lastDx: 0, lastDy: 0,
      px: 0, py: 0, cx: 0, cy: 0, cursorOn: false, hot: -1,
      introAt: reduce ? -1e9 : null, visible: false, raf: 0, last: 0,
      hoverT: new Float32Array(n), hover: new Float32Array(n), seen: new Uint8Array(n),
      op: new Float32Array(n).fill(-1), vis: new Uint8Array(n).fill(2),
    });

    const size = () => {
      s.W = stage.clientWidth; s.H = stage.clientHeight;
      const narrow = s.W < 700;
      const w = narrow ? 170 : 212, h = narrow ? 226 : 272;
      s.cw = w + (narrow ? 24 : 40);
      s.ch = h + (narrow ? 24 : 34);
      stage.style.setProperty("--card-w", `${w}px`);
      stage.style.setProperty("--card-h", `${h}px`);
      for (let i = 0; i < n; i++) {
        s.bx[i] = (cards[i].col - (cols - 1) / 2) * s.cw + cards[i].jx;
        s.by[i] = (cards[i].row - (rows - 1) / 2) * s.ch + cards[i].jy;
      }
      // phones: start centred on a column rather than on the gap between two
      if (!s.sized) { s.sized = true; s.dx = s.x = narrow ? s.cw / 2 : 0; }
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(stage);

    const frame = (t) => {
      s.raf = 0;
      if (!s.visible) return;
      const dt = s.last ? Math.min(50, t - s.last) : 16.667;
      s.last = t;
      const f = dt / 16.667;
      const worldW = cols * s.cw, worldH = rows * s.ch;

      if (!reduce && !s.dragging) {
        s.dx += (-0.2 + s.fling) * f;
        s.dy += s.flingY * f;
        const decay = Math.pow(0.92, f);
        s.fling *= decay; s.flingY *= decay;
      }
      const k = 1 - Math.pow(1 - (s.dragging ? 0.3 : 0.075), f);
      const vx = (s.dx - s.x) * k;
      s.x += vx;
      s.y += (s.dy - s.y) * k;
      if (!reduce) s.swing += (clamp((vx / f) * 0.4, -10, 10) - s.swing) * (1 - Math.pow(0.88, f));

      const since = s.introAt == null ? 0 : t - s.introAt;
      const hk = 1 - Math.pow(0.84, f);
      const halfW = s.W / 2, halfH = s.H / 2;
      const els = cardRefs.current;

      for (let i = 0; i < n; i++) {
        const el = els[i];
        if (!el) continue;
        const sx = wrap(s.bx[i] + s.x, worldW), sy = wrap(s.by[i] + s.y, worldH);
        const nx = sx / halfW, ny = sy / halfH;
        const ax = nx < 0 ? -nx : nx, ay = ny < 0 ? -ny : ny;
        const kI = s.introAt == null ? 0 : easeInOut(clamp((since - cloud[i].delay) / INTRO_MS, 0, 1));

        if (kI >= 1 && (ax > 1.45 || ay > 1.5)) {
          if (s.vis[i] !== 0) { el.style.visibility = "hidden"; s.vis[i] = 0; }
          continue;
        }
        if (s.vis[i] !== 1) { el.style.visibility = "visible"; s.vis[i] = 1; }

        const h = (s.hover[i] += (s.hoverT[i] - s.hover[i]) * hk);
        let x = sx, y = sy - h * 8;
        let z = nx * nx * 210 + ny * ny * 70 + h * 80;
        let rx = ny * 9 * (1 - h * 0.6);
        let ry = -nx * 26 + s.swing;
        let rz = -nx * 4 + cards[i].rz * (1 - h);
        let sc = 1;
        let op = (1 - clamp((ax - 1.1) * 2.4, 0, 1)) * (1 - clamp((ay - 0.95) * 1.6, 0, 0.55));

        if (kI < 1) {
          const q = cloud[i];
          x = mix(q.x, x, kI); y = mix(q.y, y, kI); z = mix(q.z, z, kI);
          rx = mix(q.rx, rx, kI); ry = mix(q.ry, ry, kI); rz = mix(q.rz, rz, kI);
          sc = mix(0.4, 1, kI); op = mix(0.9, op, kI);
        }

        el.style.transform =
          `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) ` +
          `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)` +
          (sc !== 1 ? ` scale(${sc.toFixed(3)})` : "");
        const o = Math.round(op * 20) / 20;
        if (o !== s.op[i]) { el.style.opacity = o; s.op[i] = o; }
      }

      if (cursor && s.cursorOn) {
        const ddx = s.px - s.cx, ddy = s.py - s.cy;
        if (ddx * ddx + ddy * ddy > 0.04) {
          const ck = 1 - Math.pow(0.76, f);
          s.cx += ddx * ck; s.cy += ddy * ck;
          cursor.style.transform = `translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0)`;
        }
      }
      s.raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!s.raf && s.visible) { s.last = 0; s.raf = requestAnimationFrame(frame); }
    };

    // the fly-in waits for the preloader to start dissolving
    const startIntro = () => { if (s.introAt == null && s.visible) s.introAt = performance.now(); };
    const onPreloaded = () => startIntro();
    addEventListener("rvu:preloaded", onPreloaded);

    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      if (s.visible) {
        if (window.__rvuPreloaded) startIntro();
        kick();
      }
    });
    io.observe(stage);

    const isUi = (target) => !!target.closest?.(".rw-detail, .rw-paths");

    // ---- drag / swipe ----
    const dragMove = (e) => {
      const ddx = e.clientX - s.lx, ddy = e.clientY - s.ly;
      s.lx = e.clientX; s.ly = e.clientY;
      s.dx += ddx * 1.15; s.dy += ddy * 1.15;
      s.lastDx = ddx; s.lastDy = ddy;
      s.dist += Math.abs(ddx) + Math.abs(ddy);
      if (s.dist > 6) s.moved = true;
    };
    const up = () => {
      if (!s.dragging) return;
      s.dragging = false;
      // the click that ends a drag still sees moved=true; clear it afterwards so
      // keyboard Enter and later clicks open cards again
      setTimeout(() => { s.moved = false; }, 0);
      if (!reduce) { s.fling = clamp(s.lastDx * 0.9, -40, 40); s.flingY = clamp(s.lastDy * 0.6, -30, 30); }
      stage.classList.remove("is-dragging");
      removeEventListener("pointermove", dragMove);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
    };
    const down = (e) => {
      if (e.button !== 0 || isUi(e.target)) return;
      s.dragging = true; s.moved = false; s.dist = 0; s.lastDx = s.lastDy = 0; s.fling = s.flingY = 0;
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
    let rect = stage.getBoundingClientRect();
    const onResize = () => { rect = stage.getBoundingClientRect(); };
    addEventListener("resize", onResize, { passive: true });
    const hoverMove = (e) => {
      s.px = e.clientX - rect.left; s.py = e.clientY - rect.top;
      const ui = isUi(e.target);
      if (!s.cursorOn && !ui) { s.cursorOn = true; s.cx = s.px; s.cy = s.py; cursor?.classList.add("on"); }
      if (ui && s.cursorOn) { s.cursorOn = false; cursor?.classList.remove("on"); }
      if (s.dragging && s.moved) return setHot(-1);
      const card = e.target.closest?.("[data-card]");
      setHot(card ? +card.dataset.card : -1);
    };
    const leave = () => {
      s.cursorOn = false;
      cursor?.classList.remove("on", "on-card");
      setHot(-1);
    };

    // scroll to explore: the wheel travels along the wall
    const wheel = (e) => {
      if (e.target.closest(".rw-detail")) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : 1;
      s.dx -= (e.deltaY + e.deltaX) * 0.9 * unit;
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
      s.visible = false;
      if (s.raf) cancelAnimationFrame(s.raf);
      io.disconnect(); ro.disconnect(); up();
      removeEventListener("rvu:preloaded", onPreloaded);
      removeEventListener("resize", onResize);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", hoverMove);
      stage.removeEventListener("pointerleave", leave);
      stage.removeEventListener("wheel", wheel);
      stage.removeEventListener("keydown", key);
    };
  }, [stageRef, cursorRef, cardRefs, layout]);

  // bring a keyboard-focused card to the centre
  const focusCard = useCallback((i) => {
    const s = st.current;
    if (!s) return;
    const { cols, rows } = layout;
    s.dx -= wrap(s.bx[i] + s.x, cols * s.cw);
    s.dy -= wrap(s.by[i] + s.y, rows * s.ch);
  }, [layout]);

  const wasDrag = useCallback(() => !!st.current?.moved, []);

  const markSeen = useCallback((i) => {
    const s = st.current;
    if (s && !s.seen[i]) { s.seen[i] = 1; cb.current.onSeen?.(i); }
  }, []);

  return { focusCard, wasDrag, markSeen };
}

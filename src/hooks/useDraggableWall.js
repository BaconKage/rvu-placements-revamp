import { useEffect, useRef } from "react";

// Pointer-drag + inertia + idle drift for the offer wall. One transform on one
// node, rAF-driven. No library. Returns refs to attach to the frame and plane.
export function useDraggableWall(planeW, planeH) {
  const frameRef = useRef(null);
  const planeRef = useRef(null);
  const state = useRef({
    tx: 0, ty: 0, vx: 0, vy: 0,
    bx: 0, by: 0,           // idle-drift base
    dragging: false, moved: false, touched: false,
    lx: 0, ly: 0, sx: 0, sy: 0, t: 0,
  });

  useEffect(() => {
    const frame = frameRef.current;
    const plane = planeRef.current;
    if (!frame || !plane) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;

    const bounds = () => {
      const w = frame.clientWidth, h = frame.clientHeight;
      return {
        minX: Math.min(0, w - planeW), maxX: 0,
        minY: Math.min(0, h - planeH), maxY: 0,
      };
    };
    const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
    const apply = () => {
      plane.style.transform = `translate3d(${s.tx.toFixed(1)}px, ${s.ty.toFixed(1)}px, 0)`;
    };

    const centre = () => {
      const b = bounds();
      s.bx = clamp((frame.clientWidth - planeW) / 2, b.minX, b.maxX);
      s.by = clamp((frame.clientHeight - planeH) / 2, b.minY, b.maxY);
      s.tx = s.bx; s.ty = s.by; s.vx = s.vy = 0;
      apply();
    };
    centre();

    const onResize = () => { if (!s.touched) centre(); };
    addEventListener("resize", onResize, { passive: true });

    const down = (e) => {
      s.dragging = true; s.touched = true; s.moved = false;
      frame.classList.add("dragging");
      s.lx = s.sx = e.clientX; s.ly = s.sy = e.clientY; s.vx = s.vy = 0;
      frame.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lx, dy = e.clientY - s.ly;
      s.lx = e.clientX; s.ly = e.clientY; s.vx = dx; s.vy = dy;
      const b = bounds();
      s.tx = clamp(s.tx + dx, b.minX, b.maxX);
      s.ty = clamp(s.ty + dy, b.minY, b.maxY);
      if (Math.abs(e.clientX - s.sx) + Math.abs(e.clientY - s.sy) > 6) s.moved = true;
      apply();
    };
    const glide = () => {
      const b = bounds();
      s.vx *= 0.94; s.vy *= 0.94;
      s.tx = clamp(s.tx + s.vx, b.minX, b.maxX);
      s.ty = clamp(s.ty + s.vy, b.minY, b.maxY);
      apply();
      if (Math.abs(s.vx) > 0.15 || Math.abs(s.vy) > 0.15) requestAnimationFrame(glide);
    };
    const up = () => {
      if (!s.dragging) return;
      s.dragging = false;
      frame.classList.remove("dragging");
      if (!reduced && s.moved) glide();
    };
    const key = (e) => {
      const b = bounds(); const step = 90; let hit = true;
      if (e.key === "ArrowLeft") s.tx = clamp(s.tx + step, b.minX, b.maxX);
      else if (e.key === "ArrowRight") s.tx = clamp(s.tx - step, b.minX, b.maxX);
      else if (e.key === "ArrowUp") s.ty = clamp(s.ty + step, b.minY, b.maxY);
      else if (e.key === "ArrowDown") s.ty = clamp(s.ty - step, b.minY, b.maxY);
      else hit = false;
      if (hit) { s.touched = true; e.preventDefault(); apply(); }
    };

    frame.addEventListener("pointerdown", down);
    frame.addEventListener("pointermove", move);
    frame.addEventListener("pointerup", up);
    frame.addEventListener("pointercancel", up);
    frame.addEventListener("keydown", key);

    let raf;
    if (!reduced) {
      const drift = () => {
        if (!s.touched && !s.dragging) {
          s.t += 0.0038;
          s.tx = s.bx + Math.sin(s.t) * 16;
          s.ty = s.by + Math.cos(s.t * 0.72) * 11;
          apply();
        }
        raf = requestAnimationFrame(drift);
      };
      raf = requestAnimationFrame(drift);
    }

    frame._recentre = () => { s.touched = false; s.vx = s.vy = 0; centre(); };

    return () => {
      removeEventListener("resize", onResize);
      frame.removeEventListener("pointerdown", down);
      frame.removeEventListener("pointermove", move);
      frame.removeEventListener("pointerup", up);
      frame.removeEventListener("pointercancel", up);
      frame.removeEventListener("keydown", key);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [planeW, planeH]);

  const recentre = () => frameRef.current && frameRef.current._recentre?.();
  return { frameRef, planeRef, recentre };
}

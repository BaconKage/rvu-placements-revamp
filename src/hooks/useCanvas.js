import { useEffect, useRef, useState } from "react";

// Reads a design token off :root so canvas paint follows the theme.
export function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Sizes a canvas for the device pixel ratio and returns a CSS-pixel context.
export function fitCanvas(c, w, h) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.round(w * dpr);
  c.height = Math.round(h * dpr);
  c.style.height = `${h}px`;
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function parseHex(h) {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}
export function mixRgb(a, b, t) {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));
}

// Calls draw(canvas) after every render, and again whenever the canvas is
// resized, the theme attribute flips, or web fonts finish loading.
export function useCanvas(draw) {
  const ref = useRef(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const bump = () => setTick((t) => t + 1);
    let lastW = c.clientWidth;
    const ro = new ResizeObserver(() => {
      if (Math.abs(c.clientWidth - lastW) > 1) { lastW = c.clientWidth; bump(); }
    });
    ro.observe(c);
    const mo = new MutationObserver(bump);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.fonts?.ready.then(bump);
    return () => { ro.disconnect(); mo.disconnect(); };
  }, []);

  useEffect(() => {
    if (ref.current) draw(ref.current);
  });

  return [ref, tick];
}

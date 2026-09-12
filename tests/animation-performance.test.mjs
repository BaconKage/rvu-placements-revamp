// Run: node --experimental-vm-modules --test tests/animation-performance.test.mjs
// Optional before/after comparison: set RVU_BASELINE_REF to a git revision.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../src/hooks/useCurvedWall.js", import.meta.url), "utf8");

function eventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    dispatch(type, event = {}) { for (const fn of listeners.get(type) ?? []) fn(event); },
    listenerCount() { return [...listeners.values()].reduce((n, entries) => n + entries.size, 0); },
  };
}

async function mountWall({ code = source, width = 1280, height = 800, reduced = false, preloaded = true } = {}) {
  let now = 1000;
  let id = 0;
  const frames = new Map();
  const timers = new Map();
  const effects = [];
  const observers = [];
  const writes = { transform: 0, opacity: 0 };
  const style = () => new Proxy({ setProperty(key, value) { this[key] = value; } }, {
    set(target, key, value) {
      if (key in writes) writes[key]++;
      target[key] = value;
      return true;
    },
  });
  const win = { ...eventTarget(), __rvuPreloaded: preloaded };
  const doc = { ...eventTarget(), hidden: false };
  const attrs = new Map();
  const world = { style: style(), offsetTop: height / 2 + 50 };
  const stage = {
    ...eventTarget(), clientWidth: width, clientHeight: height, style: style(),
    querySelector: () => world,
    classList: { add() {}, remove() {} },
    toggleAttribute(name, force) { attrs.set(name, force); },
  };
  const cards = Array.from({ length: 56 }, (_, i) => ({ col: i % 14, row: Math.floor(i / 14) }));
  const nodes = cards.map(() => ({ style: style() }));
  const context = vm.createContext({
    window: win, document: doc, performance: { now: () => now },
    addEventListener: win.addEventListener, removeEventListener: win.removeEventListener,
    matchMedia: (query) => ({ matches: query.includes("reduced-motion") ? reduced : true }),
    requestAnimationFrame(fn) { frames.set(++id, fn); return id; },
    cancelAnimationFrame(token) { frames.delete(token); },
    setTimeout(fn) { timers.set(++id, fn); return id; },
    clearTimeout(token) { timers.delete(token); },
    ResizeObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class {
      constructor(fn) { this.fn = fn; observers.push(this); }
      observe() {}
      disconnect() { this.disconnected = true; }
    },
  });
  const react = new vm.SyntheticModule(["useCallback", "useEffect", "useRef"], function () {
    this.setExport("useCallback", (fn) => fn);
    this.setExport("useEffect", (fn) => effects.push(fn));
    this.setExport("useRef", (current) => ({ current }));
  }, { context });
  const mod = new vm.SourceTextModule(code, { context });
  await mod.link(() => react);
  await mod.evaluate();
  const api = mod.namespace.useCurvedWall({
    stageRef: { current: stage }, cardRefs: { current: nodes }, layout: { cards, cols: 14, rows: 4 },
  });
  const cleanups = effects.map((fn) => fn());
  const setVisible = (visible) => observers[0].fn([{ isIntersecting: visible }]);
  setVisible(true);
  return {
    api, stage, win, doc, writes, frames, attrs,
    step(count = 1, hz = 60) {
      for (let i = 0; i < count; i++) {
        now += 1000 / hz;
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach((fn) => fn(now));
        const due = [...timers.values()];
        timers.clear();
        due.forEach((fn) => fn());
      }
    },
    snapshot: () => nodes.map(({ style: s }) => ({ transform: s.transform, opacity: s.opacity, visibility: s.visibility })),
    resetWrites() { writes.transform = writes.opacity = 0; },
    setVisible,
    hidden(value) { doc.hidden = value; doc.dispatch("visibilitychange"); },
    dispose() { cleanups.forEach((fn) => fn?.()); },
  };
}

test("the fly-in, drift, wheel, keyboard and card zoom remain active", async () => {
  const wall = await mountWall();
  wall.step(1);
  const cloud = wall.snapshot();
  wall.step(240);
  assert.notDeepEqual(wall.snapshot(), cloud);
  assert.equal(wall.frames.size, 1);
  const settled = wall.snapshot();
  wall.stage.dispatch("wheel", { target: { closest: () => null }, deltaX: 0, deltaY: 150, deltaMode: 0, preventDefault() {} });
  wall.step(30);
  assert.notDeepEqual(wall.snapshot(), settled);
  wall.api.zoomTo(20);
  wall.step(300);
  assert.equal(wall.frames.size, 0, "settled detail must stop requesting frames");
  wall.api.zoomOut();
  assert.equal(wall.frames.size, 1, "closing the detail must restart drift");
  wall.dispose();
  assert.equal(wall.frames.size, 0);
  assert.equal(wall.win.listenerCount() + wall.doc.listenerCount() + wall.stage.listenerCount(), 0);
});

test("off-screen and hidden walls sleep, then resume without duplicate loops", async () => {
  const wall = await mountWall();
  wall.step(240);
  wall.setVisible(false);
  wall.resetWrites();
  wall.step(60);
  assert.equal(wall.frames.size, 0);
  assert.equal(wall.writes.transform + wall.writes.opacity, 0);
  assert.equal(wall.attrs.get("data-paused"), true);
  wall.setVisible(true);
  wall.hidden(true);
  assert.equal(wall.frames.size, 0);
  wall.hidden(false);
  wall.hidden(false);
  assert.equal(wall.frames.size, 1);
  wall.dispose();
});

test("reduced motion renders once at rest and wakes for keyboard/drag/zoom", async () => {
  const wall = await mountWall({ reduced: true });
  wall.step(2);
  assert.equal(wall.frames.size, 0);
  const before = wall.snapshot();
  wall.stage.dispatch("keydown", { key: "ArrowRight", target: { closest: () => null }, preventDefault() {} });
  wall.step(240);
  assert.notDeepEqual(wall.snapshot(), before);
  assert.equal(wall.frames.size, 0);
  wall.stage.dispatch("pointerdown", { button: 0, clientX: 50, clientY: 50, target: { closest: () => null } });
  wall.win.dispatch("pointermove", { clientX: 150, clientY: 100 });
  wall.step(10);
  wall.win.dispatch("pointerup");
  wall.step(240);
  assert.equal(wall.frames.size, 0);
  wall.api.focusCard(22);
  assert.equal(wall.frames.size, 1);
  wall.dispose();
});

test("the loader still gates the fly-in and unmount cancels a live drag", async () => {
  const wall = await mountWall({ preloaded: false, width: 390, height: 844 });
  wall.step(300);
  assert(wall.snapshot().every((s) => s.transform.includes("scale(0.400)")));
  wall.win.__rvuPreloaded = true;
  wall.win.dispatch("rvu:preloaded");
  wall.step(240);
  assert(wall.snapshot().some((s) => s.visibility === "hidden"));
  wall.stage.dispatch("pointerdown", { button: 0, clientX: 0, clientY: 0, target: { closest: () => null } });
  wall.win.dispatch("pointermove", { clientX: 100, clientY: 50 });
  wall.dispose();
  assert.equal(wall.frames.size, 0);
  assert.equal(wall.win.listenerCount() + wall.doc.listenerCount() + wall.stage.listenerCount(), 0);
});

test("count-up cancels on unmount and survives React StrictMode effect replay", async () => {
  const code = await readFile(new URL("../src/hooks/useCountUp.js", import.meta.url), "utf8");
  let effect, currentRef, value, now = 0, id = 0, updates = 0;
  const frames = new Map();
  const timers = new Map();
  const observers = [];
  const context = vm.createContext({
    matchMedia: () => ({ matches: false }), performance: { now: () => now }, innerHeight: 800,
    requestAnimationFrame(fn) { frames.set(++id, fn); return id; },
    cancelAnimationFrame(key) { frames.delete(key); },
    setTimeout(fn) { timers.set(++id, fn); return id; }, clearTimeout(key) { timers.delete(key); },
    IntersectionObserver: class {
      constructor(fn) { this.fn = fn; observers.push(this); }
      observe() {} disconnect() {}
    },
  });
  const react = new vm.SyntheticModule(["useEffect", "useRef", "useState"], function () {
    this.setExport("useEffect", (fn) => { effect = fn; });
    this.setExport("useRef", (initial) => (currentRef = { current: initial }));
    this.setExport("useState", (initial) => [typeof initial === "function" ? initial() : initial, (next) => { value = next; updates++; }]);
  }, { context });
  const mod = new vm.SourceTextModule(code, { context });
  await mod.link(() => react); await mod.evaluate();
  mod.namespace.useCountUp(25, { duration: 1400 });
  currentRef.current = { getBoundingClientRect: () => ({ top: 100, bottom: 150 }) };
  const firstCleanup = effect();
  observers.at(-1).fn([{ isIntersecting: true }]);
  assert.equal(frames.size, 1);
  firstCleanup();
  assert.equal(frames.size + timers.size, 0);
  const cleanup = effect();
  observers.at(-1).fn([{ isIntersecting: true }]);
  for (let i = 0; i < 180; i++) {
    now += 1000 / 120;
    const pending = [...frames.values()]; frames.clear();
    pending.forEach((fn) => fn(now));
  }
  assert.equal(value, "25");
  assert(updates <= 28, "only update React when the displayed number changes");
  assert.equal(frames.size, 0);
  cleanup();
});

if (process.env.RVU_BASELINE_REF) {
  const baseline = execFileSync("git", ["show", `${process.env.RVU_BASELINE_REF}:src/hooks/useCurvedWall.js`], { encoding: "utf8" });
  test("before/after: preserve every rendered card's geometry at 60/120/144 Hz", async () => {
    for (const [width, height, hz] of [[390, 844, 60], [1280, 800, 120], [1920, 1080, 144]]) {
      const old = await mountWall({ code: baseline, width, height });
      const current = await mountWall({ width, height });
      for (let frame = 0; frame < hz * 6; frame++) {
        old.step(1, hz); current.step(1, hz);
        assert.deepEqual(current.snapshot(), old.snapshot(), `geometry changed at ${width}px / ${hz}Hz / frame ${frame}`);
      }
      old.resetWrites(); current.resetWrites();
      old.step(hz * 5, hz); current.step(hz * 5, hz);
      console.log(JSON.stringify({ width, hz, before: old.writes, after: current.writes }));
      assert(current.writes.opacity < old.writes.opacity / 4, "opacity writes should fall by at least 75%");
      old.dispose(); current.dispose();
    }
  });
}

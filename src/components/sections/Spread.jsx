import { useMemo, useRef, useEffect, useState } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { buildSwarm } from "../../data/placements";
import "./Spread.css";

const W = 1000, H = 440, PAD = 54, BASE = H - 70, MIN = 4, MAX = 46;
const TICKS = [4, 10, 20, 33, 43.5];

export default function Spread() {
  const dots = useMemo(() => buildSwarm(), []);
  const svgRef = useRef(null);
  const [live, setLive] = useState(false);
  const [hover, setHover] = useState(null);

  const placed = useMemo(() => {
    const xOf = (v) => PAD + ((v - MIN) / (MAX - MIN)) * (W - 2 * PAD);
    const arr = dots.map((d) => ({ ...d, x: xOf(d.v), r: d.band === "peak" ? 9 : 5.2 }))
      .sort((a, b) => a.x - b.x);
    const done = [];
    for (const d of arr) {
      let y = BASE, dir = -1, k = 1;
      const step = d.r * 1.85;
      const hits = (yy) => done.some((p) => Math.abs(p.x - d.x) < (p.r + d.r) * 0.95 && Math.abs(p.y - yy) < (p.r + d.r) * 0.92);
      // stack upward from the baseline
      let yy = BASE - d.r;
      while (hits(yy)) { yy -= step; }
      d.y = yy;
      done.push(d);
    }
    return done;
  }, [dots]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setLive(true); return; }
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) { setLive(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section spread" id="spread">
      <div className="wrap">
        <Eyebrow idx="05">The spread</Eyebrow>
        <h2 className="serif spread-h">
          <Words text="Every dot is one offer. Only one is ₹43.5." hi={new Set([6])} />
        </h2>

        <div className="swarm-wrap">
          <svg
            ref={svgRef}
            className={`swarm ${live ? "live" : ""}`}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="A swarm of dots, one per placement offer, positioned by package size from ₹4 to ₹43.5 LPA. The single highest offer stands alone at the far right."
          >
            {/* baseline */}
            <line x1={PAD} y1={BASE} x2={W - PAD} y2={BASE} className="axis" />
            {TICKS.map((t) => {
              const x = PAD + ((t - MIN) / (MAX - MIN)) * (W - 2 * PAD);
              return (
                <g key={t} className={t === 43.5 ? "tick peak" : "tick"}>
                  <line x1={x} y1={BASE} x2={x} y2={BASE + 8} />
                  <text x={x} y={BASE + 26} textAnchor="middle">₹{t}</text>
                </g>
              );
            })}
            {/* dots */}
            {placed.map((d, i) => (
              <circle
                key={i}
                className={`dot ${d.band}`}
                cx={d.x} cy={d.y} r={d.r}
                style={{ transitionDelay: `${Math.round((d.x / W) * 850)}ms` }}
                onMouseEnter={() => setHover(d)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
            {/* peak label */}
            <g className="peak-label" transform={`translate(${placed.find((d) => d.band === "peak")?.x ?? W - PAD}, ${(placed.find((d) => d.band === "peak")?.y ?? 120) - 22})`}>
              <text textAnchor="middle" className="peak-name">Aviatrix</text>
              <text textAnchor="middle" y="16" className="peak-amt">₹43.5 LPA</text>
            </g>
          </svg>

          <div className="swarm-legend">
            <span><i className="k base" /> Below ₹10 · 85</span>
            <span><i className="k mid" /> ₹10–20 · 45</span>
            <span><i className="k top" /> ₹20–33 · 20</span>
            <span><i className="k peak" /> ₹43.5 · 1</span>
          </div>
        </div>

        <p className="spread-foot mono">
          {hover
            ? `This offer ≈ ₹${hover.v} LPA${hover.who ? ` · ${hover.who}` : ""}`
            : "Distribution read from the chart published on rvu.edu.in. Hover a dot. Minimum recorded ≈ ₹4 LPA."}
        </p>
      </div>
    </section>
  );
}

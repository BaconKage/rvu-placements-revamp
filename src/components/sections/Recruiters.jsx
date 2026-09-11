import { useEffect, useMemo, useRef } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { buildRecruiterField, UPCOMING } from "../../data/placements";
import "./Recruiters.css";

function shortSector(s) {
  return s.replace(" & Software", "").replace(" & Fintech", "").replace(" & Analytics", "")
    .replace("Energy, Industrial & Health", "Industrial").replace(" & Startups", "");
}

function Card({ c }) {
  const mono = c.co.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "RV";
  return (
    <article className="rf-card" data-hot>
      <div className="rf-top">
        <span className="rf-mono">{mono}</span>
        <span className="rf-sector mono">{shortSector(c.sector)}</span>
      </div>
      <div className="rf-co serif">{c.co}</div>
    </article>
  );
}

export default function Recruiters() {
  const { cards } = useMemo(() => buildRecruiterField(), []);
  const rowA = useMemo(() => cards.filter((_, i) => i % 2 === 0), [cards]);
  const rowB = useMemo(() => cards.filter((_, i) => i % 2 === 1), [cards]);

  const secRef = useRef(null);
  const aRef = useRef(null);
  const bRef = useRef(null);

  // scroll-velocity → horizontal swipe (nk.studio behaviour, DOM-side)
  useEffect(() => {
    const sec = secRef.current, a = aRef.current, b = bRef.current;
    if (!sec || !a || !b) return;
    let raf, lastNorm = 0, skew = 0;

    const frame = () => {
      const off = !matchMedia("(min-width: 761px)").matches ||
        matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (off) {
        a.style.transform = ""; b.style.transform = "";
      } else {
        const rect = sec.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        // norm: -1 entering from below, 0 centred, +1 leaving past the top
        const norm = Math.max(-1, Math.min(1, (innerHeight / 2 - mid) / (innerHeight * 0.62)));
        const travelA = Math.max(0, a.scrollWidth - sec.clientWidth);
        const travelB = Math.max(0, b.scrollWidth - sec.clientWidth);
        const t = (norm + 1) / 2;                       // 0 at entry, 1 at exit

        const vel = norm - lastNorm;
        lastNorm = norm;
        const target = Math.max(-7, Math.min(7, vel * 560));
        skew += (target - skew) * 0.15;                 // eased skew, decays at rest

        a.style.transform = `translate3d(${(-t * travelA * 0.92).toFixed(1)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
        b.style.transform = `translate3d(${(-(1 - t) * travelB * 0.92).toFixed(1)}px,0,0) skewX(${(-skew).toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="section recruiters" id="recruiters" ref={secRef}>
      <div className="wrap">
        <Eyebrow idx="01">Recruiters</Eyebrow>
        <h2 className="serif rec-h">
          <Words text="Who recruits from RV University." glow={new Set([3, 4])} />
        </h2>
        <p className="lede rec-lede">
          {cards.length} organisations across six sectors engaged with our students this cycle.
          Scroll — the board swipes as you go.
        </p>
      </div>

      <div className="rf-band" role="region" aria-label="Recruiting companies">
        <div className="rf-row" ref={aRef}>
          {rowA.map((c, i) => <Card key={"a" + i} c={c} />)}
        </div>
        <div className="rf-row" ref={bRef}>
          {rowB.map((c, i) => <Card key={"b" + i} c={c} />)}
        </div>
      </div>

      <div className="wrap">
        <div className="rec-upcoming">
          <span className="mono rec-up-label"><span className="rec-up-dot" /> In the pipeline</span>
          <p className="rec-up-list">
            {UPCOMING.map((c, i) => (
              <span className="rec-up-co" key={c}>{c}{i < UPCOMING.length - 1 ? <span className="sep">·</span> : null}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

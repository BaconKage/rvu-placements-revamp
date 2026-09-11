import { useEffect, useMemo, useRef } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useDraggableWall } from "../../hooks/useDraggableWall";
import { buildRecruiterField, UPCOMING } from "../../data/placements";
import "./Recruiters.css";

function shortSector(s) {
  return s.replace(" & Software", "").replace(" & Fintech", "").replace(" & Analytics", "")
    .replace("Energy, Industrial & Health", "Industrial").replace(" & Startups", "");
}

function RecruiterCard({ card }) {
  const mono = card.co.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "RV";
  return (
    <article className={`rf-card ${card.tier}`} style={{ left: card.x, top: card.y }} data-hot>
      <div className="rf-top">
        <span className="rf-mono">{mono}</span>
        <span className="rf-sector mono">{shortSector(card.sector)}</span>
      </div>
      <div className="rf-co serif">{card.co}</div>
    </article>
  );
}

export default function Recruiters() {
  const { cards, planeW, planeH } = useMemo(() => buildRecruiterField(), []);
  const { frameRef, planeRef, recentre } = useDraggableWall(planeW, planeH);
  const puckRef = useRef(null);

  // nk-style "drag to explore" cursor puck, local to the field
  useEffect(() => {
    const frame = frameRef.current, puck = puckRef.current;
    if (!frame || !puck) return;
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const move = (e) => {
      const r = frame.getBoundingClientRect();
      puck.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
    };
    const on = () => puck.classList.add("on");
    const off = () => puck.classList.remove("on");
    frame.addEventListener("pointermove", move);
    frame.addEventListener("pointerenter", on);
    frame.addEventListener("pointerleave", off);
    return () => {
      frame.removeEventListener("pointermove", move);
      frame.removeEventListener("pointerenter", on);
      frame.removeEventListener("pointerleave", off);
    };
  }, [frameRef]);

  return (
    <section className="section recruiters" id="recruiters">
      <div className="wrap">
        <Eyebrow idx="01">Recruiters</Eyebrow>
        <h2 className="serif rec-h">
          <Words text="Who recruits from RV University." glow={new Set([3, 4])} />
        </h2>
        <p className="lede rec-lede">
          {cards.length} organisations across six sectors engaged with our students this cycle.
          Grab the board and drag to explore.
        </p>
      </div>

      <div
        className="rf-frame"
        ref={frameRef}
        tabIndex={0}
        role="region"
        aria-label="A draggable board of recruiting companies. Use arrow keys to pan."
        data-lenis-prevent
      >
        <div className="rf-plane" ref={planeRef} style={{ width: planeW, height: planeH }}>
          {cards.map((c) => <RecruiterCard key={c.id} card={c} />)}
        </div>

        <div className="rf-hud">
          <span className="pulse" aria-hidden="true" />
          <span className="mono">Drag to explore</span>
          <button type="button" className="rf-recentre mono" onClick={recentre}>Recentre</button>
        </div>
        <span className="rf-puck" ref={puckRef} aria-hidden="true">DRAG</span>
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

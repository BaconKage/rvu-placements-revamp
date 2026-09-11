import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { STATS } from "../../data/placements";
import { buildPeek, buildWall, rolesFor } from "../../data/recruiterWall";
import { useCurvedWall } from "../../hooks/useCurvedWall";
import Logo from "../ui/Logo";
import "./Recruiters.css";

// logo panel on top, then the company, the role alone at the bottom
const WallCard = memo(
  forwardRef(function WallCard({ c, i, onOpenCard, onFocusCard, peek }, ref) {
    const pipeline = c.kind === "pipeline";
    // in the peek the whole window is one link, so cards are plain, hidden spans
    const Tag = peek ? "span" : "button";
    const props = peek
      ? { "aria-hidden": true }
      : {
          type: "button",
          onClick: () => onOpenCard(i),
          onFocus: (e) => onFocusCard(i, e),
          "aria-label": pipeline ? `${c.co}: upcoming campus drive` : `${c.co}: ${c.title}`,
        };
    return (
      <Tag ref={ref} data-card={i} className={`rw-card ${c.kind}`} {...props}>
        <span className="rw-pic" aria-hidden="true"><Logo co={c.co} /></span>
        {pipeline && <span className="rw-tag" aria-hidden="true"><i /> Upcoming</span>}
        <span className="rw-co">{c.co}</span>
        <span className="rw-role">{pipeline ? "Upcoming campus drive" : c.title}</span>
      </Tag>
    );
  })
);

// a small window onto the wall: a few companies drifting past, one link to the full page
export function WallPeek({ cos, onClick }) {
  const layout = useMemo(() => buildPeek(cos), [cos]);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  useCurvedWall({ stageRef, cardRefs, layout, interactive: false, centreRow: true });

  return (
    <Link ref={stageRef} to="/recruiters" onClick={onClick} className="rw-stage rw-peek" aria-label="See the full list of companies">
      <span className="rw-sky" aria-hidden="true" />
      <span className="rw-world" aria-hidden="true">
        {layout.cards.map((c, i) => (
          <WallCard key={c.id} c={c} i={i} peek ref={(el) => (cardRefs.current[i] = el)} />
        ))}
      </span>
      <span className="rw-edge l" aria-hidden="true" />
      <span className="rw-edge r" aria-hidden="true" />
      <span className="rw-shade" aria-hidden="true" />
      <span className="rw-peek-cta">Full list of companies <span className="arrow">→</span></span>
    </Link>
  );
}

function Detail({ c, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, []);
  const roles = c.kind === "hired" ? rolesFor(c.co) : [];
  return (
    <div className="rw-detail" onClick={onClose}>
      <div className="rw-detail-card" role="dialog" aria-modal="true" aria-label={c.co} onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="rw-close" onClick={onClose} aria-label="Close">×</button>
        <div className="rw-detail-top">
          <span className="rw-detail-logo"><Logo co={c.co} /></span>
          <div>
            <span className="rw-detail-k">{c.kind === "pipeline" ? "In the pipeline" : c.sector}</span>
            <h3>{c.co}</h3>
          </div>
        </div>
        {c.kind === "hired" ? (
          <dl className="rw-dl">
            <div><dt>Role</dt><dd>{c.title}</dd></div>
            <div><dt>Offer</dt><dd>{c.type}</dd></div>
            <div><dt>Channel</dt><dd>{c.via === "RVU" ? "RV University campus drive" : "RV group drive (RVCE)"}</dd></div>
            {roles.length > 1 && <div><dt>Also hired for</dt><dd>{roles.filter((r) => r !== c.title).join(", ")}</dd></div>}
          </dl>
        ) : (
          <p className="rw-detail-p">
            {c.co} is lined up with the Corporate &amp; Alumni Relations office for an upcoming campus drive this cycle.
          </p>
        )}
        <div className="rw-detail-actions">
          {c.kind === "hired"
            ? <Link className="rw-btn" to="/students">How students get placed →</Link>
            : <Link className="rw-btn" to="/forms">Register your organisation →</Link>}
        </div>
      </div>
    </div>
  );
}

export default function Recruiters() {
  const layout = useMemo(() => buildWall(), []);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(0);

  const onSeen = useCallback(() => setSeen((x) => x + 1), []);
  const { focusCard, wasDrag, markSeen, zoomTo, zoomOut } = useCurvedWall({ stageRef, cardRefs, layout, onSeen });

  // the camera zooms into the card, then its details fade in over it
  const onOpenCard = useCallback((i) => {
    if (wasDrag()) return;
    markSeen(i);
    zoomTo(i);
    setOpen(i);
  }, [wasDrag, markSeen, zoomTo]);
  const close = useCallback(() => { setOpen(null); zoomOut(); }, [zoomOut]);
  const onFocusCard = useCallback((i, e) => { if (e.target.matches(":focus-visible")) focusCard(i); }, [focusCard]);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e) => e.key === "Escape" && close();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, close]);

  const total = layout.cards.length;

  return (
    <section
      className="rw-stage"
      id="recruiters"
      ref={stageRef}
      tabIndex={-1}
      data-lenis-prevent
      aria-label="Recruiter wall. Drag, swipe or scroll to explore; open a card for details."
    >
      <div className="rw-sky" aria-hidden="true" />

      <header className="rw-head">
        <div>
          <span className="rw-kicker"><em>RV University</em> Placements · 2024–25</span>
          <h1 className="rw-title">Who recruits from <em>RV University.</em></h1>
        </div>
        <dl className="rw-stats">
          {STATS.slice(0, 3).map((s) => (
            <div key={s.k}><dt>{s.v}<em>{s.unit}</em></dt><dd>{s.k}</dd></div>
          ))}
        </dl>
      </header>

      <div className="rw-world">
        {layout.cards.map((c, i) => (
          <WallCard key={c.id} c={c} i={i} ref={(el) => (cardRefs.current[i] = el)}
            onOpenCard={onOpenCard} onFocusCard={onFocusCard} />
        ))}
      </div>

      <div className="rw-edge l" aria-hidden="true" />
      <div className="rw-edge r" aria-hidden="true" />
      <div className="rw-shade" aria-hidden="true" />

      <footer className="rw-foot">
        <span className="rw-legend">
          <span><i className="hired" /> Hired through RV</span>
          <span><i className="pipeline" /> In the pipeline</span>
        </span>
        <span className="rw-count"><i /> Explored <b>{Math.min(seen, total)}/{total}</b></span>
      </footer>

      {open != null && <Detail c={layout.cards[open]} onClose={close} />}
    </section>
  );
}

import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { STATS } from "../../data/placements";
import { buildWall, domainOf, rolesFor } from "../../data/recruiterWall";
import { useCurvedWall } from "../../hooks/useCurvedWall";
import "./Recruiters.css";

// logo: unavatar -> favicon -> monogram. onTiny fires when all we got is a
// favicon too small to fill a picture panel.
function Logo({ co, onTiny }) {
  const domain = domainOf(co);
  const sources = domain
    ? [`https://unavatar.io/${domain}?fallback=false`, `https://www.google.com/s2/favicons?domain=${domain}&sz=128`]
    : [];
  const [idx, setIdx] = useState(0);
  useEffect(() => { if (onTiny && idx >= sources.length) onTiny(); }, [idx, sources.length, onTiny]);
  if (idx >= sources.length) {
    return <span className="rw-mono">{co.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}</span>;
  }
  return (
    <img src={sources[idx]} alt="" draggable="false" loading="lazy"
      onLoad={(e) => { if (onTiny && e.currentTarget.naturalWidth < 64) onTiny(); }}
      onError={() => setIdx((i) => i + 1)} />
  );
}

// company first, big; the role sits alone at the bottom
const WallCard = memo(
  forwardRef(function WallCard({ c, i, onOpenCard, onFocusCard }, ref) {
    const [pic, setPic] = useState(c.image);
    const dropPic = useCallback(() => setPic(false), []);
    const pipeline = c.kind === "pipeline";
    return (
      <button
        ref={ref}
        type="button"
        data-card={i}
        className={`rw-card ${c.kind}${pic ? " img" : ""}`}
        onClick={() => onOpenCard(i)}
        onFocus={(e) => onFocusCard(i, e)}
        aria-label={pipeline ? `${c.co}: upcoming campus drive` : `${c.co}: ${c.title}`}
      >
        {pic ? (
          <span className="rw-pic" aria-hidden="true"><Logo co={c.co} onTiny={dropPic} /></span>
        ) : (
          <span className="rw-card-top" aria-hidden="true">
            <span className="rw-avatar"><Logo co={c.co} /></span>
            {pipeline && <span className="rw-tag"><i /> Upcoming</span>}
          </span>
        )}
        <span className="rw-co">{c.co}</span>
        <span className="rw-role">{pipeline ? "Upcoming campus drive" : c.title}</span>
      </button>
    );
  })
);

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
  const cursorRef = useRef(null);
  const cardRefs = useRef([]);
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(0);

  const onSeen = useCallback(() => setSeen((x) => x + 1), []);
  const { focusCard, wasDrag, markSeen } = useCurvedWall({ stageRef, cursorRef, cardRefs, layout, onSeen });

  const onOpenCard = useCallback((i) => { if (wasDrag()) return; markSeen(i); setOpen(i); }, [wasDrag, markSeen]);
  const onFocusCard = useCallback((i, e) => { if (e.target.matches(":focus-visible")) focusCard(i); }, [focusCard]);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

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

      <div className="rw-cursor" ref={cursorRef} aria-hidden="true">
        <span className="rw-cursor-ring"><i /></span>
        <span className="rw-cursor-label">
          <span className="rw-cl-idle">Drag / scroll to explore</span>
          <span className="rw-cl-card">View</span>
        </span>
      </div>

      <footer className="rw-foot">
        <span className="rw-legend">
          <span><i className="hired" /> Hired through RV</span>
          <span><i className="pipeline" /> In the pipeline</span>
        </span>
        <nav className="rw-paths" aria-label="Choose your path">
          <Link to="/students">For students</Link>
          <Link to="/partners">For corporate partners</Link>
          <Link to="/parents">For parents</Link>
          <Link className="rw-paths-cta" to="/forms">Register to recruit</Link>
        </nav>
        <span className="rw-count"><i /> Explored <b>{Math.min(seen, total)}/{total}</b></span>
      </footer>

      {open != null && <Detail c={layout.cards[open]} onClose={() => setOpen(null)} />}
    </section>
  );
}

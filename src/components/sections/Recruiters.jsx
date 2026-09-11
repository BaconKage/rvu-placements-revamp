import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UPCOMING } from "../../data/placements";
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

// nk archive card: (picture) → headline → avatar · name · company
const WallCard = memo(
  forwardRef(function WallCard({ c, i, onOpenCard, onFocusCard }, ref) {
    const [pic, setPic] = useState(c.image);
    const dropPic = useCallback(() => setPic(false), []);
    return (
      <button
        ref={ref}
        type="button"
        data-card={i}
        className={`rw-card ${c.kind}${pic ? " img" : ""}`}
        onClick={() => onOpenCard(i)}
        onFocus={(e) => onFocusCard(i, e)}
        aria-label={c.kind === "pipeline" ? `${c.co}: upcoming campus drive` : `${c.co}: ${c.title}`}
      >
        {c.kind === "pipeline" && <span className="rw-tag"><i /> Upcoming drive</span>}
        {pic && <span className="rw-pic" aria-hidden="true"><Logo co={c.co} onTiny={dropPic} /></span>}
        <span className="rw-card-title">{c.title}</span>
        <span className="rw-card-by">
          <span className="rw-avatar" aria-hidden="true"><Logo co={c.co} /></span>
          <span className="rw-by">
            <span className="rw-by-name">{c.kind === "pipeline" ? "Campus drive" : c.co}</span>
            <span className="rw-by-sub">{c.kind === "pipeline" ? "In the pipeline · CAR" : `${c.sector} · via ${c.via}`}</span>
          </span>
        </span>
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
            <span className="rw-by-sub">{c.kind === "pipeline" ? "In the pipeline" : c.sector}</span>
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
            ? <Link className="rw-btn" to="/fit">Check your fit for roles like this →</Link>
            : <Link className="rw-btn" to="/forms">Register your organisation →</Link>}
        </div>
      </div>
    </div>
  );
}

export default function Recruiters() {
  const layout = useMemo(() => buildWall(), []);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const cursorRef = useRef(null);
  const cardRefs = useRef([]);
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(0);

  const onSeen = useCallback(() => setSeen((x) => x + 1), []);
  const { focusCard, wasDrag, markSeen } = useCurvedWall({ stageRef, trackRef, cursorRef, cardRefs, layout, onSeen });

  const onOpenCard = useCallback((i) => { if (wasDrag()) return; markSeen(i); setOpen(i); }, [wasDrag, markSeen]);
  const onFocusCard = useCallback((i, e) => { if (e.target.matches(":focus-visible")) focusCard(i); }, [focusCard]);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const total = layout.cards.length;
  const orgs = new Set(layout.cards.map((c) => c.co)).size;
  const offers = layout.cards.filter((c) => c.kind === "hired").length;

  return (
    <section className="recruiters" id="recruiters">
      <div className="rw-track" ref={trackRef}>
        <div className="rw-stage" ref={stageRef} tabIndex={-1} role="region" aria-label="Recruiter wall. Drag, swipe or scroll to explore.">
          <div className="rw-sky" aria-hidden="true" />

          <header className="rw-head">
            <div>
              <span className="rw-kicker"><em>01</em> Recruiters</span>
              <h2 className="rw-title">Who recruits from <em>RV University.</em></h2>
            </div>
            <p className="rw-sub">
              {offers} offers through RV drives and {total - offers} recruiters in the pipeline — {orgs} organisations. Drag, swipe or scroll to explore.
            </p>
          </header>

          <div className="rw-world">
            {layout.cards.map((c, i) => (
              <WallCard key={c.id} c={c} i={i} ref={(el) => (cardRefs.current[i] = el)}
                onOpenCard={onOpenCard} onFocusCard={onFocusCard} />
            ))}
          </div>

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
            <span className="rw-count"><i /> Recruiters explored <b>{Math.min(seen, total)}/{total}</b></span>
          </footer>

          {open != null && <Detail c={layout.cards[open]} onClose={() => setOpen(null)} />}
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

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { RECRUITER_SECTORS, UPCOMING, REPUTATION } from "../../data/placements";
import "./Recruiters.css";

const FLIP_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";

export default function Recruiters() {
  // flatten to one list; keep sector for filtering
  const all = useMemo(() => {
    const rank = (co) => { const i = REPUTATION.indexOf(co); return i === -1 ? 999 : i; };
    return RECRUITER_SECTORS
      .flatMap((g) => g.cos.map((co) => ({ co, sector: g.sector })))
      .sort((a, b) => rank(a.co) - rank(b.co));
  }, []);
  const sectors = useMemo(() => RECRUITER_SECTORS.map((g) => g.sector), []);
  const [active, setActive] = useState("All");

  const gridRef = useRef(null);
  const prevRects = useRef(new Map());

  const visible = active === "All" ? all : all.filter((c) => c.sector === active);

  // FLIP: animate cells that persist across a filter change to their new spot
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cells = grid.querySelectorAll(".co-cell");
    if (!reduce) {
      cells.forEach((cell) => {
        const id = cell.dataset.co;
        const now = cell.getBoundingClientRect();
        const was = prevRects.current.get(id);
        if (was) {
          const dx = was.left - now.left;
          const dy = was.top - now.top;
          if (dx || dy) {
            cell.style.transition = "none";
            cell.style.transform = `translate(${dx}px, ${dy}px)`;
            requestAnimationFrame(() => {
              cell.style.transition = `transform .55s ${FLIP_EASE}`;
              cell.style.transform = "";
            });
          }
        } else {
          // newly appearing — gentle fade/scale in
          cell.style.transition = "none";
          cell.style.opacity = "0";
          cell.style.transform = "scale(.94)";
          requestAnimationFrame(() => {
            cell.style.transition = `opacity .45s ${FLIP_EASE}, transform .45s ${FLIP_EASE}`;
            cell.style.opacity = "";
            cell.style.transform = "";
          });
        }
      });
    }
    const map = new Map();
    grid.querySelectorAll(".co-cell").forEach((c) => map.set(c.dataset.co, c.getBoundingClientRect()));
    prevRects.current = map;
  }, [active]);

  return (
    <section className="section recruiters" id="recruiters">
      <div className="wrap">
        <Eyebrow idx="01">Recruiters</Eyebrow>
        <h2 className="serif rec-h">
          <Words text="Who recruits from RV University." />
        </h2>
        <p className="lede rec-lede">
          {all.length} organisations across six sectors engaged with our students this cycle.
          Filter to explore.
        </p>

        <div className="rec-filters" role="tablist" aria-label="Filter recruiters by sector">
          <Chip label="All" count={all.length} active={active === "All"} onClick={() => setActive("All")} />
          {sectors.map((sec) => (
            <Chip
              key={sec}
              label={sec}
              count={all.filter((c) => c.sector === sec).length}
              active={active === sec}
              onClick={() => setActive(sec)}
            />
          ))}
        </div>

        <div className="rec-grid" ref={gridRef}>
          {visible.map((c) => (
            <div className="co-cell" key={c.co} data-co={c.co} data-hot>
              <span className="co-name">{c.co}</span>
              <span className="co-sector mono">{shortSector(c.sector)}</span>
            </div>
          ))}
        </div>

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

function Chip({ label, count, active, onClick }) {
  return (
    <button className={`rec-chip ${active ? "on" : ""}`} onClick={onClick} role="tab" aria-selected={active} data-hot>
      {label}<span className="rec-chip-n">{count}</span>
    </button>
  );
}

function shortSector(s) {
  return s.replace(" & Software", "").replace(" & Fintech", "").replace(" & Analytics", "")
    .replace("Energy, Industrial & Health", "Industrial").replace(" & Startups", "");
}

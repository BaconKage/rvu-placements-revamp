import { useMemo } from "react";
import { buildOfferWall } from "../../data/placements";
import { useDraggableWall } from "../../hooks/useDraggableWall";
import OfferCard from "../ui/OfferCard";
import "./Hero.css";

export default function Hero() {
  const { cards, planeW, planeH } = useMemo(() => buildOfferWall(), []);
  const { frameRef, planeRef, recentre } = useDraggableWall(planeW, planeH);

  return (
    <header className="hero" id="top">
      <div
        className="wall"
        ref={frameRef}
        tabIndex={0}
        role="region"
        aria-label="A draggable wall of RV University placement offers. Use arrow keys to pan."
      >
        <div className="wall-atmos" aria-hidden="true" />
        <div className="plane" ref={planeRef} style={{ width: planeW, height: planeH }}>
          {cards.map((c) => <OfferCard key={c.id} card={c} />)}
        </div>

        <div className="wall-copy">
          <span className="mono hero-kicker">RV University / Bengaluru / Placements 2025</span>
          <h1 className="serif hero-h1">
            Four hundred<br />and twenty-five<br />
            <span className="hero-em">ways out of here.</span>
          </h1>
          <p className="hero-lede">
            Every card on this wall is a real offer made to an RVU graduate.
            Drag it around — there is no brochure underneath.
          </p>
          <div className="hero-actions">
            <a className="btn" href="#recruit">Recruit at RVU <span className="arrow">→</span></a>
            <a className="btn ghost" href="#record">See the record</a>
          </div>
        </div>

        <div className="wall-hud">
          <span className="pulse" aria-hidden="true" />
          <span className="mono">Drag the wall</span>
          <button type="button" className="recentre mono" onClick={recentre}>Recentre</button>
        </div>
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-row">
          {Array(2).fill(TICKER).flat().map((t, i) => (
            <span className="ticker-item" key={i}>{t}<span className="ticker-sep">✦</span></span>
          ))}
        </div>
      </div>
    </header>
  );
}

const TICKER = [
  "425 OFFERS", "250+ RECRUITERS", "₹43.5 LPA HIGHEST", "1,608 ELIGIBLE",
  "6 SCHOOLS", "25% MULTIPLE OFFERS", "FORTUNE 500 GCCs", "MNC · CONSULTING · FINANCE",
];

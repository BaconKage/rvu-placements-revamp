import { useMemo } from "react";
import { buildOfferWall, COPY } from "../../data/placements";
import { useDraggableWall } from "../../hooks/useDraggableWall";
import { useMagnetic } from "../../hooks/useMagnetic";
import OfferCard from "../ui/OfferCard";
import Words from "../ui/Words";
import "./Hero.css";

export default function Hero() {
  const { cards, planeW, planeH } = useMemo(() => buildOfferWall(), []);
  const { frameRef, planeRef, recentre } = useDraggableWall(planeW, planeH);
  const magA = useMagnetic(0.5);
  const magB = useMagnetic(0.4);

  return (
    <header className="hero" id="top">
      <div
        className="wall"
        ref={frameRef}
        tabIndex={0}
        role="region"
        aria-label="A draggable wall of RV University placement offers. Use arrow keys to pan."
        data-lenis-prevent
      >
        <div className="wall-atmos" aria-hidden="true" />
        <div className="plane" ref={planeRef} style={{ width: planeW, height: planeH }}>
          {cards.map((c, i) => (
            <div className="ocard-in" style={{ "--i": i }} key={c.id}>
              <OfferCard card={c} />
            </div>
          ))}
        </div>

        <div className="wall-copy">
          <span className="mono hero-kicker">{COPY.eyebrow}</span>
          <h1 className="serif hero-h1">
            <Words text={COPY.heroLead} as="span" className="l1" />
            <Words text={COPY.heroTrail} as="span" className="l2" delay={260} hi={new Set([1, 2])} />
          </h1>
          <p className="hero-lede rise">{COPY.heroSub}</p>
          <div className="hero-actions">
            <a className="btn magnetic" ref={magA} href="#recruit">Recruit now <span className="arrow">→</span></a>
            <a className="btn ghost magnetic" ref={magB} href="#record">See the record</a>
          </div>
        </div>

        <div className="wall-hud">
          <span className="pulse" aria-hidden="true" />
          <span className="mono">Drag the wall — every card is one real offer</span>
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
  "425 OFFERS FACILITATED", "250+ RECRUITERS", "₹43.5 LPA HIGHEST", "1,600+ GRADUATES",
  "6 SCHOOLS", "MNC · GCC · TECH", "CONSULTING · FINANCIAL · STARTUP",
];

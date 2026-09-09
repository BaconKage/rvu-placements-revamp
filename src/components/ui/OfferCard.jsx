import "./OfferCard.css";

export default function OfferCard({ card }) {
  const { peak, tier, rot, x, y, sector, prog, amt, who } = card;
  const mono = (who || prog).replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "RV";
  return (
    <article
      className={`ocard ${peak ? "peak" : tier}`}
      style={{ left: x, top: y, transform: `rotate(${rot}deg)` }}
      data-hot
    >
      <span className="ocard-corner" aria-hidden="true" />
      <div className="ocard-top">
        <span className="ocard-mono">{mono}</span>
        <span className="ocard-sector">{peak ? "HIGHEST" : sector}</span>
      </div>
      <div className="ocard-amt num">
        ₹{amt}<small>LPA</small>
      </div>
      <div className="ocard-prog">{prog}</div>
      <div className="ocard-slot">
        <span className="dot" />{who || "Company"}
      </div>
    </article>
  );
}

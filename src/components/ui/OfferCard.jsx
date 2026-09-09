export default function OfferCard({ card }) {
  const { peak, tier, rot, x, y, sector, prog, amt, who } = card;
  return (
    <article
      className={`ocard ${peak ? "peak" : tier}`}
      style={{ left: x, top: y, transform: `rotate(${rot}deg)` }}
    >
      <div className="ocard-top">
        <span className="ocard-sector">{peak ? "Highest · Technology" : sector}</span>
        <span className="ocard-dot" />
      </div>
      <div className="ocard-amt num">
        ₹{amt}
        <small>LPA</small>
      </div>
      <div className="ocard-prog">{prog}</div>
      <div className="ocard-slot">
        <span>{who || "Company"}</span>
      </div>
    </article>
  );
}

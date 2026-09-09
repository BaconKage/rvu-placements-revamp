import "./OfferCard.css";

export default function OfferCard({ card }) {
  const { feat, tier, rot, x, y, sector, co, role, type, via } = card;
  const mono = co.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "RV";
  return (
    <article
      className={`ocard ${feat ? "feat" : tier}`}
      style={{ left: x, top: y, transform: `rotate(${rot}deg)` }}
      data-hot
    >
      <span className="ocard-corner" aria-hidden="true" />
      <div className="ocard-top">
        <span className="ocard-mono">{mono}</span>
        <span className="ocard-via">{via}</span>
      </div>
      <div className="ocard-co serif">{co}</div>
      <div className="ocard-role">{role}</div>
      <div className="ocard-slot">
        <span className="dot" />{type}<span className="ocard-sector">{sector}</span>
      </div>
    </article>
  );
}

// The CAR received-stamp that lands on the letter after a successful submit.
export default function Stamp({ refNo, date }) {
  return (
    <div className="rd-stamp" role="img" aria-label={`Received by Corporate and Alumni Relations, reference ${refNo}`}>
      <span className="rd-stamp-ring">
        <span className="rd-stamp-top">Corporate &amp; Alumni Relations</span>
        <span className="rd-stamp-word">Received</span>
        <span className="rd-stamp-date">{date}</span>
        <span className="rd-stamp-ref">{refNo}</span>
        <span className="rd-stamp-bottom">RV University · Bengaluru</span>
      </span>
    </div>
  );
}

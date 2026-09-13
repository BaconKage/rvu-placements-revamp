// The stamp that lands on the letter once it is signed.
// Sent: CAR's "Received" stamp, only after the endpoint confirmed receipt.
// Demo: a "Draft · not sent" stamp, so the letter never looks delivered.
export default function Stamp({ refNo, date, demo }) {
  if (demo) {
    return (
      <div className="rd-stamp demo" role="img" aria-label="Draft letter, not sent to Corporate and Alumni Relations">
        <span className="rd-stamp-ring">
          <span className="rd-stamp-top">Demo · not sent</span>
          <span className="rd-stamp-word">Draft</span>
          <span className="rd-stamp-date">{date}</span>
          <span className="rd-stamp-bottom">Email it to CAR to register</span>
        </span>
      </div>
    );
  }
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

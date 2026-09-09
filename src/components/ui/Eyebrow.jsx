export default function Eyebrow({ idx, children }) {
  return (
    <div className="eyebrow">
      {idx && <span className="idx">{idx}</span>}
      <span className="mono">{children}</span>
      <span className="line" />
    </div>
  );
}

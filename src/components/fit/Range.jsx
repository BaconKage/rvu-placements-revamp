// A labelled range control in the Fit Space style: label · track · value.
export default function Range({ label, value, onChange, min = 0, max = 1, step = 0.01, format, hint, compact }) {
  const shown = format ? format(value) : value.toFixed(2);
  if (compact) {
    return (
      <label className="fs-trow">
        <span className="fs-tn">{label}</span>
        <input className="fs-range" type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(+e.target.value)} aria-label={label} />
        <span className="fs-tv">{shown}</span>
      </label>
    );
  }
  return (
    <label className="fs-ctl">
      <span className="fs-ctl-top">
        <span className="fs-lbl">{label}</span>
        <span className="fs-ctl-v">{shown}</span>
      </span>
      <input className="fs-range" type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)} />
      {hint && <span className="fs-hint">{hint}</span>}
    </label>
  );
}

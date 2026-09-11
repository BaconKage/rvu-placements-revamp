import { useCanvas, cssVar, fitCanvas } from "../../hooks/useCanvas";
import { spd, wavelengthRgb } from "../../lib/fitModel";

// The profile as light: each skill is a Gaussian lobe at its wavelength.
export default function SpectrumCanvas({ v, height = 44, label }) {
  const [ref] = useCanvas((c) => {
    const W = Math.round(c.clientWidth || 300), H = height;
    const ctx = fitCanvas(c, W, H);
    let peak = 0.001;
    for (let l = 400; l <= 700; l += 2) peak = Math.max(peak, spd(v, l));
    for (let x = 0; x < W; x++) {
      const l = 400 + (x / W) * 300;
      const amp = spd(v, l) / peak;
      const rgb = wavelengthRgb(l);
      const f = 0.1 + 0.9 * Math.pow(amp, 1.35);
      ctx.fillStyle = `rgb(${Math.round(rgb[0] * f)},${Math.round(rgb[1] * f)},${Math.round(rgb[2] * f)})`;
      ctx.fillRect(x, 0, 1, H);
    }
    ctx.beginPath();
    for (let x = 0; x <= W; x++) {
      const l = 400 + (x / W) * 300;
      const y = H - 2 - (spd(v, l) / peak) * (H - 8);
      if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.strokeStyle = cssVar("--card"); ctx.lineWidth = 2.6; ctx.globalAlpha = 0.7; ctx.stroke();
    ctx.strokeStyle = cssVar("--ink"); ctx.lineWidth = 1; ctx.globalAlpha = 0.9; ctx.stroke();
    ctx.globalAlpha = 1;
  });

  return (
    <div className="fs-spec">
      <canvas ref={ref} className="fs-spec-canvas" role="img" aria-label={label} />
      <div className="fs-spec-cap"><span>420 nm</span><span>540</span><span>660 nm</span></div>
    </div>
  );
}

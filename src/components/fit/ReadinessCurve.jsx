import { useCanvas, cssVar, fitCanvas } from "../../hooks/useCanvas";
import { readiness } from "../../lib/fitModel";

const SPAN = 12; // months on the x-axis

export default function ReadinessCurve({ C, r0, kappa, t }) {
  const [ref] = useCanvas((c) => {
    const W = Math.round(c.clientWidth || 600), H = Math.max(240, Math.round(W * 0.46));
    const ctx = fitCanvas(c, W, H);
    const L = 50, R = 16, T = 16, B = 32, pw = W - L - R, ph = H - T - B;
    const opts = { r0, kappa };

    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = cssVar("--slate-3");
    ctx.strokeStyle = cssVar("--line");
    ctx.lineWidth = 1;
    for (let p = 0; p <= 1.0001; p += 0.25) {
      const y = T + ph * (1 - p);
      ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(L + pw, y); ctx.stroke();
      ctx.textAlign = "right"; ctx.fillText(p.toFixed(2), L - 9, y + 4);
    }
    ctx.textAlign = "center";
    for (let m = 0; m <= SPAN; m += 2) {
      const x = L + pw * (m / SPAN);
      ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, T + ph); ctx.stroke();
      ctx.fillText(m === SPAN ? `${SPAN} mo` : String(m), x, T + ph + 19);
    }

    const curve = (Cv, color, width, dash) => {
      ctx.save(); ctx.beginPath(); ctx.setLineDash(dash || []);
      for (let i = 0; i <= 240; i++) {
        const tm = (i / 240) * SPAN, xx = L + pw * (tm / SPAN), yy = T + ph * (1 - readiness(Cv, tm, opts));
        if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
      }
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(); ctx.restore();
    };
    [0.25, 0.5, 0.75].forEach((Cv) => curve(Cv, cssVar("--line-2"), 1.4, [4, 4]));
    const col = cssVar("--bronze");
    curve(C, col, 2.6);

    const x = L + pw * (t / SPAN), P = readiness(C, t, opts), y = T + ph * (1 - P);
    ctx.save();
    ctx.setLineDash([3, 3]); ctx.strokeStyle = cssVar("--slate-3");
    ctx.beginPath(); ctx.moveTo(x, T + ph); ctx.lineTo(x, y); ctx.stroke();
    ctx.restore();
    ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = cssVar("--card"); ctx.stroke();

    ctx.textAlign = "left";
    ctx.font = '500 12px "IBM Plex Mono", monospace';
    const lbl = `P = ${P.toFixed(3)} by ${t.toFixed(1)} mo`;
    const tx = Math.min(x + 11, L + pw - 150), ty = Math.min(T + ph - 8, Math.max(T + 14, y + 20));
    ctx.lineWidth = 3; ctx.strokeStyle = cssVar("--card"); ctx.strokeText(lbl, tx, ty);
    ctx.fillStyle = cssVar("--ink"); ctx.fillText(lbl, tx, ty);

    ctx.save();
    ctx.translate(14, T + ph / 2); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center"; ctx.fillStyle = cssVar("--slate-3");
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillText("P(ready by t)", 0, 0);
    ctx.restore();
  });

  return <canvas ref={ref} className="fs-curve" role="img" aria-label="Probability of being offer-ready over twelve months" />;
}

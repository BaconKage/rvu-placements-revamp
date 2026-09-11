import { useCanvas, cssVar, fitCanvas, parseHex, mixRgb } from "../../hooks/useCanvas";
import { normWeights, gapTerm, profileColour } from "../../lib/fitModel";

const G = 160; // field resolution

// Every "you" across two skills, the other four held where you are now.
export default function FitField({ student, role, axX, axY, k, c0, floors, asymmetric }) {
  const [ref] = useCanvas((c) => {
    const size = Math.round(c.clientWidth || 480);
    const ctx = fitCanvas(c, size, size);
    const lo = parseHex(cssVar("--field-lo")), hi = parseHex(cssVar("--field-hi"));
    const ink = parseHex(cssVar("--ink"));
    const w = normWeights(role.w);
    const px = axX, py = axY;

    let fixed = 0;
    for (let i = 0; i < student.length; i++) {
      if (i === px || i === py) continue;
      const e = gapTerm(student[i], role.need[i], asymmetric);
      fixed += w[i] * e * e;
    }
    const Cval = (vx, vy) => {
      const ex = gapTerm(vx, role.need[px], asymmetric), ey = gapTerm(vy, role.need[py], asymmetric);
      return Math.exp(-k * (fixed + w[px] * ex * ex + w[py] * ey * ey));
    };

    const img = ctx.createImageData(G, G);
    for (let gy = 0; gy < G; gy++) {
      const vy = 1 - (gy + 0.5) / G;
      const oky = vy >= floors[py];
      for (let gx = 0; gx < G; gx++) {
        const vx = (gx + 0.5) / G;
        const okx = vx >= floors[px];
        let col = mixRgb(lo, hi, Math.pow(Cval(vx, vy), 2.2));
        if (!(okx && oky)) {
          // below a floor: wash out toward the ground and hatch
          col = mixRgb(col, lo, 0.62);
          if ((gx + gy) % 8 < 2) col = mixRgb(col, ink, 0.16);
        }
        const o = (gy * G + gx) * 4;
        img.data[o] = col[0]; img.data[o + 1] = col[1]; img.data[o + 2] = col[2]; img.data[o + 3] = 255;
      }
    }
    const off = document.createElement("canvas");
    off.width = G; off.height = G;
    off.getContext("2d").putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, size, size);

    // C0 contour by grid crossings
    const step = size / G;
    ctx.save();
    ctx.setLineDash([5, 4]); ctx.lineWidth = 1.6; ctx.strokeStyle = cssVar("--thresh");
    ctx.beginPath();
    for (let gy = 0; gy < G; gy++) {
      for (let gx = 0; gx < G; gx++) {
        const vx = (gx + 0.5) / G, vy = 1 - (gy + 0.5) / G;
        const here = Cval(vx, vy) >= c0;
        if (gx < G - 1 && here !== (Cval(vx + 1 / G, vy) >= c0)) { ctx.moveTo((gx + 1) * step, gy * step); ctx.lineTo((gx + 1) * step, (gy + 1) * step); }
        if (gy < G - 1 && here !== (Cval(vx, vy - 1 / G) >= c0)) { ctx.moveTo(gx * step, (gy + 1) * step); ctx.lineTo((gx + 1) * step, (gy + 1) * step); }
      }
    }
    ctx.stroke();
    ctx.restore();

    // floor guide lines
    ctx.save();
    ctx.strokeStyle = cssVar("--slate-3"); ctx.globalAlpha = 0.6; ctx.lineWidth = 1;
    if (floors[px] > 0) { const X = floors[px] * size; ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, size); ctx.stroke(); }
    if (floors[py] > 0) { const Y = (1 - floors[py]) * size; ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(size, Y); ctx.stroke(); }
    ctx.restore();

    const mark = (vx, vy, fill, label, square) => {
      const X = vx * size, Y = (1 - vy) * size;
      ctx.beginPath();
      if (square) ctx.rect(X - 6, Y - 6, 12, 12); else ctx.arc(X, Y, 7, 0, Math.PI * 2);
      ctx.fillStyle = fill; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = cssVar("--ink"); ctx.stroke();
      ctx.font = '500 12px "IBM Plex Mono", monospace';
      const tx = Math.min(X + 12, size - 44), ty = Math.max(16, Y - 10);
      ctx.lineWidth = 3; ctx.strokeStyle = cssVar("--card"); ctx.strokeText(label, tx, ty);
      ctx.fillStyle = cssVar("--ink"); ctx.fillText(label, tx, ty);
    };
    mark(role.need[px], role.need[py], cssVar("--card"), "Role", true);
    mark(student[px], student[py], profileColour(student), "You");
  });

  return (
    <canvas
      ref={ref}
      className="fs-field"
      role="img"
      aria-label="Fit field: brighter means a stronger fit for the selected role across the two chosen skills"
    />
  );
}

// ==========================================================================
// Recruiter wall — the cards on the curved, drag/scroll-to-explore wall.
// Every "hired" card is a real offer from OFFERS; "pipeline" cards are the
// UPCOMING recruiters. 36 + 20 = 56 cards = 14 columns × 4 rows.
// ==========================================================================
import { OFFERS, UPCOMING, DOMAINS } from "./placements";

const ALIAS = { "Dell Technologies": "Dell", "Skyworks Solutions": "Skyworks" };
export const domainOf = (co) => DOMAINS[co] ?? DOMAINS[ALIAS[co]];
export const rolesFor = (co) => OFFERS.filter((o) => o.co === co).map((o) => o.role);

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// a small teaser wall: just the named hired companies, two rows offset by half
// so a column never shows the same company twice
export function buildPeek(cos, rows = 2) {
  const cols = cos.length;
  const cards = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const o = OFFERS.find((x) => x.co === cos[(c + r * Math.ceil(cols / 2)) % cols]);
      if (!o) continue;
      cards.push({
        kind: "hired", co: o.co, title: o.role, sector: o.sector, type: o.type, via: o.via,
        id: `peek-${r}-${c}`, col: c, row: r,
      });
    }
  }
  return { cards, cols, rows };
}

export function buildWall(cols = 14, rows = 4, seed = 2026) {
  const rnd = mulberry32(seed);
  const hired = OFFERS.map((o) => ({
    kind: "hired", co: o.co, title: o.role, sector: o.sector, type: o.type, via: o.via, feat: !!o.feat,
  }));
  const pipeline = UPCOMING.map((co) => ({
    kind: "pipeline", co, title: co, sector: "Upcoming", type: "Upcoming drive", via: "CAR",
  }));
  const shuffle = (list) => {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  // pipeline cards on a staggered diagonal so they never sit side by side;
  // featured offers take the hired slots nearest the starting view
  const isPipe = (r, c) => (c + 2 * r) % 3 === 0 || (r === 2 && c === cols - 1);
  const mid = Math.floor(cols / 2);
  const centre = new Set([`1:${mid - 1}`, `2:${mid - 1}`, `2:${mid}`, `1:${mid + 1}`]);
  const pipeQ = shuffle(pipeline);
  const hiredQ = shuffle(hired);
  const feats = hiredQ.filter((h) => h.feat || h.co === "Société Générale");
  const rest = hiredQ.filter((h) => !feats.includes(h));

  const pool = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const next = isPipe(r, c)
        ? pipeQ.shift() ?? rest.shift() ?? feats.shift()
        : centre.has(`${r}:${c}`) && feats.length
          ? feats.shift()
          : rest.shift() ?? feats.shift() ?? pipeQ.shift();
      if (next) pool.push(next);
    }
  }

  const cards = pool.map((c, i) => ({
    ...c,
    id: `${c.kind}-${c.co}-${i}`,
    col: i % cols,
    row: Math.floor(i / cols),
  }));
  return { cards, cols, rows };
}

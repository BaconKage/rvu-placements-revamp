// ==========================================================================
// All figures below are taken from the placements page currently published on
// rvu.edu.in/placements. Recruiter names are intentionally NOT invented — the
// offer cards carry a placeholder slot that Corporate & Alumni Relations fills.
// Aviatrix is the only named recruiter because RVU itself publishes it as the
// source of the ₹43.5 LPA offer.
// ==========================================================================

export const HEADLINE = {
  offers: 425,
  highest: 43.5,          // LPA, Aviatrix
  organisations: 250,     // "250+"
  eligible: 1608,
  multiOffer: 25,         // % of placed students with >1 offer
  minOffer: 4,            // LPA, lowest recorded
};

export const STATS = [
  { v: "₹43.5", unit: "LPA", k: "Highest package", note: "The highest annual compensation offered during the year.", hero: true },
  { v: "425", unit: "", k: "Offers facilitated", note: "CAR facilitated over 400 placement offers." },
  { v: "250", unit: "+", k: "Recruiting organisations", note: "MNCs, GCCs, tech, consulting, financial, startups." },
  { v: "1,600", unit: "+", k: "Industry-ready graduates", note: "A multidisciplinary talent pool." },
  { v: "6", unit: "", k: "Schools eligible", note: "Engineering to Liberal Arts." },
];

// School → programmes → eligible headcount (as published)
export const SCHOOLS = [
  { name: "School of Computer Science & Engineering", programmes: [
    { p: "B.Tech (Hons.)", n: 547 },
    { p: "B.Sc (Hons.)", n: 172 },
    { p: "M.Tech", n: 18 },
  ]},
  { name: "School of Economics & Business", programmes: [
    { p: "MBA", n: 177 },
    { p: "B.Com (Hons.)", n: 170 },
    { p: "BBA (Hons.)", n: 162 },
    { p: "M.Sc Economics", n: 16 },
    { p: "B.Sc Economics", n: 4 },
  ]},
  { name: "School of Design & Innovation", programmes: [
    { p: "B.Des (Hons.)", n: 123 },
    { p: "M.Des", n: 34 },
  ]},
  { name: "School of Law", programmes: [
    { p: "B.Sc Criminology & Cyber Law", n: 70 },
    { p: "LL.M", n: 35 },
  ]},
  { name: "School of Liberal Arts & Sciences", programmes: [
    { p: "B.Sc Psychology", n: 30 },
    { p: "M.Sc Psychology", n: 23 },
    { p: "B.A Politics & Int’l Relations", n: 4 },
    { p: "B.Sc Environmental Science", n: 2 },
  ]},
  { name: "School of Film, Media & Creative Arts", programmes: [
    { p: "B.Sc Filmmaking", n: 4 },
  ]},
];
export const COHORT_TOTAL = 1608;

// Salary distribution — read from the published chart, rounded. Approximate.
export const SPREAD = [
  { band: "₹20–33 LPA", n: 20, hint: "The top of the sheet." },
  { band: "₹10–20 LPA", n: 45, hint: "The strong middle." },
  { band: "Below ₹10 LPA", n: 85, hint: "The broad base." },
];
export const SPREAD_PEAK = { band: "₹43.5 LPA", n: 1, who: "Aviatrix" };

export const SECTORS = ["MNC", "GCC", "TECHNOLOGY", "CONSULTING", "FINANCIAL", "STARTUP"];

// The five gates a student passes — a real ordered sequence, so it is numbered.
export const PROCESS = [
  { h: "Register with CAR", p: "Registration & Declaration Form filed with Corporate & Alumni Relations. Nothing proceeds without it." },
  { h: "Pre-placement training", p: "Domain & technical training, soft skills, behavioural and networking intelligence. 80% attendance is mandatory." },
  { h: "Clear eligibility", p: "No academic backlogs. No pending disciplinary cases. Internship or capstone complete." },
  { h: "Sit the drives", p: "250+ organisations run on campus. Apply only to roles you would genuinely join." },
  { h: "Honour the offer", p: "An accepted offer is final. Concerns go to CAR, not to the recruiter." },
];

export const INTERNSHIPS = [
  "Summer Internship", "Winter Internship", "Live Projects",
  "Industry Mentoring", "Capstone Projects", "International Placements",
];

export const CONTACT = {
  office: "Corporate & Alumni Relations",
  lines: ["5th Floor, D Block, RV Vidyanikethan Post", "8th Mile, Mysuru Road, Bengaluru 560059"],
  email: "placements@rvu.edu.in",
};

// Programme labels used to populate the offer wall (real programmes only).
const WALL_PROGRAMMES = [
  "B.Tech (Hons.) — CSE", "B.Tech (Hons.) — CSE", "B.Tech (Hons.) — CSE",
  "B.Sc (Hons.) — CS", "B.Sc (Hons.) — CS", "M.Tech",
  "MBA", "MBA", "BBA (Hons.)", "B.Com (Hons.)", "B.Com (Hons.)",
  "M.Sc Economics", "B.Des (Hons.)", "M.Des", "B.Sc Psychology",
  "M.Sc Psychology", "B.Sc Criminology", "LL.M", "B.Sc Filmmaking",
];

// deterministic PRNG so the wall is identical on every load
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// package bands sampled in proportion to the published distribution
function buildBag() {
  const bag = [];
  for (let i = 0; i < 5; i++) bag.push("20–33");
  for (let i = 0; i < 11; i++) bag.push("10–20");
  for (let i = 0; i < 18; i++) bag.push("4–10");
  return bag;
}

export function buildOfferWall(cols = 7, rows = 6, seed = 20250915) {
  const rnd = mulberry32(seed);
  const bag = buildBag();
  // shuffle
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  const CELL_W = 300, CELL_H = 272;
  const cards = [];
  let bi = 0, peakPlaced = false;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // leave the centre open for hero copy
      // keep a small breathing hole dead-centre; cards still frame the copy
      if (c === 3 && (r === 2 || r === 3)) continue;
      const peak = !peakPlaced && r === 2 && c === 5;
      if (peak) peakPlaced = true;
      const depth = rnd(); // 0 far .. 1 near
      cards.push({
        id: `${r}-${c}`,
        peak,
        x: Math.round(c * CELL_W + 24 + rnd() * 48),
        y: Math.round(r * CELL_H + 20 + rnd() * 46),
        rot: +(rnd() * 7 - 3.5).toFixed(2),
        depth,
        tier: depth < 0.28 ? "far" : depth < 0.56 ? "mid" : "near",
        sector: peak ? "TECHNOLOGY" : SECTORS[Math.floor(rnd() * SECTORS.length)],
        prog: peak ? "B.Tech (Hons.) — CSE" : WALL_PROGRAMMES[Math.floor(rnd() * WALL_PROGRAMMES.length)],
        amt: peak ? "43.5" : bag[bi++ % bag.length],
        who: peak ? "Aviatrix" : null,
      });
    }
  }
  return { cards, planeW: cols * CELL_W, planeH: rows * CELL_H };
}

// One dot per offer, positioned by package value. Sampled to match the
// published distribution: ~85 below ₹10, ~45 in ₹10–20, ~20 in ₹20–33, plus
// the single ₹43.5 peak. Deterministic.
export function buildSwarm(seed = 4242) {
  const rnd = mulberry32(seed);
  const dots = [];
  const push = (lo, hi, count, band) => {
    for (let i = 0; i < count; i++) {
      const v = +(lo + rnd() * (hi - lo)).toFixed(1);
      dots.push({ v, band });
    }
  };
  push(4, 10, 85, "base");
  push(10, 20, 45, "mid");
  push(20, 33, 20, "top");
  dots.push({ v: 43.5, band: "peak", who: "Aviatrix" });
  return dots;
}

// ---- Verbatim copy from rvu.edu.in/placements ----
export const COPY = {
  eyebrow: "RV University · Bengaluru · Placements",
  heroLead: "Empowering Industry Innovators",
  heroTrail: "with Top-Tier Talent",
  heroSub:
    "Access a multidisciplinary talent pool of 1,600+ industry-ready graduates trained in cutting-edge technologies.",
  tagline: "Empowering Industry Innovators with Top-Tier Talent",
  carIntro:
    "The Corporate & Alumni Relations office is the university's primary interface between students, industry, alumni, startups and academic schools — managing the recruitment ecosystem and student employability.",
};

// "Why Recruit at RV University" — verbatim names + descriptions
export const WHY = [
  { h: "Industry-Ready Talent", p: "Hire students equipped with strong academic foundations and practical, industry-relevant skills." },
  { h: "Diverse Talent Pool", p: "Recruit from multidisciplinary programs including Engineering, Business, Design, Economics, Media, and Liberal Arts." },
  { h: "Industry-Integrated Learning", p: "Students gain hands-on experience through internships, live projects, capstones, and experiential learning." },
  { h: "Future-Focused Curriculum", p: "Graduates are prepared with digital, analytical, entrepreneurial, and leadership capabilities for evolving workplaces." },
  { h: "Seamless Recruitment Support", p: "Our Corporate & Alumni Relations (CAR) team ensures a smooth and efficient hiring process from start to finish." },
  { h: "Strong Academic Excellence", p: "Backed by the legacy of the RV Group, the university nurtures high-performing, ethical, and responsible professionals." },
];

// Student Eligibility — verbatim requirements
export const ELIGIBILITY = [
  "No academic backlogs at the time of registering for placement drives.",
  "Minimum 80% attendance in mandatory pre-placement training.",
  "Submission of the Placement Registration & Declaration Form.",
  "Completion of required experiential components (internship / immersion / capstone).",
  "Compliance with all company-specific eligibility criteria.",
  "No pending disciplinary case with STDC.",
];

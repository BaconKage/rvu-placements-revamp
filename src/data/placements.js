// ==========================================================================
// RVU Placements — data.
// Statistics, programme names, benefit copy and eligibility rules are taken
// from rvu.edu.in/placements. Company names, roles and packages are taken from
// the student-maintained RVU/RVCE 2023-batch placement sheets. Off-campus
// figures are excluded; the wall reflects offers made through the RV group.
// ==========================================================================

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

// ---- Real offers (company-forward; package is secondary) ----
// type: FTE | Intern | Intern → FTE   ·  via: RVU | RVCE
export const OFFERS = [
  { co: "Aviatrix", role: "Cloud Test / SDE", sector: "Tech", type: "Intern → FTE", via: "RVU", feat: true },
  { co: "Société Générale", role: "Cybersecurity Analyst", sector: "Finance", type: "Intern → FTE", via: "RVCE" },
  { co: "Acko", role: "SDE-1", sector: "Fintech", type: "Intern → FTE", via: "RVCE" },
  { co: "Commonwealth Bank", role: "Graduate Engineering", sector: "Finance", type: "FTE", via: "RVCE" },
  { co: "Dell Technologies", role: "Software Engineer", sector: "Tech", type: "Intern → FTE", via: "RVU" },
  { co: "Fractal Analytics", role: "Imagineer", sector: "Data / AI", type: "FTE", via: "RVCE" },
  { co: "EY", role: "Consultant — Tech", sector: "Consulting", type: "Intern → FTE", via: "RVCE" },
  { co: "State Street", role: "Technology Intern", sector: "Finance", type: "Intern → FTE", via: "RVCE" },
  { co: "Presidio", role: "Associate Engineer", sector: "Tech", type: "Intern → FTE", via: "RVCE" },
  { co: "Crestron", role: "Full-Stack Developer", sector: "Tech", type: "Intern → FTE", via: "RVCE" },
  { co: "Baker Hughes", role: "Data / AI Intern", sector: "Energy", type: "Intern → FTE", via: "RVCE", feat: true },
  { co: "Inflection", role: "Software Development Engineer", sector: "Tech", type: "Intern → FTE", via: "RVCE" },
  { co: "Infosys", role: "Specialist Programmer", sector: "Tech", type: "FTE", via: "RVCE" },
  { co: "Thomson Reuters", role: "Software Engineering Intern", sector: "Tech", type: "Intern → FTE", via: "RVU" },
  { co: "Hyperface", role: "SDE Intern (Backend)", sector: "Fintech", type: "Intern → FTE", via: "RVCE" },
  { co: "Whatfix", role: "Solutions Engineer", sector: "Tech", type: "Intern → FTE", via: "RVCE" },
  { co: "Skyworks Solutions", role: "Firmware Engineer", sector: "Semiconductors", type: "FTE", via: "RVCE" },
  { co: "Northern Trust", role: "Analyst SW Engineer", sector: "Finance", type: "FTE", via: "RVU" },
  { co: "Verint", role: "Software Engineer Intern", sector: "Tech", type: "Intern → FTE", via: "RVCE" },
  { co: "Arctic Wolf", role: "Security Intern", sector: "Cybersecurity", type: "Intern", via: "RVCE", feat: true },
  { co: "Haleon", role: "Engineering Trainee", sector: "Healthcare", type: "FTE", via: "RVCE" },
  { co: "Koch", role: "Software Intern", sector: "Industrial", type: "Intern → FTE", via: "RVU" },
  { co: "Netgear", role: "Software Development Intern", sector: "Tech", type: "Intern → FTE", via: "RVCE" },
  { co: "Pega Systems", role: "Intern", sector: "Tech", type: "Intern", via: "RVCE" },
  { co: "Ampcus Cyber", role: "Security Testing", sector: "Cybersecurity", type: "Intern → FTE", via: "RVU" },
  { co: "Sage", role: "Associate Software Engineer", sector: "Tech", type: "FTE", via: "RVCE" },
  { co: "Vymo", role: "Member of Technical Staff", sector: "Tech", type: "Intern → FTE", via: "RVU" },
  { co: "Konovo", role: "Quality Assurance Intern", sector: "Tech", type: "Intern → FTE", via: "RVU" },
  { co: "Siemens Healthineers", role: "Apprenticeship", sector: "HealthTech", type: "Intern → FTE", via: "RVU" },
  { co: "Kinaxis", role: "Associate Developer", sector: "Supply Chain", type: "Intern → FTE", via: "RVCE" },
  { co: "Aon", role: "Software Engineer", sector: "Consulting", type: "FTE", via: "RVCE" },
  { co: "Photon", role: "Apprenticeship", sector: "Tech", type: "Intern → FTE", via: "RVU" },
  { co: "Teamlease", role: "AI Engineer — Graduate", sector: "Tech", type: "FTE", via: "RVU" },
  { co: "Fermedicus", role: "Founder's Office", sector: "Startup", type: "FTE", via: "RVU" },
  { co: "Bhatiyani Astute", role: "Computer Vision Intern", sector: "AI", type: "Intern → FTE", via: "RVU" },
  { co: "O9 Solutions", role: "Consultant", sector: "Supply Chain", type: "FTE", via: "RVCE" },
];

// ---- Recruiter marquee: on campus + in the pipeline ----
export const RECRUITERS = [
  "Aviatrix", "Société Générale", "Acko", "Commonwealth Bank", "Dell", "Fractal Analytics",
  "EY", "State Street", "Presidio", "Baker Hughes", "Inflection", "Infosys", "Thomson Reuters",
  "Hyperface", "Whatfix", "Skyworks", "Northern Trust", "Verint", "Arctic Wolf", "Haleon",
  "Koch", "Netgear", "Pega Systems", "Ampcus Cyber", "Sage", "Vymo", "Siemens", "Kinaxis",
  "Aon", "Crestron", "Cognizant", "TCS", "Coupa", "RingCentral", "ZS Associates", "Juspay",
];
export const UPCOMING = [
  "MSD Global", "Mareana", "Prodapt", "GameBerry", "Red Hat", "Fox", "UsefulBI",
  "NovoNordisk GBS", "Grant Thornton", "Progress", "UCIC", "Offlyn", "SignOff Today",
  "Go Desi", "Skylark Drones", "GyanSys", "Astuto", "MSG Global", "AcceleratorX", "Dover",
];

// ---- Headline stats — breadth first, no salary ceiling ----
export const STATS = [
  { v: "50", unit: "+", k: "Recruiters on campus", note: "MNCs, GCCs, consulting, finance, startups.", hero: true },
  { v: "425", unit: "", k: "Offers facilitated", note: "CAR facilitated over 400 placement offers." },
  { v: "1,600", unit: "+", k: "Industry-ready graduates", note: "A multidisciplinary talent pool." },
  { v: "6", unit: "", k: "Schools eligible", note: "Engineering to Liberal Arts." },
  { v: "25", unit: "%", k: "Held more than one offer", note: "A quarter chose between offers." },
];

// School → programmes → eligible headcount (as published)
export const SCHOOLS = [
  { name: "School of Computer Science & Engineering", programmes: [
    { p: "B.Tech (Hons.)", n: 547 }, { p: "B.Sc (Hons.)", n: 172 }, { p: "M.Tech", n: 18 },
  ]},
  { name: "School of Economics & Business", programmes: [
    { p: "MBA", n: 177 }, { p: "B.Com (Hons.)", n: 170 }, { p: "BBA (Hons.)", n: 162 },
    { p: "M.Sc Economics", n: 16 }, { p: "B.Sc Economics", n: 4 },
  ]},
  { name: "School of Design & Innovation", programmes: [
    { p: "B.Des (Hons.)", n: 123 }, { p: "M.Des", n: 34 },
  ]},
  { name: "School of Law", programmes: [
    { p: "B.Sc Criminology & Cyber Law", n: 70 }, { p: "LL.M", n: 35 },
  ]},
  { name: "School of Liberal Arts & Sciences", programmes: [
    { p: "B.Sc Psychology", n: 30 }, { p: "M.Sc Psychology", n: 23 },
    { p: "B.A Politics & Int’l Relations", n: 4 }, { p: "B.Sc Environmental Science", n: 2 },
  ]},
  { name: "School of Film, Media & Creative Arts", programmes: [
    { p: "B.Sc Filmmaking", n: 4 },
  ]},
];
export const COHORT_TOTAL = 1608;

// "Why Recruit at RV University" — verbatim
export const WHY = [
  { h: "Industry-Ready Talent", p: "Hire students equipped with strong academic foundations and practical, industry-relevant skills." },
  { h: "Diverse Talent Pool", p: "Recruit from multidisciplinary programs including Engineering, Business, Design, Economics, Media, and Liberal Arts." },
  { h: "Industry-Integrated Learning", p: "Students gain hands-on experience through internships, live projects, capstones, and experiential learning." },
  { h: "Future-Focused Curriculum", p: "Graduates are prepared with digital, analytical, entrepreneurial, and leadership capabilities for evolving workplaces." },
  { h: "Seamless Recruitment Support", p: "Our Corporate & Alumni Relations (CAR) team ensures a smooth and efficient hiring process from start to finish." },
  { h: "Strong Academic Excellence", p: "Backed by the legacy of the RV Group, the university nurtures high-performing, ethical, and responsible professionals." },
];

// Student Eligibility — verbatim
export const ELIGIBILITY = [
  "No academic backlogs at the time of registering for placement drives.",
  "Minimum 80% attendance in mandatory pre-placement training.",
  "Submission of the Placement Registration & Declaration Form.",
  "Completion of required experiential components (internship / immersion / capstone).",
  "Compliance with all company-specific eligibility criteria.",
  "No pending disciplinary case with STDC.",
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

// deterministic PRNG so the wall is identical every load
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Lay the real offers out on the draggable plane.
export function buildOfferWall(cols = 7, rows = 6, seed = 20250915) {
  const rnd = mulberry32(seed);
  const CELL_W = 300, CELL_H = 272;
  const cards = [];
  let oi = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c === 3 && (r === 2 || r === 3)) continue; // breathing hole for copy
      const o = OFFERS[oi % OFFERS.length]; oi++;
      const depth = rnd();
      cards.push({
        id: `${r}-${c}`,
        ...o,
        x: Math.round(c * CELL_W + 24 + rnd() * 48),
        y: Math.round(r * CELL_H + 20 + rnd() * 46),
        rot: +(rnd() * 7 - 3.5).toFixed(2),
        depth,
        tier: depth < 0.28 ? "far" : depth < 0.56 ? "mid" : "near",
      });
    }
  }
  return { cards, planeW: cols * CELL_W, planeH: rows * CELL_H };
}

// ---- "Where they landed": anonymised outcomes from the 2023-batch CSE sheet.
// Programme → company · role. No names, no packages.
export const OUTCOMES = [
  { prog: "B.Tech CSE", co: "Société Générale", role: "Cybersecurity Analyst" },
  { prog: "B.Tech CSE", co: "Acko", role: "SDE-1" },
  { prog: "B.Tech CSE", co: "Commonwealth Bank", role: "Graduate Engineering" },
  { prog: "B.Tech CSE", co: "Dell Technologies", role: "Software Engineer" },
  { prog: "B.Tech CSE", co: "Fractal Analytics", role: "Imagineer" },
  { prog: "B.Tech CSE", co: "EY", role: "Consultant — Technology" },
  { prog: "B.Tech CSE", co: "State Street", role: "Technology Intern" },
  { prog: "B.Tech CSE", co: "Presidio", role: "Associate Engineer" },
  { prog: "B.Tech CSE", co: "Aviatrix", role: "Cloud / SDE" },
  { prog: "B.Tech CSE", co: "Baker Hughes", role: "Data & AI" },
  { prog: "B.Tech CSE", co: "Thomson Reuters", role: "Software Engineering Intern" },
  { prog: "B.Tech CSE", co: "Hyperface", role: "SDE Intern" },
  { prog: "B.Tech CSE", co: "Skyworks", role: "Firmware Engineer" },
  { prog: "B.Tech CSE", co: "Northern Trust", role: "Analyst SW Engineer" },
  { prog: "B.Tech CSE", co: "Infosys", role: "Specialist Programmer" },
  { prog: "B.Tech CSE", co: "Crestron", role: "Full-Stack Developer" },
];

// ---- Recruiter directory, grouped by sector (real companies from the sheets) ----
export const RECRUITER_SECTORS = [
  { sector: "Technology & Software", cos: ["Dell", "Presidio", "Crestron", "Netgear", "Pega Systems", "Whatfix", "Sage", "Vymo", "Konovo", "Cognizant", "TCS", "Infosys", "Thomson Reuters", "Teamlease", "Photon"] },
  { sector: "Finance & Fintech", cos: ["Société Générale", "Commonwealth Bank", "State Street", "Northern Trust", "Acko", "Hyperface"] },
  { sector: "Consulting & Analytics", cos: ["EY", "Fractal Analytics", "Aon", "ZS Associates"] },
  { sector: "Cybersecurity", cos: ["Arctic Wolf", "Ampcus Cyber", "Verint"] },
  { sector: "Energy, Industrial & Health", cos: ["Baker Hughes", "Koch", "Haleon", "Siemens Healthineers"] },
  { sector: "Deep-tech & Startups", cos: ["Aviatrix", "Inflection", "O9 Solutions", "Skyworks", "Kinaxis", "Bhatiyani Astute"] },
];

// Rough prestige/recognition order for the recruiter grid (highest first).
// Anything not listed sorts to the end. Names match RECRUITER_SECTORS exactly.
export const REPUTATION = [
  "Dell", "Société Générale", "Commonwealth Bank", "EY", "Cognizant", "TCS",
  "Infosys", "State Street", "Northern Trust", "Baker Hughes", "Siemens Healthineers",
  "Skyworks", "Thomson Reuters", "Acko", "Fractal Analytics", "Aon", "ZS Associates",
  "Kinaxis", "Verint", "Presidio", "Whatfix", "Netgear", "Pega Systems", "Koch",
  "Haleon", "Arctic Wolf", "Crestron", "Sage", "Aviatrix", "Hyperface", "Inflection",
  "O9 Solutions", "Vymo", "Konovo", "Ampcus Cyber", "Teamlease", "Photon", "Bhatiyani Astute",
];

// Lay the (reputation-sorted) recruiters out on a pannable plane — nk.studio
// style: upright cards in a loose, staggered grid you drag to explore.
export function buildRecruiterField(cols = 6, seed = 77) {
  const rank = (co) => { const i = REPUTATION.indexOf(co); return i === -1 ? 999 : i; };
  const list = RECRUITER_SECTORS
    .flatMap((g) => g.cos.map((co) => ({ co, sector: g.sector })))
    .sort((a, b) => rank(a.co) - rank(b.co));
  const rnd = mulberry32(seed);
  const CELL_W = 288, CELL_H = 330;
  const cards = list.map((c, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const stagger = (col % 2) * 46;               // alternate columns ride lower
    const depth = rnd();
    return {
      ...c,
      id: c.co,
      x: Math.round(col * CELL_W + 24 + rnd() * 34),
      y: Math.round(row * CELL_H + stagger + 24 + rnd() * 24),
      tier: depth < 0.3 ? "far" : depth < 0.62 ? "mid" : "near",
    };
  });
  const rows = Math.ceil(list.length / cols);
  return { cards, planeW: cols * CELL_W + 40, planeH: rows * CELL_H + staggerPad() };
  function staggerPad() { return 46 + 120; }
}

// Domains for logo lookup (Clearbit logo API); unknown → monogram fallback.
export const DOMAINS = {
  "Dell": "dell.com", "Société Générale": "societegenerale.com", "Commonwealth Bank": "commbank.com.au",
  "EY": "ey.com", "Cognizant": "cognizant.com", "TCS": "tcs.com", "Infosys": "infosys.com",
  "State Street": "statestreet.com", "Northern Trust": "northerntrust.com", "Baker Hughes": "bakerhughes.com",
  "Siemens Healthineers": "siemens-healthineers.com", "Skyworks": "skyworksinc.com",
  "Thomson Reuters": "thomsonreuters.com", "Acko": "acko.com", "Fractal Analytics": "fractal.ai",
  "Aon": "aon.com", "ZS Associates": "zs.com", "Kinaxis": "kinaxis.com", "Verint": "verint.com",
  "Presidio": "presidio.com", "Whatfix": "whatfix.com", "Netgear": "netgear.com", "Pega Systems": "pega.com",
  "Koch": "kochind.com", "Haleon": "haleon.com", "Arctic Wolf": "arcticwolf.com", "Crestron": "crestron.com",
  "Sage": "sage.com", "Aviatrix": "aviatrix.com", "Hyperface": "hyperface.co", "Inflection": "inflection.io",
  "O9 Solutions": "o9solutions.com", "Vymo": "vymo.com", "Teamlease": "teamlease.com",
};

// ==========================================================================
// Fit Space — skills and role archetypes.
// Role *names* and the recruiters attached to them come from the real OFFERS
// list. The requirement vectors, weights and floors are illustrative dials,
// not data published by CAR or any recruiter.
// ==========================================================================
import { OFFERS } from "./placements";

// Six axes, spread across the visible spectrum so a profile becomes a colour.
export const SKILLS = [
  { key: "code",   name: "Programming & systems",         short: "Programming",   lam: 420 },
  { key: "data",   name: "Data & analytics",              short: "Data",          lam: 468 },
  { key: "design", name: "Design & product thinking",     short: "Design",        lam: 516 },
  { key: "comm",   name: "Communication & client-facing", short: "Communication", lam: 564 },
  { key: "biz",    name: "Business & domain",             short: "Business",      lam: 612 },
  { key: "lead",   name: "Leadership & initiative",       short: "Leadership",    lam: 660 },
];

export const DEFAULT_STUDENT = [0.68, 0.52, 0.4, 0.6, 0.38, 0.5];

// Weights lean on what a role needs most: w_i ∝ 0.15 + need_i².
const weigh = (need) => need.map((x) => +(0.15 + x * x).toFixed(3));

// Real recruiters whose published role matches the archetype.
const hiredBy = (test) => [...new Set(OFFERS.filter(test).map((o) => o.co))];

const ARCHETYPES = [
  {
    id: "sde", name: "Software Engineer / SDE",
    need: [0.85, 0.45, 0.35, 0.5, 0.3, 0.4], floors: [0.6, 0, 0, 0, 0, 0],
    match: (o) => /\bSDE|Software|Development Engineer|Programmer|Technical Staff|Technology Intern|Associate (Software )?Engineer|Graduate Engineering|Associate Developer|SW Engineer/i.test(o.role),
  },
  {
    id: "fullstack", name: "Full-Stack Developer",
    need: [0.8, 0.3, 0.65, 0.45, 0.35, 0.4], floors: [0.55, 0, 0.35, 0, 0, 0],
    match: (o) => /Full-Stack/i.test(o.role),
  },
  {
    id: "security", name: "Cybersecurity Analyst",
    need: [0.7, 0.55, 0.2, 0.45, 0.35, 0.35], floors: [0.5, 0.35, 0, 0, 0, 0],
    match: (o) => o.sector === "Cybersecurity" || /Cyber|Security/i.test(o.role),
  },
  {
    id: "data", name: "Data / AI Engineer",
    need: [0.7, 0.85, 0.3, 0.45, 0.4, 0.35], floors: [0.45, 0.6, 0, 0, 0, 0],
    match: (o) => /Data|AI Engineer|Computer Vision|Imagineer/i.test(o.role),
  },
  {
    id: "consult", name: "Technology Consultant",
    need: [0.45, 0.6, 0.4, 0.85, 0.75, 0.6], floors: [0, 0.3, 0, 0.6, 0.4, 0],
    match: (o) => /Consultant/i.test(o.role),
  },
  {
    id: "solutions", name: "Solutions Engineer",
    need: [0.6, 0.4, 0.45, 0.8, 0.55, 0.45], floors: [0.4, 0, 0, 0.55, 0, 0],
    match: (o) => /Solutions/i.test(o.role),
  },
  {
    id: "firmware", name: "Firmware Engineer",
    need: [0.9, 0.35, 0.2, 0.35, 0.25, 0.3], floors: [0.7, 0, 0, 0, 0, 0],
    match: (o) => /Firmware/i.test(o.role),
  },
  {
    id: "qa", name: "Quality & Test Engineer",
    need: [0.6, 0.45, 0.3, 0.55, 0.3, 0.3], floors: [0.4, 0, 0, 0, 0, 0],
    match: (o) => /Quality|Test/i.test(o.role),
  },
  {
    id: "founders", name: "Founder's Office",
    need: [0.35, 0.55, 0.55, 0.8, 0.85, 0.9], floors: [0, 0, 0, 0.5, 0.5, 0.6],
    match: (o) => /Founder/i.test(o.role),
  },
];

export const ROLES = ARCHETYPES.map(({ match, ...r }) => ({
  ...r,
  w: weigh(r.need),
  recruiters: hiredBy(match),
  illustrative: true,
}));

export const roleById = (id) => ROLES.find((r) => r.id === id) ?? ROLES[0];

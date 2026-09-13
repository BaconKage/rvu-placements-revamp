// ==========================================================================
// Recruiter registration — schema, options and validation.
// Replaces the "Recruit Now" Google Form linked from rvu.edu.in/placements.
// ==========================================================================
import { SCHOOLS, RECRUITER_SECTORS } from "./placements";

export const DRAFT_KEY = "rvu-recruit-draft";

export const EMPTY = {
  org: "", website: "", sector: "", location: "",
  contact: "", designation: "", email: "", phone: "",
  engagement: [],
  roles: [{ title: "", openings: "", ctc: "", place: "" }],
  programmes: [],          // "schoolIndex:programmeIndex"
  cgpa: "", backlogs: false,
  stages: [],              // ordered
  driveDate: "", mode: "", jd: "", notes: "",
  consent: false,
};

export const SECTORS = [...RECRUITER_SECTORS.map((s) => s.sector), "Other"];
export const ENGAGEMENTS = ["Full-time", "Internship", "Intern → FTE", "Live project"];
export const STAGES = ["Online test", "Group discussion", "Technical interview", "Case study", "Portfolio review", "HR interview"];
export const MODES = ["On campus", "Virtual", "Hybrid"];

// School short forms as RVU uses them.
export const SCHOOL_ABBR = {
  "School of Computer Science & Engineering": "SoCSE",
  "School of Economics & Business": "SoEB",
  "School of Design & Innovation": "SDI",
  "School of Law": "SoL",
  "School of Liberal Arts & Sciences": "SoLAS",
  "School of Film, Media & Creative Arts": "SoFMCA",
};

export const SECTIONS = [
  { id: "organisation", label: "Organisation" },
  { id: "contact", label: "Contact" },
  { id: "roles", label: "Roles" },
  { id: "talent", label: "Talent" },
  { id: "process", label: "Process" },
  { id: "drive", label: "Drive" },
];

export function programmeOf(key) {
  const [si, pi] = key.split(":").map(Number);
  const school = SCHOOLS[si];
  const prog = school?.programmes[pi];
  return prog ? { school: school.name, abbr: SCHOOL_ABBR[school.name], p: prog.p, n: prog.n } : null;
}
export const eligibleCount = (keys) => keys.reduce((a, k) => a + (programmeOf(k)?.n ?? 0), 0);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Per-role field keys, built from the role's position in d.roles. The form and
// the letter both use these, so a blank always points at its own role.
export const roleKey = (i, field) => `role-${i}-${field}`;

const isWholePositive = (v) => /^\d+$/.test(String(v).trim()) && Number(v) > 0;

// Local "YYYY-MM-DD" for today, the earliest date a drive can be requested for.
export function todayIso() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
function dateError(iso) {
  if (!iso) return "Pick a preferred date.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || Number.isNaN(new Date(`${iso}T00:00:00`).getTime())) return "Enter a valid date.";
  if (iso < todayIso()) return "Choose today or a later date.";
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() + 2);
  if (new Date(`${iso}T00:00:00`) > limit) return "Choose a date within the next two years.";
  return null;
}

// key -> message. Keys match data-field attributes in the form and the letter.
export function validate(d) {
  const e = {};
  if (!d.org.trim()) e.org = "Add your organisation's name.";
  if (!d.sector) e.sector = "Pick the closest sector.";
  if (!d.contact.trim()) e.contact = "Who should CAR contact?";
  if (!d.designation.trim()) e.designation = "Add their designation.";
  if (!EMAIL.test(d.email.trim())) e.email = "Enter a valid work email.";
  if (d.phone && !/^[+\d][\d\s-]{7,}$/.test(d.phone.trim())) e.phone = "That phone number looks incomplete.";
  if (!d.engagement.length) e.engagement = "Choose at least one type of engagement.";
  d.roles.forEach((r, i) => {
    if (!r.title.trim()) e[roleKey(i, "title")] = i === 0 ? "Name at least one role." : "Name this role, or remove it.";
    if (!isWholePositive(r.openings)) e[roleKey(i, "openings")] = "Enter a whole number of openings (1 or more).";
  });
  if (!d.programmes.length) e.programmes = "Select at least one programme.";
  if (d.cgpa && !(Number(d.cgpa) >= 0 && Number(d.cgpa) <= 10)) e.cgpa = "CGPA is on a 10-point scale.";
  if (!d.stages.length) e.stages = "Add at least one selection stage.";
  const dateErr = dateError(d.driveDate);
  if (dateErr) e.driveDate = dateErr;
  if (!d.mode) e.mode = "Choose how the drive runs.";
  if (!d.consent) e.consent = "Please confirm to submit.";
  return e;
}

// The required parts of the letter, each done when validate() has no error for
// it — so the meter reads full exactly when the form can be submitted.
// Optional fields (city, website, phone, CGPA, JD, notes) never count.
const REQUIRED = [
  (k) => k === "org", (k) => k === "sector", (k) => k === "contact", (k) => k === "designation",
  (k) => k === "email", (k) => k === "engagement", (k) => k.startsWith("role-"),
  (k) => k === "programmes", (k) => k === "stages", (k) => k === "driveDate", (k) => k === "mode",
  (k) => k === "consent",
];
export function completion(d) {
  const keys = Object.keys(validate(d));
  const done = REQUIRED.filter((part) => !keys.some(part)).length;
  return { done, total: REQUIRED.length };
}

export function makeRef() {
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
  return `RVU-CAR-${new Date().getFullYear()}-${tail}`;
}

export const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

// Plain-text summary for the "email a copy" link.
export function summary(d, ref) {
  const progs = d.programmes.map(programmeOf).filter(Boolean).map((p) => `${p.p} (${p.abbr})`).join(", ");
  const roles = d.roles.filter((r) => r.title).map((r) => `- ${r.title} · ${r.openings || "?"} openings${r.ctc ? ` · ${r.ctc}` : ""}${r.place ? ` · ${r.place}` : ""}`).join("\n");
  return [
    `Reference: ${ref}`,
    `Organisation: ${d.org} (${d.sector}${d.location ? `, ${d.location}` : ""})`,
    d.website && `Website: ${d.website}`,
    `Contact: ${d.contact}, ${d.designation} · ${d.email}${d.phone ? ` · ${d.phone}` : ""}`,
    `Engagement: ${d.engagement.join(", ")}`,
    `Roles:\n${roles}`,
    `Programmes: ${progs} — ${eligibleCount(d.programmes)} eligible students`,
    `Criteria: min CGPA ${d.cgpa || "not stated"}; backlogs ${d.backlogs ? "permitted" : "not permitted"}`,
    `Process: ${d.stages.join(" → ")}`,
    `Drive: ${d.mode}, around ${formatDate(d.driveDate)}`,
    d.jd && `JD: ${d.jd}`,
    d.notes && `Notes: ${d.notes}`,
  ].filter(Boolean).join("\n");
}

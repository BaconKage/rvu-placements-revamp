# RV University — Placements (Revamp Concept)

A concept redesign of the RV University placements page, built for the
**RVU Placement Website Revamp Competition**.

**The idea — _The Offer Wall._** The hero isn't a banner, it's the data: a
draggable wall of real offer cards. Drag it, throw it, recentre it. It then
resolves into a quiet, precise document — the record, the cohort ledger, the
salary spread, and the five gates a student passes.

## Design language
Adopted from RV University's own brand tokens and the reference sites studied:

- **Palette** — RVU's published variables: brass `#d0a863`, slate `#233039`,
  ink `#050a09`, on a warm paper ground (never pure white). Light default,
  dark theme via the toggle.
- **Type** — **Fraunces** (display + numerals), **Sora** (wordmark),
  **Manrope** (body), **IBM Plex Mono** (labels/data) — the same family the
  RVU club site (RVibe) uses.
- **Motion** — CSS keyframes + `IntersectionObserver` reveals, one rAF-driven
  draggable plane. No animation libraries. ~53 kB gzip JS.

## Data & honesty
Every figure comes from the placements page currently on `rvu.edu.in`.
Recruiter names are intentionally left as **empty slots** the office fills —
the wall is a template, not a claim about who recruits here. Aviatrix is the
only named recruiter because RVU itself publishes it as the ₹43.5 LPA source.
Two published discrepancies are surfaced on the page for CAR to reconcile.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

## Structure
```
src/
  data/placements.js      all published figures + the offer-wall generator
  hooks/                  useReveal · useCountUp · useDraggableWall · useTheme
  components/
    Preloader · Nav
    sections/             Hero · Record · Kinetic · Cohort · Spread · Process · Recruit
    ui/                   OfferCard · Eyebrow
  styles/                 tokens.css · base.css
```

# RV University Placements (Revamp)

A redesign of the RV University placements website, built for the
**RVU Placement Website Revamp Competition**.

**Live:** https://rvu-placements-revamp.vercel.app

## Pages

| Route | What it is |
| --- | --- |
| `/` | Front door. RVU logo, a short intro, and two paths: Student / Parent or Recruiter. |
| `/students` | Everything a student or parent needs: eligibility, pre-placement training and conduct, internships, the numbers, who recruits, the 2024 cohort, and governance. |
| `/partners` | For recruiters: why hire from RVU, the talent pool, how to engage, current recruiters, and contact. |
| `/recruiters` | "Who recruits": a curved, draggable wall of recruiter cards. Click a card to zoom in. |
| `/forms` | Recruiter registration form. |

`/parents` redirects to `/students`, since the two audiences share one page.

## Design

- **Colours:** RVU's own palette only: gold `#d0a863` and navy slate `#233039`
  on a warm paper ground. There's a light and dark theme (toggle in the nav).
- **Type:** Hanken Grotesk for headings, IBM Plex Sans for body text, IBM Plex
  Mono for labels, and Newsreader on the recruiter wall. The home page uses
  Playfair Display and Cantarell, matching rvu.edu.in.
- **Imagery:** campus photos and line-art illustrations, with separate light
  and dark versions where it matters. Only the current theme's image is loaded.
- **Motion:** Lenis smooth scrolling, scroll reveals, and the recruiter wall.
  No animation libraries.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build
```

Performance checks (keep these passing):

```bash
node --experimental-vm-modules --test tests/animation-performance.test.mjs
```

See [PERFORMANCE.md](PERFORMANCE.md) for what was optimised and why. In short,
the wall's animation loop sleeps when it's off-screen, hidden or settled, and
the audience pages are lazy-loaded.

## Project structure

```
src/
  App.jsx                 routes (audience pages are lazy-loaded)
  pages/                  Home · Students · Partners · RecruiterWall · Forms
  components/
    Nav · Preloader · ScrollManager · Atmosphere
    sections/             page sections: Process, Record, Cohort, Recruit,
                          WhyRecruit, Recruiters (the wall), Outcomes, Audience
    forms/                recruiter registration form parts
    ui/                   Eyebrow · Words · Logo · OfferCard
  hooks/                  useTheme · useSmoothScroll · useReveal · useCountUp
                          useMagnetic · useCurvedWall · useDraggableWall
  data/                   placements.js · recruiterWall.js · recruitForm.js
  styles/                 tokens.css (colours, type) · base.css
public/                   favicon
tests/                    animation performance tests
```

Deployed on Vercel. `vercel.json` rewrites every path to `index.html` so
client-side routes work on refresh.

## Data

Statistics, programme names, eligibility rules, training and governance text
are taken from [rvu.edu.in/placements](https://rvu.edu.in/placements/).
Company names, roles and channels come from the student-maintained RVU / RVCE
2023-batch placement sheets. This is a design concept, not an official
university site.

## Team

- **Shubhang Srinivas Varda** ([@BaconKage](https://github.com/BaconKage))
- **Rohit Jaysheel Diggi** ([@Rohx24](https://github.com/Rohx24))

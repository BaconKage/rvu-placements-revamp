# Performance pass — 12 September 2026

Baseline: `0cb6e4f`, pulled with `git pull --ff-only mine main` from
https://github.com/BaconKage/rvu-placements-revamp.

The existing colours, typography, text, imagery, recruiter data and animation
effects are preserved. The responsive fixes make existing content reachable;
the suggestions below have not been applied to the website. No dependencies
were added or upgraded.

## Changes

- Fixed the recruiter wall's opacity cache. A Float32 cache could never equal
  some rounded JavaScript numbers, causing repeated writes of unchanged
  opacity. Integer steps retain exactly the same displayed opacity.
- Reused row/column calculations and skipped unchanged transform strings.
  Drift, fly-in, curvature, hover, inertia, zoom, blur and dust remain enabled.
- Stabilized card refs so updating the explored count or opening a detail
  does not invalidate every card's React memoization.
- Stopped the wall's JavaScript loop once an open detail settles and when the
  wall is outside the viewport or the tab is hidden. Interactions restart it.
  Off-screen dust pauses too; off-screen cards release their `will-change` hint.
- Removed an unused root-level scroll-velocity CSS variable, avoiding inherited
  style updates across the entire page on scroll.
- Batched timeline geometry reads before style writes, skipped unchanged
  states, and limited scrolling work to the visible section.
- Count-up components now update React only when the displayed number changes
  and cancel their animation on unmount. Effect replay no longer strands a
  count at zero.
- Split audience pages and the form into separate route bundles. Kept the home
  and full wall immediately available for their existing transition effects.
- Delayed direct section scrolling until the initial loader unlocks the page
  and remeasured the new page before scrolling.
- Enabled asynchronous logo decoding with the same images and fallback order.
- Let the home grow and scroll when its content exceeds the viewport. The
  one-screen layout is retained where it fits; the existing sticky navigation
  background is used when scrolling.
- Prevented focus from scrolling inside the clipped wall, keeping its overlay
  positions stable. Allowed short-screen wall layouts and scrollable details.

## Measured results

Production builds with the existing lockfile, sizes reported by Vite:

| Initial asset | Before | After |
| --- | ---: | ---: |
| JavaScript, uncompressed | 262.69 kB | 220.11 kB |
| JavaScript, gzip | 83.15 kB | 71.89 kB |
| CSS, uncompressed | 59.54 kB | 29.66 kB |
| CSS, gzip | 13.37 kB | 7.82 kB |
| Combined JavaScript + CSS, gzip | 96.52 kB | 79.71 kB |

The initial compressed code payload is **17.4% smaller**. Other route bundles
load when visited. These numbers exclude images, fonts, HTML and request
headers; they are not a measurement of total page transfer or load time.

The deterministic before/after checks compare all 56 cards on every frame for
six seconds, including the fly-in, at these simulated sizes and refresh rates.
Transforms, opacity and visibility match the baseline. The next five seconds
of idle drift produce these opacity-write counts:

| Simulated viewport / refresh rate | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| 390 × 844 / 60 Hz | 720 | 48 | 93.3% |
| 1280 × 800 / 120 Hz | 9,720 | 24 | 99.8% |
| 1920 × 1080 / 144 Hz | 4,804 | 24 | 99.5% |

These are JavaScript DOM-write counts, not measured device FPS. The visible
wall still animates at the display refresh rate; the settled-detail and
reduced-motion tests confirm that no further wall frames are scheduled at rest.

## Validation

- Production build succeeds.
- Six deterministic regression checks pass, including baseline comparison,
  off-screen/hidden-tab pause and resume, keyboard/drag interactions,
  loader timing, zoom reopening, unmount cleanup and count-up effect replay.
- Browser checks cover all six production routes, mobile navigation, the
  timeline, final counter values, card details, keyboard opening/Escape, and
  form input/live letter preview without submission. Direct section links,
  the circular transition to the wall and both themes were checked. No
  warnings or errors were captured during the production browser checks.
- Responsive browser checks include 320 × 568, 390 × 844, 768 × 1024,
  844 × 390 and 1280 × 800. These are viewport tests on this machine, not tests
  on physical phones or every browser engine.

Run the ordinary regression checks:

```powershell
node --experimental-vm-modules --test tests/animation-performance.test.mjs
```

Include the before/after comparison:

```powershell
$env:RVU_BASELINE_REF = '0cb6e4f'
node --experimental-vm-modules --test tests/animation-performance.test.mjs
```

Real low-end phone profiling remains useful before launch. Network-dependent
fonts and third-party recruiter logos can still affect loading, and keeping
the existing 3D blur means GPU capability continues to matter.

## Suggestions only — not implemented

1. **Label the reporting period consistently.** The wall says 2024–25, the
   outcomes/cohort sections say 2024, and the current official page discusses
   2025–26. Give each dataset its own year and source/updated date, rather than
   making mixed cohorts appear to describe one placement cycle.
2. **Recruiter count (done).** The site now uses the university's published
   figure of 250+ recruiting organisations, and lists the official package
   figures alongside it. The official source is
   [RVU's placement page](https://rvu.edu.in/placements/).
3. **Offer a searchable recruiter list alongside the wall.** Retain the
   immersive wall and let someone looking for one company find it quickly.
4. **Improve the smallest labels.** Larger type and slightly stronger contrast
   for recruiter roles, status badges and metadata would help phone users
   while retaining the current visual style.
5. **Clarify form delivery before launch.** `Forms.jsx` currently simulates
   success when `VITE_RECRUIT_ENDPOINT` is absent. Connect the CAR-approved
   endpoint, or clearly label the preview as a demo before visitors submit.
   The existing submission behaviour was not changed in this pass.

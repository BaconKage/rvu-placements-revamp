import { useEffect, useMemo, useRef, useState } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { buildRecruiterField, UPCOMING, DOMAINS } from "../../data/placements";
import "./Recruiters.css";

function shortSector(s) {
  return s.replace(" & Software", "").replace(" & Fintech", "").replace(" & Analytics", "")
    .replace("Energy, Industrial & Health", "Industrial").replace(" & Startups", "");
}

function LogoCard({ c }) {
  const mono = c.co.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "RV";
  const domain = DOMAINS[c.co];
  // higher-res brand image first, then favicon, then monogram
  const sources = domain
    ? [`https://unavatar.io/${domain}?fallback=false`,
       `https://www.google.com/s2/favicons?domain=${domain}&sz=256`]
    : [];
  const [idx, setIdx] = useState(0);
  const showLogo = idx < sources.length;
  return (
    <article className="lm-card" data-hot>
      <div className={`lm-logo ${showLogo ? "" : "mono"}`}>
        {showLogo ? (
          <img
            src={sources[idx]}
            alt={c.co}
            loading="lazy"
            draggable="false"
            onError={() => setIdx((i) => i + 1)}
          />
        ) : (
          <span className="lm-mono">{mono}</span>
        )}
      </div>
      <div className="lm-meta">
        <div className="lm-co serif">{c.co}</div>
        <div className="lm-sector mono">{shortSector(c.sector)}</div>
      </div>
    </article>
  );
}

// Infinite auto-scrolling marquee that you can grab and swipe; releases back to
// constant motion with a little momentum.
function LogoMarquee({ items, dir = -1, speed = 0.28 }) {
  const trackRef = useRef(null);
  const st = useRef({ pos: 0, vel: 0, dragging: false, lastX: 0, half: 0, init: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const s = st.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      s.half = track.scrollWidth / 2;
      if (!s.init) { s.pos = dir > 0 ? -s.half : 0; s.init = true; }
      s.kids = Array.from(track.children);
      s.cxs = s.kids.map((k) => k.offsetLeft + k.offsetWidth / 2);
      s.cw = (track.parentElement && track.parentElement.clientWidth) || window.innerWidth;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    // scrolling the page pushes the marquee (scroll-oriented); it decays back
    // to a gentle drift when you stop, and drag overrides it entirely.
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, dy = y - lastY; lastY = y;
      if (reduce || s.dragging) return;
      s.vel += dy * 0.32 * dir;
      s.vel = Math.max(-48, Math.min(48, s.vel));
    };
    addEventListener("scroll", onScroll, { passive: true });

    let raf;
    const base = speed * dir;
    const loop = () => {
      if (!s.dragging) {
        if (reduce) s.vel = 0;
        else s.vel += (base - s.vel) * 0.06;   // ease back to the gentle drift
        s.pos += s.vel;
      }
      if (s.half > 0) {
        if (s.pos <= -s.half) s.pos += s.half;
        else if (s.pos > 0) s.pos -= s.half;
      }
      track.style.transform = `translate3d(${s.pos.toFixed(2)}px,0,0)`;

      // lay the cards along a gentle circular arc — dome up at centre,
      // dipping and tilting toward the edges (nk-style curved field)
      if (s.kids && s.cw) {
        const halfW = s.cw / 2;
        for (let i = 0; i < s.kids.length; i++) {
          let n = (s.pos + s.cxs[i] - halfW) / halfW;   // -1 left edge .. +1 right edge
          n = Math.max(-1.5, Math.min(1.5, n));
          const y = 30 * n * n;                          // edges sink
          const rot = -n * 5;                            // follow the tangent
          const sc = 1 - Math.min(0.14, Math.abs(n) * 0.1);
          s.kids[i].style.transform = `translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("scroll", onScroll); };
  }, [dir, speed]);

  const onDown = (e) => {
    const s = st.current;
    s.dragging = true; s.lastX = e.clientX; s.vel = 0;
    trackRef.current.classList.add("grabbing");
    trackRef.current.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const s = st.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    s.lastX = e.clientX;
    s.pos += dx; s.vel = dx;               // carry drag velocity into the release
  };
  const onUp = () => {
    const s = st.current;
    s.dragging = false;
    trackRef.current?.classList.remove("grabbing");
  };

  return (
    <div className="lm">
      <div
        className="lm-track"
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {items.concat(items).map((c, i) => <LogoCard key={i} c={c} />)}
      </div>
    </div>
  );
}

export default function Recruiters() {
  const { cards } = useMemo(() => buildRecruiterField(), []);
  const rowA = useMemo(() => cards.filter((_, i) => i % 2 === 0), [cards]);
  const rowB = useMemo(() => cards.filter((_, i) => i % 2 === 1), [cards]);

  return (
    <section className="section recruiters" id="recruiters">
      <div className="wrap">
        <Eyebrow idx="01">Recruiters</Eyebrow>
        <h2 className="serif rec-h">
          <Words text="Who recruits from RV University." />
        </h2>
        <p className="lede rec-lede">
          {cards.length} organisations across six sectors engaged with our students this cycle.
          Let it run, or grab and swipe to browse.
        </p>
      </div>

      <div className="lm-band" role="region" aria-label="Recruiting companies">
        <LogoMarquee items={rowA} dir={-1} speed={0.28} />
        <LogoMarquee items={rowB} dir={1} speed={0.24} />
      </div>

      <div className="wrap">
        <div className="rec-upcoming">
          <span className="mono rec-up-label"><span className="rec-up-dot" /> In the pipeline</span>
          <p className="rec-up-list">
            {UPCOMING.map((c, i) => (
              <span className="rec-up-co" key={c}>{c}{i < UPCOMING.length - 1 ? <span className="sep">·</span> : null}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

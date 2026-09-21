import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CursorGlow, Grain } from "./effects";

const AN_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const AN_LONG = "cubic-bezier(0.22, 1, 0.36, 1)";

export function CinemaKit() {
  return (
    <>
      <style>{cinemaCss}</style>
      <Grain />
      <CursorGlow />
      <SplashScreen />
    </>
  );
}

function SplashScreen() {
  return (
    <div className="dn-splash" aria-hidden>
      <div className="dn-splash-inner">
        <span className="dn-splash-mark">
          دار <i>النوم</i>
        </span>
        <span className="dn-splash-bar" />
        <span className="dn-splash-note">راحة تصنع تفاصيلها</span>
      </div>
    </div>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 30,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "li" | "figure" | "aside";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = { transitionDelay: `${delay}ms`, "--dn-y": `${y}px` } as CSSProperties;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} style={style} className={`dn-reveal ${seen ? "dn-reveal-in" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

export function MarqueeBand({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const row = items.map((text, i) => (
    <span key={i} className="dn-mq-item">
      <i className="dn-mq-star">✦</i>
      {text}
    </span>
  ));
  return (
    <div className={`dn-mq${reverse ? " dn-mq-rev" : ""}`} dir="ltr" aria-hidden>
      <div className="dn-mq-track">
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}

type Stat = { value: number; suffix?: string; label: string };

export function StatsBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-4 md:px-8">
      {stats.map((s, i) => (
        <div key={s.label} className="text-center">
          <div className="dn-stat">
            <b>
              <Counter on={on} value={s.value} />
            </b>
            {s.suffix && <span>{s.suffix}</span>}
          </div>
          <p className="dn-stat-label">{s.label}</p>
          {i < stats.length - 1 && <span className="dn-stat-line" aria-hidden />}
        </div>
      ))}
    </div>
  );
}

function Counter({ on, value }: { on: boolean; value: number }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, value]);

  return <>{new Intl.NumberFormat("ar-EG").format(n)}</>;
}

export function ParallaxImage({ src, alt, className = "", speed = 36 }: { src: string; alt: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [off, setOff] = useState(0);

  useEffect(() => {
    let raf = 0;
    let latest = 0;
    const move = () => {
      const el = ref.current;
      if (!el) return;
      const now = performance.now();
      if (now - latest < 30) return;
      latest = now;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setOff(Math.max(-speed, Math.min(speed, p * (speed * 0.6)))));
    };
    move();
    window.addEventListener("scroll", move, { passive: true });
    window.addEventListener("resize", move);
    return () => {
      window.removeEventListener("scroll", move);
      window.removeEventListener("resize", move);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`dn-parallax ${className}`}>
      <img src={src} alt={alt} style={{ transform: `translate3d(0, ${off}px, 0) scale(1.18)` }} />
    </div>
  );
}

const cinemaCss = `
/* ---------- cinematic palette & type ---------- */
.dn-stat {
  display: flex; align-items: baseline; justify-content: center; gap: 3px;
  font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1;
  font-weight: 900; letter-spacing: -0.02em;
  background: linear-gradient(115deg, #d9a441, #f2d185 45%, #b8863b 80%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.dn-stat b { font-weight: inherit; }
.dn-stat > span { font-size: 0.45em; font-weight: 800; background: none; color: #d9a441; }
.dn-stat-label { margin-top: 10px; color: rgba(245, 237, 225, 0.66); font-weight: 700; }
.dn-stat-line {
  position: absolute; inset-inline-start: 50%; bottom: -18px; width: 56px; height: 2px;
  background: linear-gradient(90deg, transparent, #d9a441, transparent); opacity: 0.6;
}

/* ---------- reveal on scroll ---------- */
.dn-reveal { opacity: 0; transform: translateY(var(--dn-y, 30px)); transition: opacity 1s ${AN_EASE}, transform 1s ${AN_EASE}; will-change: opacity, transform; }
.dn-reveal-in { opacity: 1; transform: none; }

/* ---------- marquee ---------- */
.dn-mq { position: relative; overflow: hidden; border-block: 1px solid rgba(217, 164, 65, 0.25); background: #17110b; padding: 22px 0; }
.dn-mq-track { display: flex; width: max-content; gap: 0; animation: dnMq 36s linear infinite; will-change: transform; }
.dn-mq-rev .dn-mq-track { animation-direction: reverse; }
.dn-mq-item {
  display: inline-flex; align-items: center; gap: 14px; padding: 0 22px;
  font-size: clamp(1.1rem, 2.4vw, 1.7rem); font-weight: 800; white-space: nowrap;
  color: rgba(245, 237, 225, 0.88);
}
.dn-mq-star { color: #d9a441; font-style: normal; font-size: 0.8em; animation: dnSpin 8s linear infinite; }
@keyframes dnMq { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
@keyframes dnSpin { to { transform: rotate(360deg); } }

/* ---------- splash ---------- */
.dn-splash {
  position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center;
  background: #0f0c09; color: #f5ede1; overflow: hidden;
  animation: dnSplashOut 0.9s ${AN_LONG} 2s forwards;
  pointer-events: none;
}
.dn-splash-inner { display: grid; justify-items: center; gap: 26px; padding: 24px; }
.dn-splash-mark {
  font-size: clamp(3rem, 10vw, 5.5rem); font-weight: 900; letter-spacing: -0.03em;
  background: linear-gradient(115deg, #ffffff, #f2d185 45%, #b8863b 90%); background-size: 220% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: dnShimmer 1.4s linear infinite;
  opacity: 0; animation: dnMarkUp 0.9s ${AN_LONG} 0.15s forwards, dnShimmer 1.4s linear 0.9s infinite;
}
.dn-splash-mark i { font-style: normal; color: #d9a441; background: none; }
.dn-splash-bar { position: relative; width: min(220px, 60vw); height: 2px; background: rgba(245, 237, 225, 0.15); overflow: hidden; }
.dn-splash-bar::after {
  content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, #f2d185 50%, transparent);
  animation: dnLoad 1.1s ${AN_EASE} 0.25s forwards; transform-origin: left;
}
.dn-splash-note { font-size: 0.9rem; letter-spacing: 0.14em; color: rgba(245, 237, 225, 0.55); opacity: 0; animation: dnFade 0.6s ease 0.8s forwards; }
@keyframes dnLoad { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes dnMarkUp { from { opacity: 0; transform: translateY(46px); } to { opacity: 1; transform: none; } }
@keyframes dnFade { to { opacity: 1; } }
@keyframes dnShimmer { from { background-position: 0% 0; } to { background-position: -220% 0; } }
@keyframes dnSplashOut {
  0% { clip-path: circle(150% at 50% 50%); opacity: 1; }
  70% { clip-path: circle(24% at 50% 50%); opacity: 1; visibility: visible; }
  100% { clip-path: circle(0% at 50% 50%); opacity: 0; visibility: hidden; }
}

/* ---------- hero layers ---------- */
.dn-hero { position: relative; min-height: 88vh; display: flex; align-items: center; overflow: hidden; isolation: isolate; background: #0f0c09; }
.dn-hero-bg { position: absolute; inset: 0; z-index: -3; overflow: hidden; }
.dn-hero-bg img { width: 100%; height: 100%; object-fit: cover; animation: dnKen 14s ${AN_LONG} both; }
@keyframes dnKen { from { transform: scale(1.12) translateY(12px); } to { transform: scale(1) translateY(0); } }
.dn-hero-veil { position: absolute; inset: 0; z-index: -2; background: linear-gradient(180deg, rgba(15,12,9,0.82) 0%, rgba(15,12,9,0.42) 42%, rgba(15,12,9,0.9) 100%); }
.dn-hero-glow { position: absolute; z-index: -1; border-radius: 999px; filter: blur(90px); opacity: 0.55; mix-blend-mode: screen; animation: dnGlow 9s ease-in-out infinite alternate; }
.dn-hero-glow.g1 { width: 46vw; height: 46vw; right: -12%; top: -16%; background: radial-gradient(circle, rgba(217,164,65,0.5), transparent 60%); }
.dn-hero-glow.g2 { width: 38vw; height: 38vw; left: -10%; bottom: -12%; background: radial-gradient(circle, rgba(217,164,65,0.28), transparent 60%); animation-delay: -4s; }
@keyframes dnGlow { from { transform: translate3d(-4vw, 2vh, 0) scale(1); } to { transform: translate3d(4vw, -3vh, 0) scale(1.15); } }

.dn-word {
  display: inline-block; overflow: hidden; vertical-align: bottom;
}
.dn-word > span { display: inline-block; transform: translateY(120%); animation: dnWordUp 1.1s ${AN_LONG} forwards; }
@keyframes dnWordUp { to { transform: none; } }

.dn-rule { display: block; width: 0; height: 3px; border-radius: 99px; background: linear-gradient(90deg, #d9a441, #f2d185); animation: dnRule 1.1s ${AN_LONG} 1s forwards; }
@keyframes dnRule { to { width: 9rem; } }

.dn-chip {
  position: relative; display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid rgba(217, 164, 65, 0.4); border-radius: 999px; padding: 10px 18px;
  background: rgba(23, 17, 11, 0.55); backdrop-filter: blur(8px);
  color: #f5ede1; font-weight: 700; font-size: 0.85rem;
  opacity: 0; animation: dnFade 0.8s ease both;
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
}
.dn-chip i { font-style: normal; color: #d9a441; }
.dn-chip-float { display: inline-flex; animation: dnFloat 7s ease-in-out infinite alternate; }
.dn-chip-float.f2 { animation-duration: 8.5s; animation-delay: -2s; }
.dn-chip-float.f3 { animation-duration: 9.5s; animation-delay: -4s; }
@keyframes dnFloat { from { transform: translateY(12px); } to { transform: translateY(-12px); } }

.dn-scroll-cue { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); display: grid; justify-items: center; gap: 8px; color: rgba(245, 237, 225, 0.7); }
.dn-scroll-cue i { font-style: normal; font-size: 11px; letter-spacing: 0.22em; }
.dn-mouse { width: 24px; height: 38px; border: 1.5px solid rgba(245,237,225,0.5); border-radius: 14px; position: relative; }
.dn-mouse::after { content: ""; position: absolute; left: 50%; top: 7px; width: 3px; height: 8px; margin-left: -1.5px; border-radius: 3px; background: #d9a441; animation: dnWheel 1.8s ${AN_EASE} infinite; }
@keyframes dnWheel { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(12px); opacity: 0; } 100% { transform: translateY(0); opacity: 0; } }

/* ---------- parallax ---------- */
.dn-parallax { position: relative; overflow: hidden; height: 100%; }
.dn-parallax img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }

/* ---------- misc glow keyframes used by hero chips ---------- */
@keyframes dnHalo {
  from { opacity: 0.45; transform: scale(0.96); }
  to { opacity: 0.8; transform: scale(1.04); }
}
`;
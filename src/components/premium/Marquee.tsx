import { useEffect, useRef } from "react";
import { theme } from "./theme";

const css = `
  .pnm { background: ${theme.gold}; color: #17110b; overflow: hidden; padding: 16px 0; transform: rotate(-1.4deg) scale(1.03); position: relative; z-index: 5; box-shadow: 0 24px 60px rgba(0,0,0,.45); }
  .pnm-track { display: flex; gap: 44px; width: max-content; will-change: transform; }
  .pnm-s { font-weight: 800; font-size: 17px; white-space: nowrap; }
  @keyframes pnm-scroll { to { transform: translateX(50%); } }
  @media (prefers-reduced-motion: reduce) { .pnm-track { animation: none; } }
`;

interface Props {
  items: string[];
  /** seconds per loop */
  duration?: number;
}

/** Gold marquee ribbon, slightly tilted, infinitely looping. */
export default function Marquee({ items, duration = 26 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    // duplicate once so the loop is seamless
    t.innerHTML += t.innerHTML;
    t.style.animation = `pnm-scroll ${duration}s linear infinite`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) t.style.animation = "none";
  }, [duration]);

  const row = items.map((it, i) => (
    <span key={i} className="pnm-s" style={{ display: "flex", alignItems: "center", gap: 44 }}>
      {it} <span aria-hidden="true">◆</span>
    </span>
  ));

  /* initial content (duplicated by effect) */
  const seed = (
    <div ref={trackRef} className="pnm-track" style={{ gap: 44 }}>
      {row}
    </div>
  );
  return (
    <div className="pnm" dir="ltr">
      <style>{css}</style>
      {seed}
    </div>
  );
}

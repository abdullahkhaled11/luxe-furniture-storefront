import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { theme } from "./theme";

const grainCss = `
  .pnf-grain { position: fixed; inset: -50%; width: 200%; height: 200%; pointer-events: none; z-index: 2000; opacity: .06;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: pnf-grain .6s steps(4) infinite; }
  @keyframes pnf-grain { 0%{transform:translate(0,0)} 25%{transform:translate(-2%,3%)} 50%{transform:translate(3%,-2%)} 75%{transform:translate(-3%,-3%)} 100%{transform:translate(2%,2%)} }
  @media (prefers-reduced-motion: reduce) { .pnf-grain { animation: none; } }
`;

const glowCss = `
  .pnf-glow { position: fixed; z-index: 3000; top: 0; left: 0; width: 420px; height: 420px; border-radius: 50%; pointer-events: none; opacity: 0;
    background: radial-gradient(circle, rgba(217,164,65,.16), rgba(217,164,65,.05) 40%, transparent 70%);
    transform: translate(-50%,-50%); mix-blend-mode: screen; }
  .pnf-glow.on { opacity: 1; transition: opacity .4s ease; }
  @media (prefers-reduced-motion: reduce) { .pnf-glow { display: none; } }
`;

/** Fixed film grain overlay — gives the premium cinematic finish. */
export function Grain() {
  return (
    <>
      <style>{grainCss}</style>
      <div className="pnf-grain" aria-hidden="true" />
    </>
  );
}

/** Soft radial glow that lerp-follows the cursor. No-op on touch devices. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    let mx = innerWidth / 2,
      my = innerHeight / 2,
      gx = mx,
      gy = my;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      el.classList.add("on");
    };
    const onLeave = () => el.classList.remove("on");
    let raf = 0;
    const loop = () => {
      gx += (mx - gx) * 0.18;
      gy += (my - gy) * 0.18;
      el.style.transform = `translate(${(gx - 210).toFixed(1)}px, ${(gy - 210).toFixed(1)}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <style>{glowCss}</style>
      <div ref={ref} className="pnf-glow" aria-hidden="true" />
    </>
  );
}

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  style?: CSSProperties;
  className?: string;
}

/** Button/link that gently follows the mouse. */
export function Magnetic({ children, strength = 0.3, style, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: "inline-block",
        transition: "transform .2s cubic-bezier(.22,1,.36,1), opacity .3s",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** CTA pill tuned for the furniture theme. */
export function GoldPill({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <Magnetic strength={0.25}>
      <button
        onClick={onClick}
        style={{
          background: `linear-gradient(120deg, ${theme.goldSoft}, ${theme.gold}, ${theme.goldDeep})`,
          color: "#17110b",
          fontWeight: 900,
          fontSize: 18,
          fontFamily: "inherit",
          padding: "20px 46px",
          borderRadius: 999,
          cursor: "pointer",
          border: "none",
          boxShadow: `0 22px 50px -12px rgba(217,164,65,.55)`,
        }}
      >
        {children}
      </button>
    </Magnetic>
  );
}

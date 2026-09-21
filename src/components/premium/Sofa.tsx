import { useEffect, useRef } from "react";

const css = `
  .pns-sofa { position: relative; transform-style: preserve-3d; filter: drop-shadow(0 40px 50px rgba(0,0,0,.6)); transition: filter .4s ease; }
  .pns-sofa .sb { position: absolute; inset: 0 0 22% 0; border-radius: 40px; background: var(--uphol); transition: background .6s ease; }
  .pns-sofa .st { position: absolute; inset: 26% 4% 4% 4%; border-radius: 34px 34px 48px 48px; background: linear-gradient(180deg, color-mix(in srgb, var(--uphol) 92%, white), var(--uphol)); transition: background .6s ease; }
  .pns-sofa .sarm { position: absolute; top: 14%; height: 62%; width: 16%; border-radius: 34px; background: linear-gradient(160deg, color-mix(in srgb, var(--uphol) 96%, white), var(--uphol)); transition: background .6s ease; box-shadow: 0 10px 24px rgba(0,0,0,.35); }
  .pns-sofa .sarm.R { left: 3%; }
  .pns-sofa .sarm.L { right: 3%; }
  .pns-sofa .sleg { position: absolute; bottom: 0; width: 26px; height: 26px; border-radius: 6px; background: #3a2b1a; box-shadow: 0 8px 12px rgba(0,0,0,.5); }
  .pns-sofa .sleg.R { left: 8%; }
  .pns-sofa .sleg.L { right: 8%; }
  .pns-sofa .scus { position: absolute; inset: 27% 8% 30% 8%; border-radius: 26px; background: linear-gradient(180deg, color-mix(in srgb, var(--uphol) 80%, #000), color-mix(in srgb, var(--uphol) 88%, white)); transition: background .6s ease; }
`;

export interface SofaProps {
  width?: string;
  height?: string;
  upholstery?: string;
  tilt?: boolean;
  className?: string;
}

/** CSS-drawn sofa. Set --uphol on a parent to recolor, or pass `upholstery`. */
export default function Sofa({
  width = "480px",
  height = "220px",
  upholstery = "#a87b4d",
  tilt = false,
  className = "",
}: SofaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("--uphol", upholstery);
  }, [upholstery]);

  useEffect(() => {
    if (!tilt || !ref.current) return;
    const el = ref.current;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.parentElement!.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width / 2) / r.width;
      ty = (e.clientY - r.top - r.height / 2) / r.height;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    let raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `rotateY(${(-14 + cx * 10).toFixed(2)}deg) rotateX(${(6 - cy * 8).toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [tilt]);

  return (
    <>
      <style>{css}</style>
      <div
        ref={ref}
        className={`pns-sofa ${className}`}
        aria-hidden="true"
        style={{ width, height, transform: tilt ? undefined : "rotateY(-14deg) rotateX(6deg)" }}
      >
        <div className="sarm R" />
        <div className="sarm L" />
        <div className="sb" />
        <div className="st" />
        <div className="scus" />
        <div className="sleg R" />
        <div className="sleg L" />
      </div>
    </>
  );
}

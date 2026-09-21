import { useEffect, useRef } from "react";

const css = `
  .pnb { position: relative; transform-style: preserve-3d; filter: drop-shadow(0 40px 50px rgba(0,0,0,.55)); }
  .pnb .bed { position: relative; width: 100%; height: 100%; }
  .pnb .bhead { position: absolute; right: 4%; top: 0; width: 9%; height: 80%; border-radius: 26px; background: var(--uphol); transition: background .6s ease; box-shadow: 0 12px 28px rgba(0,0,0,.3); }
  .pnb .bframe { position: absolute; inset: 20% 0 14% 0; border-radius: 30px; background: linear-gradient(160deg, color-mix(in srgb, var(--uphol) 92%, white), var(--uphol)); transition: background .6s ease; }
  .pnb .bmat { position: absolute; inset: 28% 2.5% 17% 2.5%; border-radius: 26px; background: linear-gradient(160deg, #f7f3ea, #e9e2d4); box-shadow: inset 0 6px 18px rgba(0,0,0,.12); }
  .pnb .bpill { position: absolute; top: 33%; width: 14%; height: 32%; border-radius: 20px; background: linear-gradient(160deg, #fffdf8, #f1e9da); box-shadow: 0 10px 20px rgba(0,0,0,.18); }
  .pnb .bpill.R { right: 6%; }
  .pnb .bpill.L { left: 6%; }
  .pnb .bleg { position: absolute; bottom: 0; width: 20px; height: 24px; border-radius: 5px; background: #3a2b1a; box-shadow: 0 8px 12px rgba(0,0,0,.5); }
  .pnb .bleg.R { right: 10%; }
  .pnb .bleg.L { left: 10%; }
`;

export interface BedProps {
  width?: string;
  height?: string;
  upholstery?: string;
  tilt?: boolean;
  className?: string;
}

/** CSS-drawn bed (headboard + frame + mattress + pillows). Recolor via `upholstery`. */
export default function Bed({
  width = "480px",
  height = "240px",
  upholstery = "#7a6a4f",
  tilt = false,
  className = "",
}: BedProps) {
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
        className={`pnb ${className}`}
        aria-hidden="true"
        style={{ width, height, transform: tilt ? undefined : "rotateY(-12deg) rotateX(4deg)" }}
      >
        <div className="bed">
          <div className="bhead" />
          <div className="bframe" />
          <div className="bmat" />
          <div className="bpill R" />
          <div className="bpill L" />
          <div className="bleg R" />
          <div className="bleg L" />
        </div>
      </div>
    </>
  );
}

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { theme } from "./theme";

const css = `
  .pns-wrap { position: relative; }
  .pns-pin { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .pns-copy { position: absolute; z-index: 20; text-align: center; width: 100%; top: 10%; padding: 0 20px; }
  .pns-copy h2 { font-size: clamp(26px, 5vw, 52px); font-weight: 900; }
  .pns-copy p { color: ${theme.muted}; margin-top: 10px; font-size: 15px; max-width: 560px; margin-inline: auto; }
  .pns-scene { position: relative; width: min(680px, 92vw); height: 60vh; perspective: 1600px; }
  .pns-el { position: absolute; opacity: 0; transform: translateY(80px) scale(.9); will-change: transform, opacity; }
`;

interface Props {
  /** total height of the outer wrapper in vh (drives scroll duration) */
  heightVh?: number;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Scroll-driven narrative: sticky viewport; each child fades/pops in, in order,
 * as the scroll progresses through the section. Children get `.pns-el` styling.
 */
export default function ScrollStory({ heightVh = 260, title, subtitle, children }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.style.height = `${heightVh}vh`;
  }, [heightVh]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const els = Array.from(wrap.querySelectorAll<HTMLElement>(".pns-el"));
    const pad = () => (wrap.style.height = `${heightVh}vh`);
    let height = wrap.offsetHeight - window.innerHeight;
    addEventListener("resize", () => {
      pad();
      height = wrap.offsetHeight - window.innerHeight;
    });
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const p = Math.min(Math.max((window.innerHeight - r.top) / height, 0), 1);
      els.forEach((el, i) => {
        const s = Math.min(Math.max(p * els.length - i, 0), 1);
        el.style.opacity = String(s);
        el.style.transform = `translateY(${(1 - s) * 70}px) scale(${(0.9 + s * 0.1).toFixed(3)})`;
        if (i === 3) el.style.rotate = `${((1 - s) * -8).toFixed(2)}deg`;
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [heightVh]);

  return (
    <div ref={wrapRef} className="pns-wrap">
      <style>{css}</style>
      <div className="pns-pin">
        <div className="pns-copy">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="pns-scene">{children}</div>
      </div>
    </div>
  );
}

/* ready-made furniture scene for ScrollStory */
export function FurnitureScene() {
  const sofa = "#a87b4d";
  const base: CSSProperties = { position: "absolute", borderRadius: 24 };
  return (
    <div className="pns-scene" style={{ position: "absolute", inset: 0 }}>
      <div
        className="pns-el"
        style={{
          ...base,
          bottom: "4%",
          left: "-6%",
          width: "52%",
          height: "24%",
          background: "linear-gradient(#3a2c1e,#241b12)",
          border: "1px solid rgba(233,196,106,.2)",
        }}
      />
      <div
        className="pns-el"
        style={{
          ...base,
          top: "-4%",
          right: "-6%",
          width: "38%",
          height: "38%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, #ffe9b0, #d9a441 65%, #8a6220)",
          boxShadow: "0 40px 80px -20px rgba(217,164,65,.5)",
        }}
      />
      <div
        className="pns-el"
        style={{
          ...base,
          top: "12%",
          left: "2%",
          width: "18%",
          height: "28%",
          borderRadius: "24px 24px 40px 40px",
          background: "linear-gradient(#d9c9a8,#b7a078)",
        }}
      />
      <div
        className="pns-el"
        style={{
          ...base,
          top: "22%",
          right: "6%",
          width: "70%",
          height: "64%",
          borderRadius: 46,
          background: sofa,
          transformOrigin: "bottom",
        }}
      />
      <div
        className="pns-el"
        style={{
          ...base,
          top: "30%",
          right: "16%",
          width: "44%",
          height: "34%",
          borderRadius: 30,
          background: `linear-gradient(180deg, color-mix(in srgb, ${sofa} 85%, white), color-mix(in srgb, ${sofa} 60%, #000))`,
          border: "1px solid rgba(233,196,106,.25)",
        }}
      />
    </div>
  );
}

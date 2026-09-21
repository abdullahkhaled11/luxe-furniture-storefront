import { useCallback, useEffect, useRef, useState } from "react";
import { theme } from "./theme";

const css = `
  .pnc-shell { display: flex; align-items: center; gap: 14px; }
  .pnc-viewport { position: relative; overflow: hidden; touch-action: pan-y; user-select: none; }
  .pnc-track { display: flex; will-change: transform; transition: transform .8s cubic-bezier(0.22, 1, 0.36, 1); }
  .pnc-card { position: relative; flex-shrink: 0; border-radius: 24px; overflow: hidden; cursor: pointer;
    border: 1px solid rgba(233, 196, 106, 0.22); box-shadow: 0 24px 50px -16px rgba(0, 0, 0, 0.7);
    transition: transform .6s cubic-bezier(0.22, 1, 0.36, 1), opacity .6s ease, box-shadow .5s ease, border-color .5s ease; }
  .pnc-card::before { content: ""; position: absolute; inset: 0; border-radius: 24px; z-index: -1;
    background: linear-gradient(160deg, #3a2c1e, #241b12); border: 1px solid rgba(233, 196, 106, 0.1);
    transform: rotate(0.7deg) translate(3px, 4px); }
  .pnc-card:hover { border-color: rgba(233, 196, 106, 0.5); }
  .pnc-card.on { border-color: rgba(233, 196, 106, 0.8);
    box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.85), 0 0 42px rgba(217, 164, 65, 0.25); }
  .pnc-inner { position: absolute; inset: 0; padding: 20px; border-radius: 24px; display: flex; flex-direction: column; justify-content: flex-end;
    background: radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.18), transparent 55%), linear-gradient(160deg, #3a2c1e, #241b12); }
  .pnc-icon { position: absolute; inset: 0; display: grid; place-items: center; filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.5)); }
  .pnc-badge { position: absolute; top: 14px; right: 14px; background: ${theme.gold}; color: #17110b; font-size: 11px; font-weight: 800;
    padding: 6px 12px; border-radius: 999px; opacity: 0; transform: translateY(-6px); transition: all .4s ease; }
  .pnc-card.on .pnc-badge { opacity: 1; transform: translateY(0); }
  .pnc-fade { position: absolute; top: 0; bottom: 0; width: 64px; z-index: 2; pointer-events: none; }
  .pnc-fade-r { right: 0; background: linear-gradient(90deg, transparent, #17110b); }
  .pnc-fade-l { left: 0; background: linear-gradient(270deg, transparent, #17110b); }
  .pnc-arrow { width: 54px; height: 54px; border-radius: 50%; flex: none; border: 1px solid rgba(233, 196, 106, 0.4);
    background: rgba(23, 17, 11, 0.85); color: ${theme.goldSoft}; font-size: 22px; cursor: pointer;
    display: grid; place-items: center; transition: all .3s ease; }
  .pnc-arrow:hover { background: ${theme.gold}; color: #17110b; box-shadow: 0 0 30px rgba(217, 164, 65, 0.5); }
  @media (max-width: 760px) { .pnc-shell { gap: 8px; } .pnc-arrow { width: 44px; height: 44px; font-size: 18px; } .pnc-fade { width: 42px; } }
`;

export interface CoverflowItem {
  icon?: string;
  title: string;
  subtitle: string;
  price: string;
  image?: string;
  accent?: string;
}

interface Props {
  items: CoverflowItem[];
  rtl?: boolean;
  height?: string;
  cardWidth?: string;
}

const GAP = 18;
const EDGE = 26;
const APEX_R = 20;

function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setW(entries[0]?.contentRect.width ?? 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, w };
}

/** Horizontal slider: cards side by side (fully readable) with a subtle stack + edge peeks. */
export default function CoverflowCarousel({
  items,
  rtl = true,
  height = "clamp(340px, 44vh, 420px)",
}: Props) {
  const { ref, w } = useContainerWidth<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const moved = useRef(0);

  const go = useCallback(
    (dir: number) => setActive((a) => (a + dir + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, rtl]);

  let penv = w >= 1380 ? 5 : w >= 1080 ? 4 : w >= 720 ? 3 : 2;
  let cardW = 300;
  if (w > 0) {
    cardW = (w - (penv - 1) * GAP - EDGE * 2) / penv;
    while (cardW < 150 && penv > 1) {
      penv -= 1;
      cardW = (w - (penv - 1) * GAP - EDGE * 2) / penv;
    }
    if (cardW < 150) cardW = Math.max(140, w - GAP - EDGE * 2);
    cardW = Math.floor(cardW);
  }
  const step = cardW + GAP;
  const offset = w > 0 ? w - cardW / 2 - APEX_R - active * step : 0;

  const posFor = (i: number) => {
    const k = active - i;
    if (k < 0) return { scale: 0.9, ty: 10, opacity: 0.55, zIndex: 44 };
    const scale = Math.max(0.58, 1 - k * 0.055);
    const ty = k * 22;
    const opacity = Math.max(0.5, 1 - k * 0.13);
    return { scale, ty, opacity, zIndex: 50 - k };
  };

  return (
    <section dir={rtl ? "rtl" : "ltr"}>
      <style>{css}</style>
      <div className="pnc-shell">
        <button className="pnc-arrow" aria-label="السابق" onClick={() => go(-1)}>
          ❮
        </button>

        <div
          ref={ref}
          className="pnc-viewport"
          style={{ height, flex: "1", minWidth: 0 }}
          onPointerDown={(e) => {
            startX.current = e.clientX;
            moved.current = 0;
          }}
          onPointerMove={(e) => {
            if (startX.current !== null) moved.current = e.clientX - startX.current;
          }}
          onPointerUp={(e) => {
            if (startX.current === null) return;
            const dx = e.clientX - startX.current;
            if (Math.abs(moved.current) < 40) {
              startX.current = null;
              return;
            }
            startX.current = null;
            const forward = rtl ? dx > 0 : dx < 0;
            go(forward ? 1 : -1);
          }}
          onPointerCancel={() => {
            startX.current = null;
          }}
        >
          <div className="pnc-track" style={{ transform: `translateX(${offset}px)`, gap: GAP }}>
            {items.map((it, i) => {
              const p = posFor(i);
              return (
                <div
                  key={i}
                  className={"pnc-card" + (i === active ? " on" : "")}
                  onClick={() => setActive(i)}
                  style={{
                    width: cardW,
                    height,
                    transform: `translateY(${p.ty}px) scale(${p.scale})`,
                    opacity: p.opacity,
                    zIndex: p.zIndex,
                  }}
                >
                  <div className="pnc-inner">
                    <div className="pnc-badge">مميز</div>
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.title}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="pnc-icon" style={{ fontSize: "clamp(52px, 7vw, 96px)", color: it.accent ?? undefined }}>
                        {it.icon ?? "🪑"}
                      </div>
                    )}
                    <div style={{ fontWeight: 800, fontSize: "clamp(16px, 1.9vw, 20px)" }}>{it.title}</div>
                    <div style={{ fontSize: 13, color: theme.gold, margin: "3px 0 10px" }}>{it.subtitle}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: theme.muted, fontSize: 13 }}>
                      <span>السعر</span>
                      <b style={{ color: theme.goldSoft, fontSize: 17 }}>{it.price}</b>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pnc-fade pnc-fade-l" aria-hidden />
          <div className="pnc-fade pnc-fade-r" aria-hidden />
        </div>

        <button className="pnc-arrow" aria-label="التالي" onClick={() => go(1)}>
          ❯
        </button>
      </div>

      <p style={{ marginTop: 14, textAlign: "center", color: theme.muted, letterSpacing: 3 }}>
        <b style={{ color: theme.goldSoft, fontSize: 18 }}>{active + 1}</b> / {items.length}
      </p>
    </section>
  );
}
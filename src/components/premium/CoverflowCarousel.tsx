import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { theme } from "./theme";

const CARD_W = "min(320px, 72vw)";
const css = `
  .pnc-viewport { position: relative; margin: 0 auto; max-width: 1100px; perspective: 1800px; touch-action: pan-y; user-select: none; }
  .pnc-card { position: absolute; left: 50%; top: 50%; border-radius: 24px; overflow: hidden; cursor: pointer;
    will-change: transform, opacity; transition: transform .8s ${theme.ease}, opacity .6s ease; transform-style: preserve-3d; }
  .pnc-inner { position: absolute; inset: 0; padding: 22px; border-radius: 24px; display: flex; flex-direction: column; justify-content: flex-end;
    background: radial-gradient(circle at 20% 10%, rgba(255,255,255,.18), transparent 55%), linear-gradient(160deg, #3a2c1e, #241b12);
    border: 1px solid rgba(233,196,106,.28); box-shadow: 0 30px 60px -12px rgba(0,0,0,.75); }
  .pnc-icon { position: absolute; inset: 0; display: grid; place-items: center; filter: drop-shadow(0 10px 18px rgba(0,0,0,.5)); }
  .pnc-badge { position: absolute; top: 16px; right: 16px; background: ${theme.gold}; color: #17110b; font-size: 11px; font-weight: 800;
    padding: 6px 12px; border-radius: 999px; opacity: 0; transform: translateY(-6px); transition: all .4s ease; }
  .pnc-card.on .pnc-badge { opacity: 1; transform: translateY(0); }
  .pnc-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 100; width: 56px; height: 56px; border-radius: 50%;
    border: 1px solid rgba(233,196,106,.4); background: rgba(23,17,11,.7); color: ${theme.goldSoft}; font-size: 22px; cursor: pointer;
    display: grid; place-items: center; transition: all .3s ease; }
  .pnc-arrow:hover { background: ${theme.gold}; color: #17110b; box-shadow: 0 0 30px rgba(217,164,65,.5); }
  @media (max-width: 760px) { .pnc-arrow { width: 46px; height: 46px; font-size: 18px; } }
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

function slot(index: number, active: number, count: number, rtl: boolean) {
  let off = index - active;
  off = ((off % count) + count) % count;
  if (off > count / 2) off -= count;
  const abs = Math.min(Math.abs(off), 2);
  const dir = (off < 0 ? -1 : 1) * (rtl ? -1 : 1);
  let transform: string, opacity: number;
  if (abs === 0) {
    transform = "translateX(0px) translateZ(190px) scale(1) rotateY(0deg)";
    opacity = 1;
  } else if (abs === 1) {
    transform = `translateX(${dir * 165}px) translateZ(70px) scale(0.86) rotateY(${dir * -24}deg)`;
    opacity = 0.95;
  } else {
    transform = `translateX(${dir * 335}px) translateZ(-40px) scale(0.7) rotateY(${dir * -46}deg)`;
    opacity = 0.42;
  }
  return {
    transform,
    opacity,
    zIndex: 50 - abs,
    pointerEvents: (abs > 1 ? "none" : "auto") as "none" | "auto",
  };
}

/** Coverflow / fan carousel — 5 visible cards, center on top, arrows + drag + keys. */
export default function CoverflowCarousel({
  items,
  rtl = true,
  height = "clamp(340px, 44vh, 420px)",
  cardWidth = CARD_W,
}: Props) {
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

  const cards = useMemo(
    () =>
      items.map((it, i) => {
        const s = slot(i, active, items.length, rtl);
        const card = (
          <div
            key={i}
            className={"pnc-card" + (s.zIndex === 50 ? " on" : "")}
            onClick={() => setActive(i)}
            style={{ width: cardWidth, height, marginLeft: `calc(${cardWidth} / -2)`, ...s }}
          >
            <div className="pnc-inner">
              <div className="pnc-badge">مميز</div>
              {it.image ? (
                <img
                  src={it.image}
                  alt={it.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="pnc-icon"
                  style={{ fontSize: "clamp(64px, 9vw, 110px)", color: it.accent ?? undefined }}
                >
                  {it.icon ?? "🪑"}
                </div>
              )}
              <div style={{ fontWeight: 800, fontSize: "clamp(17px, 2vw, 22px)" }}>{it.title}</div>
              <div style={{ fontSize: 13, color: theme.gold, margin: "4px 0 12px" }}>
                {it.subtitle}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: theme.muted,
                  fontSize: 13,
                }}
              >
                <span>السعر</span>
                <b style={{ color: theme.goldSoft, fontSize: 18 }}>{it.price}</b>
              </div>
            </div>
          </div>
        );
        return card;
      }),
    [items, active, rtl, height, cardWidth],
  );

  const arrowEdge = "max(8px, calc(50% - min(560px, 50vw)))";

  return (
    <section dir={rtl ? "rtl" : "ltr"} style={{ position: "relative", textAlign: "center" }}>
      <style>{css}</style>
      <div
        className="pnc-viewport"
        style={{ height }}
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
          const threshold = 40;
          if (Math.abs(moved.current) < threshold) {
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
        {cards}
      </div>

      <button
        className="pnc-arrow"
        aria-label="السابق"
        style={{ right: arrowEdge }}
        onClick={() => go(-1)}
      >
        ❮
      </button>
      <button
        className="pnc-arrow"
        aria-label="التالي"
        style={{ left: arrowEdge }}
        onClick={() => go(1)}
      >
        ❯
      </button>

      <p style={{ marginTop: 12, color: theme.muted, letterSpacing: 3 }}>
        <b style={{ color: theme.goldSoft, fontSize: 18 }}>{active + 1}</b> / {items.length}
      </p>
    </section>
  );
}

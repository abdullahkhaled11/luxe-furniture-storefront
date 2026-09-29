import { useCallback, useEffect, useRef, useState } from "react";
import { theme } from "./theme";

const css = `
  .pnc-shell { display: flex; align-items: center; gap: 14px; }
  .pnc-viewport { position: relative; overflow: hidden; touch-action: pan-y; user-select: none; }
  .pnc-stage { position: relative; height: 100%; }
  .pnc-card { position: absolute; top: 0; border-radius: 24px; overflow: hidden; cursor: pointer;
    border: 1px solid rgba(233, 196, 106, 0.22); box-shadow: 0 24px 50px -16px rgba(0, 0, 0, 0.7);
    transition: transform .65s cubic-bezier(0.22, 1, 0.36, 1), top .65s cubic-bezier(0.22, 1, 0.36, 1),
      opacity .65s ease, box-shadow .5s ease, border-color .5s ease; }
  .pnc-card:hover { border-color: rgba(233, 196, 106, 0.5); }
  .pnc-card.on { border-color: rgba(233, 196, 106, 0.85);
    box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.85), 0 0 46px rgba(217, 164, 65, 0.3); }
  .pnc-inner { position: absolute; inset: 0; padding: 20px; border-radius: 24px; display: flex; flex-direction: column; justify-content: flex-end;
    background: radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.18), transparent 55%), linear-gradient(160deg, #3a2c1e, #241b12); }
  .pnc-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  @keyframes pncFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  .pnc-badge { position: absolute; top: 14px; right: 14px; background: ${theme.gold}; color: #17110b; font-size: 11px; font-weight: 800;
    padding: 6px 12px; border-radius: 999px; opacity: 0; transform: translateY(-6px); transition: all .4s ease; }
  .pnc-card.on .pnc-badge { opacity: 1; transform: translateY(0); }
  .pnc-icon { position: absolute; inset: 0; display: grid; place-items: center; filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.5)); }
  .pnc-pile { position: absolute; top: 50%; z-index: 5; display: grid; justify-items: center; pointer-events: none; }
  .pnc-pile-pane { position: relative; width: 56px; height: 74px; opacity: 0; animation: pncFade 0.8s ease 0.3s both; }
  .pnc-pile-pane .sheet { position: absolute; inset: 0; border-radius: 12px; border: 1px solid rgba(233, 196, 106, 0.25);
    background: linear-gradient(160deg, rgba(58, 44, 30, 0.9), rgba(36, 27, 18, 0.9)); transform-origin: bottom center; }
  .pnc-pile-pane .sheet:nth-child(1) { transform: rotate(-8deg) translateY(3px); }
  .pnc-pile-pane .sheet:nth-child(2) { transform: rotate(0deg); }
  .pnc-pile-pane .sheet:nth-child(3) { transform: rotate(8deg) translateY(3px); }
  .pnc-pile-badge { margin-top: 8px; font-size: 12px; font-weight: 800; color: ${theme.goldSoft}; }
  .pnc-fade { position: absolute; top: 0; bottom: 0; width: 60px; z-index: 4; pointer-events: none; }
  .pnc-fade-r { right: 0; background: linear-gradient(90deg, transparent, #17110b); }
  .pnc-fade-l { left: 0; background: linear-gradient(270deg, transparent, #17110b); }
  .pnc-arrow { width: 54px; height: 54px; border-radius: 50%; flex: none; border: 1px solid rgba(233, 196, 106, 0.4);
    background: rgba(23, 17, 11, 0.85); color: ${theme.goldSoft}; font-size: 22px; cursor: pointer;
    display: grid; place-items: center; transition: all .3s ease; }
  .pnc-arrow:hover { background: ${theme.gold}; color: #17110b; box-shadow: 0 0 30px rgba(217, 164, 65, 0.5); }
  @media (max-width: 760px) { .pnc-shell { gap: 8px; } .pnc-arrow { width: 44px; height: 44px; font-size: 18px; } .pnc-pile { display: none; } .pnc-fade { width: 42px; } }
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

/** Static pyramid: fixed center apex card swaps its photo; neighbors hold next/prev beds. */
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

  const factor = w >= 1500 ? 0.16 : w >= 1200 ? 0.19 : w >= 900 ? 0.22 : w >= 640 ? 0.27 : 0.34;
  const cardW = w > 0 ? Math.max(140, Math.min(320, Math.floor(w * factor))) : 260;
  const stepX = cardW + (w >= 640 ? GAP : -8);

  const slots = [-3, -2, -1, 0, 1, 2, 3].map((o) => {
    const idx = (active + o + items.length) % items.length;
    const abs = Math.abs(o);
    const top = abs >= 3 ? 0 : abs === 0 ? 4 : abs === 1 ? 22 : 40;
    const scale = abs >= 3 ? 0.82 : abs === 0 ? 1 : abs === 1 ? 0.9 : 0.8;
    const opacity = abs >= 3 ? 0 : abs === 2 ? 0.82 : 1;
    return { o, idx, item: items[idx]!, top, scale, opacity, zIndex: abs >= 3 ? 5 : 50 - abs * 10 };
  });

  const nextOn = (idx: number) => setActive(idx);

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
          style={{ height: `calc(${height} + 46px)`, flex: "1", minWidth: 0 }}
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
          <div className="pnc-stage">
            {slots.map(({ o, idx, item, top, scale, opacity, zIndex }) => (
              <div
                key={idx}
                className={"pnc-card" + (o === 0 ? " on" : "")}
                onClick={() => nextOn(idx)}
                style={{
                  left: "50%",
                  marginLeft: -cardW / 2,
                  width: cardW,
                  height,
                  top,
                  transform: `translateX(${o * stepX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
              >
                <div className="pnc-inner">
                  <div className="pnc-badge">مميز</div>
                  {item.image ? (
                    <img className="pnc-img" src={item.image} alt={item.title} />
                  ) : (
                    <div className="pnc-icon" style={{ fontSize: "clamp(52px, 7vw, 96px)", color: item.accent ?? undefined }}>
                      {item.icon ?? "🪑"}
                    </div>
                  )}
                  <div key={idx} className="pnc-meta">
                    <div style={{ fontWeight: 800, fontSize: "clamp(15px, 1.8vw, 20px)" }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: theme.gold, margin: "3px 0 10px" }}>{item.subtitle}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: theme.muted, fontSize: 13 }}>
                      <span>السعر</span>
                      <b style={{ color: theme.goldSoft, fontSize: 17 }}>{item.price}</b>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pnc-pile" style={{ right: 6 }}>
              <div className="pnc-pile-pane">
                <i className="sheet" /><i className="sheet" /><i className="sheet" />
              </div>
              <b className="pnc-pile-badge">+{Math.max(0, active)} قبل</b>
            </div>
            <div className="pnc-pile" style={{ left: 6 }}>
              <div className="pnc-pile-pane">
                <i className="sheet" /><i className="sheet" /><i className="sheet" />
              </div>
              <b className="pnc-pile-badge">+{Math.max(0, items.length - 1 - active)} بعد</b>
            </div>
          </div>
          <div className="pnc-fade pnc-fade-l" aria-hidden />
          <div className="pnc-fade pnc-fade-r" aria-hidden />
        </div>

        <button className="pnc-arrow" aria-label="التالي" onClick={() => go(1)}>
          ❯
        </button>
      </div>

      <p style={{ marginTop: 12, textAlign: "center", color: theme.muted, letterSpacing: 3 }}>
        <b style={{ color: theme.goldSoft, fontSize: 18 }}>{active + 1}</b> / {items.length}
      </p>
    </section>
  );
}
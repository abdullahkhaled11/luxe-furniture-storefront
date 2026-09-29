import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { theme } from "./theme";

const css = `
  .pnk { position: relative; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 110px 20px 80px; overflow: hidden; }
  .pnk-bg { position: absolute; inset: 0; background:
    radial-gradient(45% 35% at 15% 20%, rgba(217,164,65,.22), transparent 60%),
    radial-gradient(40% 35% at 85% 25%, rgba(150,110,60,.25), transparent 60%),
    radial-gradient(55% 45% at 50% 100%, rgba(40,28,16,.9), transparent 70%); pointer-events: none; }
  .pnk-kick { letter-spacing: 6px; font-size: 12px; color: ${theme.gold}; text-transform: uppercase; margin-bottom: 18px; animation: pnk-rise .8s .2s ${theme.ease} both; }
  .pnk-h { font-weight: 900; line-height: 1.05; font-size: clamp(38px, 9vw, 108px); }
  .pnk-word { display: inline-block; overflow: hidden; vertical-align: bottom; }
  .pnk-word > span { display: inline-block; transform: translateY(115%) rotate(5deg); animation: pnk-boot 1s ${theme.ease} forwards; }
  .pnk-word > span:nth-child(2) { animation-delay: .05s; } .pnk-word > span:nth-child(3) { animation-delay: .1s; }
  .pnk-word > span:nth-child(4) { animation-delay: .15s; } .pnk-word > span:nth-child(5) { animation-delay: .2s; }
  .pnk-word > span:nth-child(6) { animation-delay: .25s; }
  .pnk-mix { background: linear-gradient(100deg, ${theme.goldSoft}, #fff3cf, ${theme.gold}, ${theme.goldSoft}); background-size: 250% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent; animation: pnk-shimmer 5s linear infinite; }
  @keyframes pnk-boot { to { transform: translateY(0) rotate(0); } }
  @keyframes pnk-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; } }
  @keyframes pnk-shimmer { to { background-position: 250% center; } }
  .pnk-lead { max-width: 560px; color: ${theme.muted}; line-height: 1.9; margin-top: 22px; font-size: 16px; animation: pnk-rise .8s .5s ${theme.ease} both; }
  @media (prefers-reduced-motion: reduce) {
    .pnk-word > span { animation: none; transform: none; }
    .pnk-kick, .pnk-lead { animation: none; opacity: 1; }
    .pnk-mix { animation: none; }
  }
`;

interface Props {
  kicker?: string;
  children: ReactNode;
  /** words to render in the headline; `{ text, mix }` — mix gets animated gradient */
  words: Array<{ text: string; mix?: boolean }>;
  lead?: string;
}

/** Kinetic headline hero. Letters cascade in; on scroll they stretch/slide away. */
export default function KineticHero({ kicker = "", words, lead, children }: Props) {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onScroll = () => {
      const r = root.getBoundingClientRect();
      const t = Math.min(Math.max(-r.top / (window.innerHeight * 0.6), 0), 1);
      wordRefs.current.forEach((w, i) => {
        if (!w) return;
        const dir = i % 2 === 0 ? 1 : -1;
        w.querySelectorAll("span").forEach((s) => {
          (s as HTMLElement).style.transform =
            `translateY(${t * 120}px) rotate(${dir * t * 14}deg) scaleY(${1 - t * 0.18})`;
        });
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const style: CSSProperties = { fontFamily: "inherit" };

  return (
    <section ref={rootRef} className="pnk" style={style}>
      <style>{css}</style>
      <div className="pnk-bg" />
      {kicker && <div className="pnk-kick">{kicker}</div>}
      <h1 className="pnk-h">
        {words.map((w, i) => {
          const letters = Array.from(w.text);
          return (
            <span key={i}>
              <span
                className="pnk-word"
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
              >
                {letters.map((ch, j) => (
                  <span key={j} className={w.mix ? "pnk-mix" : undefined}>
                    {ch}
                  </span>
                ))}
              </span>{" "}
            </span>
          );
        })}
      </h1>
      {lead && <p className="pnk-lead">{lead}</p>}
      {children}
    </section>
  );
}

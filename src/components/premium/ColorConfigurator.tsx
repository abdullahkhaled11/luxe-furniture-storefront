import { memo, useState, type CSSProperties, type ReactNode } from "react";
import Sofa from "./Sofa";
import { theme } from "./theme";

const css = `
  .pnc-swatches { display: flex; justify-content: center; gap: 16px; margin-top: 34px; }
  .pnc-swatch { width: 44px; height: 44px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: all .35s ease; padding: 0; }
  .pnc-swatch:hover { transform: scale(1.15); }
  .pnc-swatch.on { border-color: ${theme.goldSoft}; box-shadow: 0 0 0 5px rgba(233,196,106,.15); transform: scale(1.15); }
  .pnc-surge { position: fixed; inset: 0; pointer-events: none; opacity: .5; z-index: 1500; transition: opacity .7s ease; }
`;

export interface SwatchOption {
  name: string;
  hex: string;
}

interface Props {
  colors: SwatchOption[];
  initial?: number;
  title?: string;
  hint?: string;
  width?: string;
  height?: string;
  /** render the colored item — pass Bed, Sofa or any CSS-var consumer */
  children?: (color: string) => ReactNode;
}

function flash(hex: string) {
  const d = document.createElement("div");
  d.className = "pnc-surge";
  d.style.background = `radial-gradient(circle at 50% 60%, ${hex}88, transparent 60%)`;
  document.body.appendChild(d);
  requestAnimationFrame(() => {
    d.style.opacity = "0";
    setTimeout(() => d.remove(), 700);
  });
}

/** Live color configurator — pick a shade, the product recolors instantly with a pulse. */
function ColorConfigurator({
  colors,
  initial = 0,
  title = "غيّر اللون… عيش القطعة",
  hint = "اللون بيتغير لحظيًا",
  width,
  height,
  children,
}: Props) {
  const [idx, setIdx] = useState(initial);
  const color = colors[idx] ?? colors[0]!;
  const stage: CSSProperties = {
    position: "relative",
    width: "min(520px, 84vw)",
    height: 260,
    perspective: 1400,
    display: "grid",
    placeItems: "center",
    textAlign: "center",
  };

  return (
    <div dir="rtl" style={{ textAlign: "center" }}>
      <style>{css}</style>
      <h3 style={{ fontWeight: 900, fontSize: "clamp(20px,3.5vw,30px)", marginBottom: 4 }}>
        {title}
      </h3>
      <div style={stage}>
        {children ? (
          children(color.hex)
        ) : (
          <Sofa
            width={width ?? "min(480px, 78vw)"}
            height={height ?? "220px"}
            upholstery={color.hex}
            tilt
          />
        )}
      </div>
      <div className="pnc-swatches">
        {colors.map((c, i) => (
          <button
            key={c.hex}
            className={"pnc-swatch" + (i === idx ? " on" : "")}
            style={{ background: c.hex }}
            aria-label={c.name}
            title={c.name}
            onClick={() => {
              if (i !== idx) flash(c.hex);
              setIdx(i);
            }}
          />
        ))}
      </div>
      <p style={{ marginTop: 20, fontSize: 13, color: theme.muted }}>
        {hint} · <b style={{ color: theme.goldSoft }}>{color.name}</b>
      </p>
    </div>
  );
}

export default memo(ColorConfigurator);

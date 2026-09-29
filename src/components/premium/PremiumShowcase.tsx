import {
  CoverflowCarousel,
  KineticHero,
  ScrollStory,
  FurnitureScene,
  ColorConfigurator,
  Marquee,
  Grain,
  CursorGlow,
  GoldPill,
  Sofa,
} from "./index";
import { theme } from "./theme";

const products = [
  { icon: "🛋️", title: "كنب زاوية فاخر", subtitle: "مجالس عصرية", price: "4,850 ر.س" },
  { icon: "🛏️", title: "غرفة نوم مودرن", subtitle: "غرف نوم", price: "7,200 ر.س" },
  { icon: "🪑", title: "كرسي رخام وتنفيذ", subtitle: "كراسي", price: "980 ر.س" },
  { icon: "🪞", title: "مرآة كونسول", subtitle: "مرايا", price: "1,340 ر.س" },
  { icon: "🗄️", title: "كومودينو خشبي", subtitle: "كومودينو", price: "760 ر.س" },
  { icon: "🍽️", title: "طاولة طعام 8 كراسي", subtitle: "طاولات طعام", price: "3,100 ر.س" },
  { icon: "🛋️", title: "كنب كلاسيك", subtitle: "كنب", price: "2,650 ر.س" },
];

const colors = [
  { name: "بيج", hex: "#a87b4d" },
  { name: "مشمشي", hex: "#c98a5e" },
  { name: "زيتي", hex: "#5c6b52" },
  { name: "كحلي", hex: "#3d4a63" },
  { name: "بورجندي", hex: "#7a3b44" },
];

/**
 * One import to rule them all — mount this inside your homepage.
 * Replace emoji with real product images via the `image` prop on items.
 */
export function PremiumShowcase() {
  return (
    <div
      dir="rtl"
      style={{
        background: theme.ink,
        color: theme.paper,
        fontFamily: "inherit",
        minHeight: "100vh",
        paddingTop: 76,
      }}
    >
      <Grain />
      <CursorGlow />

      <KineticHero
        kicker="قطعة واحدة من الذوق"
        words={[{ text: "ديرنا" }, { text: "خيرتك؟", mix: true }]}
        lead="لأنك مش بتشتري قطعة أثاث… انت بتختار الجوّ اللي هتعيش فيه."
      >
        <Sofa width="min(480px, 78vw)" height="220px" tilt />
        <ColorConfigurator colors={colors} />
      </KineticHero>

      <Marquee
        items={[
          "توصيل مجاني للرياض",
          "ضمان سنتين",
          "تشطيب فاخر",
          "دفع عند الاستلام",
          "تخصيص ألوان وأقمشة",
        ]}
      />

      <ScrollStory
        title={
          <>
            قطعتك… <span style={{ color: theme.goldSoft }}>تتكوّن قدامك</span>
          </>
        }
        subtitle="كل جزء من الغرفة بيتوضع بمكانه وأنت بتكمل التمرير — سردية بصرية."
      >
        <FurnitureScene />
      </ScrollStory>

      <section
        style={{ maxWidth: 1180, margin: "0 auto", padding: "120px 20px", textAlign: "center" }}
      >
        <h2 style={{ fontWeight: 900, fontSize: "clamp(28px,4.5vw,48px)", marginBottom: 40 }}>
          مسرح{" "}
          <span
            style={{
              background: `linear-gradient(90deg,${theme.goldSoft},${theme.gold})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            المنتجات
          </span>
        </h2>
        <CoverflowCarousel items={products} />
      </section>

      <section style={{ padding: "60px 20px 120px", textAlign: "center" }}>
        <h2 style={{ fontWeight: 900, fontSize: "clamp(30px,7vw,64px)" }}>
          غرفتك{" "}
          <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(233,196,106,.35)" }}>
            تستحق
          </span>{" "}
          اختيار
        </h2>
        <div style={{ marginTop: 44 }}>
          <GoldPill
            onClick={() => {
              window.location.href = "https://wa.me/";
            }}
          >
            احجز زيارة صالة
          </GoldPill>
        </div>
      </section>
    </div>
  );
}

export default PremiumShowcase;

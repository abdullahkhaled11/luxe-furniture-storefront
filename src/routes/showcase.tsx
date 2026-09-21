import { createFileRoute, Link } from "@tanstack/react-router";
import {
  KineticHero,
  Marquee,
  ScrollStory,
  FurnitureScene,
  CoverflowCarousel,
  ColorConfigurator,
  Grain,
  CursorGlow,
  GoldPill,
  Bed,
  theme,
} from "@/components/premium";
import type { CoverflowItem } from "@/components/premium";

const products: CoverflowItem[] = [
  {
    title: "سرير لافندر الملكي",
    subtitle: "تصميم مخملي فاخر",
    price: "2,499 ر.س",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "سرير سكون",
    subtitle: "خطوط عصرية ناعمة",
    price: "2,190 ر.س",
    image:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "سرير رويال",
    subtitle: "تفاصيل راقية",
    price: "2,899 ر.س",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "سرير أثير",
    subtitle: "خشب طبيعي دافئ",
    price: "1,999 ر.س",
    image:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "سرير ليان",
    subtitle: "تنجيد ناعم مودرن",
    price: "2,350 ر.س",
    image:
      "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "سرير ترف",
    subtitle: "حضور ملكي",
    price: "3,290 ر.س",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=85",
  },
];

const bedroomColors = [
  { name: "روز جولدي", hex: "#a87b4f" },
  { name: "سموكي بلو", hex: "#43546b" },
  { name: "ميرتل", hex: "#4b5b48" },
  { name: "بورجندي", hex: "#6e3942" },
  { name: "جرافيت", hex: "#3a3f46" },
];

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: "دار النوم | تجربة تفاعلية 2026" },
      {
        name: "description",
        content:
          "سردية بصرية، كونفيجير ألوان مباشر، وكتالوج ثلاثي الأبعاد — تجربة شراء من جيل جديد.",
      },
    ],
  }),
  component: ShowcasePage,
});

function ShowcasePage() {
  return (
    <div
      dir="rtl"
      style={{
        background: theme.ink,
        color: theme.paper,
        fontFamily: "inherit",
        minHeight: "100vh",
      }}
    >
      <Grain />
      <CursorGlow />

      <div style={{ position: "fixed", top: 18, left: 20, zIndex: 1200 }}>
        <Link
          to="/"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: theme.goldSoft,
            textDecoration: "none",
            border: `1px solid rgba(233,196,106,.35)`,
            padding: "9px 18px",
            borderRadius: 999,
            background: "rgba(15,12,9,.6)",
          }}
        >
          ← العودة للمتجر
        </Link>
      </div>

      <KineticHero
        kicker="دار النوم — تجربة تفاعلية"
        words={[{ text: "نوم" }, { text: "لا يُنسى", mix: true }]}
        lead="مش متجر عادي… رحاية بصرية، سريرك تلوّنه بنفسك، والكتالوج حي قدامك."
      >
        <ColorConfigurator
          colors={bedroomColors}
          title="لوّن سريرك بنفسك"
          hint="اللون بيتغيّر لحظيًا في سريرك مباشرة"
        >
          {(color) => <Bed width="min(480px,78vw)" height="240px" upholstery={color} tilt />}
        </ColorConfigurator>
      </KineticHero>

      <Marquee
        items={[
          "شحن مجاني لجميع المناطق",
          "ضمان سنتين",
          "تركيب مجاني",
          "دفع عند الاستلام",
          "تخصيص ألوان وأقمشة",
          "خامات مختارة بعناية",
        ]}
      />

      <ScrollStory
        title={
          <>
            غرفتك… <span style={{ color: theme.goldSoft }}>تتكوّن قدامك</span>
          </>
        }
        subtitle="كل جزء من الغرفة بيتوضع مكانه وأنت بتكمل التمرير — سردية بصرية بلا مجهود."
      >
        <FurnitureScene />
      </ScrollStory>

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "120px 20px 40px",
          textAlign: "center",
        }}
      >
        <p style={{ letterSpacing: 4, fontSize: 12, color: theme.gold }}>الأكثر طلباً</p>
        <h2 style={{ fontWeight: 900, fontSize: "clamp(28px,4.5vw,48px)", margin: "8px 0 42px" }}>
          كتالوج{" "}
          <span
            style={{
              background: `linear-gradient(90deg,${theme.goldSoft},${theme.gold})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            حي
          </span>
        </h2>
        <CoverflowCarousel items={products} />
      </section>

      <section style={{ textAlign: "center", padding: "70px 20px 130px" }}>
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
              window.location.href = "https://wa.me/966500000000";
            }}
          >
            احجز زيارة صالة
          </GoldPill>
        </div>
      </section>
    </div>
  );
}

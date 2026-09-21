import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Award, Check, ChevronLeft, Clock3, CreditCard, Headphones, Heart,
  Menu, MessageCircle, Minus, PackageCheck, Plus, ShieldCheck, ShoppingBag,
  Star, Trash2, Truck, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useCart, type CartProduct } from "@/lib/cart-context";
import CoverflowCarousel from "@/components/premium/CoverflowCarousel";
import { CinemaKit, MarqueeBand, ParallaxImage, Reveal, StatsBand } from "@/components/premium/cinema";

const heroImage = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=88";

const products = [
  { id: 1, name: "سرير لافندر الملكي", short: "تصميم مخملي فاخر بظهر مرتفع", price: 2499, oldPrice: 3199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85" },
  { id: 2, name: "سرير سكون", short: "أناقة هادئة وخطوط عصرية ناعمة", price: 2190, oldPrice: 2790, image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1200&q=85" },
  { id: 3, name: "سرير رويال", short: "تفاصيل راقية لراحة استثنائية", price: 2899, oldPrice: 3699, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85" },
  { id: 4, name: "سرير أثير", short: "خشب طبيعي بلمسة دافئة ومتينة", price: 1999, oldPrice: 2499, image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=85" },
  { id: 5, name: "سرير ليان", short: "تنجيد ناعم يناسب المساحات الحديثة", price: 2350, oldPrice: 2990, image: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?auto=format&fit=crop&w=1200&q=85" },
  { id: 6, name: "سرير ترف", short: "حضور ملكي وتفاصيل صنعت بعناية", price: 3290, oldPrice: 4190, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85" },
];

type Product = (typeof products)[number];
type View = "store" | "checkout" | "success";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دار النوم | أسرّة فاخرة لراحة تدوم" },
      { name: "description", content: "تسوق أجمل الأسرّة العصرية بجودة عالية وشحن مجاني لجميع مناطق المملكة من دار النوم." },
      { property: "og:title", content: "دار النوم | أسرّة فاخرة لراحة تدوم" },
      { property: "og:description", content: "أسرّة عصرية بجودة عالية، ضمان شامل، تركيب وشحن مجاني." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: StorePage,
});

const formatPrice = (value: number) => new Intl.NumberFormat("ar-SA").format(value);

function StorePage() {
  const cart = useCart();
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("دبل");
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState<View>("store");
  const [orderNumber, setOrderNumber] = useState(0);
  const [time, setTime] = useState({ hours: 8, minutes: 24, seconds: 36 });

  useEffect(() => {
    const timer = window.setInterval(() => setTime((current) => {
      let total = current.hours * 3600 + current.minutes * 60 + current.seconds - 1;
      if (total < 0) total = 8 * 3600 + 24 * 60 + 36;
      return { hours: Math.floor(total / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
    }), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const addSelected = (buyNow = false) => {
    if (!selected) return;
    cart.addItem(selected as CartProduct, selectedSize, quantity);
    setSelected(null);
    setQuantity(1);
    if (buyNow) setView("checkout");
    else setCartOpen(true);
  };

  if (view === "checkout") return <Checkout onBack={() => setView("store")} onSuccess={() => {
    setOrderNumber(Math.floor(100000 + Math.random() * 900000));
    cart.clearCart();
    setView("success");
  }} />;

  if (view === "success") return <Success orderNumber={orderNumber} onHome={() => setView("store")} />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <CinemaKit />
      <div className="bg-charcoal px-4 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
        شحن مجاني لجميع مناطق المملكة
      </div>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto grid h-18 max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="فتح القائمة"><Menu /></Button>
          <a href="#home" className="min-w-0 text-center text-2xl font-extrabold text-charcoal lg:text-right">دار <span className="text-primary">النوم</span></a>
          <nav className="hidden items-center justify-center gap-8 text-sm font-semibold lg:flex">
            <a href="#home" className="hover:text-primary">الرئيسية</a><a href="#beds" className="hover:text-primary">السراير</a><a href="#offers" className="hover:text-primary">العروض</a><a href="#reviews" className="hover:text-primary">آراء العملاء</a><a href="#contact" className="hover:text-primary">تواصل معنا</a>
          </nav>
          <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)} aria-label="فتح السلة">
            <ShoppingBag /><span className="absolute -left-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{cart.count}</span>
          </Button>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[85%]" dir="rtl">
          <SheetTitle className="text-right text-2xl font-extrabold">دار <span className="text-primary">النوم</span></SheetTitle>
          <SheetDescription className="sr-only">قائمة التنقل الرئيسية</SheetDescription>
          <nav className="mt-10 grid gap-2 text-lg font-semibold">
            {[['home','الرئيسية'],['beds','السراير'],['offers','العروض'],['reviews','آراء العملاء'],['contact','تواصل معنا']].map(([id,label]) => <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)} className="border-b py-4">{label}</a>)}
          </nav>
        </SheetContent>
      </Sheet>

      <main>
        <section id="home" className="dn-hero">
          <div className="dn-hero-bg">
            <img src={heroImage} alt="غرفة نوم فاخرة بإضاءة دافئة" />
          </div>
          <div className="dn-hero-veil" />
          <div className="dn-hero-glow g1" />
          <div className="dn-hero-glow g2" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-28 sm:px-8">
            <div className="max-w-3xl text-primary-foreground">
              <p className="mb-6 flex items-center gap-3 text-sm font-bold text-gold-soft sm:text-base" style={{ opacity: 0, animation: "dnFade 0.8s ease 2.45s forwards" }}>
                <span className="h-px w-10 bg-gold-soft/70" />
                راحة تستحقها كل ليلة
              </p>
              <h1 className="text-5xl font-extrabold leading-[1.12] sm:text-7xl lg:text-8xl">
                {["نوم", "هانئ", "يدوم"].map((word, i) => (
                  <span key={word} className="dn-word">
                    {i > 0 && " "}
                    <span className={i === 2 ? "text-gold-soft" : ""} style={{ animationDelay: `${2.35 + i * 0.18}s` }}>{word}</span>
                  </span>
                ))}
              </h1>
              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-primary-foreground/75 sm:text-2xl" style={{ opacity: 0, animation: "dnFade 0.8s ease 2.75s forwards" }}>
                أفضل أطقم وأسرّة بجودة عالية — نصنع راحتك بخامات مختارة وخدمة تركيب تصل لبيتك.
              </p>
              <div className="mt-9 flex flex-wrap gap-3" style={{ opacity: 0, animation: "dnFade 0.9s ease 2.95s forwards" }}>
                <Button variant="luxury" size="lg" asChild><a href="#beds">تسوق الآن <ChevronLeft /></a></Button>
                <Button variant="heroOutline" size="lg" asChild><a href="#about">تعرف علينا</a></Button>
              </div>
              <div className="mt-12 flex flex-wrap gap-3">
                <span className="dn-chip-float"><span className="dn-chip" style={{ animationDelay: "3.1s" }}><i>✧</i>ضمان شامل 5 سنوات</span></span>
                <span className="dn-chip-float f2"><span className="dn-chip" style={{ animationDelay: "3.25s" }}><i>✧</i>خشب طبيعي 100%</span></span>
                <span className="dn-chip-float f3"><span className="dn-chip" style={{ animationDelay: "3.4s" }}><i>✧</i>تركيب مجاني</span></span>
              </div>
            </div>
          </div>
          <div className="dn-scroll-cue">
            <span className="dn-mouse" />
            <i>اسحب للأسفل</i>
          </div>
        </section>

        <MarqueeBand items={["سرير لافندر", "توصيل مجاني", "ضمان شامل", "خشب طبيعي", "خياطة يدوية", "تركيب مجاني", "خامة فاخرة", "تصميم عصري"]} />

        <section className="border-b bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-8 md:grid-cols-4 md:px-8">
            {[[Truck, "شحن مجاني"], [Award, "جودة صناعة ممتازة"], [ShieldCheck, "دفع آمن"], [Headphones, "دعم وتواصل 24/7"]].map(([Icon, label], index) => {
              const FeatureIcon = Icon as typeof Truck;
              return <Reveal key={label as string} delay={index * 90}><div className={`flex items-center gap-3 px-2 ${index > 0 ? "md:border-r" : ""}`}><span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-primary"><FeatureIcon /></span><span className="text-sm font-bold sm:text-base">{label as string}</span></div></Reveal>;
            })}
          </div>
        </section>

        <section className="bg-charcoal py-18 text-primary-foreground sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-sm font-bold text-gold-soft">الأكثر طلباً بين عملائنا</p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">كتالوج حي لسرايرنا</h2>
              <p className="mt-3 leading-7 text-primary-foreground/70">تصفّح الأسرّة الأكثر مبيعاً بتجربة تفاعلية — اسحب الكروت أو استخدم الأسهم.</p>
            </div>
            <CoverflowCarousel items={products.map((p) => ({ title: p.name, subtitle: p.short, price: `${formatPrice(p.price)} ر.س`, image: p.image }))} />
          </div>
        </section>

        <section className="border-t border-primary/10 bg-charcoal text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl pt-16 text-center">
              <p className="text-sm font-bold text-gold-soft">أرقام تتحدث عنا</p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">ثقة تستحقها راحة نومك</h2>
            </div>
            <div className="relative">
              <StatsBand stats={[{ value: 8, suffix: "+", label: "سنوات خبرة" }, { value: 25000, suffix: "+", label: "عميل سعيد" }, { value: 1200, suffix: "+", label: "قطعة مركّبة" }, { value: 98, suffix: "%", label: "رضا العملاء" }]} />
            </div>
          </div>
        </section>

        <section id="beds" className="mx-auto max-w-7xl px-4 py-18 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading eyebrow="اختيارات صنعت لراحتك" title="أحدث سرايرنا" description="تصاميم تجمع بين جودة الخامات وأناقة التفاصيل لتمنحك بداية أفضل لكل يوم." />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {products.map((product, index) => <Reveal key={product.id} delay={index * 90}><ProductCard product={product} onOpen={() => { setSelected(product); setSelectedSize("دبل"); setQuantity(1); }} onAdd={() => { cart.addItem(product, "دبل"); setCartOpen(true); }} /></Reveal>)}
          </div>
        </section>

        <section id="offers" className="mx-auto max-w-7xl px-4 pb-18 sm:px-6 sm:pb-24 lg:px-8">
          <div className="relative overflow-hidden rounded-lg bg-charcoal px-6 py-12 text-primary-foreground shadow-luxury sm:px-12 sm:py-14">
            <div className="absolute inset-y-0 left-0 w-1/3 bg-primary/15" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><p className="mb-3 font-bold text-gold-soft">لفترة محدودة</p><h2 className="text-3xl font-extrabold leading-snug sm:text-4xl">خصم يصل إلى 30% على طقم السرير الكامل</h2><p className="mt-3 text-primary-foreground/70">جدّد غرفة نومك الآن بسعر استثنائي وشحن مجاني.</p></div>
              <div className="flex gap-2" dir="ltr">
                {[[time.hours,"ساعة"],[time.minutes,"دقيقة"],[time.seconds,"ثانية"]].map(([n,label]) => <div key={label as string} className="grid min-w-20 place-items-center rounded-md border border-primary-foreground/20 bg-primary-foreground/10 p-3"><strong className="text-2xl">{String(n).padStart(2,"0")}</strong><span className="text-xs text-primary-foreground/70">{label}</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="bg-cream py-18 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="ثقتكم مصدر فخرنا" title="آراء عملائنا" description="تجارب حقيقية من عملاء اختاروا الراحة والجودة مع دار النوم." />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {([ ["نورة العتيبي", "جدة", "السّرير أجمل من الصور، والخامة ممتازة جداً. وصلني في الموعد والتركيب كان مرتب وسريع."], ["عبدالله القحطاني", "الرياض", "تجربة شراء مريحة من البداية للنهاية، المقاس مضبوط وجودة التنجيد فاقت توقعي."], ["ريم الحربي", "الخبر", "تعامل راقٍ وسرعة في الرد. السرير غيّر شكل الغرفة بالكامل وأنصح به بكل ثقة."] ] as const).map(([name, city, text], index) => <Reveal key={name} as="article" delay={index * 110} className="h-full"><div className="h-full rounded-lg border bg-card p-6 shadow-sm"><div className="mb-5 flex text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}</div><p className="leading-8 text-muted-foreground">“{text}”</p><div className="mt-6 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-full bg-charcoal font-bold text-primary-foreground">{name.charAt(0)}</div><div><h3 className="font-bold">{name}</h3><p className="text-xs text-muted-foreground">{city}</p></div></div></div></Reveal>)}
            </div>
          </div>
        </section>

        <section id="about" dir="rtl" className="grid lg:grid-cols-2">
          <Reveal from="right" y={0} className="min-h-[380px]"><ParallaxImage src="https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=1400&q=85" alt="تفاصيل سرير فاخر مصنوع بعناية" /></Reveal>
          <Reveal from="left" y={0}><div className="flex h-full items-center bg-card px-6 py-14 sm:px-14 lg:px-20"><div className="max-w-xl"><p className="font-bold text-primary">صناعة نهتم بكل تفاصيلها</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">جودة تضمنها سنوات من الخبرة</h2><p className="mt-5 leading-8 text-muted-foreground">نصنع أسرّتنا لتكون جزءاً من راحتك لسنوات، بخامات مختارة وعناية تبدأ من التصميم حتى التركيب في منزلك.</p><ul className="mt-8 grid gap-4">{["خامات متينة مختارة بعناية", "ضمان شامل لراحة بالك", "تركيب مجاني باحترافية"].map((item, index) => <Reveal key={item} as="li" delay={index * 100} className="flex items-center gap-3 font-semibold"><span className="grid size-7 place-items-center rounded-full bg-secondary text-primary"><Check className="size-4" /></span>{item}</Reveal>)}</ul></div></div></Reveal>
        </section>
      </main>

      <Footer />
      <a href="https://wa.me/966500000000" target="_blank" rel="noreferrer" aria-label="تواصل عبر واتساب" className="fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-success text-primary-foreground shadow-luxury transition-transform hover:scale-105"><MessageCircle className="size-7" /></a>

      <ProductDialog product={selected} open={Boolean(selected)} onClose={() => setSelected(null)} size={selectedSize} setSize={setSelectedSize} quantity={quantity} setQuantity={setQuantity} onAdd={() => addSelected(false)} onBuy={() => addSelected(true)} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} onCheckout={() => { setCartOpen(false); setView("checkout"); }} />
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold text-primary">{eyebrow}</p><h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2><p className="mt-3 leading-7 text-muted-foreground">{description}</p></div>;
}

function ProductCard({ product, onOpen, onAdd }: { product: Product; onOpen: () => void; onAdd: () => void }) {
  return <article className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-luxury">
    <div className="relative aspect-[4/3] cursor-pointer overflow-hidden" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onOpen()}>
      <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      <span className="absolute right-2 top-2 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground sm:right-3 sm:top-3 sm:text-xs">خصم 20%</span>
      <Button size="icon" variant="secondary" className="absolute left-2 top-2 size-8 sm:left-3 sm:top-3" aria-label="إضافة للمفضلة"><Heart className="size-4" /></Button>
    </div>
    <div className="p-3 sm:p-5"><div className="mb-2 flex items-center gap-1 text-xs text-primary"><Star className="size-3 fill-current" /><span className="font-bold">4.8</span><span className="text-muted-foreground">(120)</span></div><h3 className="cursor-pointer text-base font-bold sm:text-lg" onClick={onOpen}>{product.name}</h3><p className="mt-1 hidden text-sm text-muted-foreground sm:block">{product.short}</p><div className="mt-3 flex flex-wrap items-baseline gap-2"><strong className="text-lg text-primary sm:text-xl">{formatPrice(product.price)} ر.س</strong><del className="text-xs text-muted-foreground sm:text-sm">{formatPrice(product.oldPrice)} ر.س</del></div><Button variant="luxury" className="mt-4 w-full px-2 text-xs sm:text-sm" onClick={onAdd}><ShoppingBag />أضف للسلة</Button></div>
  </article>;
}

function ProductDialog({ product, open, onClose, size, setSize, quantity, setQuantity, onAdd, onBuy }: { product: Product | null; open: boolean; onClose: () => void; size: string; setSize: (size: string) => void; quantity: number; setQuantity: (quantity: number) => void; onAdd: () => void; onBuy: () => void }) {
  if (!product) return null;
  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
    <DialogContent dir="rtl" className="max-h-[92vh] max-w-5xl overflow-y-auto p-0 sm:rounded-lg [&>button]:left-4 [&>button]:right-auto">
      <DialogTitle className="sr-only">تفاصيل {product.name}</DialogTitle><DialogDescription className="sr-only">اختر المقاس والكمية ثم أضف المنتج إلى السلة</DialogDescription>
      <div className="grid md:grid-cols-2">
        <div className="bg-cream p-3 sm:p-6"><img src={product.image} alt={product.name} className="aspect-square w-full rounded-md object-cover" /><div className="mt-3 grid grid-cols-3 gap-2">{products.slice(0,3).map((item) => <img key={item.id} src={item.image} alt="عرض إضافي للسرير" className="aspect-[4/3] rounded-sm object-cover opacity-80" />)}</div></div>
        <div className="p-5 sm:p-8"><p className="text-sm font-bold text-primary">دار النوم</p><h2 className="mt-2 text-3xl font-extrabold">{product.name}</h2><div className="mt-3 flex items-center gap-2"><div className="flex text-primary">{Array.from({length:5}).map((_,i) => <Star key={i} className="size-4 fill-current" />)}</div><span className="text-sm text-muted-foreground">4.8 · 120 تقييم</span></div><p className="mt-5 leading-7 text-muted-foreground">سرير أنيق مصنوع من خامات عالية الجودة، بتنجيد ناعم وهيكل متين يمنح غرفة نومك لمسة فاخرة وراحة تدوم.</p><div className="mt-5 flex items-baseline gap-3"><strong className="text-3xl text-primary">{formatPrice(product.price)} ر.س</strong><del className="text-muted-foreground">{formatPrice(product.oldPrice)} ر.س</del></div>
          <div className="mt-6"><p className="mb-3 font-bold">اختر المقاس</p><div className="flex flex-wrap gap-2">{["مفرد","دبل","كوين","كينج"].map((item) => <Button key={item} variant={size === item ? "default" : "outline"} onClick={() => setSize(item)}>{item}</Button>)}</div></div>
          <div className="mt-6"><p className="mb-3 font-bold">الكمية</p><Quantity value={quantity} onChange={setQuantity} /></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><Button variant="luxury" size="lg" onClick={onAdd}><ShoppingBag />أضف إلى السلة</Button><Button variant="outline" size="lg" className="border-primary text-primary" onClick={onBuy}>اشترِ الآن</Button></div>
          <Accordion type="single" collapsible className="mt-7"><AccordionItem value="description"><AccordionTrigger>الوصف</AccordionTrigger><AccordionContent className="leading-7 text-muted-foreground">تصميم عصري مريح، سهل التنسيق مع مختلف أنماط غرف النوم.</AccordionContent></AccordionItem><AccordionItem value="specs"><AccordionTrigger>المواصفات</AccordionTrigger><AccordionContent className="leading-7 text-muted-foreground">هيكل خشبي متين، تنجيد فاخر، وارتفاع مناسب للاستخدام اليومي.</AccordionContent></AccordionItem><AccordionItem value="shipping"><AccordionTrigger>طرق الشحن</AccordionTrigger><AccordionContent className="leading-7 text-muted-foreground">شحن وتركيب مجاني لجميع مناطق المملكة خلال 5–10 أيام عمل.</AccordionContent></AccordionItem><AccordionItem value="returns"><AccordionTrigger>سياسة الإرجاع</AccordionTrigger><AccordionContent className="leading-7 text-muted-foreground">يمكن طلب الإرجاع خلال 7 أيام وفق شروط سلامة المنتج.</AccordionContent></AccordionItem></Accordion>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}

function Quantity({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <div className="grid w-30 grid-cols-3 items-center rounded-md border bg-card"><Button variant="ghost" size="icon" onClick={() => onChange(Math.max(1, value - 1))} aria-label="تقليل الكمية"><Minus /></Button><span className="text-center font-bold">{value}</span><Button variant="ghost" size="icon" onClick={() => onChange(value + 1)} aria-label="زيادة الكمية"><Plus /></Button></div>;
}

function CartDrawer({ open, onOpenChange, onCheckout }: { open: boolean; onOpenChange: (value: boolean) => void; onCheckout: () => void }) {
  const cart = useCart();
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="left" dir="rtl" className="flex w-[92%] flex-col sm:max-w-md [&>button]:left-4 [&>button]:right-auto"><SheetTitle className="flex items-center gap-2 text-right text-xl"><ShoppingBag />سلة التسوق <span className="text-sm font-normal text-muted-foreground">({cart.count} منتجات)</span></SheetTitle><SheetDescription className="sr-only">محتويات سلة التسوق</SheetDescription>
    {cart.items.length === 0 ? <div className="grid flex-1 place-items-center text-center"><div><ShoppingBag className="mx-auto size-14 text-muted-foreground/40" /><p className="mt-4 font-bold">سلتك فارغة</p><p className="mt-1 text-sm text-muted-foreground">أضف سريرك المفضل لتجده هنا</p></div></div> : <><div className="mt-6 flex-1 space-y-5 overflow-y-auto">{cart.items.map((item) => <div key={`${item.id}-${item.size}`} className="grid grid-cols-[76px_minmax(0,1fr)_auto] gap-3 border-b pb-5"><img src={item.image} alt={item.name} className="size-19 rounded-md object-cover" /><div className="min-w-0"><h3 className="truncate font-bold">{item.name}</h3><p className="text-xs text-muted-foreground">المقاس: {item.size}</p><p className="mt-1 font-bold text-primary">{formatPrice(item.price)} ر.س</p><div className="mt-2 flex w-24 items-center justify-between rounded-md border"><Button variant="ghost" size="icon" className="size-7" onClick={() => cart.updateQuantity(item.id,item.size,item.quantity-1)}><Minus /></Button><span className="text-sm">{item.quantity}</span><Button variant="ghost" size="icon" className="size-7" onClick={() => cart.updateQuantity(item.id,item.size,item.quantity+1)}><Plus /></Button></div></div><Button variant="ghost" size="icon" className="text-destructive" onClick={() => cart.removeItem(item.id,item.size)} aria-label="حذف المنتج"><Trash2 /></Button></div>)}</div><div className="border-t pt-5"><div className="mb-4 flex justify-between text-lg font-extrabold"><span>الإجمالي</span><span>{formatPrice(cart.subtotal)} ر.س</span></div><p className="mb-4 text-xs text-muted-foreground">شامل الضريبة · الشحن والتركيب مجاناً</p><Button variant="luxury" size="lg" className="w-full" onClick={onCheckout}>إتمام الطلب <ChevronLeft /></Button></div></>}
  </SheetContent></Sheet>;
}

function Checkout({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const cart = useCart();
  const [payment, setPayment] = useState("cod");
  const submit = (event: FormEvent) => { event.preventDefault(); if (cart.items.length) onSuccess(); };
  return <div className="min-h-screen bg-cream" dir="rtl"><header className="border-b bg-card"><div className="mx-auto grid h-18 max-w-6xl grid-cols-[auto_1fr_auto] items-center px-4"><Button variant="ghost" onClick={onBack}><ChevronLeft className="rotate-180" />عودة</Button><div className="text-center text-2xl font-extrabold">دار <span className="text-primary">النوم</span></div><ShieldCheck className="text-primary" /></div></header><main className="mx-auto max-w-6xl px-4 py-10"><div className="mb-8"><p className="text-sm font-bold text-primary">خطوة واحدة تفصلك عن الراحة</p><h1 className="mt-2 text-3xl font-extrabold">إتمام الطلب</h1></div><form onSubmit={submit} className="grid gap-7 lg:grid-cols-[1fr_380px]"><div className="space-y-7"><section className="rounded-lg border bg-card p-5 shadow-sm sm:p-7"><h2 className="mb-5 text-xl font-bold">بيانات التوصيل</h2><div className="grid gap-4 sm:grid-cols-2"><Field label="الاسم الكامل"><Input required placeholder="اكتب اسمك" className="h-12" /></Field><Field label="رقم الهاتف"><Input required type="tel" placeholder="05XXXXXXXX" className="h-12" dir="rtl" /></Field><Field label="المدينة"><Input required placeholder="مثال: الرياض" className="h-12" /></Field><Field label="العنوان التفصيلي"><Input required placeholder="الحي، الشارع، رقم المنزل" className="h-12" /></Field><div className="sm:col-span-2"><Field label="ملاحظات الطلب (اختياري)"><Textarea placeholder="أي تفاصيل تساعد فريق التوصيل" className="min-h-24" /></Field></div></div></section><section className="rounded-lg border bg-card p-5 shadow-sm sm:p-7"><h2 className="mb-5 text-xl font-bold">طريقة الدفع</h2><div className="grid gap-3">{([ ["cod","الدفع عند الاستلام","ادفع نقداً عند وصول طلبك"], ["mada","مدى","دفع آمن بواسطة بطاقة مدى"], ["apple","Apple Pay","دفع سريع وآمن"] ] as const).map(([id,title,desc]) => <label key={id} className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border p-4 ${payment === id ? "border-primary bg-secondary/60" : ""}`}><input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} className="accent-primary" /><span><strong className="block">{title}</strong><small className="text-muted-foreground">{desc}</small></span><CreditCard className="text-primary" /></label>)}</div></section></div><aside className="h-fit rounded-lg border bg-card p-5 shadow-sm lg:sticky lg:top-6"><h2 className="text-xl font-bold">ملخص الطلب</h2><div className="my-5 space-y-4">{cart.items.map((item) => <div key={`${item.id}-${item.size}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-3"><img src={item.image} alt={item.name} className="size-14 rounded-md object-cover" /><div className="min-w-0"><p className="truncate text-sm font-bold">{item.name}</p><p className="text-xs text-muted-foreground">{item.size} · الكمية {item.quantity}</p></div><span className="text-sm font-bold">{formatPrice(item.price*item.quantity)} ر.س</span></div>)}</div><div className="space-y-3 border-y py-4 text-sm"><div className="flex justify-between"><span>المجموع</span><span>{formatPrice(cart.subtotal)} ر.س</span></div><div className="flex justify-between"><span>الشحن والتركيب</span><span className="font-bold text-success">مجاني</span></div></div><div className="my-5 flex justify-between text-xl font-extrabold"><span>الإجمالي</span><span>{formatPrice(cart.subtotal)} ر.س</span></div><Button variant="luxury" size="lg" className="w-full" type="submit" disabled={!cart.items.length}>تأكيد الطلب <PackageCheck /></Button><p className="mt-3 text-center text-xs text-muted-foreground"><ShieldCheck className="ml-1 inline size-3" />بياناتك محفوظة ومحمية</p></aside></form></main></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-bold">{label}{children}</label>; }

function Success({ orderNumber, onHome }: { orderNumber: number; onHome: () => void }) {
  return <main className="grid min-h-screen place-items-center bg-cream px-4 text-center" dir="rtl"><div className="max-w-xl"><div className="mx-auto grid size-24 place-items-center rounded-full bg-success text-primary-foreground"><Check className="size-12" /></div><p className="mt-8 font-bold text-primary">تم استلام طلبك بنجاح</p><h1 className="mt-2 text-4xl font-extrabold">شكراً لاختيارك دار النوم</h1><p className="mt-4 leading-8 text-muted-foreground">سيتواصل معك فريقنا قريباً لتأكيد تفاصيل الطلب وموعد التوصيل والتركيب.</p><div className="mx-auto mt-7 max-w-sm rounded-lg border bg-card p-5 shadow-sm"><p className="text-sm text-muted-foreground">رقم الطلب</p><strong className="mt-1 block text-2xl text-primary">#{orderNumber}</strong></div><Button variant="luxury" size="lg" className="mt-8" onClick={onHome}>العودة للمتجر</Button></div></main>;
}

function Footer() {
  return <footer id="contact" className="bg-charcoal text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4"><div><h2 className="text-2xl font-extrabold">دار <span className="text-gold-soft">النوم</span></h2><p className="mt-4 leading-7 text-primary-foreground/65">نصنع لك مساحة راحة تليق بيومك، بجودة سعودية وخدمة تثق بها.</p></div><div><h3 className="font-bold">روابط سريعة</h3><div className="mt-4 grid gap-3 text-sm text-primary-foreground/65"><a href="#home">الرئيسية</a><a href="#beds">السراير</a><a href="#offers">العروض</a><a href="#reviews">آراء العملاء</a></div></div><div><h3 className="font-bold">تواصل معنا</h3><div className="mt-4 grid gap-3 text-sm text-primary-foreground/65"><a href="tel:+966500000000">+966 5XXXXXXXX</a><a href="https://wa.me/966500000000">واتساب</a><a href="mailto:hello@daralnoum.sa">hello@daralnoum.sa</a></div></div><div><h3 className="font-bold">طرق دفع مرنة وآمنة</h3><div className="mt-4 flex flex-wrap gap-2">{["مدى","Visa","Apple Pay","تابي","تمارا"].map((item) => <span key={item} className="rounded-sm border border-primary-foreground/20 px-3 py-2 text-xs font-bold">{item}</span>)}</div></div></div><div className="border-t border-primary-foreground/10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-primary-foreground/50 sm:flex-row sm:items-center sm:justify-between sm:px-8"><p>© 2026 دار النوم. جميع الحقوق محفوظة.</p><div className="flex gap-5"><a href="#contact">شروط الاستخدام</a><a href="#contact">سياسة الخصوصية</a></div></div></div></footer>;
}
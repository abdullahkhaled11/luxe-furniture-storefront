# Luxe Furniture Storefront

<div dir="rtl">

**متجر أثاث فاخر** — واجهة تجارة إلكترونية عربية بالكامل (RTL) لمتجر متخصص في
الأثاث الفاخر، مع سلة مشتريات وخطوة إتمام شراء ومكتبة مؤثرات حركية.

</div>

A full Arabic right-to-left storefront for a premium furniture retailer, built as a
single-page shopping experience with SSR.

**Live demo:** https://luxe-furniture-storefront.vercel.app

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TanStack Start (file-based routing, SSR) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Components | Radix UI primitives (shadcn/ui), Lucide icons, Sonner toasts |
| Components | Embla Carousel, Recharts, React Query |
| Build | Vite, ESLint, Prettier |

## Features

**Storefront (`/`)**

- Full RTL Arabic UI with `Intl.NumberFormat("ar-SA")` for currency and dates.
- Complete purchase flow: `store` → `checkout` → `success`, with an order summary.
- Cart context (`src/lib/cart-context.tsx`) with add, remove, and quantity updates
  exposed through a single `useCart()` hook.
- Product listing with coverflow carousel, hero, marquee band, parallax imagery,
  scroll-triggered reveals, and a stats band.
- Mobile navigation via a Radix sheet, with the full experience preserved on
  desktop.

## Custom motion components

`src/components/premium/` is a self-contained component library built for this
project rather than pulled from a template:

| Component | What it does |
|---|---|
| `CoverflowCarousel` | Coverflow card stack with a physical card-movement model — new cards glide into the centre from the pressed side, outgoing edges exit while the stack shape is preserved |
| `cinema.tsx` | `CinemaKit`, `MarqueeBand`, `ParallaxImage`, `Reveal`, `StatsBand` |
| `effects.tsx` | `Grain`, `CursorGlow` — atmosphere overlays |
| `theme.ts` | Shared design tokens for the premium surface |

The carousel was the main engineering effort. The visible behaviour required
replacing the naive index swap with a keyed transition so both the entering card
and the exiting edges animate in the same frame:

```
feat: physical card movement - cards glide between pyramid slots,
      new card enters from pressed side, edges exit smoothly,
      pyramid shape preserved
```

## Project structure

```
src/
  components/premium/   motion components + design tokens
  components/ui/        Radix / shadcn primitives
  lib/cart-context.tsx  cart state and useCart()
  routes/index.tsx      storefront
```

## Getting started

Requires Node.js 18+.

```sh
git clone https://github.com/abdullahkhaled11/luxe-furniture-storefront.git
cd luxe-furniture-storefront
npm install
npm run dev
```

## Scripts

```sh
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # ESLint
npm run format   # Prettier
```

## License

MIT

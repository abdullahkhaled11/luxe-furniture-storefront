# Remix of Dar Al Nom E-commerce

Build a complete single-product Arabic (RTL) e-commerce store for a bed company. 

The store sells ONLY ONE product: beds (سراير). The design must closely match the 

style of the Saudi furniture store "أثاث نور" (furniture-nor.com) which uses Salla.

GLOBAL SETTINGS:

- Full Arabic language, dir="rtl", clean easy-to-read Arabic font (Tajawal)

- Color palette: warm furniture-store tones — white/cream background, dark 

  charcoal text, amber/gold accent (#B8860B or #D4A017) for buttons and highlights

- Modern luxury feel, generous spacing, rounded corners, subtle shadows

SECTIONS (top to bottom):

1. TOP BAR: shipping notice "شحن مجاني لجميع مناطق المملكة" on dark background.

2. HEADER: logo (placeholder — use brand name "دار النوم"), nav menu 

   (الرئيسية، السراير، العروض، آراء العملاء، تواصل معنا), cart icon with 

   badge showing item count, sticky on scroll.

3. HERO BANNER: full-width with a large elegant bed photo background (use a 

   free stock image of a luxury bed with warm lighting), overlay text:

   - Big heading "نوم هانئ يدوم"

   - Subheading "افضل أطقم وأسرّة بجودة عالية"

   - CTA buttons: "تسوق الآن" (amber) + "تعرف علينا" (outline)

4. TRUST BAR: 4 features in a row with icons — شحن مجاني، جودة صناعة ممتازة، 

   دفع آمن، دعم وتواصل 24/7.

5. PRODUCT GRID — "أحدث سرايرنا": show 6 bed product cards (free stock bed 

   images in warm bedroom settings). Each card: image, Arabic name, 

   "وصف مختصر", price in SAR (sale + old strikethrough price), 

   rating stars, "أضف للسلة" button. Cards clickable to open a detail modal.

6. PRODUCT DETAIL MODAL: large image gallery, name, description, star rating 

   (4.8 · 120 تقييم), price, VARIANT SELECTOR for size: 

   (مفرد / دبل / كينج / كوين) as pill buttons, quantity stepper (+/-), 

   big amber buttons "أضف إلى السلة" and "اشترِ الآن". 

   Accordion sections: الوصف، المواصفات، طرق الشحن، سياسة الإرجاع.

7. DEALS SECTION — "عروضنا المميزة": wide banner with gradient background, 

   "خصم يصل إلى 30% على طقم السرير الكامل" + countdown timer.

8. CUSTOMER REVIEWS — "آراء عملائنا": 3 review cards with Saudi names, 

   Arabic reviews, 5 stars.

9. ABOUT STRIP: "جودة تضمنها سنوات من الخبرة" with image + bullets 

   (خامات متينة، ضمان شامل، تركيب مجاني).

10. FOOTER: brand info, quick links, contact (phone +966 5XXXXXXXX / 

    WhatsApp / email), payment icons (مدى، Visa، Apple Pay، تابي، تمارا),

    "شروط الاستخدام" and "سياسة الخصوصية".

11. WHATSAPP FLOATING BUTTON: fixed bottom-left green WhatsApp button 

    that opens wa.me link.

FUNCTIONALITY:

- Cart drawer (slides from side): line items with image, name, size, qty 

  stepper, remove, subtotal, "إتمام الطلب" CTA.

- Checkout view: form (الاسم، الهاتف، المدينة، العنوان التفصيلي، ملاحظات)، 

  payment method selection (الدفع عند الاستلام / مدى / Apple Pay)، 

  order summary on the side, confirm button.

- Success screen after order with order number.

- State management with React Context + localStorage so cart persists.

- Make everything fully responsive for mobile first (grid collapses to 1-2 

  columns, menu becomes hamburger).

Use free stock images from images.unsplash.com for beds. Do NOT invent 

brand logos — keep the placeholder "دار النوم" as text.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1f5c376f-9b80-4e1f-b6f2-2f56f5d3ad78).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

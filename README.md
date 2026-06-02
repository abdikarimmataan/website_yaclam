# Yaclam (يعلم) — Frontend

**Learn Without Limits.** The Somali-language e-learning marketplace: courses, scholarships, career roadmaps and a student dashboard.

This is the **production frontend** (Next.js 15 App Router + TypeScript + Tailwind + Framer Motion). It is fully built and runnable. All data is seeded locally so the UI is complete and demoable; the backend developer wires the data, auth and payments layers underneath the existing components.

---

## Quick start (VS Code)

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production build:

```bash
npm run build
npm start
```

> **Note:** `npm run build` fetches the Google Fonts (Plus Jakarta Sans, Fraunces, Amiri) via `next/font` at build time, so the machine needs internet access on first build. This is standard and works on any normal dev machine and on Hostinger.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 with brand design tokens |
| Animation | Framer Motion |
| Icons | lucide-react |
| UI primitives | Hand-built `Button`/`Badge` via `class-variance-authority` (shadcn-compatible; `components.json` included) |

---

## Project structure

```
src/
├── app/                      # App Router routes
│   ├── layout.tsx            # Root layout: fonts, metadata, Navbar + Footer
│   ├── page.tsx              # Home
│   ├── globals.css           # Tailwind layers + component classes
│   ├── courses/              # /courses + /courses/[slug]
│   ├── scholarships/         # /scholarships + /scholarships/[slug]
│   ├── roadmaps/             # /roadmaps + /roadmaps/[slug]
│   ├── blog/                 # /blog + /blog/[slug]
│   ├── about/  contact/
│   ├── login/  register/     # Auth screens (wire to NextAuth)
│   ├── dashboard/            # Student dashboard
│   └── not-found.tsx
├── components/
│   ├── ui/                   # Button, Badge
│   ├── layout/               # Navbar, Footer
│   ├── shared/               # CourseCard, ScholarshipCard, RoadmapCard, BlogCard, etc.
│   └── home/                 # Hero, CoursesExplorer
└── lib/
    ├── types.ts              # All TypeScript interfaces
    ├── utils.ts              # cn(), slugify(), formatStudents()
    ├── icon-map.tsx          # string → lucide icon
    └── data/                 # SEED DATA — replace with API/DB calls
        ├── categories.ts     # 10 categories
        ├── courses.ts        # 40 courses
        ├── scholarships.ts   # 20 scholarships
        ├── roadmaps.ts       # 20 career roadmaps
        ├── blog.ts           # 20 blog posts
        ├── instructors.ts    # 6 instructors
        └── testimonials.ts   # testimonials
```

---

## Brand system

Defined in `tailwind.config.ts` as reusable tokens (use these, don't hard-code hex):

- `navy` `#0D1B4B` · `navy-deep` `#070f2e`
- `royal` `#1F3A93`
- `gold` `#C9A84C` · `gold-soft` `#E3CB86`
- `success` / `warning` / `danger`
- Fonts: `font-sans` (Plus Jakarta Sans), `font-display` (Fraunces), `font-arabic` (Amiri)

Reusable component classes live in `globals.css`: `.btn` + variants, `.card-base`, `.pill`, `.eyebrow`, `.field-input`, `.section`.

---

## Backend handoff — where to wire things in

The frontend is intentionally decoupled. Each integration point is isolated:

1. **Data** — every page imports from `src/lib/data/*`. Swap these for API routes / Prisma queries against PostgreSQL. The exported helper signatures (`getCourse(slug)`, `getScholarship(slug)`, `getPost(slug)`, `getRoadmap(id)`) are what the pages call — keep them and back them with the database.
2. **Auth** — `/login` and `/register` are UI only. Wire to **NextAuth**; gate `/dashboard` with the session.
3. **Payments** — the course buy box (`courses/[slug]`) and register screen show the payment strip (WaafiPay, EVC Plus, Zaad, PayPal, Visa). Connect **WaafiPay / PayPal / Stripe** checkout to those buttons.
4. **Media** — course thumbnails are gradient placeholders; replace with images from **Cloudflare R2 / Bunny CDN**, and video with **Bunny Stream**.
5. **Forms** — the contact form posts nowhere yet; wire to your email service (**Resend**) or an API route.
6. **Env** — copy `.env.example` to `.env.local` and fill in the values.

### Scholarship deadlines
Deadlines in `scholarships.ts` are **typical annual windows**, not live dates (see the comment at the top of the file). The admin/scholarship module should pull and verify current deadlines from each official programme site before publishing.

---

## Dynamic routing note (Next.js 15)

`params` and `searchParams` are async in Next 15. Dynamic pages already use the correct pattern:

```ts
async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

Each `[slug]` route also exports `generateStaticParams()` for static generation — extend or remove these once data is dynamic.

---

© Yaclam (يعلم). Made for the Somali ummah.

---

## v2 additions

- **Theme: Light / Dark / System** — toggle in the top navbar (and mobile menu). No-flash init script in `layout.tsx`; centralized dark overrides at the bottom of `globals.css` (`.dark` scope). Light mode is unchanged. Preference persists via `localStorage`.
- **Student dashboard** (nested routes under `/dashboard`, shared sidebar in `dashboard/layout.tsx`):
  `/dashboard` (overview), `/dashboard/courses`, `/dashboard/certificates`, `/dashboard/wishlist`, `/dashboard/orders`, `/dashboard/settings`.
- **Instructor dashboard** (`/instructor`, own layout/sidebar): overview, courses, students, reviews, earnings.
- **Course detail redesigned** — title/description/instructor row + stat row + tabbed content (Overview / Curriculum / Details / Instructor / Reviews) on the left; sticky purchase card (thumbnail, price, Add to Wishlist, Buy/Start, facts list, payment strip) on the right.
- **Course player** (`/learn/[slug]`) — Vimeo video, collapsible lessons sidebar with progress + mark-complete, lesson tabs (Overview / Resources / Comments), and a comments/reviews section. The marketing footer is hidden on `/learn`, `/dashboard`, `/instructor`, `/login`, `/register` via `FooterGate`.

### Vimeo lessons
Lesson videos embed by ID via `src/components/shared/vimeo-player.tsx`. Curriculum + IDs live in `src/lib/data/curriculum.ts` — the `vimeoId` values there are **public sample videos as placeholders**. Replace them with your real Vimeo / Bunny Stream IDs.

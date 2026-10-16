# CuttingEdger™ — Creative Graphic (2D/3D) & Digital Engineering Agency

> **Site:** [cuttingedger.com](https://cuttingedger.com)  
> **Tagline:** *Engineering Digital Dominance Through Radical Craft & Kinetic Design.*  
> **Brand Tone:** Confident, modern, slightly playful editorial design agency.  
> **Accent:** Electric Volt Lime (`#D4FF00`) / Obsidian Dark Surface (`#0A0B0E`) / Milk Surface (`#F8F9FA`).  
> **Typography:** *Syne* & *Space Grotesk* (Headings/Display) + *Plus Jakarta Sans* (Body/Technical).

---

## Technical Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend Framework** | Laravel | 13.x |
| **PHP Runtime** | PHP | 8.4+ |
| **Client Adapter** | Inertia.js (v2 Core) | 3.5+ (Server) / 3.9+ (Client) |
| **Frontend Framework** | React + TypeScript | React 19.x + TS 7.x |
| **Styling & Design Tokens** | Tailwind CSS (Native `@theme`) | 4.x (`@tailwindcss/vite`) |
| **Build Pipeline** | Vite | 8.x |
| **Smooth Motion & Scroll** | Lenis + Hardware CSS Compositor | Latest |
| **Icons** | Lucide React | Latest |
| **Testing Engine** | PHPUnit (Laravel Test Suite) | 12.x |
| **Code Style** | Laravel Pint | Latest |

---

## Folder Structure

All code is installed directly in the project root:

```text
cuttingedger.com/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── HomeController.php             # Flagship homepage with 2D/3D featured work
│   │   │   ├── WorkController.php             # Portfolio archive & case study detail
│   │   │   ├── ServiceController.php          # 2D brand design & 3D motion capabilities
│   │   │   ├── TeamController.php             # Studio collective & partner bios
│   │   │   ├── CareerController.php           # Studio vacancies & application pipeline
│   │   │   ├── BlogController.php             # Dispatch journal & technical insights
│   │   │   ├── PageController.php             # About, Pricing, FAQ, Privacy, Terms, robots.txt
│   │   │   ├── ContactController.php          # Brief validation, honeypot, DB storage
│   │   │   ├── NewsletterController.php       # Email list subscriptions
│   │   │   ├── SitemapController.php          # Dynamic XML sitemap generator
│   │   │   └── Admin/
│   │   │       └── AdminDashboardController.php # Studio Command Center (/admin)
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php      # Shared props (settings, flash, theme)
│   └── Models/                                # Domain Eloquent Models
│       ├── Category.php                       # 2D/3D disciplines & post categories
│       ├── Project.php                        # Portfolio case studies with metrics & gallery
│       ├── Service.php                        # Agency capabilities & deliverables
│       ├── TeamMember.php                     # Leadership team & social handles
│       ├── Testimonial.php                    # Client endorsements & ratings
│       ├── Client.php                         # Client logo marquees
│       ├── Post.php                           # Journal essays & reading time
│       ├── Job.php                            # Career openings (career_openings table)
│       ├── Faq.php                            # Categorized FAQ items
│       ├── PricingPlan.php                    # Design sprints & flagship packages
│       ├── ContactMessage.php                 # Inbound client project briefs
│       ├── NewsletterSubscriber.php           # Dispatch subscribers
│       └── Setting.php                        # Dynamic site-wide key/value configuration
├── bootstrap/
│   ├── app.php                                # Pipeline & middleware bootstrap
│   └── ssr/                                   # Compiled Node SSR engine
│       ├── ssr.js
│       └── ssr-manifest.json
├── database/
│   ├── migrations/                            # Schema migrations
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   └── 2026_01_01_000001_create_agency_tables.php
│   └── seeders/
│       └── DatabaseSeeder.php                 # Rich 2D/3D studio demo datasets
├── resources/
│   ├── css/
│   │   └── app.css                            # Tailwind CSS 4 entry & @theme variables
│   ├── views/
│   │   └── app.blade.php                      # Root HTML template with anti-FOUC script
│   └── js/
│       ├── app.tsx                            # React 19 Inertia client bootstrap
│       ├── ssr.tsx                            # Server-side rendering (SSR) entrypoint
│       ├── hooks/                             # Reusable React hooks
│       │   ├── useTheme.ts                    # Dark/light mode persistence
│       │   └── useSmoothScroll.ts             # Lenis smooth scroll with reduced motion check
│       ├── types/                             # TypeScript definitions
│       │   ├── index.d.ts                     # PageProps & Ziggy definitions
│       │   └── models.ts                      # Domain model interfaces
│       ├── Layouts/                           # Persistent structural layouts
│       │   ├── AppLayout.tsx                  # Main layout (Header, Footer, CursorFollower)
│       │   ├── Header.tsx                     # Sticky blurred navigation & theme toggle
│       │   ├── Footer.tsx                     # Giant statement CTA, newsletter, socials
│       │   ├── MobileMenu.tsx                 # Full-screen animated navigation
│       │   └── SlideOverContact.tsx           # Quick inquiry slide-out drawer
│       ├── Components/                        # Modular self-contained UI components
│       │   ├── UI/
│       │   │   ├── Button.tsx                 # Arrow, magnetic, outline, and glow buttons
│       │   │   ├── ThemeToggle.tsx            # Sun/Moon animated theme switcher
│       │   │   ├── CursorFollower.tsx         # Custom kinetic trailing agency cursor
│       │   │   ├── Marquee.tsx                # High-performance directional marquee
│       │   │   └── Accordion.tsx              # Accessible WCAG 2.2 AA collapsible panels
│       │   ├── Home/                          # 10 modular home sections
│       │   │   ├── SplitHero.tsx              # Option A kinetic headline + 3D cards shuffle
│       │   │   ├── IntroBand.tsx              # Infinite ticker marquee + studio manifesto
│       │   │   ├── StickyWorkCards.tsx        # 4 pinned stacked cards with cursor view
│       │   │   ├── ServicesList.tsx           # 4 expandable rows with floating 3D shapes
│       │   │   ├── StatsGrid.tsx              # 3 animated counters on viewport entry
│       │   │   ├── ClientMarquees.tsx         # Dual counter-scrolling logo tracks
│       │   │   ├── TeamPreview.tsx            # 5 partner cards with hover color reveals
│       │   │   └── TestimonialsSlider.tsx     # Keyboard-navigable accessible carousel
│       │   └── Common/
│       │       ├── PageHero.tsx               # Standardized inner page header block
│       │       └── SeoHead.tsx                # Meta tags, OpenGraph & JSON-LD schemas
│       └── Pages/                             # Inertia view pages
│           ├── Home.tsx                       # Main flagship landing page
│           ├── About.tsx                      # Philosophy, 4 pillars & collective
│           ├── Services/
│           │   ├── Index.tsx                  # Capabilities & deliverables catalog
│           │   └── Show.tsx                   # Individual discipline deep dive
│           ├── Work/
│           │   ├── Index.tsx                  # Filterable 2D/3D portfolio archive
│           │   └── Show.tsx                   # Comprehensive case study with metrics
│           ├── Team/
│           │   ├── Index.tsx                  # Full creative collective index
│           │   └── Show.tsx                   # Partner profile & authored thoughts
│           ├── Careers/
│           │   ├── Index.tsx                  # Active studio vacancies
│           │   └── Show.tsx                   # Role details & brief application form
│           ├── Pricing.tsx                    # Sprint & Flagship tiers + FAQ bridge
│           ├── Faq.tsx                        # Accessible accordion by category
│           ├── Blog/
│           │   ├── Index.tsx                  # Journal articles & filter pills
│           │   └── Show.tsx                   # Article reader with JSON-LD schema
│           ├── Contact.tsx                    # Project brief form + radar map embed
│           ├── Privacy.tsx                    # Privacy terms
│           ├── Terms.tsx                      # Service agreements & warranties
│           ├── Errors/
│           │   └── 404.tsx                    # Sleek animated 404 void page
│           └── Admin/
│               └── Dashboard.tsx              # Studio Command Center (/admin)
├── routes/
│   ├── web.php                                # Application web & admin routes
│   └── console.php                            # Artisan console commands
├── tests/
│   └── Feature/                               # Strict {ClassName}Test naming
│       ├── HomeControllerTest.php             # Tests flagship home page & Inertia props
│       ├── WorkControllerTest.php             # Tests portfolio archive, filters, case studies
│       ├── ServiceControllerTest.php          # Tests capabilities list & detail views
│       ├── ContactControllerTest.php          # Tests contact briefs, honeypot & throttling
│       ├── NewsletterControllerTest.php       # Tests email subscription & validation
│       ├── BlogControllerTest.php             # Tests journal archive & article reader
│       ├── PageControllerTest.php             # Tests About, Pricing, FAQ, Privacy, robots.txt
│       └── AdminDashboardControllerTest.php   # Tests /admin command center & KPIs
├── vite.config.ts                             # Vite configuration with React & Tailwind 4
├── tsconfig.json                              # TypeScript strict configuration
└── composer.json                              # Laravel & PHP dependencies
```

---

## Setup & Development Commands

### 1. Prerequisites
- **PHP**: 8.3 or 8.4 (with `sqlite3`, `curl`, `mbstring`, `intl` extensions enabled)
- **Node.js**: v20+ or v26+
- **Composer**: 2.x

### 2. Initial Setup

```bash
# Clone the repository and navigate into the root directory:
cd c:\projects\cuttingedger.com

# Install PHP dependencies:
composer install

# Install Node / Frontend dependencies:
# (On Windows PowerShell use npm.cmd; on macOS/Linux use npm)
npm install

# Copy environment file and generate application key:
cp .env.example .env     # (On Windows: copy .env.example .env)
php artisan key:generate

# Run database migrations:
php artisan migrate --force

# Seed realistic 2D/3D studio demo data (projects, services, team, testimonials):
php artisan db:seed --force
```

### 3. Local Development

Run the Laravel application and Vite development server concurrently:

```bash
# Terminal 1 — Start the Laravel backend server:
php artisan serve
# Application live at: http://127.0.0.1:8000

# Terminal 2 — Start the Vite frontend dev server with Hot Module Replacement (HMR):
npm run dev
# (On Windows PowerShell: npm.cmd run dev)
```

### 4. Compiling Production Bundles

```bash
# Compile client-side production bundle (Tailwind 4 + React 19 chunks):
npm run build
# (On Windows PowerShell: npm.cmd run build)

# Compile Server-Side Rendering (SSR) bundle for search engine bots:
npx vite build --ssr
# (On Windows PowerShell: npx.cmd vite build --ssr)
```

---

## Testing & Quality Assurance

All test files strictly follow the project's `{ClassName}Test.php` architecture and verify Inertia components, form validations, database persistence, and honeypot bot traps.

```bash
# Run the entire test suite:
php artisan test

# Run a specific controller test:
php artisan test --filter=WorkControllerTest
php artisan test --filter=ContactControllerTest

# Run Laravel Pint code style formatter:
vendor/bin/pint --format agent
```

---

## Key Features & Highlights

- **Hero Option A**: Dynamic kinetic headline with rotating word ticker paired with an interactive 3D work reel that shuffles cards on click or hover.
- **Sticky Stacked Work Cards**: 4 flagship commissions that pin and stack with scroll depth as the user navigates down the page.
- **Custom Cursor Follower**: Agency trailing cursor that magnifies into an action pill (`VIEW`, `CLICK TO SHUFFLE`, `EXPLORE`) over interactive elements.
- **2D & 3D Discipline Showcases**: Dedicated sections for vector brand identity, Cinema 4D/Blender product visuals, WebGL shaders, and full-stack web engineering.
- **Slide-Out Quick Contact Drawer**: Accessible slide-over drawer triggered from the navigation bar, supporting ESC key dismissal and anti-spam honeypot.
- **Studio Command Center (`/admin`)**: Native Inertia + React 19 dashboard displaying live commission briefs, budget tiers, and active showcase slots.
- **Dynamic SEO & Schema**: Universal `<SeoHead>` component automatically rendering OpenGraph, Twitter Cards, canonical tags, and structured JSON-LD (`Organization` and `Article`).
- **Dynamic Sitemap & Robots**: Generated dynamically at `/sitemap.xml` and `/robots.txt`.

---

## Production Deployment Checklist

1. **Web Server (Nginx / Apache)**:
   - Point your virtual host document root directly to `public/`.
   - Forward all requests to `index.php` (`try_files $uri $uri/ /index.php?$query_string;`).
   - Enable SSL/TLS and HTTP/2 or HTTP/3.
2. **Inertia SSR Server (Optional for pre-rendered SEO)**:
   - Start the Node SSR daemon in the background via Supervisor or PM2:
     ```bash
     node bootstrap/ssr/ssr.js
     ```
   - If the SSR server restarts or is temporarily offline, the app seamlessly falls back to client hydration without downtime.
3. **Queue Workers & Scheduler**:
   - Set up Supervisor to keep the background queue worker running:
     ```bash
     php artisan queue:work --sleep=3 --tries=3 --max-time=3600
     ```
   - Add the Laravel scheduler cron entry:
     ```cron
     * * * * * cd /path-to-app && php artisan schedule:run >> /dev/null 2>&1
     ```
4. **Production Cache & Optimization**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan event:cache
   npm run build
   npx vite build --ssr
   ```

---

## License

Built and maintained for **CuttingEdger™**. Proprietary software. All rights reserved.

# ECADEL LABS — ecadellabs.cloud
## Project Blueprint & Architecture

**Domain:** ecadellabs.cloud  
**Status:** Active · Live  
**Parent institution:** ECADEL GROUP LIMITED (ecadelgroup.com)  
**VPS:** 72.62.185.212 — Ubuntu 24.04 LTS  
**Port:** 3001 (Nginx proxied)  
**Repository:** github.com/ecadelgrouplimited-dot/ecadellabs  
**Stack:** Next.js 16.2.6 · TypeScript · Tailwind CSS v4 · Prisma 7 · SQLite (better-sqlite3) · PM2  
**SSL:** Let's Encrypt — expires 2026-08-28 (auto-renews)

---

## 1. What ECADEL LABS Is (and Is Not)

ECADEL LABS is the research and innovation engine of ECADEL GROUP LIMITED.
It is **not** a product. It is **not** a startup. It is the institution inside
the institution — where ideas are stress-tested before becoming subsidiaries,
where shared technical foundations are built, and where ECADEL publishes work
that positions it at the frontier of African technology thinking.

`ecadellabs.cloud` gives that institution a home of its own. Separate from the
commercial site. Separate in tone, audience, and purpose — but unmistakably
part of the ECADEL family.

### Primary Audiences
| Audience | What They Need |
|----------|----------------|
| Grant bodies (AfDB, Gates, USAID, EU, World Bank) | Credible research identity, structured agenda, track record |
| Universities seeking research partners | Research projects, open collaborations, fellowship program |
| African engineers & researchers | Fellowship opportunities, open problems, intellectual home |
| Academic institutions | Formal partnership pathway, published work |
| Tech community (Africa & global) | Research outputs, open-source work, technical credibility |

### What This Site Does That ecadelgroup.com Cannot
1. **Publish research** — white papers, technical notes, position papers on African technology systems
2. **Present a research agenda** — named problems being studied (not products — research problems)
3. **Host the grant identity** — when ECADEL applies for a $500K grant, this is the URL in the application
4. **Open the talent pipeline** — fellowships, residencies, open research calls
5. **Reframe the platforms as research outputs** — SBB, PAME, SafeRoad are applied research deployments, not just products

---

## 2. Architecture Decision

### Single Next.js 15 Project with Two Route Groups

```
ecadellabs.cloud/          → public frontend (Next.js App Router)
ecadellabs.cloud/admin     → protected admin panel (same project, protected route group)
```

**Why one project:**
- One deployment, one PM2 process, one `npm run build`
- Admin panel shares auth and database layer with frontend API
- No separate backend server to manage or secure
- Same developer experience as the main ecadelgroup.com project

**Why not a separate CMS (Sanity, Contentful, Strapi):**
- External services cost money
- Data leaves our infrastructure
- Adds deployment complexity on the VPS
- A custom admin panel is simpler and fully under our control

### Route Group Architecture
```
app/
├── (frontend)/              # Public site — no auth required
│   ├── layout.tsx           # Public layout (nav, footer)
│   ├── page.tsx             # Home
│   ├── research/
│   │   ├── page.tsx         # All research projects
│   │   └── [slug]/page.tsx  # Individual project
│   ├── publications/
│   │   ├── page.tsx         # All publications
│   │   └── [slug]/page.tsx  # Individual publication
│   ├── fellows/
│   │   └── page.tsx         # Fellowship program + current fellows
│   ├── grants/
│   │   └── page.tsx         # Grant information
│   ├── partnerships/
│   │   └── page.tsx         # Partner institutions
│   └── contact/
│       └── page.tsx         # Inquiry / contact form
│
├── (admin)/                 # Admin panel — auth required
│   ├── layout.tsx           # Auth wrapper + admin layout
│   ├── admin/
│   │   ├── page.tsx         # Dashboard (overview, recent activity)
│   │   ├── publications/    # CRUD — publications
│   │   ├── research/        # CRUD — research projects
│   │   ├── fellows/         # CRUD — fellows/researchers
│   │   ├── partnerships/    # CRUD — partner institutions
│   │   ├── inquiries/       # View contact form submissions
│   │   └── settings/        # Site-wide settings
│
├── api/
│   ├── auth/                # Login / session management
│   ├── publications/        # REST endpoints
│   ├── research/            # REST endpoints
│   ├── fellows/             # REST endpoints
│   ├── partnerships/        # REST endpoints
│   ├── contact/             # Contact form handler (+ email)
│   └── settings/            # Site settings
│
├── layout.tsx               # Root layout
└── globals.css              # Global styles
```

---

## 3. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | Same as main site, familiar |
| Language | TypeScript | Type safety, team familiarity |
| Styling | Tailwind CSS | Same toolchain |
| Database | SQLite (via Prisma) | No separate server, file-based, VPS-native |
| ORM | Prisma | Type-safe queries, easy migrations |
| Auth | Custom JWT (httpOnly cookie) | Simple, no external service, admin-only |
| Email | Nodemailer + Hostinger SMTP | Same as main site |
| Animations | Framer Motion | Consistent with main site |
| Icons | Lucide React | Consistent with main site |
| Process manager | PM2 (port 3001) | Same as main site |
| Web server | Nginx (reverse proxy) | Same as main site |
| SSL | Let's Encrypt / Certbot | Same as main site |

### Design System Relationship
ECADEL LABS shares the ECADEL color palette and some typography but has a
**different register** — more academic, more measured, slightly more whitespace.

- **Shared:** Gold `#C8A96E`, obsidian backgrounds, Space Grotesk display font
- **Different:** More generous line heights, more text-forward layout, lighter use of dark backgrounds on the frontend (academia reads better on lighter surfaces for long-form content)
- **Admin panel:** Functional, clean dark theme matching ECADEL brand — not a consumer product

---

## 4. Data Models (Prisma Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ── Research Publications ─────────────────────────────────────────────────────
model Publication {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  abstract    String
  content     String                        // Markdown content
  category    String                        // white-paper | research-note | technical-report | position-paper
  authors     String                        // JSON array of author names
  tags        String                        // JSON array
  featured    Boolean  @default(false)
  published   Boolean  @default(false)
  publishedAt DateTime?
  pdfUrl      String?                       // Link to PDF version if available
  imageUrl    String?                       // Cover image
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ── Research Projects ─────────────────────────────────────────────────────────
model ResearchProject {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  status      String                        // active | completed | planned
  problem     String                        // The research problem being addressed
  methodology String?                       // Approach / methodology
  outcomes    String?                       // Results / findings
  technologies String                       // JSON array
  partners    String?                       // JSON array of partner institution names
  startDate   DateTime?
  endDate     DateTime?
  featured    Boolean  @default(false)
  published   Boolean  @default(false)
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ── Fellows & Researchers ─────────────────────────────────────────────────────
model Fellow {
  id          String   @id @default(cuid())
  name        String
  role        String                        // research-fellow | resident | collaborator | advisor
  bio         String
  expertise   String                        // JSON array — areas of expertise
  institution String?                       // University / organisation they come from
  cohort      String?                       // Year / cohort label
  photoUrl    String?
  linkedinUrl String?
  active      Boolean  @default(true)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ── Partner Institutions ──────────────────────────────────────────────────────
model Partnership {
  id          String   @id @default(cuid())
  institution String
  slug        String   @unique
  type        String                        // university | research-body | government | ngo | development-bank
  description String
  country     String
  website     String?
  logoUrl     String?
  active      Boolean  @default(true)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ── Contact / Inquiry Submissions ────────────────────────────────────────────
model Inquiry {
  id          String   @id @default(cuid())
  name        String
  email       String
  organisation String?
  type        String                        // research | fellowship | partnership | grant | general
  message     String
  read        Boolean  @default(false)
  archived    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

// ── Admin Users ───────────────────────────────────────────────────────────────
model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
  lastLoginAt  DateTime?
}

// ── Site Settings ─────────────────────────────────────────────────────────────
model Setting {
  key   String @id
  value String                             // JSON string for complex values
}
```

---

## 5. Frontend Pages — Content Plan

### Home (`/`)
- **Hero:** "The Research Engine Behind Africa's Intelligence Infrastructure"
- **Mission statement** — 2-3 sentences on what ECADEL LABS is
- **Featured research project** (pulled from database)
- **Featured publication** (pulled from database)
- **Three key stats:** Research domains | Active projects | Target grant bodies
- **Partners strip** — partner institution logos
- **CTA:** "View our research agenda" + "Apply for a fellowship"

### Research Projects (`/research`)
- All published research projects
- Filter by status (active / completed / planned) and domain
- Each card: title, problem statement, status badge, tags, date

### Individual Project (`/research/[slug]`)
- Full problem description, methodology, outcomes
- Related publications
- Partner institutions
- Back to research

### Publications (`/publications`)
- All published white papers, research notes, reports
- Filter by category and tag
- Each card: title, abstract, category badge, authors, date, PDF link

### Individual Publication (`/publications/[slug]`)
- Full publication rendered from markdown
- Authors, date, tags
- PDF download link
- Related research project
- Cite this work (formatted citation)

### Fellows (`/fellows`)
- Fellowship program description (what ECADEL LABS offers)
- Current fellows/researchers grid (photo, name, role, expertise)
- Alumni section
- "Apply for a fellowship" CTA with form or email link

### Grants (`/grants`)
- ECADEL LABS and grant funding — why, how, track record
- Target grant bodies (AfDB, Gates Foundation, USAID, EU Horizon, World Bank IFC)
- Open funding opportunities ECADEL is pursuing
- How to co-apply or partner on a grant

### Partnerships (`/partnerships`)
- All partner institutions
- Filter by type
- Each card: logo, institution name, country, description

### Contact (`/contact`)
- Inquiry form with type selector (research | fellowship | partnership | grant | general)
- Direct email for urgent matters
- Response time expectation

---

## 6. Admin Panel — Feature Specifications

### Dashboard (`/admin`)
- Total counts: publications | research projects | fellows | inquiries (unread)
- Recent inquiries (last 5, with read status)
- Quick actions: "New publication" | "New research project"
- System status: last deployment, database size

### Publications (`/admin/publications`)
- Table: title, category, status (draft/published), date
- Create / Edit: full markdown editor, all fields, publish toggle
- Delete with confirmation
- Preview (opens public URL in new tab)

### Research Projects (`/admin/research`)
- Table: title, status badge, start date, featured
- Create / Edit: all fields, partner tagging, publish toggle
- Delete with confirmation

### Fellows (`/admin/fellows`)
- Table: name, role, institution, cohort, active status
- Create / Edit: all fields, photo URL, active toggle

### Partnerships (`/admin/partnerships`)
- Table: institution, type, country, active status
- Create / Edit: all fields, logo URL

### Inquiries (`/admin/inquiries`)
- Table: name, email, type, date, read status
- Click to read full message
- Mark as read / archive
- Reply via email link (opens mailto with pre-filled recipient)

### Settings (`/admin/settings`)
- Site meta: title, description, keywords
- Featured content: which publication and project appear on home
- Lab stats: research domains, active projects (editable numbers)
- Contact information

---

## 7. Authentication (Admin)

Simple, secure, no external service:

1. Admin logs in at `/admin/login` with email + password
2. Password is hashed with bcrypt and stored in the `AdminUser` table
3. On success: server creates a signed JWT, sets it as an `httpOnly` cookie
4. Next.js middleware checks for valid JWT on every `/admin/*` route
5. JWT expires after 8 hours — re-login required

```typescript
// middleware.ts — protects all /admin routes
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('ecadel_labs_admin')?.value
    if (!token || !verifyJWT(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  return NextResponse.next()
}
```

**Initial admin account:** Created via a seed script run once on the VPS.

---

## 8. Email (Contact Form)

Same Hostinger SMTP as the main site, different sender address:
- From: `labs@ecadelgroup.com` (or `ecadel@ecadelgroup.com` if not set up)
- Auto-reply to inquiry submitter: branded ECADEL LABS email
- Notification to: `ecadel@ecadelgroup.com`

---

## 9. Seed Content (Launch-Ready)

Before the first public deploy, the database will be seeded with:

### Research Projects (3 to seed)
1. **Offline-First AI Systems for African Markets**
   - Problem: AI models assume constant connectivity. Africa's infrastructure reality demands offline-first intelligence architecture.
   - Status: Active | Domain: AI Infrastructure

2. **Mobile Money as a Financial Data Layer**
   - Problem: Africa's informal economy generates rich transaction data through mobile money that formal financial systems cannot access or interpret.
   - Status: Active | Domain: Financial Infrastructure

3. **Consequence Modelling for Sub-Saharan Governance**
   - Problem: Policy decisions in African governments lack systemic consequence mapping tools calibrated for local institutional realities.
   - Status: Planning | Domain: Consequence Intelligence

### Publications (2 to seed)
1. **"The Offline-First Imperative: Why African AI Must Work Without the Internet"**
   - Category: Research Note | Authors: ECADEL LABS Research Team

2. **"Mobile Money as Intelligence Infrastructure: A Framework for African Financial Data"**
   - Category: Position Paper | Authors: ECADEL LABS Research Team

### Partners (2 to seed)
1. Makerere University — Uganda
2. African Development Bank (target grant body)

### Fellows (1 to seed)
1. Wilson Ecaat — Lead Researcher · AI Architecture & Systems

---

## 10. Deployment Plan

### VPS Setup
```
Project path:   /var/www/ecadellabs/
PM2 process:    ecadellabs
Port:           3001
Database file:  /var/www/ecadellabs/prisma/ecadellabs.db
Env file:       /var/www/ecadellabs/.env.local (VPS only, not in git)
```

### Nginx Config (`/etc/nginx/sites-available/ecadellabs.cloud`)
```nginx
server {
    listen 80;
    server_name ecadellabs.cloud www.ecadellabs.cloud;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
# SSL added by certbot
```

### DNS (Hostinger)
```
A record: ecadellabs.cloud     → 72.62.185.212
A record: www.ecadellabs.cloud → 72.62.185.212
```

### Deploy Script (`deploy.sh`)
```bash
#!/bin/bash
cd /var/www/ecadellabs
git checkout -- package-lock.json 2>/dev/null || true
git pull origin main
npm install
npm run build
npx prisma migrate deploy       # Run any pending migrations
pm2 restart ecadellabs || pm2 start npm --name "ecadellabs" -- start -- --port 3001
pm2 save
echo "✓ ecadellabs.cloud deployed"
```

### Environment Variables (`.env.local` on VPS — never in git)
```
DATABASE_URL="file:./prisma/ecadellabs.db"
JWT_SECRET=<generate-a-strong-random-secret>
JWT_EXPIRES_IN=28800
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=ecadel@ecadelgroup.com
SMTP_PASS=<hostinger-email-password>
NEXT_PUBLIC_SITE_URL=https://ecadellabs.cloud
```

---

## 11. GitHub Repository

```
Repository:   ecadelgrouplimited-dot/ecadellabs
Branch:       main
Remote URL:   git@github-ecadel:ecadelgrouplimited-dot/ecadellabs.git
```

### .gitignore additions
```
# Database (lives on VPS only)
prisma/*.db
prisma/*.db-journal

# Environment (VPS only)
.env.local
.env.production

# Build artifacts
.next/
node_modules/
```

---

## 12. Relationship to ecadelgroup.com

| Concern | ecadelgroup.com | ecadellabs.cloud |
|---------|----------------|-----------------|
| Audience | Investors, clients, partners | Academics, grant bodies, researchers |
| Tone | Commercial, ambitious | Academic, rigorous, measured |
| Content | Products, services, team, client work | Research, publications, fellowships |
| Brand | ECADEL GROUP | ECADEL LABS |
| Database | None (static/API) | SQLite (Prisma) |
| Admin | None | Full admin panel |
| Port | 3000 | 3001 |
| Domain | ecadelgroup.com | ecadellabs.cloud |

**Cross-links:**
- `ecadelgroup.com/#labs` section → links to `ecadellabs.cloud`
- `ecadellabs.cloud` footer → links back to `ecadelgroup.com`
- Shared: Hostinger SMTP, VPS, GitHub org, design language

---

## 13. Development Workflow

```bash
# Local development
cd /home/sisi-labs/Projects/ecadellabs
npm run dev                        # Runs on localhost:3001

# First-time database setup
npx prisma migrate dev --name init
npx prisma db seed                 # Seeds initial content

# Admin account creation (run once)
npx tsx scripts/create-admin.ts

# Type check
npx tsc --noEmit

# Deploy
git add . && git commit -m "..." && git push
ssh root@72.62.185.212
cd /var/www/ecadellabs && ./deploy.sh
```

---

## 14. Phase Plan

### Phase 1 — Foundation (Now)
- [x] Initialize Next.js 16 project
- [x] Set up Prisma + SQLite schema (Prisma 7, better-sqlite3 adapter)
- [x] Admin authentication (proxy.ts JWT middleware + login page)
- [x] Admin dashboard + CRUD for all content types
- [x] Seed database with initial content (3 projects, 2 publications, 2 partners, 1 fellow)
- [x] Frontend pages (Home, Research, Publications, Fellows, Grants, Partners, Contact)
- [x] Contact form with email (Nodemailer + Hostinger SMTP)
- [x] Deploy to VPS (port 3001, PM2 process: ecadellabs)
- [x] DNS + SSL for ecadellabs.cloud (Let's Encrypt, auto-renews 2026-08-28)

### Phase 2 — Content & Credibility
- [x] Fellowship program page launched (ecadellabs.cloud/fellows)
- [x] Grant body target pages (ecadellabs.cloud/grants — AfDB, Gates, USAID, EU Horizon, IFC)
- [x] Research agenda published (3 active/planned projects live)
- [x] First two publications live (research note + position paper)
- [x] Filters on Research (status), Publications (category), Partnerships (type)
- [x] SEO metadata on all pages (generateMetadata, per-page titles)
- [x] Sitemap.xml + robots.txt
- [x] 404 branded not-found page
- [x] Loading skeleton states (Research, Publications)
- [x] Related content on research project pages and publication pages
- [x] Partners strip on homepage
- [x] Mobile-responsive navbar and footer
- [ ] First external fellow onboarded (operational)
- [ ] First university partnership formalised — Makerere target (operational)
- [ ] First grant application submitted (operational)

### Phase 3 — Authority (Dev Sprint)
**Goal:** Make the site feel like a serious research institution with discovery, reach, and operational polish.

#### 3A — Discovery & Reach ✓
- [x] Full-text search (`/search?q=...`) — research + publications, grouped results, search icon in navbar
- [x] Tag/keyword pages (`/tags/[tag]`) — clicking any tag shows all content with that tag (SEO + discovery)
- [x] Newsletter signup — email capture on homepage, stored as Inquiry type "newsletter"
- [x] Research updates email template — branded ECADEL LABS auto-reply on newsletter signup

#### 3B — Admin Operational Polish ✓
- [x] Admin: inline publish/unpublish toggle on Publications and Research list pages
- [x] Admin sidebar: live unread inquiry count badge (polls every 60s)
- [x] Admin: featured content selectors on Settings page (pin specific pub/project to homepage)
- [x] Admin: inquiry analytics — breakdown by type on dashboard

#### 3C — Credibility Signals ✓
- [x] Google Scholar meta tags (`citation_title`, `citation_author`, `citation_date`, `citation_pdf_url`)
- [x] JSON-LD `ScholarlyArticle` structured data on publication pages
- [x] Print stylesheet for publication pages (academic printing)
- [x] Dynamic Open Graph images via `/api/og` — branded title cards for every publication and research page

#### 3D — Operational (Content team)
- [ ] Third and fourth publications (via admin)
- [ ] First external fellow onboarded (via admin → new fellow record)
- [ ] First university partnership formalised — Makerere University target
- [ ] First grant application submitted using ecadellabs.cloud as institutional reference

### Phase 4 — Platform (Current Sprint)
**Goal:** Open data, extended reach, and operational intelligence.

#### 4A — Open Data & API
- [x] Public research API (`/api/public/publications`, `/api/public/research`) — JSON, CORS, versioned
- [x] API documentation page (`/api-docs`) — usage examples, endpoint reference
- [ ] RSS feed for publications (`/feed.xml`) — for academic aggregators and RSS readers
- [ ] Public dataset downloads (CSV/JSON exports of research agenda)

#### 4B — Extended Admin
- [x] Admin dashboard: inquiry breakdown by type (research/fellowship/grant/newsletter)
- [ ] Admin: newsletter subscriber list view (filter inquiries by type=newsletter)
- [ ] Admin: bulk publish/unpublish on list pages (multi-select + action)
- [ ] Admin: activity log (who changed what, when)

#### 4C — Platform Features
- [ ] Research application portal (structured proposal submission form)
- [ ] Multi-admin: invite team members with editor role (read + publish, no settings)
- [ ] Performance analytics integration (lightweight, privacy-respecting)
- [ ] PDF export of publications (server-side via Puppeteer or WeasyPrint)

---

*Document authored: May 2026 · Last updated: May 2026*
*ECADEL LABS — Research & Innovation Engine*
*A division of ECADEL GROUP LIMITED · Kampala, Uganda*

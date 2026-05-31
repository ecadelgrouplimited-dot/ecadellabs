# ECADEL LABS — Operations Reference
## ecadellabs.cloud · Internal Documentation

> This document is for internal use by the ECADEL GROUP technical team.
> Keep it out of public repositories. Do not commit to git if it contains live credentials.

---

## 1. Live Environment

| Property       | Value |
|----------------|-------|
| Domain         | https://ecadellabs.cloud |
| www redirect   | https://www.ecadellabs.cloud → ecadellabs.cloud |
| VPS IP         | 72.62.185.212 |
| VPS OS         | Ubuntu 24.04 LTS |
| Node.js        | v20.20.2 |
| PM2 process    | `ecadellabs` (port 3001) |
| Nginx          | Reverse proxy on 80/443 |
| SSL            | Let's Encrypt — expires 2026-08-28 (auto-renews) |
| Database       | SQLite at `/var/www/ecadellabs/prisma/ecadellabs.db` |

---

## 2. Admin Panel Access

**URL:** https://ecadellabs.cloud/admin/login

| Field    | Value |
|----------|-------|
| Email    | ecaatwilson96@gmail.com |
| Password | Set during initial setup via `npx tsx scripts/create-admin.ts` |

To reset the admin password (run on VPS):
```bash
cd /var/www/ecadellabs
npx tsx scripts/create-admin.ts
# Enter: email, new password (min 8 chars)
```

**Admin panel sections:**
- `/admin` — Dashboard (stats, inquiry breakdown, recent inquiries)
- `/admin/publications` — Create, edit, publish/unpublish publications
- `/admin/research` — Create, edit, publish/unpublish research projects
- `/admin/fellows` — Manage fellows and researchers
- `/admin/partnerships` — Manage partner institutions
- `/admin/inquiries` — Read and respond to contact form submissions
- `/admin/settings` — Site settings, featured content selectors

---

## 3. Deployment Workflow

### Standard deploy (push code → VPS pulls)

```bash
# 1. Make changes locally
# 2. Commit and push to GitHub
git add .
git commit -m "your message"
git push origin main

# 3. Run on VPS:
cd /var/www/ecadellabs && ./deploy.sh
```

### What `deploy.sh` does:
1. `git pull origin main`
2. `npm install`
3. `npx prisma generate`
4. `npx prisma db push --accept-data-loss` (schema sync)
5. `npm run build`
6. `pm2 restart ecadellabs`
7. `pm2 save`

### Emergency restart (PM2 down after VPS reboot):
```bash
# Option A — resurrect saved processes
pm2 resurrect

# Option B — manual restart
cd /var/www/ecadellabs
pm2 start npm --name "ecadellabs" -- start -- --port 3001
pm2 save

# Ensure PM2 starts on boot (run once)
pm2 startup systemd -u root --hp /root
# Run the command it prints, then:
pm2 save
```

---

## 4. GitHub Repository

| Property    | Value |
|-------------|-------|
| Org         | ecadelgrouplimited-dot |
| Repo        | ecadellabs |
| Remote URL  | git@github-ecadel:ecadelgrouplimited-dot/ecadellabs.git |
| SSH Key     | `~/.ssh/ecadelgroup_github` (on local machine) |
| SSH Host    | `github-ecadel` (alias in `~/.ssh/config`) |
| Branch      | `main` |

---

## 5. Environment Variables

File location on VPS: `/var/www/ecadellabs/.env.local`
**Never commit this file.** It is in `.gitignore`.

```env
DATABASE_URL="file:./prisma/ecadellabs.db"
JWT_SECRET=<strong-random-hex>
JWT_EXPIRES_IN=28800
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=ecadel@ecadelgroup.com
SMTP_PASS=<hostinger-email-password>
NEXT_PUBLIC_SITE_URL=https://ecadellabs.cloud
```

---

## 6. Nginx Configuration

File: `/etc/nginx/sites-available/ecadellabs.cloud`

Proxies all traffic to `http://localhost:3001` (the Next.js app).
SSL managed by Certbot (Let's Encrypt).

Check nginx status:
```bash
nginx -t                    # Test config
systemctl status nginx      # Service status
systemctl reload nginx      # Reload after config changes
```

---

## 7. Research Agenda

### Active Research Projects

| Title | Status | Domain |
|-------|--------|--------|
| Offline-First AI Systems for African Markets | Active | AI Infrastructure |
| Mobile Money as a Financial Data Layer | Active | Financial Infrastructure |
| Consequence Modelling for Sub-Saharan Governance | Planned | Consequence Intelligence |

### Publications Live
1. *The Offline-First Imperative: Why African AI Must Work Without the Internet* — Research Note (May 2026)
2. *Mobile Money as Intelligence Infrastructure: A Framework for African Financial Data* — Position Paper (Apr 2026)

---

## 8. Research Domains & Topic Map

ECADEL LABS pursues research across **12 domains**, each with specific open questions and investigation threads. This map is the working agenda — add to it as new problems emerge.

---

### Domain 1 — AI Systems & Machine Learning
*How do we build AI that actually works in Africa's technical reality?*

| # | Research Topic | Status |
|---|----------------|--------|
| 1.1 | Offline-first AI model architectures for constrained bandwidth environments | Active |
| 1.2 | Small language models (SLMs) optimised for African language corpora | Open |
| 1.3 | AI for informal sector business intelligence and bookkeeping | Open |
| 1.4 | Federated learning across mobile money networks without centralised data | Open |
| 1.5 | AI bias and fairness in African training data contexts | Open |
| 1.6 | Edge AI deployment on low-power hardware common in East Africa | Active |
| 1.7 | Explainable AI for governance and public-sector decision support | Open |
| 1.8 | Voice-first AI interfaces for low-literacy African users | Open |

---

### Domain 2 — Mobile Money & Financial Data
*Africa's informal economy runs on mobile money — what intelligence does that data contain?*

| # | Research Topic | Status |
|---|----------------|--------|
| 2.1 | Mobile money transaction data as SME credit scoring infrastructure | Active |
| 2.2 | Cross-border mobile money flow analysis (MTN, Airtel, M-Pesa interoperability) | Open |
| 2.3 | SMS-based financial data extraction and structured interpretation | Open |
| 2.4 | Mobile money fraud pattern detection using behavioural signals | Open |
| 2.5 | API standardisation across African mobile money providers | Open |
| 2.6 | Financial inclusion measurement for traders outside formal banking | Open |
| 2.7 | Mobile money velocity as leading economic indicator for African markets | Open |
| 2.8 | Savings group (ROSCA/VSLA) digitisation through mobile money rails | Open |

---

### Domain 3 — Consequence Intelligence
*What happens downstream when African governments make decisions?*

| # | Research Topic | Status |
|---|----------------|--------|
| 3.1 | Policy consequence mapping for East African governance contexts | Active |
| 3.2 | Infrastructure investment ripple effects in developing economies | Open |
| 3.3 | Public health policy cascades in under-resourced systems | Open |
| 3.4 | Climate policy consequence modelling calibrated for sub-Saharan Africa | Open |
| 3.5 | Agricultural subsidy consequence tracing through informal supply chains | Open |
| 3.6 | Debt restructuring consequence modelling for African sovereign debt | Open |
| 3.7 | Tax policy cascade effects on the informal economy and SME survival | Open |
| 3.8 | Electoral outcome consequence simulation for East African democracies | Open |

---

### Domain 4 — Offline-First Architecture
*What does technology built for African connectivity look like at the system design level?*

| # | Research Topic | Status |
|---|----------------|--------|
| 4.1 | Local-first data synchronisation protocols for intermittent connectivity | Open |
| 4.2 | CRDTs (conflict-free replicated data types) for African field data collection | Open |
| 4.3 | Progressive web applications optimised for 2G/3G Africa | Open |
| 4.4 | SQLite as enterprise-grade data infrastructure for African SMEs | Active |
| 4.5 | Peer-to-peer data sharing across local networks without internet | Open |
| 4.6 | Bandwidth-aware sync algorithms for mobile applications | Open |
| 4.7 | Power-interruption-resilient data systems for unstable electricity grids | Open |
| 4.8 | Delta synchronisation protocols for low-data mobile environments | Open |

---

### Domain 5 — Civic Technology
*How do African citizens interact with government, and where does technology help?*

| # | Research Topic | Status |
|---|----------------|--------|
| 5.1 | Digital public infrastructure design for African municipalities | Open |
| 5.2 | Open source government data portals for East African cities | Open |
| 5.3 | Participatory budgeting platforms for county government in East Africa | Open |
| 5.4 | Digital identity systems designed for populations without persistent internet | Open |
| 5.5 | e-Government adoption barriers and failure patterns in sub-Saharan Africa | Open |
| 5.6 | Civic data standards for African local government interoperability | Open |
| 5.7 | Community infrastructure gap reporting systems via SMS and USSD | Open |
| 5.8 | Parliamentary data transparency tools for East African legislatures | Open |

---

### Domain 6 — Road Safety Infrastructure
*SafeRoad UG is one deployment — the research behind it applies across Africa.*

| # | Research Topic | Status |
|---|----------------|--------|
| 6.1 | Road hazard prediction from crowd-sourced mobile GPS data | Active |
| 6.2 | Accident black spot identification without fixed sensors | Active |
| 6.3 | Fleet safety monitoring for African commercial transport operators | Open |
| 6.4 | Real-time road condition reporting systems via citizen mobile devices | Open |
| 6.5 | Traffic pattern modelling in cities without IoT infrastructure | Open |
| 6.6 | Road safety intervention effectiveness measurement | Open |
| 6.7 | Motorcycle and boda-boda specific safety data collection systems | Open |
| 6.8 | Insurance pricing models using telematics in low-data environments | Open |

---

### Domain 7 — Agricultural Intelligence
*600 million African smallholder farmers generate and need data.*

| # | Research Topic | Status |
|---|----------------|--------|
| 7.1 | Smallholder farm yield prediction from satellite imagery and SMS data | Open |
| 7.2 | Agricultural commodity price forecasting for rural African markets | Open |
| 7.3 | Crop disease early warning systems using low-cost mobile photography | Open |
| 7.4 | Agricultural supply chain transparency for export commodity tracing | Open |
| 7.5 | Weather data integration for subsistence farming decision support | Open |
| 7.6 | Farmer cooperative management systems for ROSCA-style group savings | Open |
| 7.7 | Soil health estimation through low-cost sensor networks and AI | Open |
| 7.8 | Food security early warning from mobile money and market price data | Open |

---

### Domain 8 — Health Systems Intelligence
*African health infrastructure operates with minimal data infrastructure.*

| # | Research Topic | Status |
|---|----------------|--------|
| 8.1 | Community health worker (CHW) decision support systems for rural Africa | Open |
| 8.2 | Disease surveillance at informal settlement level using mobile reporting | Open |
| 8.3 | Medical supply chain integrity tracking in fragmented distribution systems | Open |
| 8.4 | Maternal health outcome prediction in rural and peri-urban contexts | Open |
| 8.5 | Traditional medicine documentation and safe integration with digital systems | Open |
| 8.6 | Mental health data infrastructure for sub-Saharan Africa | Open |
| 8.7 | Epidemic early warning signal extraction from mobile health records | Open |
| 8.8 | Offline-capable electronic health records for clinic environments | Open |

---

### Domain 9 — Urban Intelligence
*African cities are the fastest-growing in the world and the least data-mapped.*

| # | Research Topic | Status |
|---|----------------|--------|
| 9.1 | Informal settlement mapping and data infrastructure for East African cities | Open |
| 9.2 | Urban planning decision support for rapidly urbanising secondary cities | Open |
| 9.3 | Waste management route optimisation for African municipalities | Open |
| 9.4 | Water distribution monitoring and leakage detection in informal areas | Open |
| 9.5 | Urban mobility data collection without traditional fixed-sensor infrastructure | Open |
| 9.6 | Housing affordability modelling in African cities using mobile money data | Open |
| 9.7 | Night economy intelligence for city planning (Kampala, Nairobi, Lagos) | Open |
| 9.8 | Street vendor location data and economic contribution measurement | Open |

---

### Domain 10 — Education Technology Research
*African EdTech fails when it assumes connectivity and standardised curriculum.*

| # | Research Topic | Status |
|---|----------------|--------|
| 10.1 | Learning outcome measurement in schools with intermittent power and internet | Open |
| 10.2 | AI tutoring systems adapted for African national curriculum contexts | Open |
| 10.3 | Teacher training effectiveness tracking systems for in-service development | Open |
| 10.4 | Student dropout prediction and early intervention model for East Africa | Open |
| 10.5 | Literacy and numeracy data infrastructure for East African languages | Open |
| 10.6 | School management systems for resource-constrained environments | Open |
| 10.7 | EdTech adoption barrier mapping across rural African school districts | Open |
| 10.8 | Examination integrity and verification systems for national examinations | Open |

---

### Domain 11 — Energy & Infrastructure
*Power unreliability is one of the largest productivity taxes on African businesses.*

| # | Research Topic | Status |
|---|----------------|--------|
| 11.1 | Renewable energy adoption modelling for off-grid African communities | Open |
| 11.2 | Load shedding impact quantification on SME productivity and revenue | Open |
| 11.3 | Solar mini-grid optimisation algorithms for rural community clusters | Open |
| 11.4 | Grid reliability scoring and predictive maintenance for African utilities | Open |
| 11.5 | Energy poverty measurement and tracking at household and community level | Open |
| 11.6 | Biomass and biogas energy system performance monitoring | Open |
| 11.7 | Water-power infrastructure interdependency mapping in East Africa | Open |
| 11.8 | EV charging infrastructure planning for African city environments | Open |

---

### Domain 12 — Legal & Regulatory Intelligence
*Laws exist but information about them does not reach those who need it.*

| # | Research Topic | Status |
|---|----------------|--------|
| 12.1 | Legal information access systems for informal sector workers and traders | Open |
| 12.2 | Regulatory compliance tracking tools for African SMEs | Open |
| 12.3 | Court case data infrastructure and outcome analysis for East Africa | Open |
| 12.4 | Land rights documentation systems for rural and peri-urban communities | Open |
| 12.5 | Tax compliance burden measurement for African micro-businesses | Open |
| 12.6 | Cross-border trade regulation intelligence for the EAC common market | Open |
| 12.7 | Intellectual property protection in African digital and creative markets | Open |
| 12.8 | Contract enforcement mechanisms for the informal economy | Open |

---

## 8. Target Grant Bodies

| Institution | Short | Type | Alignment |
|-------------|-------|------|-----------|
| African Development Bank | AfDB | Development Finance | Financial data, governance intelligence |
| Gates Foundation | BMGF | Philanthropic | Mobile money, public health AI |
| USAID | USAID | Bilateral Aid | Digital development, civic tech |
| EU Horizon Europe | EU Horizon | Research Fund | AI research, Global South |
| World Bank IFC | IFC | Development Finance | SME financial systems |

---

## 9. Partner Institutions

| Institution | Type | Country | Notes |
|-------------|------|---------|-------|
| Makerere University | University | Uganda | Target academic partner — East Africa anchor |
| African Development Bank | Development Bank | Pan-African | Target grant body |

---

## 10. Public API

**Base URL:** `https://ecadellabs.cloud/api/public`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/public/publications` | GET | All published publications (paginated) |
| `/api/public/research` | GET | All published research projects (paginated) |

**Parameters:** `?limit=20&page=1` (both endpoints)
**Auth:** None required
**CORS:** Open (`*`)
**Docs:** https://ecadellabs.cloud/api-docs

---

## 11. Email Configuration

**Provider:** Hostinger SMTP
**From address:** ecadel@ecadelgroup.com
**SMTP host:** smtp.hostinger.com : 465 (SSL)

Emails sent:
- Contact form auto-reply → to inquiry submitter
- Contact form notification → to ecadel@ecadelgroup.com
- Newsletter subscription auto-reply → to subscriber

---

## 12. DNS Records (Hostinger)

| Type | Host | Value |
|------|------|-------|
| A | @ | 72.62.185.212 |
| A | www | 72.62.185.212 |

---

## 13. Content Management Cheatsheet

### Publish a new publication
1. Go to `/admin/publications/new`
2. Fill in title, category, abstract, full content (Markdown)
3. Add authors (comma-separated), tags (comma-separated)
4. Click **Publish** (or **Save Draft** to keep it hidden)
5. Set it as featured from `/admin/settings` to show it on the homepage

### Add a research project
1. Go to `/admin/research/new`
2. Fill in title, description, research problem, methodology (optional)
3. Set status: active | planned | completed
4. Click **Publish**

### Mark a fellow
1. Go to `/admin/fellows/new`
2. Fill in name, role, bio, expertise, institution
3. Toggle **Active fellow** on
4. Optional: toggle **Featured** to show prominently

### Respond to an inquiry
1. Go to `/admin/inquiries`
2. Click an inquiry to open it
3. Click **Reply via Email** (opens your email client)
4. Click **Archive** to dismiss it

---

## 14. Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.6 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS v4 + inline styles | 4.x |
| Database | SQLite via Prisma | Prisma 7.8 |
| ORM adapter | better-sqlite3 | 12.x |
| Auth | Custom JWT (httpOnly cookie) | — |
| Email | Nodemailer + Hostinger SMTP | 8.x |
| Icons | Lucide React | 1.x |
| Process manager | PM2 | 7.x |
| Web server | Nginx | 1.24 |
| SSL | Let's Encrypt / Certbot | — |

---

*Last updated: May 2026*
*ECADEL LABS — Research & Innovation Engine*
*A division of ECADEL GROUP LIMITED · Kampala, Uganda*

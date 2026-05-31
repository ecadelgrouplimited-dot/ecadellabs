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

### Research Domains (6 total)
1. AI Systems & Machine Learning
2. Mobile Money & Financial Data
3. Consequence Intelligence
4. Offline-First Architecture
5. Civic Technology
6. Road Safety Infrastructure

### Publications Live
1. *The Offline-First Imperative: Why African AI Must Work Without the Internet* — Research Note (May 2026)
2. *Mobile Money as Intelligence Infrastructure: A Framework for African Financial Data* — Position Paper (Apr 2026)

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

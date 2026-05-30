import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

function createClient() {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/ecadellabs.db";
  const rel  = raw.replace(/^file:/, "");
  const url  = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

const prisma = createClient();

async function main() {
  console.log("Seeding ECADEL LABS database…");

  // ── Research Projects ──────────────────────────────────────────────────────
  await prisma.researchProject.upsert({
    where:  { slug: "offline-first-ai-africa" },
    update: {},
    create: {
      title:       "Offline-First AI Systems for African Markets",
      slug:        "offline-first-ai-africa",
      description: "Investigating AI model architectures and deployment strategies that function reliably in low-connectivity African environments.",
      problem:     "Virtually all commercially deployed AI systems assume persistent internet connectivity. Africa's infrastructure reality — intermittent power, limited bandwidth, expensive data — makes this assumption invalid for most of the continent. The result is that the populations with the most to gain from AI remain systematically excluded from its benefits. ECADEL LABS is investigating what a genuinely offline-first AI architecture looks like: not adapted from cloud-first systems, but purpose-built for African connectivity realities.",
      methodology: "Literature review of existing offline-capable ML frameworks, performance benchmarking on constrained hardware common to African markets, case study analysis of SBB's Kiongozi AI deployment in Uganda.",
      status:       "active",
      technologies: JSON.stringify(["Machine Learning", "Edge AI", "SQLite", "ONNX", "Next.js"]),
      partners:     JSON.stringify(["ECADEL GROUP Limited"]),
      featured:     true,
      published:    true,
    },
  });

  await prisma.researchProject.upsert({
    where:  { slug: "mobile-money-financial-data" },
    update: {},
    create: {
      title:       "Mobile Money as a Financial Data Layer",
      slug:        "mobile-money-financial-data",
      description: "Exploring how mobile money transaction data can serve as a foundational financial intelligence layer for African SMEs and institutions.",
      problem:     "Africa's informal economy generates billions of transactions through mobile money systems — MTN, Airtel, M-Pesa — that formal financial analysis tools cannot access or interpret. This creates a fundamental blind spot in African economic data. Banks, development banks, and policymakers are making decisions without visibility into the dominant transaction layer. ECADEL LABS is investigating how mobile money data, properly structured, can become an intelligence layer that enables better credit access, economic analysis, and financial inclusion for the 60M+ African SMEs operating without formal financial records.",
      status:       "active",
      technologies: JSON.stringify(["Financial Data Systems", "SMS Parsing", "Data Engineering", "Mobile Money APIs"]),
      partners:     null,
      featured:     false,
      published:    true,
    },
  });

  await prisma.researchProject.upsert({
    where:  { slug: "consequence-modelling-african-governance" },
    update: {},
    create: {
      title:       "Consequence Modelling for Sub-Saharan Governance",
      slug:        "consequence-modelling-african-governance",
      description: "Developing frameworks for mapping the cascading consequences of policy decisions in African governmental contexts.",
      problem:     "Policy decisions in African governments — infrastructure investment, health policy, fiscal adjustments — carry systemic consequences that propagate across economic, social, and environmental systems simultaneously. Existing consequence modelling tools were built for Western institutional contexts with different data environments, governance structures, and systemic interdependencies. ECADEL LABS is developing consequence modelling frameworks specifically calibrated for Sub-Saharan African governance realities, with initial application to East African policy contexts.",
      status:       "planned",
      technologies: JSON.stringify(["Systems Modelling", "AI", "Graph Databases", "Policy Analysis"]),
      partners:     null,
      featured:     false,
      published:    true,
    },
  });

  // ── Publications ───────────────────────────────────────────────────────────
  await prisma.publication.upsert({
    where:  { slug: "offline-first-imperative" },
    update: {},
    create: {
      title:       "The Offline-First Imperative: Why African AI Must Work Without the Internet",
      slug:        "offline-first-imperative",
      abstract:    "This research note argues that the dominant AI deployment paradigm — cloud-first, connectivity-dependent — is structurally incompatible with the infrastructure reality of most African markets. We propose a set of design principles for offline-first AI systems and evaluate existing frameworks against these principles, with reference to ECADEL GROUP's Kiongozi AI deployment in Uganda as a case study.",
      content:     "## Introduction\n\nThe artificial intelligence revolution is, for most of Africa, happening at a distance.\n\nNot because African markets lack the talent, the demand, or the problems worth solving — but because every major AI system commercially deployed in the past decade has been designed around an assumption that is false for the majority of African users: that connectivity is reliable, affordable, and persistent.\n\n## The Connectivity Assumption\n\nCloud-first AI architecture assumes three things that are systematically untrue across most of Africa:\n\n1. **Reliable connectivity** — that the device can reach the model when needed\n2. **Affordable data** — that the cost of API calls is negligible relative to the value delivered\n3. **Low latency** — that response times are measured in milliseconds, not seconds\n\nIn Uganda, Kenya, Nigeria, and across sub-Saharan Africa, all three assumptions fail regularly. Mobile data costs remain high relative to incomes. Power outages are frequent. Rural and peri-urban connectivity is intermittent at best.\n\n## What Offline-First AI Requires\n\nA genuinely offline-first AI system must satisfy four properties:\n\n**1. On-device inference** — The model must run on the device itself, not on a remote server. This requires model compression, quantization, and hardware-appropriate optimization.\n\n**2. Local data sovereignty** — All data must be processable locally, with synchronization to the cloud when connectivity is available rather than as a prerequisite to function.\n\n**3. Graceful degradation** — When connectivity is available, the system should leverage it for enhanced capability; when it is not, the core functionality must remain intact.\n\n**4. Bandwidth-aware design** — Synchronization and update mechanisms must be designed for intermittent, expensive connectivity rather than continuous high-bandwidth connections.\n\n## Case Study: Kiongozi AI in Uganda\n\nECADEL GROUP's Kiongozi AI, deployed as the intelligence layer of Smart Business Book (SBB), offers an instructive case study in offline-first AI implementation for an African market.\n\n## Conclusion\n\nThe choice is not between AI and no AI for African markets. It is between AI designed for African realities and AI imported from elsewhere that fails when it matters most. ECADEL LABS argues for the former — and is building the frameworks to make it possible.",
      category:     "research-note",
      authors:      JSON.stringify(["ECADEL LABS Research Team"]),
      tags:         JSON.stringify(["AI", "Offline-First", "Africa", "Machine Learning", "Infrastructure"]),
      featured:     true,
      published:    true,
      publishedAt:  new Date("2026-05-01"),
    },
  });

  await prisma.publication.upsert({
    where:  { slug: "mobile-money-intelligence-framework" },
    update: {},
    create: {
      title:       "Mobile Money as Intelligence Infrastructure: A Framework for African Financial Data",
      slug:        "mobile-money-intelligence-framework",
      abstract:    "This position paper proposes a conceptual framework for treating mobile money transaction data as a foundational financial intelligence layer for African economies. We argue that the structural characteristics of mobile money — ubiquity, SMS-based accessibility, and informal economy penetration — make it uniquely suited as the primary data substrate for African financial AI systems, distinct from the bank feed model that underpins Western fintech.",
      content:     "## The Mobile Money Opportunity\n\nAfrica's mobile money ecosystem is one of the most significant financial data environments on earth — and one of the most systematically ignored by formal financial intelligence systems.\n\nM-Pesa processes more transactions annually than PayPal. MTN Mobile Money operates across 17 African countries. Airtel Money serves millions of users across East and West Africa. Yet the financial intelligence tooling built on top of these systems remains primitive compared to what is available to users of formal banking infrastructure.\n\n## Why This Matters\n\nSixty million African SMEs operate without formal financial records. Not because their finances are unrecorded — they are recorded in mobile money transaction histories — but because the systems built to interpret financial data were not designed to read those records.\n\nThe result is a fundamental asymmetry: the enterprises that most need access to financial intelligence (credit scoring, cash flow forecasting, supplier analytics) are systematically excluded because their financial lives run through channels that formal systems cannot read.\n\n## The Framework\n\nWe propose treating mobile money data as a four-layer intelligence stack:\n\n**Layer 1: Transaction Data** — Raw SMS and API data from mobile money providers\n**Layer 2: Pattern Recognition** — Supplier/customer identification, cash flow cycles, seasonal patterns\n**Layer 3: Business Intelligence** — Automated categorization, reconciliation, forecasting\n**Layer 4: Institutional Intelligence** — Credit scoring, risk assessment, economic analysis\n\n## Conclusion\n\nMobile money is not a substitute for banking. It is a different kind of financial infrastructure — one that Africa built for itself, at scale, before Western fintech arrived. The intelligence systems built on top of it should be built the same way.",
      category:     "position-paper",
      authors:      JSON.stringify(["ECADEL LABS Research Team"]),
      tags:         JSON.stringify(["Mobile Money", "Financial Data", "Africa", "Fintech", "SME"]),
      featured:     false,
      published:    true,
      publishedAt:  new Date("2026-04-15"),
    },
  });

  // ── Fellows ────────────────────────────────────────────────────────────────
  await prisma.fellow.upsert({
    where:  { id: "seed-wilson-ecaat" },
    update: {},
    create: {
      id:          "seed-wilson-ecaat",
      name:        "Wilson Ecaat",
      role:        "research-fellow",
      bio:         "Wilson Ecaat is the founder and lead developer of ECADEL GROUP LIMITED and the founding researcher at ECADEL LABS. His research focuses on offline-first AI systems for African markets, mobile money as a financial data layer, and applied intelligence infrastructure for African institutions. He is the architect behind Smart Business Book (sbb.finance) and PAME AI (pame.cc).",
      expertise:   JSON.stringify(["AI Architecture", "Offline-First Systems", "Mobile Money Infrastructure", "Systems Engineering", "Product Research"]),
      institution: "ECADEL GROUP LIMITED",
      cohort:      "2026",
      active:      true,
      featured:    true,
    },
  });

  // ── Partnerships ───────────────────────────────────────────────────────────
  await prisma.partnership.upsert({
    where:  { slug: "african-development-bank" },
    update: {},
    create: {
      institution: "African Development Bank",
      slug:        "african-development-bank",
      type:        "development-bank",
      description: "Target grant body for ECADEL LABS' research on financial data infrastructure and governance intelligence for African institutions.",
      country:     "Pan-African (HQ: Abidjan, Côte d'Ivoire)",
      website:     "https://www.afdb.org",
      active:      true,
      featured:    false,
    },
  });

  await prisma.partnership.upsert({
    where:  { slug: "makerere-university" },
    update: {},
    create: {
      institution: "Makerere University",
      slug:        "makerere-university",
      type:        "university",
      description: "Uganda's premier research university. Target academic partner for ECADEL LABS' East African technology infrastructure research and talent pipeline.",
      country:     "Uganda",
      website:     "https://www.mak.ac.ug",
      active:      true,
      featured:    true,
    },
  });

  // ── Settings ───────────────────────────────────────────────────────────────
  const defaults = [
    { key: "labsTitle",       value: JSON.stringify("ECADEL LABS") },
    { key: "labsTagline",     value: JSON.stringify("Research & Innovation Engine") },
    { key: "contactEmail",    value: JSON.stringify("ecadel@ecadelgroup.com") },
    { key: "researchDomains", value: JSON.stringify("6") },
    { key: "activeProjects",  value: JSON.stringify("3") },
    { key: "grantBodies",     value: JSON.stringify("5") },
  ];
  for (const s of defaults) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log("✓ Database seeded successfully");
  console.log("  - 3 research projects");
  console.log("  - 2 publications");
  console.log("  - 1 fellow");
  console.log("  - 2 partnerships");
  console.log("  - Default settings");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

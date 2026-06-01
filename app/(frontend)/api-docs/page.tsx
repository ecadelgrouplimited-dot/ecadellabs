import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research API",
  description: "ECADEL LABS public research API — open JSON endpoints for accessing our published research and publications.",
};

const BASE = "https://ecadellabs.cloud/api/public";

const ENDPOINTS = [
  {
    method: "GET",
    path:   "/api/public/fellows",
    desc:   "Returns all active fellows and researchers.",
    params: [
      { name:"role",  type:"string", desc:"Filter by role: research-fellow | resident | collaborator | advisor" },
      { name:"limit", type:"number", desc:"Results per page (default: 20, max: 100)" },
      { name:"page",  type:"number", desc:"Page number (default: 1)" },
    ],
    example: `${BASE}/fellows`,
    response: `{
  "data": [
    {
      "id":          "cm...",
      "slug":        "wilson-ecaat",
      "name":        "Wilson Ecaat",
      "role":        "research-fellow",
      "bio":         "Wilson Ecaat is the founder...",
      "expertise":   ["AI Architecture", "Offline-First Systems"],
      "institution": "ECADEL GROUP LIMITED",
      "cohort":      "2026",
      "featured":    true,
      "profileUrl":  "https://ecadellabs.cloud/fellows/wilson-ecaat"
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 20, "pages": 1 }
}`,
  },
  {
    method: "GET",
    path:   "/api/public/partnerships",
    desc:   "Returns all active partner institutions.",
    params: [
      { name:"type",  type:"string", desc:"Filter: university | development-bank | research-body | government | ngo" },
      { name:"limit", type:"number", desc:"Results per page (default: 20, max: 100)" },
      { name:"page",  type:"number", desc:"Page number (default: 1)" },
    ],
    example: `${BASE}/partnerships?type=university`,
    response: `{
  "data": [
    {
      "id":          "cm...",
      "institution": "Makerere University",
      "slug":        "makerere-university",
      "type":        "university",
      "description": "Uganda's premier research university...",
      "country":     "Uganda",
      "website":     "https://www.mak.ac.ug",
      "featured":    true
    }
  ],
  "meta": { "total": 2, "page": 1, "limit": 20, "pages": 1 }
}`,
  },
  {
    method: "GET",
    path:   "/api/public/publications",
    desc:   "Returns all published publications.",
    params: [
      { name:"category", type:"string", desc:"Filter: research-note | white-paper | position-paper | technical-report" },
      { name:"tag",      type:"string", desc:"Filter by tag keyword (e.g. AI, Africa)" },
      { name:"limit",    type:"number", desc:"Results per page (default: 20, max: 100)" },
      { name:"page",     type:"number", desc:"Page number (default: 1)" },
    ],
    example: `${BASE}/publications?category=research-note&limit=5`,
    response: `{
  "data": [
    {
      "id":          "cm...",
      "title":       "The Offline-First Imperative",
      "slug":        "offline-first-imperative",
      "abstract":    "This research note argues...",
      "category":    "research-note",
      "authors":     ["ECADEL LABS Research Team"],
      "tags":        ["AI", "Africa", "Offline-First"],
      "pdfUrl":      null,
      "publishedAt": "2026-05-01T00:00:00.000Z",
      "featured":    true,
      "url":         "https://ecadellabs.cloud/publications/offline-first-imperative"
    }
  ],
  "meta": { "total": 2, "page": 1, "limit": 5, "pages": 1 }
}`,
  },
  {
    method: "GET",
    path:   "/api/public/research",
    desc:   "Returns all published research projects.",
    params: [
      { name:"status", type:"string", desc:"Filter: active | planned | completed" },
      { name:"limit",  type:"number", desc:"Results per page (default: 20, max: 100)" },
      { name:"page",   type:"number", desc:"Page number (default: 1)" },
    ],
    example: `${BASE}/research?status=active`,
    response: `{
  "data": [
    {
      "id":           "cm...",
      "title":        "Offline-First AI Systems for African Markets",
      "slug":         "offline-first-ai-africa",
      "description":  "Investigating AI model architectures...",
      "problem":      "Virtually all commercially deployed AI systems...",
      "status":       "active",
      "technologies": ["Machine Learning", "Edge AI", "SQLite"],
      "partners":     ["ECADEL GROUP Limited"],
      "startDate":    null,
      "featured":     true,
      "url":          "https://ecadellabs.cloud/research/offline-first-ai-africa"
    }
  ],
  "meta": { "total": 3, "page": 1, "limit": 20, "pages": 1 }
}`,
  },
];

export default function ApiDocsPage() {
  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"64rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Open Research Data
          </p>
          <h1 style={{ fontSize:"clamp(1.8rem,2.5vw,2.5rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.125rem" }}>
            Public Research API
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"42rem", lineHeight:1.75, fontSize:"0.9375rem", marginBottom:"1.5rem" }}>
            ECADEL LABS provides open JSON API access to our published research and publications. No authentication required. Free to use for academic, research, and non-commercial purposes.
          </p>
          <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
            {[
              { label:"Base URL",   value:BASE },
              { label:"Version",    value:"v1" },
              { label:"Format",     value:"JSON" },
              { label:"Auth",       value:"None required" },
              { label:"Endpoints",  value:"4 (publications, research, fellows, partnerships)" },
              { label:"Health",     value:"GET /api/health" },
            ].map((m) => (
              <div key={m.label} style={{ padding:"0.375rem 0.875rem", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginRight:"0.375rem" }}>{m.label}:</span>
                <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.65)", fontFamily:"monospace" }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div style={{ maxWidth:"64rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"3rem" }}>
          {ENDPOINTS.map((ep) => (
            <div key={ep.path} style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)" }}>
              {/* Endpoint header */}
              <div style={{ padding:"1.5rem 2rem", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:"1rem" }}>
                <span style={{ fontSize:"10px", padding:"3px 8px", backgroundColor:"rgba(74,180,120,0.12)", color:"#4ab478", fontFamily:"monospace", fontWeight:600 }}>
                  {ep.method}
                </span>
                <code style={{ fontSize:"0.875rem", color:"#F0EDE6", fontFamily:"monospace" }}>{ep.path}</code>
              </div>

              <div style={{ padding:"1.5rem 2rem" }}>
                <p style={{ color:"rgba(200,196,190,0.62)", fontSize:"0.875rem", lineHeight:1.7, marginBottom:"1.5rem" }}>{ep.desc}</p>

                {/* Parameters */}
                <p style={{ fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Parameters</p>
                <div style={{ marginBottom:"1.5rem", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                  {ep.params.map((param) => (
                    <div key={param.name} style={{ display:"flex", gap:"1rem", fontSize:"0.8125rem", padding:"0.5rem 0.875rem", backgroundColor:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>
                      <code style={{ color:"#C8A96E", fontFamily:"monospace", flexShrink:0, minWidth:"80px" }}>{param.name}</code>
                      <code style={{ color:"rgba(200,196,190,0.38)", fontFamily:"monospace", flexShrink:0 }}>{param.type}</code>
                      <span style={{ color:"rgba(200,196,190,0.55)" }}>{param.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Example */}
                <p style={{ fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Example Request</p>
                <div style={{ padding:"0.875rem 1rem", backgroundColor:"#060608", border:"1px solid rgba(255,255,255,0.06)", fontFamily:"monospace", fontSize:"0.8125rem", color:"rgba(200,196,190,0.65)", marginBottom:"1.5rem", overflowX:"auto" }}>
                  GET {ep.example}
                </div>

                {/* Response */}
                <p style={{ fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Example Response</p>
                <pre style={{ padding:"1rem", backgroundColor:"#060608", border:"1px solid rgba(255,255,255,0.06)", fontFamily:"monospace", fontSize:"0.75rem", color:"rgba(200,196,190,0.58)", overflowX:"auto", lineHeight:1.7, margin:0 }}>
                  {ep.response}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Usage note */}
        <div style={{ marginTop:"3rem", padding:"1.75rem 2rem", backgroundColor:"rgba(200,169,110,0.04)", border:"1px solid rgba(200,169,110,0.15)" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Usage & Attribution</p>
          <p style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.62)", lineHeight:1.75, marginBottom:"0.75rem" }}>
            This API is free for academic, research, and non-commercial use. When citing ECADEL LABS data in publications or reports, please reference:
          </p>
          <p style={{ fontFamily:"monospace", fontSize:"0.8125rem", color:"rgba(200,196,190,0.5)", backgroundColor:"#060608", padding:"0.75rem 1rem", border:"1px solid rgba(255,255,255,0.06)" }}>
            ECADEL LABS (2026). Research Data API. Retrieved from https://ecadellabs.cloud/api/public
          </p>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)", marginTop:"1rem" }}>
            For commercial use or bulk data requests, contact{" "}
            <Link href="/contact?type=research" style={{ color:"rgba(200,169,110,0.7)", textDecoration:"none" }}>ecadel@ecadelgroup.com</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fellowship Program",
  description: "ECADEL LABS trains engineers, researchers and systems thinkers who will build Africa's intelligence infrastructure. Apply for a fellowship.",
};

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string,string> = {
  "research-fellow":"Research Fellow","resident":"Resident",
  "collaborator":"Collaborator","advisor":"Advisor",
};

const VALUE_PROPS = [
  { title:"Research Access", desc:"Work alongside ECADEL LABS' active research agenda on real problems with real stakes for African technology infrastructure." },
  { title:"Platform Exposure", desc:"Contribute to and learn from SBB, PAME AI, SafeRoad, Hapa, and Meridian — systems in production across East Africa." },
  { title:"Institutional Network", desc:"Connect with ECADEL GROUP's partners, grant bodies, and university collaborators across Africa and internationally." },
];

export default async function FellowsPage() {
  const fellows = await prisma.fellow.findMany({
    where: { active:true },
    orderBy: [{ featured:"desc" },{ name:"asc" }],
  });

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Fellowship Program
          </p>
          <h1 style={{ fontSize:"clamp(1.8rem,2.5vw,2.5rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.125rem" }}>
            Fellows &amp; Researchers.
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"42rem", lineHeight:1.75, fontSize:"0.9375rem" }}>
            ECADEL LABS trains the engineers, researchers, and systems thinkers who will build Africa&apos;s intelligence infrastructure. Our fellowship programme connects ambitious Africans with the problems worth solving.
          </p>
        </div>
      </div>

      {/* ── Value props ─────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"#0A0C12" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"0 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", backgroundColor:"rgba(255,255,255,0.07)" }}>
            {VALUE_PROPS.map((v) => (
              <div key={v.title} style={{ backgroundColor:"#0A0C12", padding:"2rem 2rem 2.5rem" }}>
                <div style={{ width:"3px", height:"2rem", backgroundColor:"#C8A96E", marginBottom:"1.25rem" }} />
                <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#F0EDE6", fontFamily:"var(--font-display)", marginBottom:"0.625rem" }}>{v.title}</h3>
                <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.8125rem", lineHeight:1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fellows grid ────────────────────────────────────────────────── */}
      <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"3rem 1.5rem" }}>
        {fellows.length > 0 && (
          <>
            <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"1.5rem" }}>
              Current Fellows &amp; Researchers
            </p>
            <div className="fellows-grid" style={{ backgroundColor:"rgba(255,255,255,0.06)", marginBottom:"3rem" }}>
              {fellows.map((f) => {
                const expertise = JSON.parse(f.expertise) as string[];
                const initials  = f.name.split(" ").map((n) => n[0]).join("").slice(0,2);
                return (
                  <Link key={f.id} href={`/fellows/${f.slug ?? f.id}`} style={{ backgroundColor:"#060608", padding:"2rem", display:"block", textDecoration:"none" }} className="hover:bg-deep group">
                    {/* Avatar + name */}
                    <div style={{ display:"flex", alignItems:"flex-start", gap:"1rem", marginBottom:"1.25rem" }}>
                      <div style={{ width:"40px", height:"40px", borderRadius:"50%", backgroundColor:"rgba(200,169,110,0.1)", border:"1px solid rgba(200,169,110,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, color:"#C8A96E", fontSize:"0.75rem", flexShrink:0 }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontSize:"0.9375rem", fontWeight:600, color:"#F0EDE6", fontFamily:"var(--font-display)" }}>{f.name}</div>
                        <div style={{ fontSize:"9px", color:"rgba(200,169,110,0.7)", letterSpacing:"0.08em", marginTop:"0.25rem" }}>{ROLE_LABELS[f.role] ?? f.role}</div>
                        {f.institution && <div style={{ fontSize:"0.75rem", color:"rgba(200,196,190,0.38)", marginTop:"0.2rem" }}>{f.institution}</div>}
                      </div>
                    </div>

                    {/* Bio */}
                    <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.8125rem", lineHeight:1.7, marginBottom:"1rem", overflow:"hidden", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical" }}>
                      {f.bio}
                    </p>

                    {/* Expertise tags */}
                    {expertise.length > 0 && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem", marginBottom:"1rem" }}>
                        {expertise.slice(0,3).map((e) => (
                          <span key={e} style={{ fontSize:"9px", padding:"2px 7px", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.4)", fontFamily:"monospace" }}>{e}</span>
                        ))}
                      </div>
                    )}

                    {f.linkedinUrl && (
                      <span style={{ fontSize:"10px", color:"rgba(200,196,190,0.38)" }}>LinkedIn ↗</span>
                    )}
                    <div style={{ fontSize:"10px", color:"rgba(200,169,110,0.55)", marginTop:"0.5rem" }}>View profile →</div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Apply CTA */}
        <div style={{ padding:"3rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", textAlign:"center" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1rem" }}>Join ECADEL LABS</p>
          <h2 style={{ fontSize:"clamp(1.4rem,2vw,1.75rem)", fontWeight:700, color:"#F0EDE6", fontFamily:"var(--font-display)", marginBottom:"0.875rem" }}>
            Apply for a Fellowship
          </h2>
          <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.875rem", lineHeight:1.7, maxWidth:"30rem", margin:"0 auto 1.75rem" }}>
            We are looking for researchers and engineers who are deeply serious about African technology infrastructure. If that is you, reach out.
          </p>
          <Link href="/contact?type=fellowship" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.8rem 2rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none" }}>
            Fellowship Inquiry <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

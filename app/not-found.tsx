import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem 1.5rem" }}>
      <div style={{ textAlign:"center", maxWidth:"28rem" }}>
        {/* Logo mark */}
        <div style={{ width:"80px", height:"80px", margin:"0 auto 2rem", opacity:0.25, position:"relative" }}>
          <Image src="/logos/ecadel_labs_transparent_1600.png" alt="" fill className="object-contain" />
        </div>

        <p style={{ fontSize:"9px", letterSpacing:"0.4em", textTransform:"uppercase", color:"rgba(200,169,110,0.6)", fontFamily:"monospace", marginBottom:"1rem" }}>
          404 — Not Found
        </p>
        <h1 style={{ fontSize:"1.75rem", fontWeight:700, color:"#F0EDE6", fontFamily:"var(--font-display)", lineHeight:1.2, marginBottom:"1rem" }}>
          This page doesn&apos;t exist.
        </h1>
        <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.9375rem", lineHeight:1.7, marginBottom:"2.5rem" }}>
          The page you&apos;re looking for may have moved or never existed. Return to the ECADEL LABS homepage.
        </p>

        <div style={{ display:"flex", justifyContent:"center", gap:"0.875rem", flexWrap:"wrap" }}>
          <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.8rem 1.75rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none" }}>
            Go Home
          </Link>
          <Link href="/research" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.8rem 1.75rem", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.7)", fontSize:"0.8125rem", textDecoration:"none" }}>
            View Research
          </Link>
        </div>

        <p style={{ fontSize:"10px", color:"rgba(200,196,190,0.2)", fontFamily:"monospace", marginTop:"3rem" }}>
          ECADEL LABS · ecadellabs.cloud
        </p>
      </div>
    </div>
  );
}

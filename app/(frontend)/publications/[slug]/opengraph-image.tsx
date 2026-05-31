import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CAT_LABELS: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

export default async function Image({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const pub = await prisma.publication.findFirst({
    where: { slug, published:true },
    select: { title:true, abstract:true, category:true, authors:true },
  });

  const title    = pub?.title    ?? "ECADEL LABS Publication";
  const category = pub?.category ? (CAT_LABELS[pub.category] ?? pub.category) : "Publication";
  const authors  = pub?.authors  ? (JSON.parse(pub.authors) as string[]).slice(0,2).join(", ") : "ECADEL LABS";

  return new ImageResponse(
    (
      <div style={{
        width:"100%", height:"100%",
        background:"#060608",
        display:"flex", flexDirection:"column",
        padding:"64px 72px",
        position:"relative",
      }}>
        {/* Gold accent line */}
        <div style={{ width:"60px", height:"3px", background:"#C8A96E", marginBottom:"36px" }} />

        {/* Category badge */}
        <div style={{
          fontSize:"13px", letterSpacing:"3px", textTransform:"uppercase",
          color:"rgba(200,169,110,0.75)", fontFamily:"monospace", marginBottom:"24px",
        }}>
          {category}
        </div>

        {/* Title */}
        <div style={{
          fontSize: title.length > 60 ? "38px" : "48px",
          fontWeight:700, color:"#F0EDE6",
          lineHeight:1.15, flex:1,
          maxWidth:"900px",
        }}>
          {title.length > 90 ? title.slice(0, 87) + "…" : title}
        </div>

        {/* Authors */}
        <div style={{ fontSize:"16px", color:"rgba(200,196,190,0.5)", marginBottom:"32px" }}>
          {authors}
        </div>

        {/* Bottom bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ fontSize:"20px", fontWeight:700, color:"#F0EDE6" }}>
              ECADEL <span style={{ color:"#C8A96E" }}>LABS</span>
            </div>
            <div style={{ width:"1px", height:"16px", background:"rgba(255,255,255,0.15)" }} />
            <div style={{ fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(200,196,190,0.38)" }}>
              Research & Innovation Engine
            </div>
          </div>
          <div style={{ fontSize:"13px", color:"rgba(200,196,190,0.25)", fontFamily:"monospace" }}>
            ecadellabs.cloud
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

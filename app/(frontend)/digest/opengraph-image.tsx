import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const size = { width:1200, height:630 };
export const contentType = "image/png";

export default async function Image() {
  const [pubCount, projCount] = await Promise.all([
    prisma.publication.count({ where:{ published:true } }),
    prisma.researchProject.count({ where:{ published:true } }),
  ]);

  const month = new Date().toLocaleDateString("en-GB", { month:"long", year:"numeric" });

  return new ImageResponse(
    (
      <div style={{ width:"100%", height:"100%", background:"#060608", display:"flex", flexDirection:"column", padding:"64px 72px" }}>
        <div style={{ width:"60px", height:"3px", background:"#C8A96E", marginBottom:"32px" }} />
        <div style={{ fontSize:"12px", letterSpacing:"4px", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"20px", display:"flex" }}>
          Research Digest · {month}
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:"4px" }}>
          <div style={{ fontSize:"48px", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, display:"flex" }}>ECADEL LABS</div>
          <div style={{ fontSize:"48px", fontWeight:700, color:"#C8A96E", lineHeight:1.1, display:"flex" }}>Research Briefing</div>
        </div>
        <div style={{ display:"flex", gap:"32px", marginBottom:"32px" }}>
          <div style={{ display:"flex", flexDirection:"column" }}>
            <span style={{ fontSize:"36px", fontWeight:800, color:"#C8A96E" }}>{pubCount}</span>
            <span style={{ fontSize:"11px", color:"rgba(200,196,190,0.4)", letterSpacing:"2px", textTransform:"uppercase", display:"flex" }}>Publications</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            <span style={{ fontSize:"36px", fontWeight:800, color:"#C8A96E" }}>{projCount}</span>
            <span style={{ fontSize:"11px", color:"rgba(200,196,190,0.4)", letterSpacing:"2px", textTransform:"uppercase", display:"flex" }}>Research Projects</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"24px" }}>
          <div style={{ display:"flex", gap:"8px" }}>
            <span style={{ fontSize:"18px", fontWeight:700, color:"#F0EDE6" }}>ECADEL</span>
            <span style={{ fontSize:"18px", fontWeight:700, color:"#C8A96E" }}>LABS</span>
          </div>
          <div style={{ fontSize:"13px", color:"rgba(200,196,190,0.3)", fontFamily:"monospace", display:"flex" }}>ecadellabs.cloud/digest</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

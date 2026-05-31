import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STATUS_COLORS: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };

export default async function Image({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const project = await prisma.researchProject.findFirst({
    where: { slug, published:true },
    select: { title:true, description:true, status:true },
  });

  const title  = project?.title  ?? "ECADEL LABS Research";
  const status = project?.status ?? "active";
  const statusColor = STATUS_COLORS[status] ?? "#C8A96E";

  return new ImageResponse(
    (
      <div style={{
        width:"100%", height:"100%",
        background:"#060608",
        display:"flex", flexDirection:"column",
        padding:"64px 72px",
      }}>
        {/* Status line */}
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"36px" }}>
          <div style={{ width:"60px", height:"3px", background:"#C8A96E" }} />
          <div style={{ fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(200,169,110,0.65)", fontFamily:"monospace" }}>
            Research Agenda
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          display:"inline-flex", alignItems:"center",
          fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"monospace",
          padding:"4px 12px", marginBottom:"24px",
          background:`${statusColor}15`, color:statusColor,
          alignSelf:"flex-start",
        }}>
          {status}
        </div>

        {/* Title */}
        <div style={{
          fontSize: title.length > 60 ? "40px" : "50px",
          fontWeight:700, color:"#F0EDE6",
          lineHeight:1.15, flex:1,
          maxWidth:"900px",
        }}>
          {title.length > 90 ? title.slice(0, 87) + "…" : title}
        </div>

        {/* Bottom */}
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

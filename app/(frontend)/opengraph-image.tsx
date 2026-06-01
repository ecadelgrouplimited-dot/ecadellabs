import { ImageResponse } from "next/og";

export const size = { width:1200, height:630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width:"100%", height:"100%", background:"#060608", display:"flex", flexDirection:"column", padding:"64px 72px" }}>
        <div style={{ width:"60px", height:"3px", background:"#C8A96E", marginBottom:"40px" }} />
        <div style={{ fontSize:"13px", letterSpacing:"4px", textTransform:"uppercase", color:"rgba(200,169,110,0.75)", fontFamily:"monospace", marginBottom:"24px", display:"flex" }}>
          ECADEL LABS · ecadellabs.cloud
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:"4px" }}>
          <div style={{ fontSize:"54px", fontWeight:700, color:"#F0EDE6", lineHeight:1.08, display:"flex" }}>Research & Innovation</div>
          <div style={{ fontSize:"54px", fontWeight:700, color:"#C8A96E", lineHeight:1.08, display:"flex" }}>Engine for Africa.</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"24px" }}>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <span style={{ fontSize:"20px", fontWeight:700, color:"#F0EDE6" }}>ECADEL</span>
            <span style={{ fontSize:"20px", fontWeight:700, color:"#C8A96E" }}>LABS</span>
          </div>
          <div style={{ fontSize:"13px", color:"rgba(200,196,190,0.3)", fontFamily:"monospace", display:"flex" }}>ecadellabs.cloud</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

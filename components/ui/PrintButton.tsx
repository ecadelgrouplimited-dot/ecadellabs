"use client";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        display:"inline-flex", alignItems:"center", gap:"0.5rem",
        padding:"0.5rem 1rem",
        border:"1px solid rgba(255,255,255,0.08)",
        backgroundColor:"rgba(255,255,255,0.03)",
        color:"rgba(200,196,190,0.5)",
        fontSize:"0.75rem", cursor:"pointer", fontFamily:"inherit",
        transition:"all 0.15s",
      }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(200,169,110,0.3)"; e.currentTarget.style.color = "rgba(200,196,190,0.8)"; }}
      onMouseOut={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(200,196,190,0.5)"; }}
    >
      <Printer size={13} /> Print / Save PDF
    </button>
  );
}

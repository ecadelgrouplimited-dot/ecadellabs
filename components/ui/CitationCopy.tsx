"use client";

import { useState } from "react";
import { CheckCheck, Copy, Download } from "lucide-react";

interface Props {
  title:   string;
  authors: string[];
  year:    number | string;
  slug:    string;
  url:     string;
}

export default function CitationCopy({ title, authors, year, slug, url }: Props) {
  const [apaCopied,  setApaCopied]  = useState(false);
  const [mlaCopied,  setMlaCopied]  = useState(false);

  const authorStr = authors.join(", ") || "ECADEL LABS Research Team";

  const apa = `${authorStr} (${year}). ${title}. ECADEL LABS. ${url}`;
  const mla = `${authorStr}. "${title}." ECADEL LABS, ${year}, ${url}.`;

  async function copy(text:string, setter: (v:boolean)=>void) {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2500);
  }

  const BTN: React.CSSProperties = {
    display:"flex", alignItems:"center", gap:"0.5rem",
    padding:"0.375rem 0.875rem", fontSize:"10px", fontFamily:"monospace",
    backgroundColor:"rgba(255,255,255,0.04)",
    border:"1px solid rgba(255,255,255,0.08)",
    color:"rgba(200,196,190,0.5)", cursor:"pointer", borderRadius:"3px",
    transition:"all 0.15s",
  };

  return (
    <div style={{ marginTop:"1.25rem" }}>
      <p style={{ fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
        Cite This Work
      </p>

      {/* APA */}
      <div style={{ marginBottom:"0.875rem" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.375rem" }}>
          <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>APA</span>
          <button style={{ ...BTN, color: apaCopied?"#4ab478":"rgba(200,196,190,0.5)", borderColor: apaCopied?"rgba(74,180,120,0.3)":"rgba(255,255,255,0.08)" }}
            onClick={()=>copy(apa, setApaCopied)}>
            {apaCopied?<CheckCheck size={11}/>:<Copy size={11}/>} {apaCopied?"Copied":"Copy"}
          </button>
        </div>
        <div style={{ padding:"0.75rem 0.875rem", backgroundColor:"#060608", border:"1px solid rgba(255,255,255,0.07)", fontFamily:"monospace", fontSize:"0.75rem", color:"rgba(200,196,190,0.52)", lineHeight:1.7, borderRadius:"3px" }}>
          {apa}
        </div>
      </div>

      {/* MLA */}
      <div style={{ marginBottom:"0.875rem" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.375rem" }}>
          <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>MLA</span>
          <button style={{ ...BTN, color: mlaCopied?"#4ab478":"rgba(200,196,190,0.5)", borderColor: mlaCopied?"rgba(74,180,120,0.3)":"rgba(255,255,255,0.08)" }}
            onClick={()=>copy(mla, setMlaCopied)}>
            {mlaCopied?<CheckCheck size={11}/>:<Copy size={11}/>} {mlaCopied?"Copied":"Copy"}
          </button>
        </div>
        <div style={{ padding:"0.75rem 0.875rem", backgroundColor:"#060608", border:"1px solid rgba(255,255,255,0.07)", fontFamily:"monospace", fontSize:"0.75rem", color:"rgba(200,196,190,0.52)", lineHeight:1.7, borderRadius:"3px" }}>
          {mla}
        </div>
      </div>

      {/* BibTeX download */}
      <a href={`/publications/${slug}/cite.bib`} download style={{ ...BTN, textDecoration:"none", width:"fit-content" }}>
        <Download size={11}/> Download BibTeX (.bib)
      </a>
    </div>
  );
}

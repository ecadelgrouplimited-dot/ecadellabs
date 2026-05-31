"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Minimize2, Maximize2, Download, Printer, Minus, Plus,
  BookOpen, ChevronUp, AlertCircle, ExternalLink,
} from "lucide-react";

// ── URL utilities ──────────────────────────────────────────────────────────

function detectUrlType(url: string): "gdrive" | "gdoc" | "gsheet" | "pdf" | "external" {
  if (/drive\.google\.com\/file\/d\//.test(url))   return "gdrive";
  if (/docs\.google\.com\/document/.test(url))      return "gdoc";
  if (/docs\.google\.com\/spreadsheets/.test(url))  return "gsheet";
  if (/\.pdf(\?|$)/i.test(url))                     return "pdf";
  return "external";
}

function toEmbedUrl(url: string): string {
  const type = detectUrlType(url);
  if (type === "gdrive") {
    const m = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
    return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
  }
  if (type === "gdoc") {
    const m = url.match(/docs\.google\.com\/document\/d\/([^/?]+)/);
    return m ? `https://docs.google.com/document/d/${m[1]}/preview` : url;
  }
  if (type === "gsheet") {
    const m = url.match(/docs\.google\.com\/spreadsheets\/d\/([^/?]+)/);
    return m ? `https://docs.google.com/spreadsheets/d/${m[1]}/preview` : url;
  }
  return url; // pdf / external — embed directly
}

function toDownloadUrl(url: string): string {
  const type = detectUrlType(url);
  if (type === "gdrive") {
    const m = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
    return m ? `https://drive.google.com/uc?export=download&id=${m[1]}` : url;
  }
  return url;
}

function getDocLabel(url: string): string {
  const type = detectUrlType(url);
  if (type === "gdrive")  return "Google Drive Document";
  if (type === "gdoc")    return "Google Doc";
  if (type === "gsheet")  return "Google Sheet";
  if (type === "pdf")     return "PDF Document";
  return "External Document";
}

// ── Reading progress hook ─────────────────────────────────────────────────

function useReadingProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const rect    = ref.current.getBoundingClientRect();
      const total   = rect.height - window.innerHeight;
      const current = -rect.top;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0);
    };
    window.addEventListener("scroll", update, { passive:true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [ref]);
  return progress;
}

// ── Extract headings for mini TOC ────────────────────────────────────────

function extractTOC(html: string) {
  const matches = [...html.matchAll(/<h([23])[^>]*>([^<]+)<\/h[23]>/gi)];
  return matches.map((m) => ({
    level: Number(m[1]),
    text:  m[2].trim(),
    id:    m[2].trim().toLowerCase().replace(/[^\w]+/g,"-"),
  }));
}

// ── Main reader ───────────────────────────────────────────────────────────

interface Props {
  documentUrl?: string | null;
  htmlContent?: string | null;
  title:        string;
  estimatedWords?: number;
}

const TOOLBAR_H = "48px";

export default function EcadelReader({ documentUrl, htmlContent, title, estimatedWords }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [fontSize,   setFontSize]   = useState(16);
  const [tocOpen,    setTocOpen]    = useState(false);
  const [iframeH,    setIframeH]    = useState(680);
  const [iframeErr,  setIframeErr]  = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const progress   = useReadingProgress(contentRef);

  const embedUrl   = documentUrl ? toEmbedUrl(documentUrl)    : null;
  const dlUrl      = documentUrl ? toDownloadUrl(documentUrl) : null;
  const docLabel   = documentUrl ? getDocLabel(documentUrl)   : null;
  const toc        = htmlContent ? extractTOC(htmlContent)    : [];
  const readMins   = estimatedWords ? Math.max(1, Math.ceil(estimatedWords / 200)) : null;

  // Escape key exits fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && fullscreen) setFullscreen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [fullscreen]);

  // Adjust iframe height when fullscreen
  useEffect(() => {
    setIframeH(fullscreen ? window.innerHeight - parseInt(TOOLBAR_H) - 4 : 680);
  }, [fullscreen]);

  function print() { window.print(); }

  const containerStyle: React.CSSProperties = fullscreen
    ? { position:"fixed", inset:0, zIndex:999, backgroundColor:"#060608", display:"flex", flexDirection:"column" }
    : { position:"relative", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden" };

  const TBTN: React.CSSProperties = {
    display:"flex", alignItems:"center", justifyContent:"center",
    width:"32px", height:"32px", background:"none", border:"none",
    cursor:"pointer", color:"rgba(200,196,190,0.5)", borderRadius:"3px",
    transition:"all 0.15s", flexShrink:0,
  };

  function TBtn({ onClick, title: t, children }: { onClick: ()=>void; title: string; children: React.ReactNode }) {
    return (
      <button type="button" onClick={onClick} title={t} style={TBTN}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#F0EDE6"; }}
        onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(200,196,190,0.5)"; }}>
        {children}
      </button>
    );
  }

  return (
    <div style={containerStyle}>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div style={{ height:TOOLBAR_H, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 0.875rem", backgroundColor:"#0A0C12", borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
        {/* Left — label + read time */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.875rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
            <BookOpen size={13} color="rgba(200,169,110,0.6)" />
            <span style={{ fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,169,110,0.65)", fontFamily:"monospace" }}>
              ECADEL LABS READER
            </span>
          </div>
          {docLabel && (
            <span style={{ fontSize:"9px", padding:"1px 7px", backgroundColor:"rgba(255,255,255,0.05)", color:"rgba(200,196,190,0.38)", borderRadius:"2px", fontFamily:"monospace" }}>
              {docLabel}
            </span>
          )}
          {readMins && !embedUrl && (
            <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>~{readMins} min read</span>
          )}
        </div>

        {/* Right — controls */}
        <div style={{ display:"flex", alignItems:"center", gap:"2px" }}>
          {/* Font controls — only for inline content */}
          {!embedUrl && htmlContent && (
            <>
              <TBtn onClick={() => setFontSize((s) => Math.max(13, s - 1))} title="Decrease font size">
                <Minus size={12} />
              </TBtn>
              <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", width:"24px", textAlign:"center" }}>{fontSize}</span>
              <TBtn onClick={() => setFontSize((s) => Math.min(22, s + 1))} title="Increase font size">
                <Plus size={12} />
              </TBtn>
              <div style={{ width:"1px", height:"20px", backgroundColor:"rgba(255,255,255,0.08)", margin:"0 4px" }} />
            </>
          )}

          {/* TOC toggle — only for inline with headings */}
          {!embedUrl && toc.length > 0 && (
            <TBtn onClick={() => setTocOpen(!tocOpen)} title="Table of contents">
              <span style={{ fontSize:"10px", fontFamily:"monospace", color: tocOpen ? "#C8A96E" : "rgba(200,196,190,0.5)" }}>≡</span>
            </TBtn>
          )}

          {/* Open in new tab (for embedded docs) */}
          {documentUrl && (
            <a href={documentUrl} target="_blank" rel="noopener noreferrer" style={{ ...TBTN, textDecoration:"none" }} title="Open in new tab"
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#F0EDE6"; }}
              onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(200,196,190,0.5)"; }}>
              <ExternalLink size={13} />
            </a>
          )}

          {/* Download */}
          {dlUrl && (
            <a href={dlUrl} download style={{ ...TBTN, textDecoration:"none" }} title="Download document"
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#F0EDE6"; }}
              onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(200,196,190,0.5)"; }}>
              <Download size={13} />
            </a>
          )}

          {/* Print */}
          <TBtn onClick={print} title="Print / Save as PDF">
            <Printer size={13} />
          </TBtn>

          <div style={{ width:"1px", height:"20px", backgroundColor:"rgba(255,255,255,0.08)", margin:"0 4px" }} />

          {/* Fullscreen */}
          <TBtn onClick={() => setFullscreen(!fullscreen)} title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}>
            {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </TBtn>
        </div>
      </div>

      {/* ── Reading progress bar (inline content only) ──────────────── */}
      {!embedUrl && htmlContent && (
        <div style={{ height:"2px", backgroundColor:"rgba(255,255,255,0.05)" }}>
          <div style={{ height:"100%", width:`${progress}%`, backgroundColor:"#C8A96E", transition:"width 0.1s linear" }} />
        </div>
      )}

      {/* ── Content area ────────────────────────────────────────────── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* TOC sidebar */}
        {tocOpen && toc.length > 0 && (
          <div style={{ width:"220px", flexShrink:0, backgroundColor:"#060608", borderRight:"1px solid rgba(255,255,255,0.07)", padding:"1.25rem 1rem", overflowY:"auto", maxHeight: fullscreen ? `calc(100vh - ${TOOLBAR_H})` : "680px" }}>
            <p style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Contents</p>
            {toc.map((h, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  document.getElementById(h.id)?.scrollIntoView({ behavior:"smooth" });
                }}
                style={{ display:"block", width:"100%", textAlign:"left", background:"none", border:"none", cursor:"pointer", padding:`0.375rem 0 0.375rem ${h.level === 3 ? "1rem" : "0"}`, fontSize:"0.8rem", color:"rgba(200,196,190,0.55)", lineHeight:1.4, borderLeft:`2px solid ${h.level === 2 ? "rgba(200,169,110,0.3)" : "transparent"}`, paddingLeft:`${h.level === 3 ? "1.25rem" : "0.5rem"}`, marginBottom:"2px", transition:"color 0.15s" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#C8A96E")}
                onMouseOut={(e)  => (e.currentTarget.style.color = "rgba(200,196,190,0.55)")}
              >
                {h.text}
              </button>
            ))}
          </div>
        )}

        {/* Main content */}
        <div style={{ flex:1, overflow:"auto", position:"relative" }} ref={contentRef}>
          {embedUrl ? (
            <>
              {iframeErr ? (
                /* Fallback when iframe is blocked */
                <div style={{ padding:"3rem", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem" }}>
                  <AlertCircle size={28} color="rgba(212,162,76,0.6)" />
                  <p style={{ color:"rgba(200,196,190,0.62)", fontSize:"0.9375rem" }}>
                    This document cannot be embedded. Open it directly:
                  </p>
                  <a href={documentUrl!} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.75rem 1.5rem", backgroundColor:"#C8A96E", color:"#060608", textDecoration:"none", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.875rem", borderRadius:"3px" }}>
                    <ExternalLink size={14} /> Open Document
                  </a>
                </div>
              ) : (
                <iframe
                  src={embedUrl}
                  style={{ width:"100%", height:`${iframeH}px`, border:"none", display:"block" }}
                  allow="autoplay"
                  onError={() => setIframeErr(true)}
                  title={title}
                />
              )}
            </>
          ) : htmlContent ? (
            <div
              style={{ padding: fullscreen ? "3rem 4rem" : "2.5rem 2rem", maxWidth:"72ch", margin:"0 auto" }}
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <div style={{ padding:"3rem", textAlign:"center", color:"rgba(200,196,190,0.32)", fontSize:"0.875rem" }}>
              No content available for this publication.
            </div>
          )}
        </div>
      </div>

      {/* ── Back to top (fullscreen only, inline content) ──────────── */}
      {fullscreen && !embedUrl && progress > 20 && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
          style={{ position:"absolute", bottom:"1.5rem", right:"1.5rem", width:"40px", height:"40px", borderRadius:"50%", backgroundColor:"rgba(200,169,110,0.15)", border:"1px solid rgba(200,169,110,0.3)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}
        >
          <ChevronUp size={16} color="#C8A96E" />
        </button>
      )}
    </div>
  );
}

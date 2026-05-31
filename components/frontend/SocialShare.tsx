"use client";

import { useState } from "react";
import { Link2, Mail, CheckCheck, Share2 } from "lucide-react";

interface Props {
  title:    string;
  url:      string;
  abstract: string;
  authors:  string[];
  tags:     string[];
}

// Inline SVGs for platforms removed from lucide v1
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

export default function SocialShare({ title, url, abstract, authors, tags }: Props) {
  const [copied, setCopied] = useState(false);

  const enc    = encodeURIComponent;
  const short  = abstract.slice(0, 120) + (abstract.length > 120 ? "…" : "");
  const tagStr = tags.slice(0, 3).map((t) => t.replace(/\s+/g,"")).join(",");

  const LINKS = [
    {
      label:  "X / Twitter",
      Icon:   XIcon,
      color:  "#e2e8f0",
      bgHov:  "rgba(226,232,240,0.1)",
      href:   `https://twitter.com/intent/tweet?text=${enc(`"${title}" — ECADEL LABS`)}&url=${enc(url)}&hashtags=ECADELLabs,AfricanResearch${tagStr ? "," + tagStr : ""}`,
    },
    {
      label:  "LinkedIn",
      Icon:   LinkedInIcon,
      color:  "#0a66c2",
      bgHov:  "rgba(10,102,194,0.12)",
      href:   `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
    {
      label:  "WhatsApp",
      Icon:   WhatsAppIcon,
      color:  "#25d366",
      bgHov:  "rgba(37,211,102,0.1)",
      href:   `https://wa.me/?text=${enc(`${title}\n\n${short}\n\nRead: ${url}`)}`,
    },
    {
      label:  "Email",
      Icon:   () => <Mail size={14} />,
      color:  "#C8A96E",
      bgHov:  "rgba(200,169,110,0.12)",
      href:   `mailto:?subject=${enc(title + " — ECADEL LABS Research")}&body=${enc(`${title}\n${authors.join(", ")}\n\n${abstract}\n\nRead the full publication:\n${url}`)}`,
    },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div style={{ marginTop:"3rem", paddingTop:"2rem", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <Share2 size={14} color="rgba(200,169,110,0.7)" />
          <span style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace" }}>
            Share this publication
          </span>
        </div>
        <button
          type="button"
          onClick={copyLink}
          style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.4rem 0.875rem", fontSize:"10px", fontFamily:"monospace", backgroundColor: copied ? "rgba(74,180,120,0.12)" : "rgba(255,255,255,0.04)", border:`1px solid ${copied ? "rgba(74,180,120,0.3)" : "rgba(255,255,255,0.1)"}`, color: copied ? "#4ab478" : "rgba(200,196,190,0.55)", cursor:"pointer", borderRadius:"3px", transition:"all 0.2s" }}
        >
          {copied ? <CheckCheck size={11} /> : <Link2 size={11} />}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      {/* Platform buttons */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.625rem" }}>
        {LINKS.map(({ label, Icon, color, bgHov, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.5rem 1rem", backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,196,190,0.6)", fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px", transition:"all 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = bgHov; e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.color = color; }}
            onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(200,196,190,0.6)"; }}
          >
            <Icon /> {label}
          </a>
        ))}
      </div>

      {/* Citation */}
      <div style={{ marginTop:"1.5rem" }}>
        <p style={{ fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"0.625rem" }}>
          Cite this work
        </p>
        <div style={{ padding:"0.875rem 1rem", backgroundColor:"#060608", border:"1px solid rgba(255,255,255,0.07)", fontFamily:"monospace", fontSize:"0.75rem", color:"rgba(200,196,190,0.48)", lineHeight:1.7, borderRadius:"3px" }}>
          {authors.join(", ")} ({new Date().getFullYear()}). <em>{title}</em>. ECADEL LABS. {url}
        </div>
      </div>
    </div>
  );
}

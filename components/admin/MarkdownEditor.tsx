"use client";

import { useState, useRef } from "react";
import {
  Bold, Italic, Heading2, Heading3, Quote, Code,
  List, Link2, Minus, Eye, Edit3,
} from "lucide-react";

interface Props {
  value:    string;
  onChange: (v: string) => void;
  rows?:    number;
  placeholder?: string;
}

const TOOLBAR = [
  { icon:Bold,     label:"Bold",         wrap:["**","**"] },
  { icon:Italic,   label:"Italic",       wrap:["*","*"] },
  { icon:Heading2, label:"Heading 2",    line:"## " },
  { icon:Heading3, label:"Heading 3",    line:"### " },
  { icon:Quote,    label:"Blockquote",   line:"> " },
  { icon:Code,     label:"Code",         wrap:["`","`"] },
  { icon:List,     label:"List item",    line:"- " },
  { icon:Link2,    label:"Link",         template:"[text](url)" },
  { icon:Minus,    label:"Divider",      insert:"\n\n---\n\n" },
];

export default function MarkdownEditor({ value, onChange, rows = 18, placeholder }: Props) {
  const [preview, setPreview] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(btn: typeof TOOLBAR[number]) {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = value.slice(s, e);
    let inserted = "";

    if (btn.template) {
      inserted = btn.template;
    } else if (btn.insert) {
      inserted = btn.insert;
    } else if (btn.line) {
      inserted = btn.line + (selected || "text");
    } else if (btn.wrap) {
      inserted = btn.wrap[0] + (selected || "text") + btn.wrap[1];
    }

    const next = value.slice(0, s) + inserted + value.slice(e);
    onChange(next);
    setTimeout(() => {
      ta.focus();
      const pos = s + inserted.length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  }

  const TBTN: React.CSSProperties = {
    display:"flex", alignItems:"center", justifyContent:"center",
    width:"28px", height:"28px", background:"none", border:"none",
    cursor:"pointer", color:"rgba(200,196,190,0.5)", borderRadius:"3px",
    transition:"all 0.15s",
  };

  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.1)", borderRadius:"3px", overflow:"hidden" }}>
      {/* Toolbar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.375rem 0.625rem", backgroundColor:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"2px" }}>
          {TOOLBAR.map((btn) => (
            <button
              key={btn.label}
              type="button"
              title={btn.label}
              onClick={() => apply(btn)}
              style={TBTN}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#F0EDE6"; }}
              onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(200,196,190,0.5)"; }}
            >
              <btn.icon size={13} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          style={{ display:"flex", alignItems:"center", gap:"0.375rem", padding:"0.25rem 0.625rem", fontSize:"10px", letterSpacing:"0.08em", textTransform:"uppercase", color: preview ? "#C8A96E" : "rgba(200,196,190,0.45)", background:"none", border:`1px solid ${preview ? "rgba(200,169,110,0.35)" : "rgba(255,255,255,0.08)"}`, cursor:"pointer", borderRadius:"3px", fontFamily:"monospace", transition:"all 0.15s" }}
        >
          {preview ? <Edit3 size={11} /> : <Eye size={11} />}
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div
          style={{ padding:"1.25rem", minHeight:`${rows * 1.6}rem`, backgroundColor:"rgba(255,255,255,0.02)", color:"rgba(200,196,190,0.8)", fontSize:"0.875rem", lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit" }}
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: value
            .replace(/^### (.+)$/gm, "<h3>$1</h3>")
            .replace(/^## (.+)$/gm, "<h2>$1</h2>")
            .replace(/^# (.+)$/gm, "<h1>$1</h1>")
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>")
            .replace(/`(.+?)`/g, "<code>$1</code>")
            .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
            .replace(/^- (.+)$/gm, "<li>$1</li>")
            .replace(/---/g, "<hr>")
            .replace(/\n\n/g, "</p><p>")
            .replace(/^\s/, "<p>")
          }}
        />
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder ?? "Write in Markdown…"}
          style={{ width:"100%", resize:"vertical", backgroundColor:"rgba(255,255,255,0.02)", border:"none", color:"#F0EDE6", padding:"1rem 1rem", fontSize:"0.875rem", lineHeight:1.75, outline:"none", fontFamily:"'JetBrains Mono','Fira Code',monospace", boxSizing:"border-box" }}
        />
      )}

      {/* Word / char count */}
      <div style={{ display:"flex", justifyContent:"flex-end", padding:"0.25rem 0.75rem", backgroundColor:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.28)", fontFamily:"monospace" }}>
          {value.split(/\s+/).filter(Boolean).length} words · {value.length} chars
        </span>
      </div>
    </div>
  );
}

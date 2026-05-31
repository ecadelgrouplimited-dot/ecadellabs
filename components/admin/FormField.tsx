"use client";

export const INPUT: React.CSSProperties = {
  width:"100%", backgroundColor:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(255,255,255,0.1)", color:"#F0EDE6",
  padding:"0.6875rem 0.875rem", fontSize:"0.875rem",
  outline:"none", fontFamily:"inherit", borderRadius:"3px",
  transition:"border-color 0.2s", boxSizing:"border-box" as const,
};

export function fieldFocus(e: React.FocusEvent<HTMLElement>) {
  (e.target as HTMLElement).style.borderColor = "rgba(200,169,110,0.55)";
}
export function fieldBlur(e: React.FocusEvent<HTMLElement>) {
  (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
}

interface LabelProps { children: React.ReactNode; required?: boolean; hint?: string }

export function FieldLabel({ children, required, hint }: LabelProps) {
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:"0.5rem", marginBottom:"0.5rem" }}>
      <label style={{ fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.48)", fontFamily:"monospace" }}>
        {children}{required && <span style={{ color:"#D4A24C", marginLeft:"2px" }}>*</span>}
      </label>
      {hint && <span style={{ fontSize:"10px", color:"rgba(200,196,190,0.28)", fontStyle:"italic" }}>{hint}</span>}
    </div>
  );
}

interface SectionProps { title: string; children: React.ReactNode; accent?: string }

export function FormSection({ title, children, accent = "#C8A96E" }: SectionProps) {
  return (
    <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", overflow:"hidden" }}>
      <div style={{ padding:"0.875rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", borderLeft:`3px solid ${accent}`, display:"flex", alignItems:"center" }}>
        <span style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F0EDE6", fontSize:"0.875rem" }}>{title}</span>
      </div>
      <div style={{ padding:"1.5rem" }}>
        {children}
      </div>
    </div>
  );
}

export function Row({ cols = 2, gap = "1rem", children }: { cols?: number; gap?: string; children: React.ReactNode }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap }}>
      {children}
    </div>
  );
}

interface BtnProps {
  onClick?: () => void;
  type?:    "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
  size?: "sm" | "md";
}

export function Btn({ onClick, type = "button", disabled, variant = "secondary", children, size = "md" }: BtnProps) {
  const pd = size === "sm" ? "0.45rem 0.875rem" : "0.7rem 1.375rem";
  const styles: Record<string, React.CSSProperties> = {
    primary:   { backgroundColor:"#C8A96E", color:"#060608", border:"none" },
    secondary: { backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.72)", border:"1px solid rgba(255,255,255,0.1)" },
    danger:    { backgroundColor:"rgba(224,85,85,0.08)",  color:"#e05555", border:"1px solid rgba(224,85,85,0.2)" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display:"inline-flex", alignItems:"center", gap:"0.375rem",
        padding:pd, borderRadius:"3px", cursor:disabled ? "not-allowed" : "pointer",
        fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem",
        opacity:disabled ? 0.45 : 1, transition:"all 0.15s",
        ...styles[variant],
      }}
      onMouseOver={(e) => {
        if (disabled) return;
        if (variant === "primary")   e.currentTarget.style.backgroundColor = "#A88B54";
        if (variant === "secondary") e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
        if (variant === "danger")    e.currentTarget.style.backgroundColor = "rgba(224,85,85,0.15)";
      }}
      onMouseOut={(e) => {
        if (variant === "primary")   e.currentTarget.style.backgroundColor = "#C8A96E";
        if (variant === "secondary") e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
        if (variant === "danger")    e.currentTarget.style.backgroundColor = "rgba(224,85,85,0.08)";
      }}
    >
      {children}
    </button>
  );
}

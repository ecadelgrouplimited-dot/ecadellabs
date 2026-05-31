"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const INPUT: React.CSSProperties = {
  width:"100%", backgroundColor:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(255,255,255,0.1)", color:"#F0EDE6",
  padding:"0.75rem 0.875rem 0.75rem 2.5rem",
  fontSize:"0.875rem", outline:"none", fontFamily:"inherit",
  borderRadius:"3px", transition:"border-color 0.2s",
};

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email, password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Invalid credentials"); }
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      minHeight:"100vh", backgroundColor:"#060608",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"2rem 1.5rem",
    }}>
      {/* Subtle grid background */}
      <div style={{
        position:"fixed", inset:0,
        backgroundImage:"linear-gradient(rgba(200,169,110,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.02) 1px,transparent 1px)",
        backgroundSize:"60px 60px", pointerEvents:"none",
      }} />

      <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:"380px" }}>
        {/* Logo */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"2.5rem" }}>
          <div style={{ width:"64px", height:"64px", position:"relative", marginBottom:"1rem" }}>
            <Image src="/logos/ecadel_labs_transparent_1600.png" alt="ECADEL LABS" fill className="object-contain" />
          </div>
          <div style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.125rem", letterSpacing:"0.03em" }}>
            ECADEL <span style={{ color:"#C8A96E" }}>LABS</span>
          </div>
          <div style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.38)", fontFamily:"monospace", marginTop:"4px" }}>
            Administration
          </div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor:"#0A0C12",
          border:"1px solid rgba(255,255,255,0.08)",
          borderTop:"2px solid #C8A96E",
          padding:"2rem",
        }}>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F0EDE6", fontSize:"1.125rem", marginBottom:"0.375rem" }}>
            Sign in
          </h1>
          <p style={{ color:"rgba(200,196,190,0.45)", fontSize:"0.8125rem", marginBottom:"1.75rem" }}>
            ECADEL LABS admin portal
          </p>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.125rem" }}>
            {/* Email */}
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.45)", fontFamily:"monospace", marginBottom:"0.5rem" }}>
                Email
              </label>
              <div style={{ position:"relative" }}>
                <Mail size={14} color="rgba(200,196,190,0.3)" style={{ position:"absolute", left:"0.75rem", top:"50%", transform:"translateY(-50%)" }} />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={INPUT} placeholder="admin@ecadelgroup.com"
                  onFocus={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.5)")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.45)", fontFamily:"monospace", marginBottom:"0.5rem" }}>
                Password
              </label>
              <div style={{ position:"relative" }}>
                <Lock size={14} color="rgba(200,196,190,0.3)" style={{ position:"absolute", left:"0.75rem", top:"50%", transform:"translateY(-50%)" }} />
                <input
                  type={show ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...INPUT, paddingRight:"2.75rem" }} placeholder="••••••••"
                  onFocus={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.5)")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button" onClick={() => setShow(!show)}
                  style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(200,196,190,0.35)", padding:0 }}
                >
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding:"0.625rem 0.875rem", backgroundColor:"rgba(224,85,85,0.06)", border:"1px solid rgba(224,85,85,0.2)", color:"#e05555", fontSize:"0.8125rem", borderRadius:"2px" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width:"100%", padding:"0.8125rem",
                backgroundColor: loading ? "rgba(200,169,110,0.7)" : "#C8A96E",
                color:"#060608", fontFamily:"var(--font-display)",
                fontWeight:600, fontSize:"0.875rem",
                border:"none", cursor: loading ? "not-allowed" : "pointer",
                borderRadius:"3px", marginTop:"0.25rem",
                transition:"background-color 0.15s",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign:"center", marginTop:"1.75rem", fontSize:"10px", color:"rgba(200,196,190,0.25)", fontFamily:"monospace", letterSpacing:"0.08em" }}>
          ECADEL LABS · Admin Portal · ecadellabs.cloud
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Beaker, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Invalid credentials"); }
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <Beaker size={20} className="text-gold" />
          <div>
            <div className="text-cream font-display font-bold text-lg tracking-wide">
              ECADEL <span className="text-gold">LABS</span>
            </div>
            <div className="text-platinum/42 text-[9px] tracking-[0.2em] uppercase font-mono text-center">
              Admin
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-deep border border-white/8 p-8">
          <div className="mb-6">
            <h1 className="font-display font-semibold text-cream text-lg mb-1">Sign in</h1>
            <p className="text-platinum/60 text-sm">ECADEL LABS administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-platinum/60 mb-1.5 font-mono">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="admin@ecadelgroup.com"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-platinum/60 mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-platinum/38 hover:text-platinum/65 transition-colors"
                >
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-ruby border border-ruby/20 bg-ruby/5 px-3 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-obsidian font-display font-semibold text-sm tracking-wide hover:bg-gold-dim transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[10px] text-platinum/30 tracking-wide">
          ECADEL LABS · Admin Portal · ecadellabs.cloud
        </p>
      </div>
    </div>
  );
}

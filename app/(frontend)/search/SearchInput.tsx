"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect, useTransition } from "react";
import { Search, X } from "lucide-react";

export default function SearchInput({ initialValue = "" }: { initialValue?: string }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount when on search page
  useEffect(() => {
    if (pathname === "/search") inputRef.current?.focus();
  }, [pathname]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    });
  }

  function clear() {
    setValue("");
    inputRef.current?.focus();
    startTransition(() => {
      router.push("/search");
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ position:"relative" }}>
      <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
        <Search
          size={16}
          color="rgba(200,169,110,0.6)"
          style={{ position:"absolute", left:"1rem", flexShrink:0, pointerEvents:"none" }}
        />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search publications, research projects, topics…"
          autoComplete="off"
          style={{
            width:"100%",
            backgroundColor:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.1)",
            color:"#F0EDE6",
            fontSize:"1rem",
            padding:"0.875rem 3rem 0.875rem 2.75rem",
            outline:"none",
            fontFamily:"inherit",
            opacity: pending ? 0.7 : 1,
            transition:"border-color 0.2s, opacity 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.45)")}
          onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            style={{ position:"absolute", right:"0.875rem", background:"none", border:"none", cursor:"pointer", color:"rgba(200,196,190,0.38)", padding:"0.25rem" }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </form>
  );
}

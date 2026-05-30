"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  param:    string;
  options:  FilterOption[];
  allLabel?: string;
}

export default function FilterBar({ param, options, allLabel = "All" }: FilterBarProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const current = searchParams.get(param) ?? "";

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const all = [{ value: "", label: allLabel }, ...options];

  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem", opacity: pending ? 0.6 : 1, transition:"opacity 0.15s" }}>
      {all.map((opt) => {
        const active = current === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => select(opt.value)}
            style={{
              padding:"0.375rem 0.875rem",
              fontSize:"9px",
              letterSpacing:"0.15em",
              textTransform:"uppercase",
              fontFamily:"monospace",
              cursor:"pointer",
              border:"none",
              transition:"all 0.15s",
              backgroundColor: active ? "#C8A96E" : "rgba(255,255,255,0.04)",
              color:           active ? "#060608" : "rgba(200,196,190,0.55)",
              borderBottom:    active ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

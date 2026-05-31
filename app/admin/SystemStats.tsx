"use client";

import { useEffect, useState } from "react";
import { Database, Server, Clock } from "lucide-react";

interface Stats { dbSizeKb:number; nodeVersion:string; uptime:number; totalPageViews:number }

function fmt(seconds:number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function SystemStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/system").then(r=>r.json()).then(setStats).catch(()=>{});
  }, []);

  if (!stats) return null;

  return (
    <div style={{ marginBottom:"2rem" }}>
      <p style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.28)", fontFamily:"monospace", marginBottom:"0.75rem" }}>System</p>
      <div style={{ display:"flex", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
        {[
          { icon:Database, label:"Database",   value:`${stats.dbSizeKb} KB`,        color:"#8BA7C7" },
          { icon:Server,   label:"Node",       value:stats.nodeVersion,             color:"#4ab478" },
          { icon:Clock,    label:"Uptime",     value:fmt(stats.uptime),             color:"#D4A24C" },
          { icon:Server,   label:"Page Views", value:stats.totalPageViews.toLocaleString(), color:"#C8A96E" },
        ].map(({ icon:Icon, label, value, color }) => (
          <div key={label} style={{ flex:1, backgroundColor:"#0A0C12", padding:"0.75rem 1rem", display:"flex", alignItems:"center", gap:"0.625rem" }}>
            <Icon size={12} color={`${color}70`} />
            <div>
              <div style={{ fontSize:"9px", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</div>
              <div style={{ fontSize:"0.875rem", fontWeight:600, color, fontFamily:"monospace" }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

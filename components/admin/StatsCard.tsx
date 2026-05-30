interface StatsCardProps {
  label:    string;
  value:    number | string;
  sub?:     string;
  accent?:  string;
}

export default function StatsCard({ label, value, sub, accent = "#C8A96E" }: StatsCardProps) {
  return (
    <div className="bg-carbon border border-white/7 p-6 hover:border-white/12 transition-colors duration-200">
      <div className="text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-2">{label}</div>
      <div className="font-display font-bold text-3xl mb-1" style={{ color: accent }}>
        {value}
      </div>
      {sub && <div className="text-xs text-platinum/50">{sub}</div>}
    </div>
  );
}

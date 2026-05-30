export default function Loading() {
  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <div style={{ width:"100px", height:"10px", backgroundColor:"rgba(255,255,255,0.06)", marginBottom:"1.25rem" }} />
          <div style={{ width:"260px", height:"32px", backgroundColor:"rgba(255,255,255,0.06)", marginBottom:"1rem" }} />
          <div style={{ width:"380px", height:"14px", backgroundColor:"rgba(255,255,255,0.04)", marginBottom:"0.5rem" }} />
          <div style={{ width:"300px", height:"14px", backgroundColor:"rgba(255,255,255,0.04)", marginBottom:"2rem" }} />
          <div style={{ display:"flex", gap:"0.375rem" }}>
            {[80,90,100,110].map((w,i) => (
              <div key={i} style={{ width:`${w}px`, height:"28px", backgroundColor:"rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"2.5rem 1.5rem" }}>
        <div className="pub-grid" style={{ backgroundColor:"rgba(255,255,255,0.06)" }}>
          {[1,2,3,4].map((i) => (
            <div key={i} style={{ backgroundColor:"#060608", padding:"2rem", display:"flex", flexDirection:"column", gap:"0.875rem" }}>
              <div style={{ width:"90px", height:"20px", backgroundColor:"rgba(255,255,255,0.05)" }} />
              <div style={{ width:"80%", height:"18px", backgroundColor:"rgba(255,255,255,0.07)", marginBottom:"0.25rem" }} />
              <div style={{ width:"95%", height:"13px", backgroundColor:"rgba(255,255,255,0.04)" }} />
              <div style={{ width:"85%", height:"13px", backgroundColor:"rgba(255,255,255,0.04)" }} />
              <div style={{ width:"70%", height:"13px", backgroundColor:"rgba(255,255,255,0.04)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

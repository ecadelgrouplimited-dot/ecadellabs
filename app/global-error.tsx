"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin:0, backgroundColor:"#060608", color:"#F0EDE6", fontFamily:"system-ui,sans-serif", display:"flex", minHeight:"100vh", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        <div style={{ textAlign:"center", maxWidth:"26rem" }}>
          <div style={{ fontSize:"9px", letterSpacing:"0.4em", textTransform:"uppercase", color:"rgba(212,162,76,0.7)", fontFamily:"monospace", marginBottom:"1rem" }}>
            ECADEL LABS · Critical Error
          </div>
          <h1 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"1rem", lineHeight:1.2 }}>
            The application could not load.
          </h1>
          <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.875rem", lineHeight:1.7, marginBottom:"2rem" }}>
            A critical error occurred. Please try refreshing the page.
            {error.digest && ` Error ID: ${error.digest}`}
          </p>
          <button onClick={reset} style={{ padding:"0.75rem 2rem", backgroundColor:"#C8A96E", color:"#060608", fontWeight:600, fontSize:"0.875rem", border:"none", cursor:"pointer", borderRadius:"3px" }}>
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

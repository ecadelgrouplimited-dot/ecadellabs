import ConditionalSidebar from "./ConditionalSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:"flex", minHeight:"100vh", backgroundColor:"#060608" }}>
      <ConditionalSidebar />
      <main style={{ flex:1, overflow:"auto", minWidth:0 }}>
        {children}
      </main>
    </div>
  );
}

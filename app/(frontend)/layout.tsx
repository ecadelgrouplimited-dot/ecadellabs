import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-obsidian">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import AnalyticsTracker from "@/components/ui/AnalyticsTracker";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-obsidian">
      <Navbar />
      <AnalyticsTracker />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400","500","600","700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ecadellabs.cloud"),
  title: {
    default: "ECADEL LABS — Research & Innovation Engine",
    template: "%s | ECADEL LABS",
  },
  description:
    "ECADEL LABS is the research and innovation engine of ECADEL GROUP LIMITED — advancing African intelligence infrastructure through original research, academic partnerships, and applied technology for the continent.",
  keywords: [
    "ECADEL LABS", "ecadellabs.cloud", "African AI research", "African technology research",
    "intelligence infrastructure Africa", "ECADEL GROUP", "Kampala Uganda research",
    "African innovation lab", "AI research Africa", "mobile money data infrastructure",
    "offline-first AI systems", "African governance technology",
  ],
  authors: [{ name: "ECADEL LABS", url: "https://ecadellabs.cloud" }],
  creator: "ECADEL GROUP LIMITED",
  openGraph: {
    title: "ECADEL LABS — Research & Innovation Engine",
    description: "Advancing African intelligence infrastructure through original research and applied technology.",
    siteName: "ECADEL LABS",
    url: "https://ecadellabs.cloud",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}

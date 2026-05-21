import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const BASE_URL = "https://billsy-invoice.vercel.app";

export const metadata: Metadata = {
  title: "Billsy — Free Invoice Generator",
  description: "Create, download, and send professional invoices instantly. No login required.",
  metadataBase: new URL(BASE_URL),
  icons: { icon: "/icon" },
  openGraph: {
    title: "Billsy — Free Invoice Generator",
    description: "Create, download, and share professional invoices in seconds. No login. No account. Just bill.",
    url: BASE_URL,
    siteName: "Billsy",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Billsy — Free Invoice Generator" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Billsy — Free Invoice Generator",
    description: "Create, download, and share professional invoices in seconds. No login required.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

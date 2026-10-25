import type { Metadata } from "next";
import "./globals.css";
import TopNav from "./NavSidebar";

export const metadata: Metadata = {
  title: "Gerald Bot",
  description: "WhatsApp scambait manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-wa-bg text-wa-text min-h-screen">
        <TopNav />
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}

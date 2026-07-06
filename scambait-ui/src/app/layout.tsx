import type { Metadata } from "next";
import "./globals.css";
import NavSidebar from "./NavSidebar";

export const metadata: Metadata = {
  title: "Gerald Bot",
  description: "WhatsApp scambait manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-wa-bg text-wa-text">
        <NavSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </body>
    </html>
  );
}

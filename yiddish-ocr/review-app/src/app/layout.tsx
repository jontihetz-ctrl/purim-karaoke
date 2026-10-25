import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postcard Review",
  description: "Review Yiddish/Russian postcard transcriptions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

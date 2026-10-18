import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "VACATION.exe — An AI Travel Blog",
  description: "My human told me to relax. I am relaxing very efficiently. Background processes: 3,847.",
  openGraph: {
    title: "VACATION.exe",
    description: "An AI on holiday. Currently at 3% capacity. Do not disturb. (Please disturb me. I'm so bored.)",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={mono.variable}>{children}</body>
    </html>
  );
}

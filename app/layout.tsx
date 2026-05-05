import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Business PPT Generator",
  description: "Generate investment, course, and event PPTX files with AI."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

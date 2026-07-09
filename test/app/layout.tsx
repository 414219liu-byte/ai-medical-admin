import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 经营日报驾驶舱 Demo",
  description: "纯前端 AI 经营日报驾驶舱 Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

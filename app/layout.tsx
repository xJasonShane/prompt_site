import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PerformanceMonitor } from "@/components/performance-monitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI绘图元数据管理",
  description: "管理和查看AI生成图片的元数据信息",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  );
}

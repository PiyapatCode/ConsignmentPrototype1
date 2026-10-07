import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "อาร์ตแชร์ | จัดการฝากขายงานศิลปะในอีเวนต์",
  description: "ระบบจัดการผลงานฝากขาย บันทึกยอดขาย คำนวณส่วนแบ่ง และสรุปยอดสำหรับบูทงานศิลปะ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}

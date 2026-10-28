import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "آکادمی کاراته شوتوکان زارع",
  description: "وب‌سایت رسمی آکادمی کاراته شوتوکان زارع در شیراز؛ معرفی مربی، کلاس‌ها، افتخارات و مقالات کاراته.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body><div className="topline" />{children}</body></html>;
}

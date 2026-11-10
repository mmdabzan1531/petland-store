import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "پت‌لند | فروشگاه حیوانات خانگی", description: "فروشگاه آنلاین لوازم و غذای حیوانات خانگی" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}

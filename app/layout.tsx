import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '名古屋・犬山・高山｜五日旅行手帳',
  description: '2026 年 10 月 30 日至 11 月 3 日，名古屋、犬山與高山五日四夜行程、航班與交通指南。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}

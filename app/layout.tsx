import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";
import { cn } from "@/lib/utils";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "ntan gallery",
    template: "%s | ntan gallery",
  },
  description:
    "Không gian riêng tư để lưu trữ ảnh, thư và ký ức cho bạn bè với bảo mật cao.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          sans.variable,
          mono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}

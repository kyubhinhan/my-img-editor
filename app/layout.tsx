import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";

const font = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Img Editor",
  description: "simple img editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={font.className}>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { NextUIProvider } from '@nextui-org/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Img Editor',
  description: 'simple img editor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}

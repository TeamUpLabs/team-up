import type { Metadata } from "next";
import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { geistSans, geistMono } from "@/lib/fonts";
import AlertProvider from "@/components/AlertProvider";
config.autoAddCss = false

export const metadata: Metadata = {
  title: "TeamUp",
  description: "TeamUp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`} suppressHydrationWarning>
        <AlertProvider />
        {children}
      </body>
    </html>
  );
}

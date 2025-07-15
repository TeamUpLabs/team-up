import type { Metadata, Viewport } from "next";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { geistSans } from "@/lib/fonts";
import AlertProvider from "@/providers/AlertProvider";
import ConfirmProvider from "@/providers/ConfirmProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/providers/NotificationProvider";
import NotificationAlertProvider from "@/providers/NotificationAlertProvider";
import { SWRConfig } from "swr";

config.autoAddCss = false;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "TeamUp | 함께 성장하는 협업 플랫폼",
  description:
    "TeamUp - 개발자, 디자이너, 기획자를 위한 토이 프로젝트 협업 플랫폼 | A collaboration platform for developers, designers, and planners to work together on toy projects",
  keywords: [
    "TeamUp",
    "협업",
    "팀 프로젝트",
    "개발자",
    "디자이너",
    "기획자",
    "토이 프로젝트",
    "collaboration",
    "team projects",
    "developers",
    "designers",
    "planners",
  ],
  authors: [{ name: "TeamUp", url: "https://team-up.kro.kr" }],
  creator: "이석민",
  publisher: "이석민",
  robots: { index: true, follow: true },
  metadataBase: new URL("https://team-up.kro.kr"),
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/ko",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    title: "TeamUp | 함께 성장하는 협업 플랫폼",
    description:
      "함께 만들고, 함께 성장하는 협업 커뮤니티 | Create. Collaborate. Code. Together.",
    siteName: "TeamUp",
    images: [
      {
        url: "/Logo.jpg",
        width: 1200,
        height: 630,
        alt: "TeamUp - 협업 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TeamUp | 함께 성장하는 협업 플랫폼",
    description: "개발자, 디자이너, 기획자를 위한 토이 프로젝트 협업 플랫폼",
    images: ["/Logo.jpg"],
    creator: "@teamup",
  },
  icons: {
    icon: "/MiniLogo.jpg",
    shortcut: "/MiniLogo.jpg",
    apple: "/MiniLogo.jpg",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/MiniLogo.jpg",
    },
  },
  manifest: "/manifest.json",
  applicationName: "TeamUp",
  category: "collaboration",
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased`}
        suppressHydrationWarning
      >
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 1000 * 60 * 5, // 5분
            errorRetryCount: 2,
            errorRetryInterval: 1000 * 5, // 5초
            focusThrottleInterval: 1000 * 60 * 5, // 5분
            loadingTimeout: 10000, // 10초
          }}
        >
          <NotificationProvider>
            <NotificationAlertProvider />
            <AlertProvider />
            <ConfirmProvider />
            <ThemeProvider>{children}</ThemeProvider>
          </NotificationProvider>
        </SWRConfig>
      </body>
    </html>
  );
}

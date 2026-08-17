import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_NAME = "Clay Graphik";
const SITE_URL = "https://claygraphik.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Strategic Design. Conversion Focused. Growth Driven.`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Clay Graphik is an independent creative studio in Dubai serving ambitious businesses across the UAE, GCC and global markets — strategic branding, web design and digital creative built for clarity, trust and action.",
  applicationName: SITE_NAME,
  keywords: [
    "Clay Graphik",
    "creative studio Dubai",
    "branding Dubai",
    "web design Dubai",
    "digital creative",
    "UAE",
    "GCC",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Strategic Design. Conversion Focused. Growth Driven.`,
    description:
      "Independent creative studio in Dubai. Strategic branding, web design and digital creative for ambitious businesses across the UAE, GCC and global markets.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Strategic Design. Conversion Focused. Growth Driven.`,
    description:
      "Independent creative studio in Dubai. Strategic branding, web design and digital creative.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${hanken.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}

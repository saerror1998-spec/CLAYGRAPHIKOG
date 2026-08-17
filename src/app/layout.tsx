import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import SiteShell from "@/components/global/SiteShell";
import { organizationSchema, seo, site } from "@/data/siteContent";
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

const SITE_NAME = site.name;
const SITE_URL = site.website;
const OG_IMAGE = `${SITE_URL}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: seo.home.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: seo.home.description,
  applicationName: SITE_NAME,
  // No global alternates.canonical: Next.js auto-generates the per-route
  // canonical from metadataBase + pathname, so /work, /services etc. each
  // get their own canonical URL on the claygraphik.com domain.
  keywords: [
    "Clay Graphik",
    "creative studio Dubai",
    "branding Dubai",
    "web design Dubai",
    "content systems",
    "creative direction",
    "UAE",
    "GCC",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: seo.home.title,
    description: seo.home.description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.home.title,
    description: seo.home.description,
    images: [OG_IMAGE],
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

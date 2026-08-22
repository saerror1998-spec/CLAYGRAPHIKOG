import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import SiteShell from "@/components/global/SiteShell";
import { organizationSchema, ogDefaults, professionalServiceSchema, seo, site, twitterDefaults } from "@/data/siteContent";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.website,
};
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
    ...ogDefaults,
    url: SITE_URL,
    title: seo.home.title,
    description: seo.home.description,
  },
  twitter: {
    ...twitterDefaults,
    title: seo.home.title,
    description: seo.home.description,
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded focus:bg-lime focus:px-4 focus:py-3 focus:text-carbon focus:shadow-lg"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

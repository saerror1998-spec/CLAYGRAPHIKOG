import Link from "next/link";
import Image from "next/image";
import { navigation, site, socials } from "@/data/siteContent";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-carbon/40 px-6 pb-10 pt-16 sm:px-8 lg:px-10 lg:pt-24">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/brand/clay-graphik-logo.png"
            alt="Clay Graphik"
            width={140}
            height={38}
            className="mb-6 h-6 w-auto"
          />
          <p className="max-w-[260px] text-sm leading-relaxed text-softgray">
            {site.tagline}
          </p>
        </div>

        <nav aria-label="Footer menu">
          <h3 className="label mb-5 text-offwhite/50">MENU</h3>
          <ul className="space-y-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-softgray transition-colors hover:text-lime"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="label mb-5 text-offwhite/50">CONNECT</h3>
          <ul className="space-y-3">
            {socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="text-sm text-softgray transition-colors hover:text-lime"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label mb-5 text-offwhite/50">LOCATION</h3>
          <p className="text-sm text-softgray">{site.location}</p>
          <h3 className="label mb-3 mt-8 text-offwhite/50">SERVING</h3>
          <p className="text-sm text-softgray">{site.serviceArea}</p>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
        <div className="flex gap-6">
          <Link href="/privacy" className="label transition-colors hover:text-offwhite">
            Privacy
          </Link>
          <Link href="/terms" className="label transition-colors hover:text-offwhite">
            Terms
          </Link>
        </div>
        <p className="label text-offwhite/40">© 2026 Clay Graphik. All rights reserved.</p>
      </div>
    </footer>
  );
}

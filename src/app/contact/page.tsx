import type { Metadata } from "next";
import PageHero from "@/components/motion/PageHero";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Clay Graphik — independent creative studio in Dubai. Strategy & Identity, Websites & UX, Content Systems, Creative Direction.",
};

const DIRECT = [
  { label: "EMAIL", value: "connect@claygraphik.com", href: "mailto:connect@claygraphik.com" },
  { label: "PHONE / WHATSAPP", value: "+971 52 341 2447", href: "https://wa.me/971523412447" },
  { label: "INSTAGRAM", value: "@claygraphik", href: "https://instagram.com/claygraphik" },
  { label: "WEBSITE", value: "claygraphik.com", href: "https://claygraphik.com" },
  { label: "LOCATION", value: "Dubai, UAE", href: null },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="LET'S MAKE"
        titleAccent="SOMETHING WORTH NOTICING."
        support="Tell us what you're building. We'll get back to you with a clear next step."
      />

      <div className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border border-white/[0.08] bg-white/[0.02] p-8 lg:p-10">
              <p className="label text-offwhite/50">DIRECT</p>
              <ul className="mt-6 space-y-6">
                {DIRECT.map((item) => (
                  <li key={item.label}>
                    <p className="label text-offwhite/40">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="mt-1 inline-block text-base text-offwhite transition-colors hover:text-lime"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-base text-offwhite">{item.value}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import PageHero from "@/components/motion/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Clay Graphik collects, uses and protects your information.",
};

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "1. Information we collect",
    body: "We collect information you choose to provide through the contact form — name, company, email address, phone number and project details. We do not collect personal information from visitors who only browse the website.",
  },
  {
    title: "2. How we use your information",
    body: "Information you submit through the contact form is used solely to respond to your enquiry and discuss a potential engagement. We do not sell, rent or share your personal information with third parties for marketing purposes.",
  },
  {
    title: "3. Communication",
    body: "If you contact us, we may reply by email, phone or WhatsApp to the details you provided. You can ask us to delete your information at any time by writing to connect@claygraphik.com.",
  },
  {
    title: "4. Data retention",
    body: "We keep enquiry details only as long as needed to handle your request and, if we work together, for the duration of our working relationship. You may request deletion at any time.",
  },
  {
    title: "5. Analytics",
    body: "The website may use privacy-respecting analytics to understand how pages are used. This data is aggregated and does not identify individual visitors.",
  },
  {
    title: "6. Your rights",
    body: "You have the right to access, correct or delete the personal information we hold about you. To exercise these rights, email connect@claygraphik.com.",
  },
  {
    title: "7. Contact",
    body: "Questions about this policy can be sent to connect@claygraphik.com or via WhatsApp at +971 52 341 2447.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL" title="PRIVACY POLICY." support="Last updated: 2026" />
      <div className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        <div className="max-w-3xl space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.title} className="border-t border-white/[0.08] pt-8">
              <h2 className="text-xl font-medium uppercase tracking-tight text-offwhite">
                {section.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-softgray">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

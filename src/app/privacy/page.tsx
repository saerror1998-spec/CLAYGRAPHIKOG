import type { Metadata } from "next";
import PageHero from "@/components/motion/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Clay Graphik collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "1. Information we collect",
    body: "We collect information you choose to provide through the contact form — name, company, email address, phone number, service and project details. We do not collect personal information from visitors who only browse the website.",
  },
  {
    title: "2. How your enquiry is handled",
    body: "When you submit the contact form, your details are formatted in your browser into a pre-filled WhatsApp message and opened in WhatsApp, where you choose to send it to Clay Graphik. The website itself does not store or transmit your form details to any Clay Graphik server. Enquiries sent via WhatsApp are then handled through WhatsApp in accordance with WhatsApp's terms. We do not sell, rent or share your personal information with third parties for marketing purposes.",
  },
  {
    title: "3. Communication",
    body: "If you contact us, we may reply by email, phone or WhatsApp to the details you provided. You can ask us to delete your information at any time by writing to connects@claygraphik.com.",
  },
  {
    title: "4. Data retention",
    body: "We keep enquiry details we receive (for example, via WhatsApp or email) only as long as needed to handle your request and, if we work together, for the duration of our working relationship. You may request deletion at any time.",
  },
  {
    title: "5. Analytics and cookies",
    body: "The website does not use third-party analytics, advertising trackers or tracking cookies. Browsing the site does not collect personal information about you.",
  },
  {
    title: "6. Your rights",
    body: "You have the right to access, correct or delete the personal information we hold about you. To exercise these rights, email connects@claygraphik.com.",
  },
  {
    title: "7. Contact",
    body: "Questions about this policy can be sent to connects@claygraphik.com or via WhatsApp at +971 52 341 2447.",
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

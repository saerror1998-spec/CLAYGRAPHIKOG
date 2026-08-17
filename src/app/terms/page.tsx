import type { Metadata } from "next";
import PageHero from "@/components/motion/PageHero";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the Clay Graphik website.",
};

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "1. Acceptance of terms",
    body: "By accessing or using the Clay Graphik website, you agree to these terms. If you do not agree, please do not use the site.",
  },
  {
    title: "2. Use of the website",
    body: "The website is provided to help you understand Clay Graphik and its services. You may not use the site in any way that is unlawful, harmful or that interferes with its operation.",
  },
  {
    title: "3. Intellectual property",
    body: "All content on this website — including designs, text, graphics, logos and the Clay Graphik brand — is the property of Clay Graphik unless otherwise stated and may not be reproduced without permission.",
  },
  {
    title: "4. Enquiries and engagement",
    body: "Submitting an enquiry does not create a client relationship. Any project engagement is governed by a separate written agreement agreed by both parties.",
  },
  {
    title: "5. No warranties",
    body: "The website is provided 'as is'. Clay Graphik makes no warranties about its availability or accuracy and is not liable for any loss arising from its use.",
  },
  {
    title: "6. Changes",
    body: "These terms may be updated from time to time. Continued use of the website after changes constitutes acceptance of the revised terms.",
  },
  {
    title: "7. Contact",
    body: "Questions about these terms can be sent to connect@claygraphik.com or via WhatsApp at +971 52 341 2447.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL" title="TERMS OF USE." support="Last updated: 2026" />
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

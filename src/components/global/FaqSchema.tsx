import { faqs } from "@/data/siteContent";

/**
 * FAQPage JSON-LD structured data.
 * Renders the same questions visible in the <FAQ /> component.
 * Used on /services and /contact where the FAQ section appears.
 */
export default function FaqSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface Service {
  slug: string;
  number: string;
  title: string;
  positioning: string;
  capabilities: string[];
  relatedWork: string[];
}

export const services: Service[] = [
  {
    slug: "strategy-identity",
    number: "01",
    title: "Strategy & Identity",
    positioning:
      "Brands that start with a clear strategy end up looking inevitable. We define the position, then build the identity that makes it visible.",
    capabilities: ["Brand Strategy", "Logo & Visual Identity", "Brand Guidelines", "Identity Systems"],
    relatedWork: ["brand-book-system"],
  },
  {
    slug: "websites-ux",
    number: "02",
    title: "Websites & UX",
    positioning:
      "Your website is your hardest-working asset. We design and build digital experiences that look clear, credible and built to convert.",
    capabilities: ["Website Design", "Landing Pages", "UI / UX", "Web Development", "WordPress / Webflow"],
    relatedWork: ["web-platform-concept"],
  },
  {
    slug: "content-systems",
    number: "03",
    title: "Content Systems",
    positioning:
      "Content is a system, not a task. We build repeatable creative systems that keep your brand consistent across every channel.",
    capabilities: ["Social Media Design", "Campaign Creative", "Content Systems", "Marketing Collateral"],
    relatedWork: ["content-system-concept"],
  },
  {
    slug: "creative-direction",
    number: "04",
    title: "Creative Direction",
    positioning:
      "When the message matters, someone has to own the standard. We direct the work so every asset lands with the same intent.",
    capabilities: [
      "Presentation Design",
      "Packaging",
      "Digital Products",
      "Launch Assets",
      "Creative Direction",
    ],
    relatedWork: ["brand-book-system"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export interface Service {
  slug: string;
  number: string;
  title: string;
  /** Short line used on cards and the index. */
  positioning: string;
  /** Longer description used on the detail page. */
  description: string;
  capabilities: string[];
  relatedWork: string[];
}

export const services: Service[] = [
  {
    slug: "strategy-identity",
    number: "01",
    title: "Strategy & Identity",
    positioning: "Build a brand people understand, remember and trust.",
    description:
      "We create strategic visual identities that give businesses a clear, professional and consistent presence across every customer touchpoint.",
    capabilities: [
      "Brand Strategy",
      "Positioning",
      "Logo Design",
      "Visual Identity",
      "Color Systems",
      "Typography",
      "Brand Guidelines",
      "Brand Applications",
    ],
    relatedWork: ["brand-book-system"],
  },
  {
    slug: "websites-ux",
    number: "02",
    title: "Websites & UX",
    positioning: "Digital experiences designed for clarity, credibility and action.",
    description:
      "We design modern responsive websites that communicate your offer clearly, strengthen trust and guide users toward meaningful action.",
    capabilities: [
      "Website Strategy",
      "Website Design",
      "Landing Pages",
      "UI / UX Design",
      "Responsive Design",
      "Website Development",
      "Conversion Structure",
      "Basic On-Page SEO",
      "Performance Optimization",
    ],
    relatedWork: ["web-platform-concept"],
  },
  {
    slug: "content-systems",
    number: "03",
    title: "Content Systems",
    positioning: "Consistent creative systems for brands that need to stay visible.",
    description:
      "We build repeatable content systems that help brands communicate consistently without redesigning everything from scratch for every post or campaign.",
    capabilities: [
      "Social Media Design",
      "Instagram Content Systems",
      "Carousels",
      "Campaign Creative",
      "Content Templates",
      "Marketing Collateral",
      "Launch Content",
      "Digital Advertising Creative",
    ],
    relatedWork: ["content-system-concept"],
  },
  {
    slug: "creative-direction",
    number: "04",
    title: "Creative Direction",
    positioning: "Creative direction that keeps every brand touchpoint working together.",
    description:
      "From presentations and launch campaigns to digital products and brand applications, we extend the visual system into practical assets built for real business use.",
    capabilities: [
      "Creative Direction",
      "Presentation Design",
      "Packaging",
      "Digital Products",
      "Lead Magnets",
      "eBooks",
      "Launch Assets",
      "Campaign Systems",
      "Digital Product UI",
    ],
    relatedWork: ["brand-book-system"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

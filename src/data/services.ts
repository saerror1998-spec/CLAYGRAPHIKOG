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
  /** What this service is and who it is for. */
  about: string;
  /** The business problem this service addresses. */
  problem: string;
  /** What Clay Graphik delivers for this service. */
  deliverables: string[];
  /** How the engagement works. */
  process: string;
  /** What the client can expect as an outcome. */
  outcome: string;
  /** Slugs of related services for internal linking. */
  relatedServices: string[];
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
    about:
      "Brand strategy and identity design for businesses that need a clear, professional and consistent visual presence. Clay Graphik works with founders, service businesses and growing brands across Dubai, the UAE and the GCC who want their brand to feel credible from the first impression through every customer touchpoint.",
    problem:
      "When positioning is unclear or the visual identity feels inconsistent, businesses lose trust before the conversation even starts. Strong brands make decisions easier — for customers, partners and the team behind the business.",
    deliverables: [
      "Brand strategy and positioning document",
      "Logo and mark system",
      "Color palette and typography rules",
      "Visual identity guidelines",
      "Application examples across digital and print",
      "Brand usage documentation",
    ],
    process:
      "Every engagement begins with a discovery conversation about the business, the audience and the competitive landscape. Strategy and positioning come first — then the visual identity is built to express that direction consistently. Deliverables are prepared as a documented system, not a collection of disconnected files.",
    outcome:
      "A brand that presents the business clearly and consistently across every channel — from the website and social presence to proposals, packaging and internal materials.",
    relatedServices: ["websites-ux", "creative-direction"],
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
    about:
      "Website design and UX for businesses that need a digital presence which looks credible, communicates clearly and converts visitors into enquiries. Clay Graphik builds responsive websites for companies in Dubai, the UAE and the GCC — from single-page landing experiences to full service-site builds.",
    problem:
      "A website is often the first impression a business makes online. When the design feels outdated, the navigation is confusing or the conversion path is unclear, potential customers leave before they understand the offer.",
    deliverables: [
      "Website strategy and information architecture",
      "UI and UX design",
      "Responsive layout design",
      "Landing page design",
      "Basic on-page SEO implementation",
      "Performance and speed optimization",
    ],
    process:
      "The project starts by defining the audience, the business goal and the visitor journey. Strategy and structure come first — then design and development follow a documented process with clear milestones. Every page has a job, and every element is placed to serve that purpose.",
    outcome:
      "A website that presents the business clearly, builds trust from the first visit and makes it easy for visitors to take the next step — whether that means making an enquiry, booking a call or placing an order.",
    relatedServices: ["strategy-identity", "content-systems"],
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
    about:
      "Social media and content systems for brands that need to stay visible and consistent across digital channels. Clay Graphik creates reusable template libraries, campaign frameworks and brand-aligned creative for businesses in Dubai, the UAE and the GCC who want content that looks intentional — not improvised.",
    problem:
      "Without a system, social content becomes inconsistent, time-consuming and disconnected from the brand. Teams end up redesigning every post from scratch, and the visual identity slowly drifts.",
    deliverables: [
      "Social media template library",
      "Instagram content system",
      "Carousel and story frameworks",
      "Campaign creative templates",
      "Marketing collateral guidelines",
      "Launch content package",
    ],
    process:
      "The work starts by understanding the brand's existing visual system, content goals and publishing rhythm. Clay Graphik designs a modular framework — fixed enough to keep everything on-brand, flexible enough for daily output. Templates are delivered with clear usage guidelines so any team member can produce content that stays consistent.",
    outcome:
      "A repeatable content system that keeps the brand consistent across every post, campaign and channel — reducing design time while maintaining visual quality.",
    relatedServices: ["strategy-identity", "creative-direction"],
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
    about:
      "Creative direction and brand applications for businesses that need their visual system extended into practical, real-world assets. Clay Graphik works with companies across Dubai, the UAE and the GCC on presentations, packaging, digital products, launch campaigns and branded materials that stay consistent with the wider identity.",
    problem:
      "A strong identity system only creates value when it is applied consistently. Without creative direction, new assets — from pitch decks to product launches — often look disconnected from the brand.",
    deliverables: [
      "Presentation and pitch deck design",
      "Packaging and physical brand applications",
      "Digital product UI design",
      "Lead magnet and eBook design",
      "Launch campaign creative",
      "Brand extension guidelines",
    ],
    process:
      "Clay Graphik takes the established brand system and applies it to the specific asset or campaign. Every creative decision references the existing identity — colour, type, layout and tone — so the result feels like a natural extension of the brand rather than a one-off design.",
    outcome:
      "Practical brand assets that look like they belong to the same business — from the pitch deck and product packaging to the launch campaign and digital experience.",
    relatedServices: ["strategy-identity", "content-systems"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/**
 * Clay Graphik — central site content.
 *
 * Single source of truth for canonical business information (contact,
 * socials, navigation, CTAs, principles, process, FAQs, SEO). Components
 * consume this data instead of scattering emails/phones across the codebase,
 * so a correction here updates the whole site.
 */

export const site = {
  name: "Clay Graphik",
  tagline: "Strategic Design. Conversion Focused. Growth Driven.",
  positioning: "Independent Creative Studio",
  location: "Dubai, UAE",
  serviceArea: "UAE / GCC / GLOBAL",
  website: "https://claygraphik.com",
  email: "connects@claygraphik.com",
  phoneDisplay: "+971 52 341 2447",
  phoneRaw: "+971523412447",
  whatsappNumber: "971523412447",
  whatsappUrl: "https://wa.me/971523412447",
  instagramHandle: "@claygraphik",
  instagramUrl: "https://www.instagram.com/claygraphik/",
  threadsHandle: "@claygraphik",
  threadsUrl: "https://www.threads.com/@claygraphik",
} as const;

/** Short prefilled greeting used by general WhatsApp CTA buttons. */
export const whatsappGreeting = "Hello Clay Graphik, I'd like to discuss a project.";

/**
 * Build a wa.me link with an optional prefilled message.
 * Falls back to the short greeting when no message is supplied.
 */
export function waLink(message?: string): string {
  const text = message?.trim() ? message.trim() : whatsappGreeting;
  return `${site.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const socials = [
  { label: "Instagram", href: site.instagramUrl, external: true },
  { label: "Threads", href: site.threadsUrl, external: true },
  { label: "WhatsApp", href: site.whatsappUrl, external: true },
  { label: "Email", href: `mailto:${site.email}`, external: false },
] as const;

export const ctas = {
  startProject: "START A PROJECT",
  viewSelectedWork: "VIEW SELECTED WORK",
  exploreServices: "EXPLORE SERVICES",
  whatsapp: "LET'S TALK ON WHATSAPP",
  aboutStudio: "ABOUT THE STUDIO",
  allServices: "ALL SERVICES",
} as const;

export const heroCopy = {
  eyebrow: "INDEPENDENT CREATIVE STUDIO — DUBAI",
  support:
    "Strategic branding, high-performing websites and digital creative for businesses that want to look clear, credible and built to grow.",
} as const;

export const whatWeDoCopy = {
  headline: "ONE PARTNER FOR BRAND, WEB, CONTENT AND BUSINESS GROWTH.",
  support:
    "Clay Graphik combines strategy, design and digital execution to help growing businesses build clearer brands, stronger online experiences and consistent creative systems.",
  secondary: "We make businesses easier to understand, trust and choose.",
} as const;

export const processSteps = [
  {
    number: "01",
    title: "DISCOVER",
    copy: "Understand the business, audience, offer, challenges and goals.",
  },
  {
    number: "02",
    title: "DEFINE",
    copy: "Turn what we learn into a clear creative direction, messaging hierarchy and project plan.",
  },
  {
    number: "03",
    title: "DESIGN",
    copy: "Build the identity, digital experience and content system with clarity and consistency.",
  },
  {
    number: "04",
    title: "DELIVER",
    copy: "Prepare the final system for real-world use, launch confidently and create a foundation that can grow.",
  },
] as const;

export const principles = [
  {
    number: "01",
    title: "CLARITY OVER NOISE.",
    copy: "Strong design should make a business easier to understand, easier to trust and easier to choose.",
  },
  {
    number: "02",
    title: "SYSTEMS OVER RANDOM OUTPUT.",
    copy: "Repeatable systems keep a brand consistent across every channel — without reinventing the visual language for every post.",
  },
  {
    number: "03",
    title: "BUSINESS THINKING WITH CREATIVE CRAFT.",
    copy: "Every creative decision starts with the business, audience, offer and objective.",
  },
] as const;

export const positioningPrinciples = [
  {
    title: "STRATEGIC FIRST",
    copy: "Every design decision starts with the business, audience, offer and objective.",
  },
  {
    title: "CONVERSION FOCUSED",
    copy: "We structure brands, websites and content around clarity, trust and action.",
  },
  {
    title: "BUILT FOR GROWTH",
    copy: "The systems we create are designed to remain consistent as your business, audience and offer grow.",
  },
] as const;

export const faqs = [
  {
    question: "What services does Clay Graphik offer?",
    answer:
      "Clay Graphik works across brand strategy and identity, websites and UX, content systems and creative direction.",
  },
  {
    question: "Can you design my brand and website together?",
    answer:
      "Yes. Brand and website projects can be developed as one connected system so the positioning, visual identity and digital experience remain consistent.",
  },
  {
    question: "Do you create social media content systems?",
    answer:
      "Yes. Clay Graphik can create reusable social templates, campaign systems, carousels and ongoing visual direction for consistent content.",
  },
  {
    question: "Can you help with digital products or eBooks?",
    answer:
      "Yes. Digital products, lead magnets, presentations and eBooks can be designed as extensions of the wider brand system.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Timelines depend on the project scope, deliverables and feedback cycle. A clear schedule is defined before work begins.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Pricing depends on scope and deliverables. Send your project requirements and Clay Graphik can recommend the most suitable approach.",
  },
] as const;

/** Per-route SEO — title + description (canonical claygraphik.com domain). */
export const seo = {
  home: {
    title:
      "Clay Graphik — Creative Studio in Dubai | Branding, Web & Digital Design",
    description:
      "Clay Graphik is an independent creative studio in Dubai creating strategic brand identities, high-performing websites and digital content systems for businesses across the UAE, GCC and beyond.",
  },
  services: {
    title: "Creative Services — Branding, Web Design & Content | Clay Graphik Dubai",
    description:
      "Explore Clay Graphik services across brand strategy and identity, website design and development, content systems and creative direction.",
  },
  work: {
    title: "Selected Work — Clay Graphik Creative Studio Dubai",
    description:
      "Explore selected branding, website and digital creative projects by Clay Graphik.",
  },
  about: {
    title: "About Clay Graphik — Independent Creative Studio in Dubai",
    description:
      "Clay Graphik is an independent Dubai creative studio helping businesses build clearer brands, stronger digital experiences and consistent creative systems.",
  },
  contact: {
    title: "Start a Project — Contact Clay Graphik Dubai",
    description:
      "Contact Clay Graphik for branding, website design, content systems and creative direction projects in the UAE, GCC and beyond.",
  },
} as const;

/** Organization / ProfessionalService structured data (verified fields only). */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Clay Graphik",
  url: site.website,
  logo: `${site.website}/brand/clay-graphik-logo.png`,
  image: `${site.website}/og.png`,
  email: site.email,
  telephone: site.phoneRaw,
  description:
    "Clay Graphik is an independent creative studio in Dubai creating strategic brand identities, high-performing websites and digital content systems for businesses across the UAE, GCC and beyond.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  areaServed: ["AE", "GCC", "Global"],
  sameAs: [site.instagramUrl, site.threadsUrl],
} as const;

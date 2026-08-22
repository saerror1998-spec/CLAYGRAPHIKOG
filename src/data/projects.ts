/**
 * Clay Graphik project data.
 *
 * Real client case studies use `status: "client"` and include a `caseStudy`
 * object with multiple images and structured editorial sections.
 *
 * Studio concept work uses `status: "concept"` and is labelled
 * "STUDIO CONCEPT" publicly so it never reads as a paying client engagement.
 */
export type ProjectCategory = "Branding" | "Web" | "Social / Digital";

export interface CaseStudyImage {
  src: string;
  alt: string;
  /** Optional width hint for Next/Image — natural size preferred. */
  width?: number;
  height?: number;
}

export interface CaseStudySection {
  label: string;
  title: string;
  body: string;
  /** Optional image displayed alongside the text. */
  image?: CaseStudyImage;
  /** If true, image is displayed full-width instead of side-by-side. */
  fullWidthImage?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  /** "concept" = internal placeholder; "client" = verified real client work. */
  status: "concept" | "client";
  summary: string;
  image: string;
  imageAlt: string;
  /** Case study copy — used for concept projects. */
  overview: string;
  objective: string;
  approach: string;
  system: string;
  deliverables: string[];
  outcome: string;
  /** Related Clay Graphik service titles. */
  services: string[];

  /** ── Real client case-study fields ── */
  /** Hero image shown at the top of the case-study page. */
  heroImage?: string;
  /** Client name displayed on the case study. */
  clientName?: string;
  /** Structured editorial sections for the case-study layout. */
  caseStudy?: CaseStudySection[];
  /** Full deliverables list for real projects. */
  caseStudyDeliverables?: string[];
}

export const projects: Project[] = [
  // ──────────────────────────────────────────────────────────────────────
  //  REAL CLIENT CASE STUDIES
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "jdc-global",
    title: "JDC Global",
    category: "Branding",
    year: 2026,
    status: "client",
    clientName: "JDC Global",
    summary:
      "Brand identity and digital-system work for JDC Global, creating a structured visual presence across professional services and digital touchpoints.",
    image: "/projects/jdc-global/jdc-global-hero.jpg",
    imageAlt: "JDC Global brand identity and digital system presentation",
    heroImage: "/projects/jdc-global/jdc-global-hero.jpg",
    overview:
      "JDC Global operates across professional services including PRO, accounting and government-service related offerings. The project brought these distinct service areas together under one coherent visual system — from the core brand identity through to the digital experience.",
    objective:
      "Establish a brand presence that communicates credibility across JDC Global's range of professional services while remaining flexible enough for future growth.",
    approach:
      "The identity was built around a clear, structured design language — combining confident typography, a refined colour system and consistent application rules across digital and physical touchpoints.",
    system:
      "A restrained professional palette anchored in dark and neutral tones, with precise typography and a modular layout system applied across brand applications and digital interfaces.",
    deliverables: [
      "Brand identity and logo system",
      "Digital interface design",
      "Brand touchpoint design",
      "Responsive digital experience",
    ],
    outcome:
      "A unified brand system that connects JDC Global's professional service areas under one visual identity — providing consistency across business materials and digital presence.",
    services: ["Strategy & Identity", "Websites & UX", "Creative Direction"],
    caseStudy: [
      {
        label: "PROJECT OVERVIEW",
        title: "Overview",
        body: "JDC Global brings together multiple professional service lines — from PRO services and accounting to government-related business support. The project focused on creating a brand system that could represent the breadth of the offering without losing clarity or visual cohesion. Clay Graphik developed a structured identity designed to work across digital platforms, business collateral and service-specific touchpoints.",
      },
      {
        label: "BRAND DIRECTION",
        title: "Brand Direction",
        body: "The visual system was built around clarity, structure and professionalism. Every design decision — from the colour palette and typography to the layout language — was chosen to communicate credibility across JDC Global's service areas. The result is an identity that feels confident and organized, reflecting the precision expected of a professional services business.",
        image: {
          src: "/projects/jdc-global/jdc-global-logo.png",
          alt: "JDC Global logo",
        },
      },
      {
        label: "DIGITAL SYSTEM",
        title: "Digital System",
        body: "The digital system extends the brand identity into a consistent interface language. Layouts, components and content hierarchies follow the same structured rules established in the brand guidelines — ensuring the digital experience feels like a natural continuation of the visual identity.",
        image: {
          src: "/projects/jdc-global/jdc-global-digital-system.jpg",
          alt: "JDC Global digital system interface design",
        },
      },
      {
        label: "BRAND TOUCHPOINTS",
        title: "Brand Touchpoints",
        body: "Beyond the digital space, the identity was applied across a range of brand touchpoints — business materials, service documentation and presentation formats. Each application follows the same design language, reinforcing consistency whether the brand is encountered online or in person.",
        image: {
          src: "/projects/jdc-global/jdc-global-brand-touchpoints.jpg",
          alt: "JDC Global brand applications across touchpoints",
        },
      },
      {
        label: "RESPONSIVE EXPERIENCE",
        title: "Responsive Experience",
        body: "The digital presence was designed to work seamlessly across devices — from desktop interfaces to mobile screens. The responsive system maintains the brand's structured visual language at every viewport, ensuring a professional experience regardless of how the audience accesses the platform.",
        image: {
          src: "/projects/jdc-global/jdc-global-responsive.jpg",
          alt: "JDC Global responsive digital experience across devices",
        },
      },
    ],
    caseStudyDeliverables: [
      "Brand strategy and positioning",
      "Logo and identity system",
      "Colour palette and typography rules",
      "Digital interface design",
      "Brand touchpoint applications",
      "Responsive layout system",
      "Brand guidelines",
    ],
  },
  {
    slug: "nelta-tech",
    title: "NELTA TECH",
    category: "Web",
    year: 2026,
    status: "client",
    clientName: "NELTA TECH",
    summary:
      "Brand, website and content-system work for NELTA TECH, connecting visual identity and digital communication into one consistent direction.",
    image: "/projects/nelta-tech/nelta-tech-hero.jpg",
    imageAlt: "NELTA TECH brand and digital presence presentation",
    heroImage: "/projects/nelta-tech/nelta-tech-hero.jpg",
    overview:
      "NELTA TECH required a connected approach spanning brand identity, web presence and content systems. The project brought these elements together into a single coherent digital direction — ensuring the brand communicates consistently across its website, content channels and business materials.",
    objective:
      "Unify NELTA TECH's visual identity, digital presence and content approach into one consistent brand system.",
    approach:
      "The project combined brand direction, website design and content-system development into a single coordinated effort — ensuring every digital touchpoint reflects the same visual language and brand voice.",
    system:
      "A clean, technology-forward design system with structured typography, a defined colour palette and consistent content frameworks across web and social channels.",
    deliverables: [
      "Brand identity direction",
      "Responsive website design",
      "Content system design",
      "Brand presentation",
    ],
    outcome:
      "A connected brand system where the website, content channels and business materials all communicate the same visual identity and brand voice.",
    services: [
      "Strategy & Identity",
      "Websites & UX",
      "Content Systems",
      "Creative Direction",
    ],
    caseStudy: [
      {
        label: "PROJECT OVERVIEW",
        title: "Overview",
        body: "NELTA TECH needed its brand, website and content systems working together rather than as disconnected pieces. Clay Graphik approached the project as an integrated effort — aligning the visual identity with the digital experience and the ongoing content direction. The result is a brand that communicates consistently whether a visitor encounters it on the website, through social content or in a business presentation.",
      },
      {
        label: "BRAND DIRECTION",
        title: "Brand Direction",
        body: "The brand system was developed to reflect NELTA TECH's positioning in the technology and digital services space. A structured visual language — combining precise typography, a defined colour system and consistent application rules — ensures the brand feels cohesive across every touchpoint.",
        image: {
          src: "/projects/nelta-tech/nelta-tech-logo.png",
          alt: "NELTA TECH logo and brand identity",
        },
      },
      {
        label: "WEBSITE EXPERIENCE",
        title: "Website Experience",
        body: "The website was designed to communicate NELTA TECH's offering clearly while maintaining the brand's visual standards. Layout structure, content hierarchy and interactive elements follow a unified design system — creating a professional digital experience that aligns with the broader brand identity.",
        image: {
          src: "/projects/nelta-tech/nelta-tech-responsive.jpg",
          alt: "NELTA TECH responsive website design",
        },
      },
      {
        label: "CONTENT SYSTEM",
        title: "Content System",
        body: "A repeatable content framework was built to keep NELTA TECH's digital communication consistent across channels. The system provides structured templates and guidelines for social media, campaign materials and marketing content — reducing the design overhead while maintaining visual quality.",
        image: {
          src: "/projects/nelta-tech/nelta-tech-content-system.jpg",
          alt: "NELTA TECH content system and templates",
        },
      },
      {
        label: "BRAND APPLICATION",
        title: "Brand Application",
        body: "The identity system was extended across presentation materials and business collateral. Each application references the same brand rules — colour, type, layout and tone — ensuring the brand presents consistently whether encountered digitally or in print.",
        image: {
          src: "/projects/nelta-tech/nelta-tech-brand-presentation.jpg",
          alt: "NELTA TECH brand presentation design",
        },
      },
    ],
    caseStudyDeliverables: [
      "Brand strategy and voice development",
      "Logo and visual identity system",
      "SEO audit and recommendations",
      "Responsive website design",
      "Content system and templates",
      "Brand presentation design",
      "Brand guidelines documentation",
    ],
  },
  {
    slug: "soundscape",
    title: "Soundscape",
    category: "Branding",
    year: 2026,
    status: "client",
    clientName: "Soundscape",
    summary:
      "Brand identity, event branding and digital direction for Soundscape — a multi-touchpoint entertainment brand project.",
    image: "/projects/soundscape/soundscape-hero.jpg",
    imageAlt: "Soundscape brand identity and event branding presentation",
    heroImage: "/projects/soundscape/soundscape-hero.jpg",
    overview:
      "Soundscape is a multi-division entertainment brand requiring a visual identity system capable of spanning event environments, digital platforms and business collateral. Clay Graphik developed the brand identity, event branding applications and digital direction — creating a visual system flexible enough to serve multiple divisions while remaining recognizably one brand.",
    objective:
      "Build a brand identity system that works across event environments, digital channels and multi-division applications while maintaining a unified visual presence.",
    approach:
      "The identity was developed as a modular system — a core brand language with defined rules for colour, typography and layout, applied consistently across event branding, digital experience and physical brand applications.",
    system:
      "A bold, high-contrast visual system built for impact — combining a strong colour palette, confident typography and adaptable layout rules across event, digital and collateral applications.",
    deliverables: [
      "Brand identity system",
      "Logo and mark",
      "Event branding applications",
      "Digital direction",
    ],
    outcome:
      "A multi-touchpoint brand system that works consistently across event environments, digital platforms and business materials — providing Soundscape with a recognizable visual identity across every division.",
    services: ["Strategy & Identity", "Creative Direction", "Websites & UX"],
    caseStudy: [
      {
        label: "PROJECT OVERVIEW",
        title: "Overview",
        body: "Soundscape operates across multiple entertainment divisions — each with its own event environments, digital touchpoints and business materials. The project required a brand identity system flexible enough to serve these varied applications while remaining recognizably unified. Clay Graphik built a comprehensive visual system spanning brand identity, event branding and digital direction.",
      },
      {
        label: "BRAND IDENTITY",
        title: "Brand Identity",
        body: "The identity was designed for visual impact and adaptability. A bold colour system, distinctive typography and a clear set of application rules ensure the brand stands out in high-energy event environments while remaining refined in digital and print contexts. The mark and supporting visual elements were developed to work across formats — from large-scale signage to small digital icons.",
        image: {
          src: "/projects/soundscape/soundscape-logo.png",
          alt: "Soundscape logo and brand identity",
        },
      },
      {
        label: "BRAND SYSTEM",
        title: "Brand System",
        body: "The brand system was built as a modular framework — a core set of rules for colour, type and layout that can be applied consistently across different divisions and touchpoints. This approach allows each area of the business to express the brand appropriately for its context while staying aligned with the overall visual language.",
        image: {
          src: "/projects/soundscape/soundscape-brand-system.jpg",
          alt: "Soundscape brand system and visual guidelines",
        },
      },
      {
        label: "EVENT BRANDING",
        title: "Event Branding",
        body: "Event branding was a central component of the project — extending the identity into physical environments where visual impact matters most. Applications include stage backdrops, signage systems, event passes, lanyards and auditorium branding. Each element follows the brand's design rules while being purpose-built for the event context.",
        image: {
          src: "/projects/soundscape/soundscape-event-branding.jpg",
          alt: "Soundscape event branding applications",
        },
      },
      {
        label: "DIGITAL EXPERIENCE",
        title: "Digital Experience",
        body: "The digital direction translates the brand's energy into online touchpoints — from the website to social presence and digital collateral. The responsive system maintains the brand's bold visual language across every screen size, ensuring the digital experience matches the impact of the physical event environments.",
        image: {
          src: "/projects/soundscape/soundscape-responsive.jpg",
          alt: "Soundscape responsive digital experience",
        },
      },
    ],
    caseStudyDeliverables: [
      "Brand strategy and identity system",
      "Logo and mark design",
      "Colour palette and typography",
      "Event branding — signage, passes, lanyards",
      "Stage backdrop and auditorium branding",
      "Digital and website direction",
      "Brand guidelines documentation",
    ],
  },
  {
    slug: "lacabite",
    title: "Lacabite",
    category: "Branding",
    year: 2026,
    status: "client",
    clientName: "Lacabite Bakery & Arabic Sweets",
    summary:
      "Brand identity, guidelines and digital design for Lacabite Bakery & Arabic Sweets — an F&B branding project.",
    image: "/projects/lacabite/lacabite-hero.jpg",
    imageAlt: "Lacabite Bakery brand identity and touchpoints",
    heroImage: "/projects/lacabite/lacabite-hero.jpg",
    overview:
      "Lacabite Bakery & Arabic Sweets required a complete brand identity system spanning visual identity, brand guidelines and digital design. Clay Graphik developed a brand presence that connects the warmth of the bakery experience with a polished, professional visual system — extending from the logo and touchpoint materials through to the website and mobile experience.",
    objective:
      "Create a complete brand identity for a bakery and sweets business that feels both inviting and professionally structured across every customer touchpoint.",
    approach:
      "The project began with brand identity and guideline development — establishing the visual rules that would inform every subsequent application. The identity was then extended into brand touchpoints, website design and a responsive mobile experience.",
    system:
      "A warm yet refined visual language — combining approachable typography, a considered colour palette and structured layout rules across physical touchpoints and digital platforms.",
    deliverables: [
      "Brand identity and logo",
      "Brand guidelines",
      "Brand touchpoint design",
      "Website design",
      "Mobile experience design",
    ],
    outcome:
      "A complete brand system — from identity and 22-page guidelines document through to digital presence — giving Lacabite a consistent, professional visual identity across all customer-facing channels.",
    services: ["Strategy & Identity", "Websites & UX", "Creative Direction"],
    caseStudy: [
      {
        label: "PROJECT OVERVIEW",
        title: "Overview",
        body: "Lacabite Bakery & Arabic Sweets needed a brand identity that could carry the warmth of an artisan bakery while maintaining the professionalism expected of a growing food-and-beverage business. Clay Graphik developed a complete brand system — from core identity and extensive guidelines through to brand touchpoints and digital design — creating a visual presence that works across physical and digital customer touchpoints.",
      },
      {
        label: "BRAND IDENTITY",
        title: "Brand Identity",
        body: "The identity was designed to feel inviting and distinctive — reflecting the character of a bakery and Arabic sweets brand while maintaining visual consistency. The logo, colour palette and typography system work together to create a brand that feels both approachable and professionally crafted.",
        image: {
          src: "/projects/lacabite/lacabite-logo.png",
          alt: "Lacabite logo and brand identity",
        },
      },
      {
        label: "BRAND GUIDELINES",
        title: "Brand Guidelines",
        body: "A comprehensive brand guidelines document was developed to ensure consistent application of the identity across every touchpoint. The guidelines cover logo usage, colour specifications, typography rules, layout principles and application examples — providing a complete reference for maintaining the brand's visual standards.",
      },
      {
        label: "BRAND TOUCHPOINTS",
        title: "Brand Touchpoints",
        body: "The identity was extended across a range of physical and digital touchpoints — from packaging and in-store materials to business collateral and marketing assets. Each application follows the established brand rules, ensuring the visual experience stays consistent whether a customer encounters the brand online or in person.",
        image: {
          src: "/projects/lacabite/lacabite-brand-touchpoints.jpg",
          alt: "Lacabite brand touchpoints and applications",
        },
      },
      {
        label: "WEBSITE EXPERIENCE",
        title: "Website Experience",
        body: "The website was designed to present the bakery's offering clearly while maintaining the brand's visual character. Layout structure, content hierarchy and visual elements follow the same design system established in the brand guidelines — creating a digital presence that feels like a natural extension of the physical brand experience.",
        image: {
          src: "/projects/lacabite/lacabite-website-full.png",
          alt: "Lacabite full website design",
        },
      },
      {
        label: "MOBILE EXPERIENCE",
        title: "Mobile Experience",
        body: "The mobile experience was designed to maintain the brand's visual standards on smaller screens — ensuring the same quality of experience whether visitors access the brand from a desktop browser or a mobile device. The responsive system adapts layout and content while preserving the brand's design language.",
        image: {
          src: "/projects/lacabite/lacabite-mobile.jpg",
          alt: "Lacabite responsive mobile experience",
        },
      },
    ],
    caseStudyDeliverables: [
      "Brand strategy and positioning",
      "Logo and identity system",
      "Colour palette and typography",
      "22-page brand guidelines document",
      "Brand touchpoint design",
      "Website design",
      "Responsive mobile experience",
      "Brand application examples",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  //  STUDIO CONCEPT PROJECTS
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "brand-book-system",
    title: "Brand Book System",
    category: "Branding",
    year: 2026,
    status: "concept",
    summary:
      "A complete identity system study — mark, palette, type and applications — built to keep a brand consistent across every touchpoint.",
    image: "/images/clay-graphik/clay-graphik-brand-identity.png",
    imageAlt: "Clay Graphik brand identity and visual system presentation",
    overview:
      "A brand is only as strong as its consistency. This studio concept documents a complete identity system: how the palette, typography and layout rules work together across print and digital.",
    objective:
      "Keep the system strict enough to feel premium, yet flexible enough for a growing business to apply it without a design team on call.",
    approach:
      "We defined the core tokens first — colour, type, spacing — then built a library of repeatable layouts and components that enforce the system automatically.",
    system:
      "Neon lime as a strategic accent on carbon and off-white, Hanken Grotesk for display, JetBrains Mono for technical labels.",
    deliverables: [
      "Brand mark usage",
      "Colour & type system",
      "Layout rules",
      "Application examples",
    ],
    outcome:
      "A clearer, more consistent visual presentation across the brand's key customer touchpoints.",
    services: ["Strategy & Identity", "Creative Direction"],
  },
  {
    slug: "web-platform-concept",
    title: "Web Platform Concept",
    category: "Web",
    year: 2026,
    status: "concept",
    summary:
      "A high-converting website concept — clear hierarchy, editorial pace and a conversion path that moves visitors from interest to action.",
    image: "/images/clay-graphik/clay-graphik-digital-system.png",
    imageAlt: "Clay Graphik digital design system and interface presentation",
    overview:
      "Websites are the front door of a modern business. This studio concept shows how information architecture, editorial layout and motion work together to build trust fast.",
    objective:
      "Present a complex service offering clearly on one page without burying the visitor in noise — and without sacrificing brand character.",
    approach:
      "Every section has a job: prove credibility, explain the offering, show the process, and make starting a project effortless.",
    system:
      "A foreground-stage layout with generous negative space, large display type and a restrained lime accent on interactive elements.",
    deliverables: [
      "Information architecture",
      "UI design system",
      "Editorial layout",
      "Motion direction",
    ],
    outcome:
      "A website structure where the offer is easier to understand and the path to enquiry is clear.",
    services: ["Websites & UX"],
  },
  {
    slug: "content-system-concept",
    title: "Content System Concept",
    category: "Social / Digital",
    year: 2026,
    status: "concept",
    summary:
      "A repeatable content system — templates, campaign frames and a posting rhythm — that keeps social output on-brand without daily design panic.",
    image: "/projects/concept-content-system.svg",
    imageAlt: "Abstract editorial concept visual for a content system project",
    overview:
      "Consistent content is what makes a brand feel alive. This studio concept defines a modular system for campaigns, social posts and marketing collateral.",
    objective:
      "Design a system flexible enough for daily output but strict enough that everything still looks like the same brand.",
    approach:
      "A fixed set of frames, type roles and colour rules means anyone on the team can produce on-brand assets quickly.",
    system:
      "Modular frames with strong type hierarchy, a lime accent for emphasis, and clean grid discipline across every format.",
    deliverables: [
      "Template library",
      "Campaign frames",
      "Social formats",
      "Collateral guidelines",
    ],
    outcome:
      "A repeatable system that keeps the brand consistent across every post, campaign and channel.",
    services: ["Content Systems"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project | undefined {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return projects[0];
  return projects[(idx + 1) % projects.length];
}

/** Returns only real client projects. */
export function getClientProjects(): Project[] {
  return projects.filter((p) => p.status === "client");
}

/** Returns only concept projects. */
export function getConceptProjects(): Project[] {
  return projects.filter((p) => p.status === "concept");
}

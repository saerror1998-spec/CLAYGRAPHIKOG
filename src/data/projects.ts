/**
 * Clay Graphik project data.
 *
 * NOTE: real client case studies are not available yet. Entries are marked
 * `status: "concept"` internally so they can be swapped for verified client
 * work later — no fake clients, results, awards or metrics are presented.
 * Concept work is labelled "STUDIO CONCEPT" publicly so it never reads as a
 * paying client engagement.
 */
export type ProjectCategory = "Branding" | "Web" | "Social / Digital";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  /** "concept" = internal placeholder awaiting verified client material. */
  status: "concept" | "client";
  summary: string;
  image: string;
  imageAlt: string;
  /** Case study copy. */
  overview: string;
  objective: string;
  approach: string;
  system: string;
  deliverables: string[];
  /** Qualitative outcome only — never invented numbers. */
  outcome: string;
  /** Related Clay Graphik service titles. */
  services: string[];
}

export const projects: Project[] = [
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
    deliverables: ["Brand mark usage", "Colour & type system", "Layout rules", "Application examples"],
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
    deliverables: ["Information architecture", "UI design system", "Editorial layout", "Motion direction"],
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
    deliverables: ["Template library", "Campaign frames", "Social formats", "Collateral guidelines"],
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

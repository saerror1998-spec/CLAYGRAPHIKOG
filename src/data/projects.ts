/**
 * Clay Graphik project data.
 *
 * NOTE: real client case studies are not available yet. Entries are marked
 * `status: "concept"` internally so they can be swapped for verified client
 * work later — no fake clients, results, awards or metrics are presented.
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
  challenge: string;
  approach: string;
  visualSystem: string;
  deliverables: string[];
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
    image: "/projects/brand-book-system.jpg",
    imageAlt: "Editorial spread of the Clay Graphik brand book system",
    overview:
      "A brand is only as strong as its consistency. This concept case study documents a complete identity system: how the palette, typography and layout rules work together across print and digital.",
    challenge:
      "Keep the system strict enough to feel premium, yet flexible enough for a growing business to apply it without a design team on call.",
    approach:
      "We defined the core tokens first — colour, type, spacing — then built a library of repeatable layouts and components that enforce the system automatically.",
    visualSystem:
      "Neon lime as a strategic accent on carbon and off-white, Hanken Grotesk for display, JetBrains Mono for technical labels.",
    deliverables: ["Brand mark usage", "Colour & type system", "Layout rules", "Application examples"],
  },
  {
    slug: "web-platform-concept",
    title: "Web Platform Concept",
    category: "Web",
    year: 2026,
    status: "concept",
    summary:
      "A high-converting website concept — clear hierarchy, editorial pace and a conversion path that moves visitors from interest to action.",
    image: "/projects/concept-web-platform.svg",
    imageAlt: "Abstract editorial concept visual for a web platform project",
    overview:
      "Websites are the front door of a modern business. This concept case study shows how information architecture, editorial layout and motion work together to build trust fast.",
    challenge:
      "Present complex service offering clearly on one page without burying the visitor in noise — and without sacrificing brand character.",
    approach:
      "Every section has a job: prove credibility, explain the offering, show the process, and make starting a project effortless.",
    visualSystem:
      "A foreground-stage layout with generous negative space, large display type and a restrained lime accent on interactive elements.",
    deliverables: ["Information architecture", "UI design system", "Editorial layout", "Motion direction"],
  },
  {
    slug: "content-system-concept",
    category: "Social / Digital",
    year: 2026,
    status: "concept",
    title: "Content System Concept",
    summary:
      "A repeatable content system — templates, campaign frames and a posting rhythm — that keeps social output on-brand without daily design panic.",
    image: "/projects/concept-content-system.svg",
    imageAlt: "Abstract editorial concept visual for a content system project",
    overview:
      "Consistent content is what makes a brand feel alive. This concept case study defines a modular system for campaigns, social posts and marketing collateral.",
    challenge:
      "Design a system flexible enough for daily output but strict enough that everything still looks like the same brand.",
    approach:
      "A fixed set of frames, type roles and colour rules means anyone on the team can produce on-brand assets quickly.",
    visualSystem:
      "Modular frames with strong type hierarchy, a lime accent for emphasis, and clean grid discipline across every format.",
    deliverables: ["Template library", "Campaign frames", "Social formats", "Collateral guidelines"],
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

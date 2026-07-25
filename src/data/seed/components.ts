import type { ComponentImportance } from "@prisma/client";

export type SeedComponent = {
  slug: string;
  name: string;
  description?: string;
  importance: ComponentImportance;
};

export const seedComponents: SeedComponent[] = [
  { slug: "cartridge", name: "Cartucho", importance: "CRITICAL" },
  { slug: "disc", name: "Disco / cartucho de juego", importance: "CRITICAL" },
  { slug: "outer-box", name: "Caja exterior", importance: "HIGH" },
  { slug: "inner-box", name: "Caja interior", importance: "MEDIUM" },
  { slug: "manual", name: "Manual", importance: "HIGH" },
  { slug: "inserts", name: "Insertos publicitarios", importance: "LOW" },
  { slug: "map", name: "Mapa", importance: "MEDIUM" },
  { slug: "pokewalker", name: "Pokéwalker", importance: "HIGH" },
  { slug: "pokewalker-clip", name: "Clip del Pokéwalker", importance: "MEDIUM" },
  { slug: "transfer-pak", name: "Transfer Pak", importance: "OPTIONAL" },
  { slug: "wireless-adapter", name: "Wireless Adapter", importance: "OPTIONAL" },
  { slug: "sleeve", name: "Funda", importance: "LOW" },
  { slug: "seal", name: "Precinto", importance: "MEDIUM" },
  { slug: "points-card", name: "Tarjeta de puntos", importance: "LOW" },
  { slug: "other", name: "Otros", importance: "OPTIONAL" },
];

export type EditionComponentSeed = {
  componentSlug: string;
  weight: number;
  isRequired?: boolean;
};

/** Default physical CIB checklist for cartridge handhelds */
export const defaultCartridgeComponents: EditionComponentSeed[] = [
  { componentSlug: "cartridge", weight: 4 },
  { componentSlug: "outer-box", weight: 3 },
  { componentSlug: "manual", weight: 2 },
  { componentSlug: "inserts", weight: 1, isRequired: false },
];

export const heartGoldSoulSilverComponents: EditionComponentSeed[] = [
  { componentSlug: "cartridge", weight: 4 },
  { componentSlug: "outer-box", weight: 3 },
  { componentSlug: "manual", weight: 2 },
  { componentSlug: "pokewalker", weight: 3 },
  { componentSlug: "pokewalker-clip", weight: 1 },
  { componentSlug: "inserts", weight: 1, isRequired: false },
];

export const switchPhysicalComponents: EditionComponentSeed[] = [
  { componentSlug: "disc", weight: 4 },
  { componentSlug: "outer-box", weight: 3 },
  { componentSlug: "manual", weight: 1, isRequired: false },
  { componentSlug: "inserts", weight: 1, isRequired: false },
];

export interface HarmonyDefinition {
  label: string;
  description: string;
  a: number; // primary offset for accent hue
  b: number; // secondary offset for secondary hue
}

export type HarmonyMode =
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'split'
  | 'tetradic'
  | 'monochrome'
  | 'square';

export const HARMONIES: Record<HarmonyMode, HarmonyDefinition> = {
  analogous: {
    label: 'Analogous',
    description: 'Adjacent hues (±30°), creating a natural and unified atmosphere.',
    a: 30,
    b: -30,
  },
  complementary: {
    label: 'Complementary',
    description: 'Opposite hues (180°), producing high energy and visual pop.',
    a: 180,
    b: 30,
  },
  triadic: {
    label: 'Triadic',
    description: 'Three evenly spaced hues (120° apart) offering vibrant balance.',
    a: 120,
    b: 240,
  },
  split: {
    label: 'Split-Comp.',
    description: 'Opposite split hues (150° and 210°), high contrast with less tension.',
    a: 150,
    b: 210,
  },
  tetradic: {
    label: 'Tetradic',
    description: 'Dual complementary pairs (90° and 180°), rich multifaceted palette.',
    a: 90,
    b: 180,
  },
  square: {
    label: 'Square',
    description: 'Four equidistant points around the wheel (90°, 180°, 270°).',
    a: 90,
    b: 270,
  },
  monochrome: {
    label: 'Monochrome',
    description: 'Single hue with varied chroma and lightness for ultra-clean UI.',
    a: 0,
    b: 0,
  },
};

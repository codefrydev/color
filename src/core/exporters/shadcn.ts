import { hslToHex } from '../color/conversions';
import { StudioState } from '../engine/types';
import { deriveDesignSystem } from '../engine/derivation';

export function exportShadcn(st: StudioState): string {
  const L = deriveDesignSystem(st, 'light');
  const D = deriveDesignSystem(st, 'dark');

  const formatHslRaw = (hsl: { h: number; s: number; l: number }) =>
    `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`;

  return `/* Shadcn/UI compatible globals.css variables */
:root {
  --background: ${formatHslRaw(L.scales.n[50])};
  --foreground: ${formatHslRaw(L.scales.n[950])};

  --card: ${formatHslRaw({ h: 0, s: 0, l: 100 })};
  --card-foreground: ${formatHslRaw(L.scales.n[900])};

  --popover: ${formatHslRaw({ h: 0, s: 0, l: 100 })};
  --popover-foreground: ${formatHslRaw(L.scales.n[900])};

  --primary: ${formatHslRaw(L.scales.p[600])};
  --primary-foreground: 0 0% 100%;

  --secondary: ${formatHslRaw(L.scales.n[100])};
  --secondary-foreground: ${formatHslRaw(L.scales.n[900])};

  --muted: ${formatHslRaw(L.scales.n[100])};
  --muted-foreground: ${formatHslRaw(L.scales.n[600])};

  --accent: ${formatHslRaw(L.scales.a[500])};
  --accent-foreground: 0 0% 100%;

  --destructive: ${formatHslRaw(L.scales.danger[600])};
  --destructive-foreground: 0 0% 100%;

  --border: ${formatHslRaw(L.scales.n[200])};
  --input: ${formatHslRaw(L.scales.n[200])};
  --ring: ${formatHslRaw(L.scales.p[500])};

  --radius: ${L.tokens['--radius-md'] || '0.5rem'};
}

.dark {
  --background: ${formatHslRaw(D.scales.n[950])};
  --foreground: ${formatHslRaw(D.scales.n[50])};

  --card: ${formatHslRaw(D.scales.n[900])};
  --card-foreground: ${formatHslRaw(D.scales.n[100])};

  --popover: ${formatHslRaw(D.scales.n[900])};
  --popover-foreground: ${formatHslRaw(D.scales.n[100])};

  --primary: ${formatHslRaw(D.scales.p[400])};
  --primary-foreground: ${formatHslRaw(D.scales.n[950])};

  --secondary: ${formatHslRaw(D.scales.n[800])};
  --secondary-foreground: ${formatHslRaw(D.scales.n[100])};

  --muted: ${formatHslRaw(D.scales.n[800])};
  --muted-foreground: ${formatHslRaw(D.scales.n[400])};

  --accent: ${formatHslRaw(D.scales.a[400])};
  --accent-foreground: ${formatHslRaw(D.scales.n[950])};

  --destructive: ${formatHslRaw(D.scales.danger[500])};
  --destructive-foreground: 0 0% 100%;

  --border: ${formatHslRaw(D.scales.n[800])};
  --input: ${formatHslRaw(D.scales.n[800])};
  --ring: ${formatHslRaw(D.scales.p[400])};
}
`;
}

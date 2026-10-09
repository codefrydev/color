import { hslToHex } from '../color/conversions';
import { StudioState, STOPS, ScaleKey } from '../engine/types';
import { deriveDesignSystem, SEM_KEYS } from '../engine/derivation';

export function exportTailwindV4(st: StudioState): string {
  const L = deriveDesignSystem(st, 'light');
  let o = `/* Tailwind CSS v4 Theme Extension */\n@theme {\n`;

  const scaleNames: Record<string, string> = {
    p: 'color-primary',
    a: 'color-accent',
    s: 'color-secondary',
    n: 'color-neutral',
    success: 'color-success',
    warning: 'color-warning',
    danger: 'color-danger',
    info: 'color-info',
  };

  (Object.keys(scaleNames) as ScaleKey[]).forEach((sc) => {
    STOPS.forEach((stop) => {
      const hex = st.customScales?.[sc]?.[stop] || hslToHex(L.scales[sc][stop]);
      o += `  --${scaleNames[sc]}-${stop}: ${hex};\n`;
    });
  });

  // Radii
  ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].forEach((r) => {
    o += `  --radius-${r}: var(--radius-${r});\n`;
  });

  o += `}\n`;
  return o;
}

export function exportTailwindV3(st: StudioState): string {
  const L = deriveDesignSystem(st, 'light');
  const colors: Record<string, Record<string, string>> = {};

  const mapNames = ['primary', 'accent', 'secondary', 'neutral'];
  const keys: ScaleKey[] = ['p', 'a', 's', 'n'];
  keys.forEach((k, i) => {
    colors[mapNames[i]] = Object.fromEntries(
      STOPS.map((s) => [s, st.customScales?.[k]?.[s] || hslToHex(L.scales[k][s])])
    );
  });

  SEM_KEYS.forEach((k) => {
    colors[k] = Object.fromEntries(
      STOPS.map((s) => [s, st.customScales?.[k]?.[s] || hslToHex(L.scales[k][s])])
    );
  });

  const t = L.tokens;
  const pick = (prefix: string) =>
    Object.fromEntries(
      Object.entries(t)
        .filter(([k]) => k.startsWith(prefix))
        .map(([k, v]) => [k.slice(prefix.length), v])
    );

  return `/** tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/\n {6}\}/g, '\n      ')},
      borderRadius: ${JSON.stringify(pick('--radius-'), null, 8)},
      boxShadow: ${JSON.stringify(pick('--shadow-'), null, 8)},
      fontSize: ${JSON.stringify(pick('--text-'), null, 8)}
    }
  }
};
`;
}

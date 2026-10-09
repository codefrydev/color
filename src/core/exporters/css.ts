import { formatColor } from '../color/conversions';
import { StudioState, STOPS, ScaleKey } from '../engine/types';
import { deriveDesignSystem } from '../engine/derivation';

export function exportCss(st: StudioState): string {
  const L = deriveDesignSystem(st, 'light');
  const D = deriveDesignSystem(st, 'dark');
  const f = st.format;

  let o = `/* Color Design System Studio — ${st.harmony.toUpperCase()} palette from ${L.meta.hex.toUpperCase()}\n`;
  o += ` * Temperature: ${L.meta.temp} | Psychology: ${L.meta.psych}\n`;
  o += ` * Generated: ${new Date().toISOString().slice(0, 10)}\n */\n\n`;

  o += `:root {\n`;
  const scaleLabels: Record<string, string> = {
    p: 'Primary',
    a: 'Accent',
    s: 'Secondary',
    n: 'Neutral',
    success: 'Success',
    warning: 'Warning',
    danger: 'Danger',
    info: 'Info',
  };

  (Object.keys(scaleLabels) as ScaleKey[]).forEach((sc) => {
    o += `  /* ${scaleLabels[sc]} Scale */\n`;
    STOPS.forEach((stop) => {
      o += `  --${sc}-${stop}: ${formatColor(L.scales[sc][stop], f)};\n`;
    });
    o += '\n';
  });

  o += `  /* Design Tokens */\n`;
  Object.entries(L.tokens).forEach(([k, v]) => {
    o += `  ${k}: ${v};\n`;
  });

  o += `\n  /* Semantic Roles (Light) */\n`;
  Object.entries(L.sem).forEach(([k, v]) => {
    o += `  ${k}: ${v.css};\n`;
  });
  o += `}\n\n`;

  o += `[data-theme="dark"] {\n`;
  o += `  /* Semantic Roles (Dark) */\n`;
  Object.entries(D.sem).forEach(([k, v]) => {
    o += `  ${k}: ${v.css};\n`;
  });
  o += `}\n`;

  return o;
}

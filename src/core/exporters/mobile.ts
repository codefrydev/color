import { hslToHex, hslToRgb } from '../color/conversions';
import { StudioState, STOPS } from '../engine/types';
import { deriveDesignSystem } from '../engine/derivation';

export function exportSwift(st: StudioState): string {
  const L = deriveDesignSystem(st, 'light');
  let o = `// ColorStudioTokens.swift\nimport SwiftUI\n\npublic struct ColorStudio {\n`;

  const keys: ('p' | 'a' | 's' | 'n')[] = ['p', 'a', 's', 'n'];
  const names = ['primary', 'accent', 'secondary', 'neutral'];

  keys.forEach((k, idx) => {
    o += `    // ${names[idx].toUpperCase()} SCALE\n`;
    STOPS.forEach((s) => {
      const rgb = hslToRgb(L.scales[k][s]);
      o += `    public static let ${names[idx]}${s} = Color(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)})\n`;
    });
    o += '\n';
  });

  o += `}\n`;
  return o;
}

export function exportKotlin(st: StudioState): string {
  const L = deriveDesignSystem(st, 'light');
  let o = `// ColorStudioTokens.kt\npackage com.designsystem.theme\n\nimport androidx.compose.ui.graphics.Color\n\nobject ColorStudio {\n`;

  const keys: ('p' | 'a' | 's' | 'n')[] = ['p', 'a', 's', 'n'];
  const names = ['Primary', 'Accent', 'Secondary', 'Neutral'];

  keys.forEach((k, idx) => {
    o += `    // ${names[idx].toUpperCase()} SCALE\n`;
    STOPS.forEach((s) => {
      const hex = hslToHex(L.scales[k][s]).replace('#', '').toUpperCase();
      o += `    val ${names[idx]}${s} = Color(0xFF${hex})\n`;
    });
    o += '\n';
  });

  o += `}\n`;
  return o;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface LAB {
  L: number;
  a: number;
  b: number;
}

export interface OKLCH {
  l: number; // 0 to 1
  c: number; // 0 to ~0.4
  h: number; // 0 to 360
}

export interface OKLAB {
  L: number;
  a: number;
  b: number;
}

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

export const mod = (h: number): number => ((h % 360) + 360) % 360;

/** Convert HSL to RGB (0-255) */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const normS = s / 100;
  const normL = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = normS * Math.min(normL, 1 - normL);
  const f = (n: number) =>
    normL - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * clamp(f(0), 0, 1)),
    g: Math.round(255 * clamp(f(8), 0, 1)),
    b: Math.round(255 * clamp(f(4), 0, 1)),
  };
}

/** Convert RGB to Hex string (#rrggbb) */
export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Convert HSL to Hex string */
export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

/** Convert Hex string to RGB */
export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(clean.slice(0, 2), 16) || 0,
    g: parseInt(clean.slice(2, 4), 16) || 0,
    b: parseInt(clean.slice(4, 6), 16) || 0,
  };
}

/** Convert RGB to HSL */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;
  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === normR) {
      h = (normG - normB) / d + (normG < normB ? 6 : 0);
    } else if (max === normG) {
      h = (normB - normR) / d + 2;
    } else {
      h = (normR - normG) / d + 4;
    }
    h *= 60;
  }

  return { h: mod(h), s: clamp(s * 100, 0, 100), l: clamp(l * 100, 0, 100) };
}

/** Convert Hex string to HSL */
export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

/** sRGB to linear RGB channel */
export function sRgbToLinear(c: number): number {
  const norm = c / 255;
  return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

/** Linear RGB to sRGB channel */
export function linearToSRgb(c: number): number {
  const clamped = clamp(c, 0, 1);
  return Math.round(
    255 *
      (clamped <= 0.0031308
        ? 12.92 * clamped
        : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055)
  );
}

/** Convert RGB to CIE LAB */
export function rgbToLab({ r, g, b }: RGB): LAB {
  const rL = sRgbToLinear(r);
  const gL = sRgbToLinear(g);
  const bL = sRgbToLinear(b);

  const x = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) / 0.95047;
  const y = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) / 1.0;
  const z = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) / 1.08883;

  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;

  const fX = f(x);
  const fY = f(y);
  const fZ = f(z);

  return {
    L: 116 * fY - 16,
    a: 500 * (fX - fY),
    b: 200 * (fY - fZ),
  };
}

/** Convert RGB to Oklab */
export function rgbToOklab({ r, g, b }: RGB): OKLAB {
  const rL = sRgbToLinear(r);
  const gL = sRgbToLinear(g);
  const bL = sRgbToLinear(b);

  const l = Math.cbrt(0.4122214708 * rL + 0.5363325363 * gL + 0.0514459929 * bL);
  const m = Math.cbrt(0.2119034982 * rL + 0.6806995451 * gL + 0.1073969566 * bL);
  const s = Math.cbrt(0.0883024619 * rL + 0.2817188376 * gL + 0.6299787005 * bL);

  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

/** Convert Oklab to RGB */
export function oklabToRgb({ L, a, b }: OKLAB): RGB {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: linearToSRgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: linearToSRgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: linearToSRgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}

/** Convert RGB to OKLCH */
export function rgbToOklch(rgb: RGB): OKLCH {
  const lab = rgbToOklab(rgb);
  const c = Math.hypot(lab.a, lab.b);
  let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  h = mod(h);
  return { l: clamp(lab.L, 0, 1), c, h };
}

/** Convert OKLCH to RGB */
export function oklchToRgb({ l, c, h }: OKLCH): RGB {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  return oklabToRgb({ L: l, a, b });
}

/** Convert OKLCH to CSS string `oklch(L C H)` */
export function oklchToCss({ l, c, h }: OKLCH): string {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}

/** Format color based on preferred format */
export function formatColor(
  hsl: HSL,
  format: 'hex' | 'rgb' | 'hsl' | 'oklch'
): string {
  if (format === 'hex') return hslToHex(hsl);
  const rgb = hslToRgb(hsl);
  if (format === 'rgb') return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
  if (format === 'oklch') return oklchToCss(rgbToOklch(rgb));
  return `hsl(${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%)`;
}

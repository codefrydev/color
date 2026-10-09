import { RGB, HSL, hslToRgb, sRgbToLinear } from './conversions';

/** Calculate standard WCAG 2.1/2.2 relative luminance */
export function getLuminance(rgb: RGB): number {
  const r = sRgbToLinear(rgb.r);
  const g = sRgbToLinear(rgb.g);
  const b = sRgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Calculate standard WCAG contrast ratio between two colors (1 to 21) */
export function getContrast(c1: HSL | RGB, c2: HSL | RGB): number {
  const rgb1 = 'h' in c1 ? hslToRgb(c1) : c1;
  const rgb2 = 'h' in c2 ? hslToRgb(c2) : c2;
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Check WCAG AA and AAA conformance */
export function checkWcag(
  ratio: number,
  isLargeText = false
): {
  aa: boolean;
  aaa: boolean;
  rating: 'AAA' | 'AA' | 'Fail';
} {
  const minAA = isLargeText ? 3.0 : 4.5;
  const minAAA = isLargeText ? 4.5 : 7.0;
  const aa = ratio >= minAA;
  const aaa = ratio >= minAAA;
  return {
    aa,
    aaa,
    rating: aaa ? 'AAA' : aa ? 'AA' : 'Fail',
  };
}

/**
 * APCA (Advanced Perceptual Contrast Algorithm) lightness contrast (Lc) estimation.
 * Standard W3C Silver / WCAG 3.0 candidate formula.
 */
export function getApca(txt: RGB, bg: RGB): number {
  // Linearize sRGB with APCA exponents
  const normTxt = [txt.r / 255, txt.g / 255, txt.b / 255];
  const normBg = [bg.r / 255, bg.g / 255, bg.b / 255];

  const yTxt =
    0.2126729 * Math.pow(normTxt[0], 2.4) +
    0.7151522 * Math.pow(normTxt[1], 2.4) +
    0.072175 * Math.pow(normTxt[2], 2.4);

  const yBg =
    0.2126729 * Math.pow(normBg[0], 2.4) +
    0.7151522 * Math.pow(normBg[1], 2.4) +
    0.072175 * Math.pow(normBg[2], 2.4);

  // Soft clamp for black level
  const yTxtClamped = yTxt > 0.022 ? yTxt : yTxt + Math.pow(0.022 - yTxt, 1.414);
  const yBgClamped = yBg > 0.022 ? yBg : yBg + Math.pow(0.022 - yBg, 1.414);

  // Polarity: Dark text on light background vs Light text on dark background
  if (Math.abs(yBgClamped - yTxtClamped) < 0.0005) {
    return 0;
  }

  let Lc = 0;
  if (yBgClamped > yTxtClamped) {
    // Dark text on light background (positive contrast)
    const SAPC = Math.pow(yBgClamped, 0.56) - Math.pow(yTxtClamped, 0.57);
    Lc = SAPC * 1.14;
  } else {
    // Light text on dark background (negative contrast)
    const SAPC = Math.pow(yBgClamped, 0.65) - Math.pow(yTxtClamped, 0.62);
    Lc = SAPC * 1.14;
  }

  return Math.round(Lc * 100);
}

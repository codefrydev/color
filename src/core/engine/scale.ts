import { HSL, clamp, mod, oklchToRgb, rgbToHsl, hslToRgb, rgbToOklch } from '../color/conversions';
import { ColorScale, ColorStop, STOPS } from './types';

// Classic HSL lightness curves
export const L_CURVE: Record<ColorStop, number> = {
  50: 97,
  100: 94,
  200: 86,
  300: 77,
  400: 66,
  500: 55,
  600: 45,
  700: 35,
  800: 25,
  900: 15,
  950: 9,
};

// Classic HSL saturation multipliers
export const S_CURVE: Record<ColorStop, number> = {
  50: 0.6,
  100: 0.72,
  200: 0.86,
  300: 0.95,
  400: 1,
  500: 1,
  600: 1,
  700: 0.96,
  800: 0.9,
  900: 0.82,
  950: 0.72,
};

// Target perceived lightness in OKLCH (0.0 to 1.0)
export const OKLCH_L_TARGETS: Record<ColorStop, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.86,
  300: 0.76,
  400: 0.65,
  500: 0.54,
  600: 0.44,
  700: 0.35,
  800: 0.26,
  900: 0.18,
  950: 0.12,
};

// Chroma scaling curve in OKLCH
export const OKLCH_C_CURVE: Record<ColorStop, number> = {
  50: 0.22,
  100: 0.38,
  200: 0.65,
  300: 0.85,
  400: 0.96,
  500: 1.0,
  600: 0.97,
  700: 0.88,
  800: 0.74,
  900: 0.55,
  950: 0.38,
};

/** Generate a 50-950 scale using classic HSL curves */
export function makeHslScale(h: number, s: number, flat = false): ColorScale {
  const scale = {} as ColorScale;
  STOPS.forEach((stop) => {
    scale[stop] = {
      h: mod(h),
      s: clamp(s * (flat ? 1 : S_CURVE[stop]), 0, 100),
      l: L_CURVE[stop],
    };
  });
  return scale;
}

/**
 * Generate a 50-950 scale using modern OKLCH perceptual lightness & chroma.
 * This guarantees consistent perceived contrast across different hues.
 */
export function makeOklchScale(h: number, s: number, flat = false): ColorScale {
  const baseHsl: HSL = { h: mod(h), s: clamp(s, 0, 100), l: 50 };
  const baseRgb = hslToRgb(baseHsl);
  const baseOklch = rgbToOklch(baseRgb);

  const scale = {} as ColorScale;
  STOPS.forEach((stop) => {
    const targetL = OKLCH_L_TARGETS[stop];
    const chromaFactor = flat ? 0.3 : OKLCH_C_CURVE[stop];
    const targetC = baseOklch.c * (flat ? 0.2 : chromaFactor);

    // Convert back from OKLCH to RGB and then HSL
    const rgb = oklchToRgb({
      l: targetL,
      c: targetC,
      h: baseOklch.h,
    });
    scale[stop] = rgbToHsl(rgb);
  });

  return scale;
}

/** Unified scale builder respecting state preference */
export function makeScale(
  h: number,
  s: number,
  flat = false,
  mode: 'oklch' | 'hsl' = 'oklch'
): ColorScale {
  if (mode === 'oklch' && !flat) {
    return makeOklchScale(h, s, flat);
  }
  return makeHslScale(h, s, flat);
}

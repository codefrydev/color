import { RGB, clamp, sRgbToLinear, linearToSRgb } from './conversions';

export type VisionMode =
  | 'Normal vision'
  | 'Protanopia'
  | 'Deuteranopia'
  | 'Tritanopia'
  | 'Achromatopsia';

const SIMULATION_MATRICES: Record<
  VisionMode,
  number[][] | 'gray' | null
> = {
  'Normal vision': null,
  'Protanopia': [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  'Deuteranopia': [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  'Tritanopia': [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
  'Achromatopsia': 'gray',
};

/** Simulate how an RGB color appears under various vision deficiencies */
export function simulateColorBlindness(rgb: RGB, mode: VisionMode): RGB {
  const matrix = SIMULATION_MATRICES[mode];
  if (!matrix) return rgb;

  if (matrix === 'gray') {
    // Relative luminance calculation in standard sRGB gamma 2.2
    const linR = sRgbToLinear(rgb.r);
    const linG = sRgbToLinear(rgb.g);
    const linB = sRgbToLinear(rgb.b);
    const lum = 0.2126 * linR + 0.7152 * linG + 0.0722 * linB;
    const y = linearToSRgb(lum);
    return { r: y, g: y, b: y };
  }

  const lin = [sRgbToLinear(rgb.r), sRgbToLinear(rgb.g), sRgbToLinear(rgb.b)];
  const transformed = matrix.map((row) =>
    clamp(row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2], 0, 1)
  );

  return {
    r: linearToSRgb(transformed[0]),
    g: linearToSRgb(transformed[1]),
    b: linearToSRgb(transformed[2]),
  };
}

export const VISION_MODES: VisionMode[] = [
  'Normal vision',
  'Protanopia',
  'Deuteranopia',
  'Tritanopia',
  'Achromatopsia',
];

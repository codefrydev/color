import { RGB, LAB, rgbToLab } from './conversions';

/** CIE76 color difference formula (Euclidean distance in CIELAB) */
export function deltaE76(c1: RGB | LAB, c2: RGB | LAB): number {
  const lab1 = 'r' in c1 ? rgbToLab(c1) : c1;
  const lab2 = 'r' in c2 ? rgbToLab(c2) : c2;
  return Math.hypot(lab1.L - lab2.L, lab1.a - lab2.a, lab1.b - lab2.b);
}

/** CIEDE2000 color difference formula (modern perceptual standard) */
export function deltaE2000(c1: RGB | LAB, c2: RGB | LAB): number {
  const lab1 = 'r' in c1 ? rgbToLab(c1) : c1;
  const lab2 = 'r' in c2 ? rgbToLab(c2) : c2;

  const L1 = lab1.L;
  const a1 = lab1.a;
  const b1 = lab1.b;
  const L2 = lab2.L;
  const a2 = lab2.a;
  const b2 = lab2.b;

  const avgL = (L1 + L2) / 2;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const avgC = (C1 + C2) / 2;

  const G =
    0.5 *
    (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));

  const a1Prime = a1 * (1 + G);
  const a2Prime = a2 * (1 + G);

  const C1Prime = Math.hypot(a1Prime, b1);
  const C2Prime = Math.hypot(a2Prime, b2);

  const h1Prime =
    ((Math.atan2(b1, a1Prime) * 180) / Math.PI + 360) % 360;
  const h2Prime =
    ((Math.atan2(b2, a2Prime) * 180) / Math.PI + 360) % 360;

  const deltaLPrime = L2 - L1;
  const deltaCPrime = C2Prime - C1Prime;

  let deltaHPrime = 0;
  if (C1Prime * C2Prime !== 0) {
    const diff = h2Prime - h1Prime;
    if (Math.abs(diff) <= 180) {
      deltaHPrime = diff;
    } else if (diff > 180) {
      deltaHPrime = diff - 360;
    } else {
      deltaHPrime = diff + 360;
    }
  }
  const deltaHPrimeCap =
    2 * Math.sqrt(C1Prime * C2Prime) * Math.sin(((deltaHPrime / 2) * Math.PI) / 180);

  const avgLPrime = avgL;
  const avgCPrime = (C1Prime + C2Prime) / 2;

  let avgHPrime = h1Prime + h2Prime;
  if (C1Prime * C2Prime !== 0) {
    if (Math.abs(h1Prime - h2Prime) <= 180) {
      avgHPrime = (h1Prime + h2Prime) / 2;
    } else if (h1Prime + h2Prime < 360) {
      avgHPrime = (h1Prime + h2Prime + 360) / 2;
    } else {
      avgHPrime = (h1Prime + h2Prime - 360) / 2;
    }
  }

  const T =
    1 -
    0.17 * Math.cos(((avgHPrime - 30) * Math.PI) / 180) +
    0.24 * Math.cos(((2 * avgHPrime) * Math.PI) / 180) +
    0.32 * Math.cos(((3 * avgHPrime + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * avgHPrime - 63) * Math.PI) / 180);

  const deltaTheta =
    30 * Math.exp(-Math.pow((avgHPrime - 275) / 25, 2));
  const RC =
    2 *
    Math.sqrt(
      Math.pow(avgCPrime, 7) / (Math.pow(avgCPrime, 7) + Math.pow(25, 7))
    );
  const SL =
    1 +
    (0.015 * Math.pow(avgLPrime - 50, 2)) /
      Math.sqrt(20 + Math.pow(avgLPrime - 50, 2));
  const SC = 1 + 0.045 * avgCPrime;
  const SH = 1 + 0.015 * avgCPrime * T;
  const RT = -Math.sin(((2 * deltaTheta) * Math.PI) / 180) * RC;

  return Math.sqrt(
    Math.pow(deltaLPrime / SL, 2) +
      Math.pow(deltaCPrime / SC, 2) +
      Math.pow(deltaHPrimeCap / SH, 2) +
      RT * (deltaCPrime / SC) * (deltaHPrimeCap / SH)
  );
}

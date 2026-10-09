import { RGB, rgbToHex, rgbToHsl, HSL } from './conversions';

export interface ExtractedColor {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  count: number;
  percentage: number;
}

/**
 * Extract dominant colors from an image File or HTMLImageElement
 */
export async function extractColorsFromImage(
  fileOrImage: File | HTMLImageElement,
  maxColors = 6
): Promise<ExtractedColor[]> {
  let img: HTMLImageElement;

  if (fileOrImage instanceof File) {
    const objectUrl = URL.createObjectURL(fileOrImage);
    img = new Image();
    img.src = objectUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    URL.revokeObjectURL(objectUrl);
  } else {
    img = fileOrImage;
    if (!img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve;
      });
    }
  }

  // Draw scaled down to canvas for fast processing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const maxDim = 150;
  let { naturalWidth: width, naturalHeight: height } = img;
  if (!width || !height) {
    width = img.width || 100;
    height = img.height || 100;
  }

  const scale = Math.min(1, maxDim / Math.max(width, height));
  canvas.width = Math.max(1, Math.floor(width * scale));
  canvas.height = Math.max(1, Math.floor(height * scale));

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Simple color quantization bucket (step of 16 in RGB space)
  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  let totalPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue; // ignore transparent pixels

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Quantize by rounding down to nearest multiple of 16
    const qr = Math.floor(r / 16) * 16;
    const qg = Math.floor(g / 16) * 16;
    const qb = Math.floor(b / 16) * 16;
    const key = `${qr},${qg},${qb}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.r += r;
      existing.g += g;
      existing.b += b;
      existing.count += 1;
    } else {
      buckets.set(key, { r, g, b, count: 1 });
    }
    totalPixels += 1;
  }

  const sorted = Array.from(buckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, maxColors);

  return sorted.map((item) => {
    const avgRgb: RGB = {
      r: Math.round(item.r / item.count),
      g: Math.round(item.g / item.count),
      b: Math.round(item.b / item.count),
    };
    return {
      hex: rgbToHex(avgRgb),
      rgb: avgRgb,
      hsl: rgbToHsl(avgRgb),
      count: item.count,
      percentage: totalPixels > 0 ? (item.count / totalPixels) * 100 : 0,
    };
  });
}

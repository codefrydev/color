import {
  HSL,
  clamp,
  mod,
  hslToHex,
  hexToHsl,
  hslToRgb,
  rgbToLab,
  formatColor,
} from '../color/conversions';
import { getContrast } from '../color/contrast';
import { deltaE76 } from '../color/deltaE';
import { HARMONIES } from './harmonies';
import { makeScale } from './scale';
import {
  StudioState,
  DerivedSystem,
  DerivedSystemMeta,
  ColorScale,
  ColorStop,
  ScaleKey,
  STOPS,
  SemanticValue,
  ContrastPick,
} from './types';

export const SEM_BASE: Record<string, number> = {
  success: 145,
  warning: 40,
  danger: 4,
  info: 208,
};

export const SEM_KEYS: ('success' | 'warning' | 'danger' | 'info')[] = [
  'success',
  'warning',
  'danger',
  'info',
];

export const getTemperature = (h: number): 'warm' | 'cool' =>
  h < 70 || h >= 320 ? 'warm' : 'cool';

export const getPsychology = (h: number): string => {
  if (h < 30 || h >= 345) return 'Energetic, passionate';
  if (h < 60) return 'Warm, friendly, optimistic';
  if (h < 120) return 'Fresh, natural, calming';
  if (h < 180) return 'Balanced, growth, professional';
  if (h < 240) return 'Trustworthy, calm, reliable';
  if (h < 300) return 'Creative, premium, innovative';
  return 'Playful, expressive';
};

/** Find the stop in a scale that satisfies minimum contrast requirement against a background */
export function pickStop(
  scale: ColorScale,
  candidates: ColorStop[],
  bg: HSL,
  minContrast: number
): ContrastPick {
  let best = candidates[0];
  let bestRatio = 0;
  for (const stop of candidates) {
    const ratio = getContrast(scale[stop], bg);
    if (ratio >= minContrast) {
      return { stop, ratio, ok: true };
    }
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = stop;
    }
  }
  return { stop: best, ratio: bestRatio, ok: false };
}

/** Unified derivation engine: StudioState + theme -> complete Design System */
export function deriveDesignSystem(
  st: StudioState,
  theme: 'light' | 'dark'
): DerivedSystem {
  const isDark = theme === 'dark';
  const base: HSL = { h: mod(st.h), s: st.s, l: st.l };
  const baseRgb = hslToRgb(base);
  const temp = getTemperature(base.h);

  // Saturation boost and temperature bias
  let ps = clamp(Math.max(base.s, 35) * st.satBoost, 15, 100);
  ps = clamp(ps + (temp === 'warm' ? 3 : -2), 15, 100);
  if (isDark) ps = Math.min(ps, 88);

  const harmonyDef = HARMONIES[st.harmony];
  const aH = mod(base.h + harmonyDef.a + st.accentShift);
  const sH = mod(base.h + harmonyDef.b + st.accentShift);
  const monoK = st.harmony === 'monochrome' ? 0.55 : 1;
  const nH = mod(base.h + st.neutralHue);
  const nS = st.neutralTint;

  // Build 50-950 scales
  const scales: Record<ScaleKey, ColorScale> = {
    p: makeScale(base.h, ps, false, st.scaleMode),
    a: makeScale(aH, ps * monoK, false, st.scaleMode),
    s: makeScale(sH, ps * 0.85 * monoK, false, st.scaleMode),
    n: makeScale(nH, nS, true, st.scaleMode),
    success: {} as ColorScale,
    warning: {} as ColorScale,
    danger: {} as ColorScale,
    info: {} as ColorScale,
  };

  const semHue: Record<string, number> = {};
  SEM_KEYS.forEach((k) => {
    // Brand pull: gently warp status hues towards primary brand hue
    const delta = ((base.h - SEM_BASE[k] + 540) % 360) - 180;
    semHue[k] = mod(SEM_BASE[k] + delta * (st.semPull / 100) * 0.25);
    scales[k] = makeScale(
      semHue[k],
      clamp(ps + (k === 'warning' ? 10 : 0), 55, 95),
      false,
      st.scaleMode
    );
  });

  // Apply custom scale overrides if present
  if (st.customScales) {
    (Object.keys(st.customScales) as ScaleKey[]).forEach((sc) => {
      const stops = st.customScales![sc];
      if (stops) {
        if (!scales[sc]) scales[sc] = {} as ColorScale;
        STOPS.forEach((stop) => {
          if (stops[stop]) {
            scales[sc][stop] = hexToHsl(stops[stop]);
          }
        });
      }
    });
  }

  // Assign semantic roles
  const N = scales.n;
  const P = scales.p;
  const picks: DerivedSystemMeta['picks'] = {};
  const sem: Record<string, SemanticValue> = {};
  const usage: Record<string, string[]> = {};

  const ref = (
    sc: ScaleKey,
    stop: ColorStop,
    auto = false
  ): SemanticValue => ({
    css: `var(--${sc}-${stop})`,
    c: scales[sc][stop],
    scale: sc,
    stop,
    auto,
  });

  const lit = (hex: string): SemanticValue => ({
    css: hex,
    c: { h: 0, s: 0, l: hex === '#ffffff' ? 100 : 0 },
    lit: true,
  });

  const put = (name: string, v: SemanticValue) => {
    sem[name] = v;
    if (v.scale && v.stop) {
      const key = `${v.scale}-${v.stop}`;
      usage[key] = usage[key] || [];
      usage[key].push(name);
    }
  };

  const white: HSL = { h: 0, s: 0, l: 100 };
  const surface = isDark ? N[900] : white;

  put('--bg-app', ref('n', isDark ? 950 : 50));
  put('--bg-surface', isDark ? ref('n', 900) : lit('#ffffff'));
  put('--bg-surface-hover', ref('n', isDark ? 800 : 100));
  put('--bg-surface-active', ref('n', isDark ? 700 : 200));
  put('--border-subtle', ref('n', isDark ? 800 : 200));
  put('--border-default', ref('n', isDark ? 700 : 300));

  const fc = pickStop(
    P,
    isDark ? [400, 300, 200] : [500, 600, 700, 800],
    surface,
    3
  );
  put('--border-focus', ref('p', fc.stop, true));

  // Text colors auto-picked for contrast
  const tp = pickStop(N, isDark ? [50, 100] : [900, 950], surface, st.contrast);
  const ts = pickStop(
    N,
    isDark ? [300, 200, 100, 50] : [600, 700, 800, 900],
    surface,
    st.contrast
  );
  const tm = pickStop(
    N,
    isDark ? [400, 300, 200, 100] : [500, 600, 700, 800],
    surface,
    4.5
  );

  put('--text-primary', ref('n', tp.stop, true));
  put('--text-secondary', ref('n', ts.stop, true));
  put('--text-muted', ref('n', tm.stop, true));

  const bs = pickStop(
    N,
    isDark ? [600, 500, 400, 300] : [400, 500, 600, 700],
    surface,
    3
  );
  put('--border-strong', ref('n', bs.stop, true));

  const lk = pickStop(P, isDark ? [300, 200, 100] : [700, 800, 900], surface, 4.5);
  put('--text-inverse', isDark ? ref('n', 950) : lit('#ffffff'));
  picks.textSecondary = ts;
  picks.textMuted = tm;

  // Primary buttons
  let btn: ContrastPick;
  let btnText: SemanticValue;
  if (!isDark) {
    btn = pickStop(P, [500, 600, 700, 800, 900], white, st.contrast);
    btnText = lit('#ffffff');
    const hoverStop =
      STOPS[Math.min(STOPS.indexOf(btn.stop) + 1, STOPS.length - 1)];
    put('--btn-primary-bg', ref('p', btn.stop, true));
    put('--btn-primary-hover', ref('p', hoverStop));
  } else {
    btn = pickStop(P, [500, 400, 300, 200], N[950], st.contrast);
    btnText = ref('n', 950);
    const hoverStop = STOPS[Math.max(STOPS.indexOf(btn.stop) - 1, 0)];
    put('--btn-primary-bg', ref('p', btn.stop, true));
    put('--btn-primary-hover', ref('p', hoverStop));
  }
  put('--btn-primary-text', btnText);
  picks.btn = btn;
  picks.btnText = btnText;

  put('--btn-secondary-bg', isDark ? ref('n', 800) : lit('#ffffff'));
  put('--btn-secondary-border', ref('n', isDark ? 700 : 300));
  put('--btn-secondary-text', ref('n', tp.stop));
  put('--btn-ghost-text', ref('p', lk.stop, true));

  sem['--btn-ghost-hover'] = {
    css: `color-mix(in srgb, var(--p-500) ${isDark ? 14 : 10}%, transparent)`,
    c: P[500],
    derived: true,
  };

  put('--link', ref('p', lk.stop, true));
  put('--nav-text', ref('n', isDark ? 300 : 600));
  sem['--nav-hover'] = {
    css: `color-mix(in srgb, var(--p-500) ${isDark ? 12 : 8}%, transparent)`,
    c: P[500],
    derived: true,
  };
  put('--nav-active-bg', ref('p', isDark ? 900 : 100));
  put('--nav-active-text', ref('p', isDark ? 200 : 800));

  put('--accent-bg', ref('a', isDark ? 500 : 600, true));
  const accBg = scales.a[isDark ? 500 : 600];
  const accTxt = isDark ? N[950] : white;
  if (getContrast(accBg, accTxt) < 4.5) {
    const alt = pickStop(
      scales.a,
      isDark ? [500, 400, 300] : [600, 700, 800],
      accTxt,
      4.5
    );
    put('--accent-bg', ref('a', alt.stop, true));
  }
  put('--accent-text', isDark ? ref('n', 950) : lit('#ffffff'));
  put('--accent-soft-bg', ref('p', isDark ? 900 : 100));
  put('--accent-soft-text', ref('p', isDark ? 200 : 800));

  // Semantic status roles
  SEM_KEYS.forEach((k) => {
    const bg = ref(k, isDark ? 900 : 100);
    const t = pickStop(
      scales[k],
      isDark ? [200, 100, 300] : [800, 700, 900],
      scales[k][isDark ? 900 : 100],
      st.contrast
    );
    put(`--${k}-bg`, bg);
    put(`--${k}-text`, ref(k, t.stop, true));
    put(`--${k}-border`, ref(k, isDark ? 700 : 300));
    picks[k] = t;
  });

  // Design Tokens (Radius, Spacing, Typography, Shadows)
  const energy = ps / 100;
  const bright = base.l / 100;
  const roundness = (temp === 'warm' ? 1.2 : 0.85) * (0.9 + energy * 0.2);
  const spaceF = 1 + energy * 0.25;
  const typeF = (0.95 + bright * 0.1) * st.type;
  const soft = temp === 'warm' ? 1.25 : 0.8;
  const shA = (isDark ? 0.55 : 0.14) * st.shadow;
  const shC = `hsl(${Math.round(base.h)} 40% ${isDark ? 2 : 14}%`;

  const R = (v: number) => Math.max(0, Math.round(v * roundness * st.radius));
  const tokens: Record<string, string> = {};

  const radiiMap: Record<string, number> = {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
  };
  Object.entries(radiiMap).forEach(([k, v]) => {
    tokens[`--radius-${k}`] = `${R(v)}px`;
  });
  tokens['--radius-full'] = '9999px';

  [1, 2, 3, 4, 6, 8, 12, 16].forEach((n) => {
    tokens[`--space-${n}`] = `${Math.round(n * 4 * spaceF * st.spacing)}px`;
  });

  const fontSizes: Record<string, number> = {
    xs: 0.75,
    sm: 0.875,
    base: 1,
    lg: 1.125,
    xl: 1.25,
    '2xl': 1.5,
    '3xl': 1.875,
    '4xl': 2.25,
  };
  Object.entries(fontSizes).forEach(([k, v]) => {
    tokens[`--text-${k}`] = `${(v * typeF).toFixed(3)}rem`;
  });

  const off = temp === 'warm' ? 0.08 : -0.04;
  tokens['--leading-tight'] = (st.leading * 0.83).toFixed(2);
  tokens['--leading-normal'] = (st.leading + off).toFixed(2);
  tokens['--leading-relaxed'] = (st.leading + 0.3 + off).toFixed(2);

  tokens['--tracking-tight'] = `${(-0.2 - energy * 0.3).toFixed(2)}px`;
  tokens['--tracking-normal'] = '0px';
  tokens['--tracking-wide'] = `${(0.3 + energy * 0.4).toFixed(2)}px`;

  const sh = (y: number, b: number, a: number) =>
    `0 ${(y * soft).toFixed(1)}px ${(b * soft).toFixed(1)}px ${shC} / ${Math.min(
      a * shA,
      1
    ).toFixed(3)})`;

  tokens['--shadow-xs'] = sh(1, 2, 0.6);
  tokens['--shadow-sm'] = `${sh(1, 3, 0.8)}, ${sh(1, 2, 0.5)}`;
  tokens['--shadow-md'] = `${sh(4, 8, 0.9)}, ${sh(2, 4, 0.5)}`;
  tokens['--shadow-lg'] = `${sh(10, 20, 1)}, ${sh(4, 8, 0.5)}`;
  tokens['--shadow-xl'] = `${sh(20, 32, 1.2)}, ${sh(8, 12, 0.6)}`;

  // Assemble CSS variables dictionary
  const vars: Record<string, string> = {};
  (Object.keys(scales) as ScaleKey[]).forEach((sc) => {
    STOPS.forEach((stop) => {
      if (st.customScales && st.customScales[sc] && st.customScales[sc]![stop]) {
        vars[`--${sc}-${stop}`] = st.customScales[sc]![stop];
      } else {
        vars[`--${sc}-${stop}`] = `hsl(${scales[sc][stop].h.toFixed(1)} ${scales[sc][stop].s.toFixed(1)}% ${scales[sc][stop].l.toFixed(1)}%)`;
      }
    });
  });

  Object.entries(sem).forEach(([k, v]) => {
    vars[k] = v.css;
  });
  Object.assign(vars, tokens);

  const meta: DerivedSystemMeta = {
    hex: st.customScales?.p?.[500] || hslToHex(base),
    rgb: baseRgb,
    base,
    lab: rgbToLab(baseRgb),
    temp,
    psych: getPsychology(base.h),
    energy,
    bright,
    ps,
    aH,
    sH,
    nH,
    nS,
    semHue,
    roundness,
    spaceF,
    typeF,
    soft,
    shA,
    deltaPA: deltaE76(hslToRgb(scales.p[500]), hslToRgb(scales.a[500])),
    picks,
    usage,
  };

  return {
    theme,
    scales,
    sem,
    tokens,
    vars,
    meta,
  };
}

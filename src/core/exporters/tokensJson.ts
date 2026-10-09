import { hslToHex } from '../color/conversions';
import { StudioState, STOPS, ScaleKey } from '../engine/types';
import { deriveDesignSystem, SEM_KEYS } from '../engine/derivation';

export function exportTokensJson(st: StudioState): string {
  const L = deriveDesignSystem(st, 'light');
  const D = deriveDesignSystem(st, 'dark');

  const scaleKeys: ScaleKey[] = ['p', 'a', 's', 'n', ...SEM_KEYS];
  const scaleMap: Record<string, string> = {
    p: 'primary',
    a: 'accent',
    s: 'secondary',
    n: 'neutral',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info',
  };

  const colorTokens: Record<string, any> = {};

  scaleKeys.forEach((k) => {
    const name = scaleMap[k];
    colorTokens[name] = {};
    STOPS.forEach((stop) => {
      colorTokens[name][stop] = {
        $value: st.customScales?.[k]?.[stop] || hslToHex(L.scales[k][stop]),
        $type: 'color',
      };
    });
  });

  const semanticLight: Record<string, any> = {};
  Object.entries(L.sem).forEach(([k, v]) => {
    semanticLight[k.replace('--', '')] = {
      $value: hslToHex(v.c),
      $type: 'color',
    };
  });

  const semanticDark: Record<string, any> = {};
  Object.entries(D.sem).forEach(([k, v]) => {
    semanticDark[k.replace('--', '')] = {
      $value: hslToHex(v.c),
      $type: 'color',
    };
  });

  const tokens = {
    color: colorTokens,
    semantic: {
      light: semanticLight,
      dark: semanticDark,
    },
    meta: {
      baseHue: st.h,
      baseSaturation: st.s,
      baseLightness: st.l,
      harmony: st.harmony,
      contrastTarget: st.contrast,
    },
  };

  return JSON.stringify(tokens, null, 2);
}

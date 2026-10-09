import { HSL, RGB, LAB } from '../color/conversions';
import { HarmonyMode } from './harmonies';

export type ColorStop = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export const STOPS: ColorStop[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export type ColorScale = Record<ColorStop, HSL>;

export type ScaleKey = 'p' | 'a' | 's' | 'n' | 'success' | 'warning' | 'danger' | 'info';

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

export type ScaleMode = 'oklch' | 'hsl';

export interface StudioLocks {
  primary: boolean;
  accent: boolean;
  neutral: boolean;
  semantic: boolean;
  tokens: boolean;
}

export interface StudioState {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 15 - 85
  theme: 'light' | 'dark';
  harmony: HarmonyMode;
  format: ColorFormat;
  contrast: number; // 3.0, 4.5, 7.0
  scaleMode: ScaleMode; // 'oklch' (perceptual) or 'hsl'

  // Fine tuning
  satBoost: number; // 0.6 - 1.4
  accentShift: number; // -60 - 60
  neutralTint: number; // 0 - 30%
  neutralHue: number; // -90 - 90
  semPull: number; // 0 - 100%

  // Token multipliers
  radius: number; // 0.3 - 2.2
  spacing: number; // 0.7 - 1.6
  shadow: number; // 0 - 2.5
  type: number; // 0.85 - 1.3
  leading: number; // 1.2 - 1.9

  locks: StudioLocks;
}

export interface SemanticValue {
  css: string;
  c: HSL;
  scale?: ScaleKey;
  stop?: ColorStop;
  auto?: boolean;
  derived?: boolean;
  lit?: boolean;
}

export interface ContrastPick {
  stop: ColorStop;
  ratio: number;
  ok: boolean;
}

export interface DerivedSystemMeta {
  hex: string;
  rgb: RGB;
  base: HSL;
  lab: LAB;
  temp: 'warm' | 'cool';
  psych: string;
  energy: number;
  bright: number;
  ps: number;
  aH: number;
  sH: number;
  nH: number;
  nS: number;
  semHue: Record<string, number>;
  roundness: number;
  spaceF: number;
  typeF: number;
  soft: number;
  shA: number;
  deltaPA: number;
  picks: {
    btn?: ContrastPick;
    btnText?: SemanticValue;
    textSecondary?: ContrastPick;
    textMuted?: ContrastPick;
    [key: string]: any;
  };
  usage: Record<string, string[]>;
}

export interface DerivedSystem {
  theme: 'light' | 'dark';
  scales: Record<ScaleKey, ColorScale>;
  sem: Record<string, SemanticValue>;
  tokens: Record<string, string>;
  vars: Record<string, string>;
  meta: DerivedSystemMeta;
}

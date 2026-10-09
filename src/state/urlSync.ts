import { StudioState } from '../core/engine/types';

export function encodeStateToHash(state: StudioState): string {
  try {
    const json = JSON.stringify(state);
    if (typeof window !== 'undefined') {
      return btoa(unescape(encodeURIComponent(json)));
    }
    return Buffer.from(json).toString('base64');
  } catch (e) {
    return '';
  }
}

export function decodeStateFromHash(hash: string): Partial<StudioState> | null {
  try {
    const clean = hash.replace(/^#/, '').trim();
    if (!clean || clean.startsWith('sec-')) return null;

    let json = '';
    if (typeof window !== 'undefined') {
      json = decodeURIComponent(escape(atob(clean)));
    } else {
      json = Buffer.from(clean, 'base64').toString('utf-8');
    }

    const parsed = JSON.parse(json);
    if (typeof parsed.h === 'number') {
      return parsed;
    }
  } catch (e) {
    // invalid hash
  }
  return null;
}

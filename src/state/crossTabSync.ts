import { StudioState } from '../core/engine/types';

export const CHANNEL_NAME = 'color_studio_sync';
export const STORAGE_KEY = 'color_live_state_v3';

let channel: BroadcastChannel | null = null;

export function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null;
  if (!('BroadcastChannel' in window)) return null;
  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }
  }
  return channel;
}

export function broadcastStudioState(state: StudioState): void {
  if (typeof window === 'undefined') return;

  // 1. BroadcastChannel for active tabs
  const ch = getBroadcastChannel();
  if (ch) {
    try {
      ch.postMessage({ type: 'STATE_UPDATE', payload: state });
    } catch (e) {
      console.warn('Failed to broadcast state', e);
    }
  }

  // 2. localStorage for cross-tab storage event & cold tab starts
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore quota errors
  }
}

export function readPersistedStudioState(): StudioState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as StudioState;
    }
  } catch (e) {
    console.warn('Failed to read persisted state', e);
  }
  return null;
}

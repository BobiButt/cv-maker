// src/lib/share.ts
import LZString from 'lz-string';
import type { CV } from '../types/cv';

export function encodeCVToURL(cv: CV): string {
  const json = JSON.stringify(cv);
  const compressed = LZString.compressToEncodedURIComponent(json);
  const base = `${window.location.origin}/editor#cv=${compressed}`;
  return base;
}

export function decodeCVFromURL(): CV | null {
  const hash = window.location.hash;
  if (!hash.startsWith('#cv=')) return null;
  const compressed = hash.slice(4);
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json) as CV;
  } catch {
    return null;
  }
}

export function clearShareHash() {
  if (window.location.hash.startsWith('#cv=')) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}
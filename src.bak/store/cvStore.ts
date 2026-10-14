// src/store/cvStore.ts
import { create } from 'zustand';
import type {
  CV,
  CVSection,
  SectionType,
  CVTheme,
  CVSettings,
  Personal,
  CVItem,
} from '../types/cv';
import { createEmptyCV, createSection, uid } from '../lib/cvFactory';
import { saveCV } from '../lib/db';

const STORAGE_KEY = 'cv-maker:current';

interface CVState {
  cv: CV;
  past: CV[];
  future: CV[];

  setTitle: (title: string) => void;
  loadCV: (cv: CV) => void;
  resetCV: (title?: string) => void;

  updatePersonal: (patch: Partial<Personal>) => void;
  updateTheme: (patch: Partial<CVTheme>) => void;
  updateSettings: (patch: Partial<CVSettings>) => void;

  addSection: (type: SectionType) => void;
  removeSection: (sectionId: string) => void;
  renameSection: (sectionId: string, title: string) => void;
  toggleSection: (sectionId: string) => void;
  reorderSections: (from: number, to: number) => void;

  addItem: (sectionId: string, item?: Partial<CVItem>) => void;
  updateItem: (sectionId: string, itemId: string, patch: Partial<CVItem>) => void;
  removeItem: (sectionId: string, itemId: string) => void;
  reorderItems: (sectionId: string, from: number, to: number) => void;

  undo: () => void;
  redo: () => void;
}

const defaultItemFor = (type: SectionType): CVItem => {
  switch (type) {
    case 'summary': return { id: uid(), text: '' };
    case 'experience':
      return { id: uid(), role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' };
    case 'education':
      return { id: uid(), degree: '', school: '', location: '', startDate: '', endDate: '', current: false, description: '' };
    case 'skills': return { id: uid(), name: '' };
    case 'projects':
      return { id: uid(), name: '', role: '', link: '', startDate: '', endDate: '', description: '' };
    case 'languages': return { id: uid(), name: '', proficiency: '' };
    case 'certifications': return { id: uid(), name: '', issuer: '', date: '', link: '' };
    case 'awards': return { id: uid(), title: '', issuer: '', date: '', description: '' };
    case 'volunteering':
      return { id: uid(), role: '', org: '', startDate: '', endDate: '', current: false, description: '' };
    case 'custom':
    default:
      return { id: uid(), title: '', subtitle: '', date: '', description: '' };
  }
};

const loadFromStorage = (): CV => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyCV();
    return JSON.parse(raw) as CV;
  } catch {
    return createEmptyCV();
  }
};

const saveToStorage = (cv: CV) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
  } catch {}
  // Async mirror to IndexedDB (fire and forget)
  saveCV(cv).catch(() => {});
};

const HISTORY_LIMIT = 50;

export const useCVStore = create<CVState>((set, get) => {
  const commit = (updater: (cv: CV) => CV) => {
    const { cv, past } = get();
    const next = { ...updater(cv) };
    next.meta = { ...next.meta, updatedAt: new Date().toISOString() };
    const newPast = [...past, cv].slice(-HISTORY_LIMIT);
    saveToStorage(next);
    set({ cv: next, past: newPast, future: [] });
  };

  return {
    cv: loadFromStorage(),
    past: [],
    future: [],

    setTitle: (title) => commit((cv) => ({ ...cv, meta: { ...cv.meta, title } })),

    loadCV: (cv) => {
      saveToStorage(cv);
      set({ cv, past: [], future: [] });
    },

    resetCV: (title) => {
      const cv = createEmptyCV(title);
      saveToStorage(cv);
      set({ cv, past: [], future: [] });
    },

    updatePersonal: (patch) => commit((cv) => ({ ...cv, personal: { ...cv.personal, ...patch } })),
    updateTheme: (patch) => commit((cv) => ({ ...cv, theme: { ...cv.theme, ...patch } })),
    updateSettings: (patch) => commit((cv) => ({ ...cv, settings: { ...cv.settings, ...patch } })),

    addSection: (type) => commit((cv) => ({ ...cv, sections: [...cv.sections, createSection(type)] })),
    removeSection: (sectionId) =>
      commit((cv) => ({ ...cv, sections: cv.sections.filter((s) => s.id !== sectionId) })),
    renameSection: (sectionId, title) =>
      commit((cv) => ({
        ...cv,
        sections: cv.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
      })),
    toggleSection: (sectionId) =>
      commit((cv) => ({
        ...cv,
        sections: cv.sections.map((s) => (s.id === sectionId ? { ...s, visible: !s.visible } : s)),
      })),
    reorderSections: (from, to) =>
      commit((cv) => {
        const arr = [...cv.sections];
        const [moved] = arr.splice(from, 1);
        arr.splice(to, 0, moved);
        return { ...cv, sections: arr };
      }),

    addItem: (sectionId, item) =>
      commit((cv) => ({
        ...cv,
        sections: cv.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const base = defaultItemFor(s.type);
          const merged = { ...base, ...item, id: uid() } as CVItem;
          return { ...s, items: [...s.items, merged] };
        }),
      })),

    updateItem: (sectionId, itemId, patch) =>
      commit((cv) => ({
        ...cv,
        sections: cv.sections.map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.map((it) => (it.id === itemId ? ({ ...it, ...patch } as CVItem) : it)) }
            : s
        ),
      })),

    removeItem: (sectionId, itemId) =>
      commit((cv) => ({
        ...cv,
        sections: cv.sections.map((s) =>
          s.id === sectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s
        ),
      })),

    reorderItems: (sectionId, from, to) =>
      commit((cv) => ({
        ...cv,
        sections: cv.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const arr = [...s.items];
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          return { ...s, items: arr };
        }),
      })),

    undo: () => {
      const { past, cv, future } = get();
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      saveToStorage(previous);
      set({ cv: previous, past: past.slice(0, -1), future: [cv, ...future].slice(0, HISTORY_LIMIT) });
    },

    redo: () => {
      const { past, cv, future } = get();
      if (future.length === 0) return;
      const next = future[0];
      saveToStorage(next);
      set({ cv: next, past: [...past, cv].slice(-HISTORY_LIMIT), future: future.slice(1) });
    },
  };
});
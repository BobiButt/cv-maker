// src/lib/db.ts
import Dexie, { type Table } from 'dexie';
import type { CV } from '../types/cv';

export interface CVRecord {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  data: CV; // full CV object
}

class CVDatabase extends Dexie {
  cvs!: Table<CVRecord, string>;

  constructor() {
    super('cv-maker');
    this.version(1).stores({
      cvs: 'id, updatedAt, createdAt, title',
    });
  }
}

export const db = new CVDatabase();

export async function saveCV(cv: CV) {
  await db.cvs.put({
    id: cv.meta.id,
    title: cv.meta.title,
    createdAt: cv.meta.createdAt,
    updatedAt: cv.meta.updatedAt,
    data: cv,
  });
}

export async function getCV(id: string): Promise<CV | undefined> {
  const rec = await db.cvs.get(id);
  return rec?.data;
}

export async function deleteCV(id: string) {
  await db.cvs.delete(id);
}

export async function duplicateCV(id: string): Promise<CV | undefined> {
  const rec = await db.cvs.get(id);
  if (!rec) return undefined;
  const copy = structuredClone(rec.data);
  const newId = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  copy.meta = {
    ...copy.meta,
    id: newId,
    title: `${copy.meta.title} (copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveCV(copy);
  return copy;
}

export async function listCVs(): Promise<CVRecord[]> {
  return db.cvs.orderBy('updatedAt').reverse().toArray();
}
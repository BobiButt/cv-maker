// src/templates/index.ts
import type { ComponentType } from 'react';
import type { CV } from '../types/cv';
import Classic from './Classic';
import Modern from './Modern';
import Minimal from './Minimal';
import TwoColumn from './TwoColumn';
import AtsPlain from './AtsPlain';

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  component: ComponentType<{ cv: CV }>;
}

export const TEMPLATES: TemplateMeta[] = [
  { id: 'classic', name: 'Classic', description: 'Centered header, uppercase sections', component: Classic },
  { id: 'modern', name: 'Modern', description: 'Left accent bar, strong header', component: Modern },
  { id: 'minimal', name: 'Minimal', description: 'Quiet, typography-first', component: Minimal },
  { id: 'two-column', name: 'Two Column', description: 'Main + sidebar (skills, languages)', component: TwoColumn },
  { id: 'ats', name: 'ATS Plain', description: 'Black & white, ATS-friendly', component: AtsPlain },
];

export function getTemplate(id: string): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
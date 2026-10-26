// src/templates/index.ts
import type { ComponentType } from 'react';
import type { CV } from '../types/cv';
import Classic from './Classic';
import Modern from './Modern';
import Minimal from './Minimal';
import TwoColumn from './TwoColumn';
import AtsPlain from './AtsPlain';
import Elegant from './Elegant';
import Executive from './Executive';
import Creative from './Creative';
import Academic from './Academic';
import Tech from './Tech';

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
  { id: 'elegant', name: 'Elegant', description: 'Centered header with accent rules', component: Elegant },
  { id: 'executive', name: 'Executive', description: 'Two-column with sidebar for skills & links', component: Executive },
  { id: 'creative', name: 'Creative', description: 'Vibrant header with skill progress bars', component: Creative },
  { id: 'academic', name: 'Academic', description: 'Formal serif layout for academia', component: Academic },
  { id: 'tech', name: 'Tech', description: 'Developer-focused with technology stack bars', component: Tech },
];

export function getTemplate(id: string): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

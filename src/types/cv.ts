// src/types/cv.ts

export const SCHEMA_VERSION = 1;

export type SectionType =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'languages'
  | 'certifications'
  | 'awards'
  | 'volunteering'
  | 'custom';

export interface CVLink {
  id: string;
  label: string;
  url: string;
}

export interface Personal {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photo?: string;
  links: CVLink[];
}

export interface SummaryItem {
  id: string;
  text: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level?: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface VolunteeringItem {
  id: string;
  role: string;
  org: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export type CVItem =
  | SummaryItem
  | ExperienceItem
  | EducationItem
  | SkillItem
  | ProjectItem
  | LanguageItem
  | CertificationItem
  | AwardItem
  | VolunteeringItem
  | CustomItem;

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  items: CVItem[];
}

export interface CVTheme {
  template: string;
  accent: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  spacing: number;
}

export interface CVSettings {
  pageSize: 'A4' | 'Letter';
  rtl: boolean;
  atsMode: boolean;
  showPhoto: boolean;
  printMargin: number;
}

export interface CVMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface CV {
  meta: CVMeta;
  personal: Personal;
  sections: CVSection[];
  theme: CVTheme;
  settings: CVSettings;
}
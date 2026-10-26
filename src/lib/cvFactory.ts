// src/lib/cvFactory.ts
import type { CV, CVSection, SectionType } from '../types/cv';
import { SCHEMA_VERSION } from '../types/cv';

export const uid = (): string =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const sectionTitles: Record<SectionType, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  languages: 'Languages',
  certifications: 'Certifications',
  awards: 'Awards',
  volunteering: 'Volunteering',
  custom: 'Custom Section',
};

export const createSection = (type: SectionType): CVSection => ({
  id: uid(),
  type,
  title: sectionTitles[type],
  visible: true,
  items: [],
});

export const createEmptyCV = (title = 'Untitled CV'): CV => ({
  meta: {
    id: uid(),
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schemaVersion: SCHEMA_VERSION,
  },
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    links: [],
  },
  sections: [
    createSection('summary'),
    createSection('experience'),
    createSection('education'),
    createSection('skills'),
  ],
  theme: {
    template: 'classic',
    accent: '#2563eb',
    textColor: '#111827',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 1.5,
    spacing: 1,
  },
  settings: {
    pageSize: 'A4',
    rtl: false,
    atsMode: false,
    showPhoto: true,
    printMargin: 4,
    printFit: 'one-page',
  },
});

export const createSampleCV = (): CV => {
  const cv = createEmptyCV('Sample CV');
  cv.personal = {
    fullName: 'Alex Morgan',
    jobTitle: 'Frontend Engineer',
    email: 'alex@example.com',
    phone: '+1 555 123 4567',
    location: 'Berlin, Germany',
    website: 'alexmorgan.dev',
    links: [
      { id: uid(), label: 'GitHub', url: 'https://github.com/alex' },
      { id: uid(), label: 'LinkedIn', url: 'https://linkedin.com/in/alex' },
    ],
  };
  cv.sections = [
    {
      ...createSection('summary'),
      items: [
        {
          id: uid(),
          text: 'Frontend engineer with 5+ years building performant, accessible web apps in React and TypeScript.',
        },
      ],
    },
    {
      ...createSection('experience'),
      items: [
        {
          id: uid(),
          role: 'Senior Frontend Engineer',
          company: 'Acme Corp',
          location: 'Berlin',
          startDate: '2022-01',
          endDate: '',
          current: true,
          description:
            '• Led migration to React 18 + Vite, cutting build times by 60%\n• Built design system used by 8 product teams',
        },
        {
          id: uid(),
          role: 'Frontend Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          startDate: '2019-06',
          endDate: '2021-12',
          current: false,
          description:
            '• Shipped core dashboard used by 40k users\n• Introduced TypeScript and testing culture',
        },
      ],
    },
    {
      ...createSection('education'),
      items: [
        {
          id: uid(),
          degree: 'BSc Computer Science',
          school: 'Technical University',
          location: 'Munich',
          startDate: '2015-09',
          endDate: '2019-05',
          current: false,
        },
      ],
    },
    {
      ...createSection('skills'),
      items: [
        { id: uid(), name: 'React' },
        { id: uid(), name: 'TypeScript' },
        { id: uid(), name: 'Node.js' },
        { id: uid(), name: 'Tailwind CSS' },
      ],
    },
  ];
  return cv;
};
import type { CV } from '../types/cv';
import {
  ContactLine,
  PhotoCircle,
  SectionHeading,
  getVisibleSections,
  renderItemBody,
  SkillChips,
} from './shared';

export default function Clean({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);

  return (
    <div style={{ background: '#fff' }}>
      <header style={{ marginBottom: 26, paddingBottom: 14, borderBottom: `1px solid ${theme.accent}` }}>
        {cv.settings.showPhoto && personal.photo && (
          <div style={{ marginBottom: 10, display: 'inline-block' }}>
            <div style={{ border: '1px solid #e2e8f0', display: 'inline-block' }}>
              <PhotoCircle cv={cv} size={70} />
            </div>
          </div>
        )}
        <h1 style={{ fontSize: '2em', fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1.1em', color: theme.accent, marginBottom: 8, fontWeight: 500 }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ fontSize: '0.9em', color: '#475569' }}>
          <ContactLine cv={cv} />
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} style={{ marginBottom: theme.spacing * 24 }}>
          <SectionHeading title={s.title} accent={theme.accent} variant="normal" />
          {s.type === 'skills' ? (
            <SkillChips items={s.items} />
          ) : (
            s.items.map((it) => (
              <div key={it.id} style={{ marginBottom: 12 }}>
                {renderItemBody(s, it, theme.accent)}
              </div>
            ))
          )}
        </section>
      ))}
    </div>
  );
}

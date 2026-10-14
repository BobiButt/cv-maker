import type { CV } from '../types/cv';
import {
  ContactLine,
  SectionHeading,
  getVisibleSections,
  renderItemBody,
  SkillChips,
} from './shared';

export default function Classic({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);

  return (
    <>
      <header
        style={{
          borderBottom: `2px solid ${theme.accent}`,
          paddingBottom: 12,
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.9em', fontWeight: 700, color: theme.accent, margin: 0 }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1.05em', color: '#555', marginTop: 2 }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ marginTop: 6, fontSize: '0.9em', color: '#666' }}>
          <ContactLine cv={cv} />
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} style={{ marginBottom: theme.spacing * 16 }}>
          <SectionHeading title={s.title} accent={theme.accent} />
          {s.type === 'skills' ? (
            <SkillChips items={s.items} accent={theme.accent} />
          ) : (
            s.items.map((it) => (
              <div key={it.id} style={{ marginBottom: 8 }}>
                {renderItemBody(s, it, theme.accent)}
              </div>
            ))
          )}
        </section>
      ))}
    </>
  );
}
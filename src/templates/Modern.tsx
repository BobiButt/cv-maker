import type { CV } from '../types/cv';
import {
  ContactLine,
  SectionHeading,
  getVisibleSections,
  renderItemBody,
  SkillChips,
} from './shared';

export default function Modern({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);

  return (
    <>
      <header
        style={{
          borderLeft: `6px solid ${theme.accent}`,
          paddingLeft: 16,
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: '2em', fontWeight: 800, margin: 0 }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1.1em', color: theme.accent, fontWeight: 600 }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ marginTop: 6, fontSize: '0.9em', color: '#555' }}>
          <ContactLine cv={cv} />
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} style={{ marginBottom: theme.spacing * 16 }}>
          <SectionHeading title={s.title} accent={theme.accent} />
          {s.type === 'skills' ? (
            <SkillChips items={s.items} />
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
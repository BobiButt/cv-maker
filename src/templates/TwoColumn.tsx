import type { CV } from '../types/cv';
import {
  ContactLine,
  SectionHeading,
  getVisibleSections,
  renderItemBody,
  SkillChips,
} from './shared';

const SIDEBAR_TYPES = new Set(['skills', 'languages', 'certifications']);

export default function TwoColumn({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const visible = getVisibleSections(cv);
  const main = visible.filter((s) => !SIDEBAR_TYPES.has(s.type));
  const side = visible.filter((s) => SIDEBAR_TYPES.has(s.type));

  return (
    <>
      <header
        style={{
          borderBottom: `2px solid ${theme.accent}`,
          paddingBottom: 12,
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: '1.9em', fontWeight: 700, color: theme.accent, margin: 0 }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1em', color: '#555' }}>{personal.jobTitle}</div>
        )}
        <div style={{ marginTop: 6, fontSize: '0.9em', color: '#666' }}>
          <ContactLine cv={cv} />
        </div>
      </header>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: '0 0 62%' }}>
          {main.map((s) => (
            <section key={s.id} style={{ marginBottom: theme.spacing * 16 }}>
              <SectionHeading title={s.title} accent={theme.accent} />
              {s.items.map((it) => (
                <div key={it.id} style={{ marginBottom: 8 }}>
                  {renderItemBody(s, it, theme.accent)}
                </div>
              ))}
            </section>
          ))}
        </div>
        <div style={{ flex: 1, borderLeft: '1px solid #e2e8f0', paddingLeft: 16 }}>
          {side.map((s) => (
            <section key={s.id} style={{ marginBottom: theme.spacing * 14 }}>
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
        </div>
      </div>
    </>
  );
}
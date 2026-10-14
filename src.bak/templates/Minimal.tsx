import type { CV } from '../types/cv';
import {
  ContactLine,
  getVisibleSections,
  renderItemBody,
  SkillChips,
} from './shared';

export default function Minimal({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);

  return (
    <>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.8em', fontWeight: 600, margin: 0 }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1em', color: '#666' }}>{personal.jobTitle}</div>
        )}
        <div style={{ marginTop: 4, fontSize: '0.85em', color: '#888' }}>
          <ContactLine cv={cv} />
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} style={{ marginBottom: theme.spacing * 14 }}>
          <h2
            style={{
              fontSize: '0.85em',
              fontWeight: 600,
              color: '#888',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {s.title}
          </h2>
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
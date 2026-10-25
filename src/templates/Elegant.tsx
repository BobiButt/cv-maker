import type { CV } from '../types/cv';
import {
  ContactLine,
  PhotoCircle,
  getVisibleSections,
  renderItemBody,
  SkillChips,
} from './shared';

export default function Elegant({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);

  return (
    <>
      <header
        style={{
          textAlign: 'center',
          paddingBottom: 14,
          borderBottom: `1px solid ${theme.accent}`,
          marginBottom: 18,
        }}
      >
        {cv.settings.showPhoto && personal.photo && (
          <div style={{ marginBottom: 10, display: 'inline-block' }}>
            <PhotoCircle cv={cv} size={90} />
          </div>
        )}
        <h1 style={{ fontSize: '2.2em', fontWeight: 700, color: theme.accent, margin: 0, letterSpacing: '0.03em' }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1.15em', color: '#444', marginTop: 6, fontWeight: 500 }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ marginTop: 8, fontSize: '0.9em', color: '#666' }}>
          <ContactLine cv={cv} />
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} style={{ marginBottom: theme.spacing * 18 }}>
          <h2
            style={{
              fontSize: '1.1em',
              fontWeight: 700,
              color: theme.accent,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderBottom: `1px solid ${theme.accent}`,
              paddingBottom: 4,
              marginBottom: 10,
              display: 'inline-block',
            }}
          >
            {s.title}
          </h2>
          {s.type === 'skills' ? (
            <SkillChips items={s.items} />
          ) : (
            s.items.map((it) => (
              <div key={it.id} style={{ marginBottom: 10 }}>
                {renderItemBody(s, it, theme.accent)}
              </div>
            ))
          )}
        </section>
      ))}
    </>
  );
}

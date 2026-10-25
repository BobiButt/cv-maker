import type { CV } from '../types/cv';
import {
  ContactLine,
  PhotoCircle,
  getVisibleSections,
  renderItemBody,
  SkillChips,
} from './shared';

const SIDEBAR_TYPES = new Set(['skills', 'languages', 'certifications']);

export default function Executive({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const visible = getVisibleSections(cv);
  const main = visible.filter((s) => !SIDEBAR_TYPES.has(s.type));
  const side = visible.filter((s) => SIDEBAR_TYPES.has(s.type));

  return (
    <>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: '0 0 62%' }}>
          {cv.settings.showPhoto && personal.photo && (
            <div style={{ marginBottom: 14, textAlign: 'center' }}>
              <PhotoCircle cv={cv} size={80} />
            </div>
          )}
          <h1 style={{ fontSize: '2em', fontWeight: 800, color: theme.accent, margin: '0 0 4px 0' }}>
            {personal.fullName || 'Your Name'}
          </h1>
          {personal.jobTitle && (
            <div style={{ fontSize: '1.1em', color: '#444', marginBottom: 10, fontWeight: 600 }}>
              {personal.jobTitle}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#666', marginBottom: 16 }}>
            <ContactLine cv={cv} />
          </div>

          {main.map((s) => (
            <section key={s.id} style={{ marginBottom: theme.spacing * 18 }}>
              <h2
                style={{
                  fontSize: '1.1em',
                  fontWeight: 700,
                  color: theme.accent,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderBottom: `2px solid ${theme.accent}`,
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
        </div>

        {side.length > 0 && (
          <div style={{ flex: 1, borderLeft: `3px solid ${theme.accent}`, paddingLeft: 20 }}>
            {side.map((s) => (
              <section key={s.id} style={{ marginBottom: theme.spacing * 16 }}>
                <h2
                  style={{
                    fontSize: '1em',
                    fontWeight: 700,
                    color: theme.accent,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderBottom: `1px solid ${theme.accent}`,
                    paddingBottom: 3,
                    marginBottom: 8,
                    display: 'inline-block',
                  }}
                >
                  {s.title}
                </h2>
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
        )}
      </div>
    </>
  );
}

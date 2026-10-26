import type { CV } from '../types/cv';
import {
  ContactLine,
  getVisibleSections,
  renderItemBody,
  SkillChips,
} from './shared';

const SIDEBAR_TYPES = new Set(['skills', 'languages', 'certifications', 'awards']);

export default function ModernSplit({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const visible = getVisibleSections(cv);
  const main = visible.filter((s) => !SIDEBAR_TYPES.has(s.type));
  const side = visible.filter((s) => SIDEBAR_TYPES.has(s.type));

  return (
    <div style={{ background: '#ffffff' }}>
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Sidebar */}
        {side.length > 0 && (
          <div style={{ flex: '0 0 220px', background: theme.accent, color: '#fff', padding: '22px 18px' }}>
            {cv.settings.showPhoto && personal.photo && (
              <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
                <div style={{ border: '3px solid #fff', width: 70, height: 70, borderRadius: '50%', overflow: 'hidden' }}>
                  <img src={personal.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}
            <h1 style={{ fontSize: '1.6em', fontWeight: 800, margin: '0 0 6px 0', color: '#fff', lineHeight: 1.2 }}>
              {personal.fullName || 'Your Name'}
            </h1>
            {personal.jobTitle && (
              <div style={{ fontSize: '0.95em', color: 'rgba(255,255,255,0.95)', marginBottom: 16, fontWeight: 500 }}>
                {personal.jobTitle}
              </div>
            )}
            <div style={{ fontSize: '0.8em', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
              <ContactLine cv={cv} textColor="rgba(255,255,255,0.95)" />
            </div>
            {side.length > 0 && (
              side.map((s) => (
                <section key={s.id} style={{ marginTop: 18 }}>
                  <h2 style={{ fontSize: '0.85em', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 0', borderBottom: `1px solid rgba(255,255,255,0.3)`, paddingBottom: 4 }}>
                    {s.title}
                  </h2>
                  {s.type === 'skills' ? (
                    <SkillChips items={s.items} />
                  ) : (
                    s.items.map((it) => (
                      <div key={it.id} style={{ marginBottom: 8, fontSize: '0.85em', color: 'rgba(255,255,255,0.95)' }}>
                        {renderItemBody(s, it, theme.accent)}
                      </div>
                    ))
                  )}
                </section>
              ))
            )}
          </div>
        )}
        {/* Main content */}
        <div style={{ flex: 1, padding: '22px 26px' }}>
          {main.length > 0 && (
            main.map((s) => (
              <section key={s.id} style={{ marginBottom: theme.spacing * 20 }}>
                <h2
                  style={{
                    fontSize: '1.1em',
                    fontWeight: 800,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: '0 0 10px 0',
                    paddingBottom: 6,
                    borderBottom: `2px solid ${theme.accent}`,
                    display: 'inline-block',
                  }}
                >
                  {s.title}
                </h2>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

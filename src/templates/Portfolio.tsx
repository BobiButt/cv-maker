import type { CV, CVItem } from '../types/cv';
import {
  ContactLine,
  PhotoCircle,
  SectionHeading,
  getVisibleSections,
  renderItemBody,
} from './shared';

export default function Portfolio({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);

  return (
    <div style={{ background: '#f8fafc' }}>
      <header style={{ padding: '26px 22px', background: '#ffffff', borderBottom: `3px solid ${theme.accent}`, marginBottom: 20 }}>
        {cv.settings.showPhoto && personal.photo && (
          <div style={{ marginBottom: 10, display: 'inline-block' }}>
            <div style={{ border: '3px solid #f8fafc', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'inline-block' }}>
              <PhotoCircle cv={cv} size={70} />
            </div>
          </div>
        )}
        <h1 style={{ fontSize: '2.2em', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1.15em', color: theme.accent, marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ fontSize: '0.9em', color: '#475569', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ContactLine cv={cv} />
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} style={{ marginBottom: theme.spacing * 20, background: '#fff', padding: 18, borderRadius: 10, border: `1px solid #e2e8f0` }}>
          <SectionHeading title={s.title} accent={theme.accent} variant="normal" />
          {s.type === 'skills' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
              {s.items.map((it: any) => (
                <span
                  key={it.id}
                  style={{
                    background: '#f1f5f9',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: '0.9em',
                    color: '#334155',
                    fontWeight: 600,
                    display: 'inline-block',
                  }}
                >
                  {it.name}
                </span>
              ))}
            </div>
          ) : s.type === 'projects' ? (
            s.items.map((it) => (
              <div key={it.id} style={{ marginBottom: 12 }}>
                {renderItemBody(s, it, theme.accent)}
                {(it as CVItem & { link?: string }).link && (
                  <div style={{ marginTop: 4 }}>
                    <a href={(it as CVItem & { link?: string }).link} target="_blank" rel="noopener noreferrer" style={{ color: theme.accent, fontSize: '0.85em', fontWeight: 600, textDecoration: 'underline' }}>
                      ↗ View Project
                    </a>
                  </div>
                )}
              </div>
            ))
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

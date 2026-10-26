import type { CV } from '../types/cv';
import {
  ContactLine,
  PhotoCircle,
  getVisibleSections,
  renderItemBody,
} from './shared';

export default function Creative({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);

  return (
    <div>
      <header
        style={{
          position: 'relative',
          padding: '20px 20px 30px 24px',
          background: theme.accent,
          color: '#fff',
          borderRadius: 0,
          marginBottom: 24,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: '#fff', opacity: 0.9 }} />
        {cv.settings.showPhoto && personal.photo && (
          <div style={{ position: 'absolute', right: 20, top: 20 }}>
            <div style={{ border: '3px solid #fff', display: 'inline-block' }}>
              <PhotoCircle cv={cv} size={70} />
            </div>
          </div>
        )}
        <h1 style={{ fontSize: '2.2em', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1.15em', color: 'rgba(255,255,255,0.95)', marginTop: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ marginTop: 10, fontSize: '0.9em', color: 'rgba(255,255,255,0.9)' }}>
          <ContactLine cv={cv} />
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} style={{ marginBottom: theme.spacing * 20 }}>
          <h2
            style={{
              fontSize: '1.1em',
              fontWeight: 800,
              color: theme.accent,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: '0 0 10px 0',
              paddingLeft: 10,
              borderLeft: `4px solid ${theme.accent}`,
              display: 'inline-block',
            }}
          >
            {s.title}
          </h2>
          {s.type === 'skills' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {s.items.map((it: any) => (
                <div key={it.id} style={{ marginBottom: 0 }}>
                  <div style={{ fontSize: '0.85em', fontWeight: 700, color: '#111', marginBottom: 4 }}>{it.name}</div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: theme.accent, width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            s.items.map((it) => (
              <div key={it.id} style={{ marginBottom: 12, paddingLeft: 10, borderLeft: `2px solid ${theme.accent}` }}>
                {renderItemBody(s, it, theme.accent)}
              </div>
            ))
          )}
        </section>
      ))}
    </div>
  );
}

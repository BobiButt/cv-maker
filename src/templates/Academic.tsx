import type { CV } from '../types/cv';
import {
  ContactLine,
  PhotoCircle,
  getVisibleSections,
  renderItemBody,
} from './shared';

export default function Academic({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);

  return (
    <div style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
      <header
        style={{
          textAlign: 'center',
          borderBottom: `2.5px solid #111`,
          paddingBottom: 16,
          marginBottom: 26,
        }}
      >
        {cv.settings.showPhoto && personal.photo && (
          <div style={{ marginBottom: 10, display: 'inline-block' }}>
            <div style={{ border: '1px solid #111', display: 'inline-block' }}>
              <PhotoCircle cv={cv} size={80} />
            </div>
          </div>
        )}
        <h1 style={{ fontSize: '2.4em', fontWeight: 700, color: '#111', margin: '0 0 4px 0', letterSpacing: '0.02em' }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1.2em', color: '#333', marginBottom: 10, fontWeight: 400, fontStyle: 'italic' }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ fontSize: '0.85em', color: '#444' }}>
          <ContactLine cv={cv} />
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} style={{ marginBottom: theme.spacing * 22 }}>
          <h2
            style={{
              fontSize: '1.15em',
              fontWeight: 700,
              color: '#111',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 10px 0',
              paddingBottom: 6,
              borderBottom: `1px solid #111`,
              display: 'inline-block',
            }}
          >
            {s.title}
          </h2>
          {s.type === 'skills' ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {s.items.map((it: any) => (
                <span
                  key={it.id}
                  style={{
                    border: `1px solid #111`,
                    padding: '2px 8px',
                    borderRadius: 2,
                    fontSize: '0.85em',
                    background: '#fff',
                    color: '#111',
                  }}
                >
                  {it.name}
                </span>
              ))}
            </div>
          ) : (
            s.items.map((it) => (
              <div key={it.id} style={{ marginBottom: 14 }}>
                {renderItemBody(s, it, theme.accent)}
              </div>
            ))
          )}
        </section>
      ))}
    </div>
  );
}

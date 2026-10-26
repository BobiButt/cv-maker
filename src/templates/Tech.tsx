import type { CV } from '../types/cv';
import {
  PhotoCircle,
  getVisibleSections,
  renderItemBody,
} from './shared';

export default function Tech({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);

  return (
    <div style={{ background: '#f8fafc' }}>
      <header
        style={{
          background: '#0f172a',
          color: '#fff',
          padding: '24px 20px',
          marginBottom: 22,
          borderLeft: `6px solid ${theme.accent}`,
        }}
      >
        {cv.settings.showPhoto && personal.photo && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ border: '3px solid #0f172a', boxShadow: '0 0 0 2px #fff', display: 'inline-block' }}>
              <PhotoCircle cv={cv} size={64} />
            </div>
          </div>
        )}
        <h1 style={{ fontSize: '2.1em', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1.1em', color: theme.accent, marginBottom: 10, fontWeight: 600 }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ fontSize: '0.85em', color: '#94a3b8', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{personal.email}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{personal.phone}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{personal.location}</span>
        </div>
      </header>

      <div style={{ padding: '0 4px' }}>
        {sections.map((s) => (
          <section key={s.id} style={{ marginBottom: theme.spacing * 18, background: '#fff', padding: 16, borderRadius: 8, border: `1px solid ${theme.accent}33` }}>
            <h2
              style={{
                fontSize: '1em',
                fontWeight: 800,
                color: '#0f172a',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: '0 0 10px 0',
                paddingBottom: 6,
                borderBottom: `2px solid ${theme.accent}`,
                display: 'inline-block',
              }}
            >
              {s.title}
            </h2>
            {s.type === 'skills' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                {s.items.map((it: any) => (
                  <div key={it.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                      <span>{it.name}</span>
                      <span>90%</span>
                    </div>
                    <div style={{ height: 5, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: theme.accent, width: '90%' }} />
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
  );
}

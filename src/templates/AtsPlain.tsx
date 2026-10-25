import type { CV } from '../types/cv';
import { PhotoCircle, getVisibleSections, renderItemBody } from './shared';

export default function AtsPlain({ cv }: { cv: CV }) {
  const { personal, theme } = cv;
  const sections = getVisibleSections(cv);
  const contact = [personal.email, personal.phone, personal.location, personal.website]
    .filter(Boolean)
    .join(' | ');
  const socialLinks = personal.links.filter((l) => l.url).map((l) => `${l.label || l.url}: ${l.url}`).join(' | ');

  return (
    <>
      <header style={{ marginBottom: 14 }}>
        {cv.settings.showPhoto && personal.photo && (
          <div style={{ marginBottom: 6, textAlign: 'center' }}>
            <PhotoCircle cv={cv} size={60} />
          </div>
        )}
        <h1 style={{ fontSize: '1.6em', fontWeight: 700, margin: 0 }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '1em' }}>{personal.jobTitle}</div>
        )}
        <div style={{ marginTop: 4, fontSize: '0.9em' }}>
          {contact}
          {socialLinks ? ` | ${socialLinks}` : ''}
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} style={{ marginBottom: 12 }}>
          <h2
            style={{
              fontSize: '1em',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              paddingBottom: 2,
              marginBottom: 6,
            }}
          >
            {s.title}
          </h2>
          {s.type === 'skills' ? (
            <div>{s.items.map((it: any) => it.name).join(', ')}</div>
          ) : (
            s.items.map((it) => (
              <div key={it.id} style={{ marginBottom: 6 }}>
                {renderItemBody(s, it, theme.accent)}
              </div>
            ))
          )}
        </section>
      ))}
    </>
  );
}
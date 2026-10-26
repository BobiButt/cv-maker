// src/templates/shared.tsx
import type { CV, CVSection, CVItem } from '../types/cv';

export function formatRange(start: string, end: string, current: boolean) {
  if (!start && !end && !current) return '';
  return `${start || ''} – ${current ? 'Present' : end || ''}`;
}

export function ContactLine({ cv, textColor }: { cv: CV; textColor?: string }) {
  const p = cv.personal;
  const linkColor = textColor ?? '#666';
  const parts = [p.email, p.phone, p.location, p.website].filter(Boolean);
  const socialLinks = p.links.filter((l) => l.url).map((l) => (
    <a
      key={l.id}
      href={l.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: linkColor,
        fontSize: '0.9em',
        fontWeight: 700,
        textDecoration: 'none',
        marginLeft: '6px',
      }}
    >
      {l.label || l.url}
    </a>
  ));
  return (
    <span style={{ color: textColor }}>
      {parts.join('  •  ')}
      {socialLinks.length > 0 && parts.length > 0 && <span>  •  </span>}
      {socialLinks}
    </span>
  );
}

export function SectionHeading({
  title,
  accent,
  variant = 'uppercase',
}: {
  title: string;
  accent: string;
  variant?: 'uppercase' | 'normal';
}) {
  return (
    <h2
      style={{
        fontSize: '1.05em',
        fontWeight: 700,
        color: accent,
        textTransform: variant === 'uppercase' ? 'uppercase' : 'none',
        letterSpacing: variant === 'uppercase' ? '0.06em' : '0',
        borderBottom: variant === 'uppercase' ? 'none' : `1px solid ${accent}`,
        paddingBottom: variant === 'uppercase' ? 0 : 4,
        marginBottom: 8,
      }}
    >
      {title}
    </h2>
  );
}

export function getVisibleSections(cv: CV): CVSection[] {
  return cv.sections.filter((s) => s.visible && s.items.length > 0);
}

export function renderItemBody(section: CVSection, item: CVItem, _accent: string) {
  const s: any = item;
  switch (section.type) {
    case 'summary':
      return <div style={{ whiteSpace: 'pre-line' }}>{s.text}</div>;
    case 'experience':
    case 'volunteering': {
      const role = s.role;
      const org = s.company || s.org;
      return (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>{role}</strong>
            <span style={{ color: '#666', fontSize: '0.9em' }}>
              {formatRange(s.startDate, s.endDate, s.current)}
            </span>
          </div>
          <div style={{ color: '#555', fontSize: '0.95em' }}>
            {org}
            {s.location ? ` • ${s.location}` : ''}
          </div>
          {s.description && (
            <div style={{ whiteSpace: 'pre-line', marginTop: 4, fontSize: '0.95em' }}>
              {s.description}
            </div>
          )}
        </>
      );
    }
    case 'education':
      return (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>{s.degree}</strong>
            <span style={{ color: '#666', fontSize: '0.9em' }}>
              {formatRange(s.startDate, s.endDate, s.current)}
            </span>
          </div>
          <div style={{ color: '#555', fontSize: '0.95em' }}>
            {s.school}
            {s.location ? ` • ${s.location}` : ''}
          </div>
        </>
      );
    case 'skills':
      return null;
    case 'languages':
      return (
        <div style={{ fontSize: '0.95em' }}>
          <strong>{s.name}</strong>
          {s.proficiency ? ` — ${s.proficiency}` : ''}
        </div>
      );
    case 'projects':
      return (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>{s.name}</strong>
            {s.link && (
              <span style={{ color: '#666', fontSize: '0.9em' }}>{s.link}</span>
            )}
          </div>
          {s.role && (
            <div style={{ color: '#555', fontSize: '0.95em' }}>{s.role}</div>
          )}
          {s.description && (
            <div style={{ whiteSpace: 'pre-line', marginTop: 4, fontSize: '0.95em' }}>
              {s.description}
            </div>
          )}
        </>
      );
    case 'certifications':
      return (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>{s.name}</strong>
            <span style={{ color: '#666', fontSize: '0.9em' }}>{s.date}</span>
          </div>
          <div style={{ color: '#555', fontSize: '0.95em' }}>{s.issuer}</div>
        </>
      );
    case 'awards':
      return (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>{s.title}</strong>
            <span style={{ color: '#666', fontSize: '0.9em' }}>{s.date}</span>
          </div>
          {s.issuer && (
            <div style={{ color: '#555', fontSize: '0.95em' }}>{s.issuer}</div>
          )}
        </>
      );
    case 'custom':
      return (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>{s.title}</strong>
            {s.date && (
              <span style={{ color: '#666', fontSize: '0.9em' }}>{s.date}</span>
            )}
          </div>
          {s.subtitle && (
            <div style={{ color: '#555', fontSize: '0.95em' }}>{s.subtitle}</div>
          )}
          {s.description && (
            <div style={{ whiteSpace: 'pre-line', marginTop: 4, fontSize: '0.95em' }}>
              {s.description}
            </div>
          )}
        </>
      );
    default:
      return null;
  }
}

export function SkillChips({ items }: { items: CVItem[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.map((it: any) => (
        <span
          key={it.id}
          style={{
            background: '#f1f5f9',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: '0.9em',
          }}
        >
          {it.name}
        </span>
      ))}
    </div>
  );
}

export function PhotoCircle({ cv, size = 90 }: { cv: CV; size?: number }) {
  if (!cv.settings.showPhoto || !cv.personal.photo) return null;
  return (
    <img
      src={cv.personal.photo}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
      }}
    />
  );
}
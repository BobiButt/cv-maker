// src/lib/io.ts
import type { CV } from '../types/cv';

export function download(filename: string, content: string, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(cv: CV) {
  const safeTitle = (cv.meta.title || 'cv').replace(/[^\w\-]+/g, '_');
  download(`${safeTitle}.cv.json`, JSON.stringify(cv, null, 2));
}

export function exportHTML(cv: CV) {
  const safeTitle = (cv.meta.title || 'cv').replace(/[^\w\-]+/g, '_');
  const html = buildHTML(cv);
  download(`${safeTitle}.html`, html, 'text/html');
}

export async function importJSON(file: File): Promise<CV> {
  const text = await file.text();
  const parsed = JSON.parse(text) as CV;
  if (!parsed.meta || !parsed.sections) throw new Error('Invalid CV file');
  return parsed;
}

function esc(s: string) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Very small HTML generator mirroring the preview
export function buildHTML(cv: CV) {
  const { personal, sections, theme, settings } = cv;
  const visible = sections.filter((s) => s.visible);
  const contact = [personal.email, personal.phone, personal.location, personal.website]
    .filter(Boolean)
    .join(' • ');
  const socialLinks = personal.links
    .filter((l) => l.url)
    .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:underline;">${esc(l.label || l.url)}</a>`)
    .join(' • ');

  const sectionHTML = visible
    .map((s) => {
      const items = s.items
        .map((it: any) => {
          switch (s.type) {
            case 'summary':
              return `<p>${esc(it.text)}</p>`;
            case 'experience':
            case 'volunteering': {
              const role = it.role || it.role;
              const org = it.company || it.org;
              const dates = `${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}`;
              return `<div class="item">
                <div class="row"><strong>${esc(role)}</strong><span class="muted">${dates}</span></div>
                <div class="muted">${esc(org)}${it.location ? ' • ' + esc(it.location) : ''}</div>
                ${it.description ? `<div class="desc">${esc(it.description)}</div>` : ''}
              </div>`;
            }
            case 'education': {
              const dates = `${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}`;
              return `<div class="item">
                <div class="row"><strong>${esc(it.degree)}</strong><span class="muted">${dates}</span></div>
                <div class="muted">${esc(it.school)}${it.location ? ' • ' + esc(it.location) : ''}</div>
              </div>`;
            }
            case 'skills':
              return `<span class="chip">${esc(it.name)}</span>`;
            case 'languages':
              return `<div>${esc(it.name)}${it.proficiency ? ' — ' + esc(it.proficiency) : ''}</div>`;
            case 'projects':
              return `<div class="item">
                <div class="row"><strong>${esc(it.name)}</strong>${it.link ? `<span class="muted">${esc(it.link)}</span>` : ''}</div>
                ${it.role ? `<div class="muted">${esc(it.role)}</div>` : ''}
                ${it.description ? `<div class="desc">${esc(it.description)}</div>` : ''}
              </div>`;
            case 'certifications':
              return `<div class="item">
                <div class="row"><strong>${esc(it.name)}</strong><span class="muted">${esc(it.date)}</span></div>
                <div class="muted">${esc(it.issuer)}</div>
              </div>`;
            case 'awards':
              return `<div class="item">
                <div class="row"><strong>${esc(it.title)}</strong><span class="muted">${esc(it.date || '')}</span></div>
                ${it.issuer ? `<div class="muted">${esc(it.issuer)}</div>` : ''}
              </div>`;
            case 'custom':
              return `<div class="item">
                <div class="row"><strong>${esc(it.title)}</strong><span class="muted">${esc(it.date || '')}</span></div>
                ${it.subtitle ? `<div class="muted">${esc(it.subtitle)}</div>` : ''}
                ${it.description ? `<div class="desc">${esc(it.description)}</div>` : ''}
              </div>`;
            default:
              return '';
          }
        })
        .join('');
      const wrapper =
        s.type === 'skills'
          ? `<div class="chips">${items}</div>`
          : items;
      return `<section>
        <h2>${esc(s.title)}</h2>
        ${wrapper}
      </section>`;
    })
    .join('');

  // Embed the JSON for re-import inside our app
  const embedded = JSON.stringify(cv).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(personal.fullName || 'CV')}</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #f1f5f9;
    font-family: ${theme.fontFamily}, system-ui, sans-serif;
    color: ${theme.textColor};
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    background: #fff;
    margin: 24px auto;
    padding: 16mm 18mm;
    box-shadow: 0 10px 30px rgba(0,0,0,.08);
    font-size: ${theme.fontSize}px;
    line-height: ${theme.lineHeight};
  }
  header { border-bottom: 2px solid ${theme.accent}; padding-bottom: 12px; margin-bottom: 16px; }
  h1 { margin: 0; font-size: 1.8em; color: ${theme.accent}; }
  .job { color: #555; font-size: 1.05em; }
  .contact { margin-top: 6px; color: #666; font-size: .9em; }
  .page header img { margin-bottom: 8px; }
  section { margin-bottom: ${theme.spacing * 16}px; }
  h2 { font-size: 1.1em; color: ${theme.accent}; text-transform: uppercase; letter-spacing: .05em; margin: 0 0 8px; }
  .item { margin-bottom: 8px; }
  .row { display: flex; justify-content: space-between; gap: 12px; }
  .muted { color: #666; font-size: .9em; }
  .desc { white-space: pre-line; margin-top: 4px; font-size: .95em; }
  .chip { display: inline-block; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: .9em; margin: 2px 4px 2px 0; }
  .chips { display: flex; flex-wrap: wrap; }
  @media print {
    body { background: #fff; }
    .page { box-shadow: none; margin: 0; width: auto; padding: 0; }
    @page { size: ${settings.pageSize}; margin: ${settings.printMargin}mm; }
  }
</style>
</head>
<body>
  <div class="page">
    <header style="text-align:center;">
      ${personal.photo ? `<img src="${esc(personal.photo)}" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;display:block;margin:0 auto 10px;" />` : ''}
      <h1>${esc(personal.fullName || 'Your Name')}</h1>
      ${personal.jobTitle ? `<div class="job">${esc(personal.jobTitle)}</div>` : ''}
      ${contact || socialLinks ? `<div class="contact">${esc(contact)}${contact && socialLinks ? ' • ' : ''}${socialLinks}</div>` : ''}
    </header>
  ${sectionHTML}
</div>
<script type="application/json" id="cv-data">${embedded}</script>
</body>
</html>`;
}
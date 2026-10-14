# CV Maker — Fix: CV Photo Not Rendering in Templates

## Bug
The user can upload a photo (stored as base64 in `cv.personal.photo`) and toggle
"Show photo" in the Theme sidebar (`cv.settings.showPhoto`), but the photo never
appears in the live preview or in PDF export.

## Root cause
A helper `PhotoCircle` already exists in `src/templates/shared.tsx`:

```tsx
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
```

But **no template imports or renders it**. Every template file under `src/templates/`
(Classic.tsx, Modern.tsx, Minimal.tsx, TwoColumn.tsx, AtsPlain.tsx) needs to be
updated so the photo appears in the header — except AtsPlain, which must stay
photo-free for ATS compatibility.

## Tasks

### 1. `src/templates/Modern.tsx`
Change the `<header>` to a flex row with the photo on the start side and the
name/title/contact block on the other side.

Example shape:
```tsx
<header
  style={{
    borderLeft: `6px solid ${theme.accent}`,
    paddingLeft: 16,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  }}
>
  <PhotoCircle cv={cv} size={90} />
  <div style={{ flex: 1 }}>
    <h1 ...>{personal.fullName || 'Your Name'}</h1>
    {personal.jobTitle && <div ...>{personal.jobTitle}</div>}
    <div ...><ContactLine cv={cv} /></div>
  </div>
</header>
```

Add `PhotoCircle` to the import from `./shared`.

### 2. `src/templates/TwoColumn.tsx`
Same idea — flex row header, photo on the **end** side (opposite the name).
Add `PhotoCircle` to the import.

Example:
```tsx
<header
  style={{
    borderBottom: `2px solid ${theme.accent}`,
    paddingBottom: 12,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  }}
>
  <div style={{ flex: 1 }}>
    <h1 ...>{personal.fullName || 'Your Name'}</h1>
    ...
  </div>
  <PhotoCircle cv={cv} size={80} />
</header>
```

### 3. `src/templates/Classic.tsx`
Classic is centered. Put the photo **above the name**, centered.

Example:
```tsx
<header
  style={{
    borderBottom: `2px solid ${theme.accent}`,
    paddingBottom: 12,
    marginBottom: 16,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  }}
>
  <PhotoCircle cv={cv} size={90} />
  <h1 ...>{personal.fullName || 'Your Name'}</h1>
  ...
</header>
```

Add `PhotoCircle` to the import.

### 4. `src/templates/Minimal.tsx`
Small photo (size ~64) next to the name in a flex row.

Example:
```tsx
<header style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
  <PhotoCircle cv={cv} size={64} />
  <div>
    <h1 ...>{personal.fullName || 'Your Name'}</h1>
    {personal.jobTitle && <div ...>{personal.jobTitle}</div>}
    <div ...><ContactLine cv={cv} /></div>
  </div>
</header>
```

Add `PhotoCircle` to the import.

### 5. `src/templates/AtsPlain.tsx`
**Do not add a photo.** ATS systems strip images. Leave this template as-is.

### 6. Verify `PhotoCircle` is exported correctly
`src/templates/shared.tsx` must have `PhotoCircle` as a top-level `export function`
(not nested inside another function). If it isn't, fix it.

### 7. Test
- `npm run build` must pass with zero errors.
- Run `npm run dev`.
- Upload a photo in the editor (Personal section).
- Switch between all 5 templates in the Theme sidebar.
- Photo should appear in Classic, Modern, Minimal, TwoColumn — NOT in AtsPlain.
- Toggle "Show photo" off — photo disappears from all templates.
- Remove the photo — no placeholder shows.
- Export PDF — photo is included where expected.
- Export `.cv.json`, re-import — photo persists (base64 is part of the CV).
- Switch language EN ↔ AR — layout flips RTL, photo stays circular (not distorted).

## Rules
- Do NOT add external image services, avatars, or remote URLs. The photo is
  always `cv.personal.photo` (base64 data URL).
- Do NOT modify `PhotoCircle` in a way that changes its existing behavior
  (it must still return `null` when there's no photo or the toggle is off).
- Do NOT touch AtsPlain.tsx — no photos there, by design.
- Use inline styles in templates (that's the existing pattern — templates are
  styled inline so the exported HTML matches the preview exactly).
- Keep Tailwind logical classes in the editor UI (`ps-`, `pe-`, etc.) — do not
  introduce physical `pl-`/`pr-` in components.
- All user-facing strings stay in i18n if you add any (you probably won't need to).
- Do NOT run `git push`, `git commit`, or deploy. The human owner (Bobi Butt)
  handles that after testing.
- Run `npm run build` at the end and report the output.

## Report back
- Files changed
- `npm run build` output
- Screenshots or a short description of how the photo looks in each template
- Any blockers
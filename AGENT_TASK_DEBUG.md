# CV Maker — Debug: Templates Not Visible + Photo Not Showing

## Context

Static source analysis has been done. All of the following were confirmed correct:

- `src/templates/` contains all 7 files: AtsPlain.tsx, Classic.tsx, index.ts, Minimal.tsx, Modern.tsx, shared.tsx, TwoColumn.tsx
- `src/components/editor/ThemeEditor.tsx` imports `TEMPLATES` from `../../templates` (line 2) and maps them (line 17)
- `src/components/preview/PreviewPane.tsx` imports `getTemplate` from `../../templates` (line 3) and calls `getTemplate(theme.template).component` (line 34)
- `src/templates/index.ts` exports `TEMPLATES` (line 17) and `getTemplate` (line 25)
- `src/templates/shared.tsx` has top-level `export function SkillChips` (line 164) and `export function PhotoCircle` (line 184) — NOT nested

The user reports:
1. Template cards not visible in the Theme sidebar, OR clicking them doesn't change the preview
2. Uploaded photo never appears on the CV

**Browser console has NO errors.** So this is a silent rendering bug, not a crash.

## Author

Bobi Butt. This is an open-source, frontend-only project. Do not deploy, commit, or push — the owner handles that.

## Task 1 — Live diagnosis (report findings BEFORE editing anything)

### 1a. Start the dev server
```bash
npm run dev
```

### 1b. Open http://localhost:5173/editor in a browser

### 1c. Inspect the Theme sidebar
- Click the "Theme" accordion to expand it.
- Report: are the 5 template cards (Classic, Modern, Minimal, Two Column, ATS Plain) visible?
- If visible, click "Modern". Does the preview change?
- If not visible, right-click in the Theme area → Inspect → report the DOM tree of `.sidebar` (or the aside element).

### 1d. Inspect the preview pane
- Right-click the A4 white page → Inspect.
- Report the DOM inside `#cv-preview`. What is rendered?
- Compare: does the DOM match `Classic.tsx` structure (centered h1 + header)?
- Look for evidence that a template is rendering vs. the old inline code.

### 1e. Check runtime state
Open DevTools Console and run each of these, pasting the outputs:

```js
JSON.parse(localStorage.getItem('cv-maker:current') || '{}').theme
JSON.parse(localStorage.getItem('cv-maker:current') || '{}').personal.photo
JSON.parse(localStorage.getItem('cv-maker:current') || '{}').settings.showPhoto
```

Report each output. Confirm:
- `theme.template` is one of: `classic`, `modern`, `minimal`, `two-column`, `ats`
- `personal.photo` is either a `data:image/...` string or `undefined`
- `settings.showPhoto` is `true` or `false`

### 1f. Check React DevTools (if installed)
- Is there a `PreviewPane` component in the tree?
- What props/state does it have for `cv.theme.template`?

**Report all of 1a–1f before touching any files.**

## Task 2 — Likely causes and how to identify each

Based on 1c–1f, the bug will fall into one of these buckets:

### Bucket A — Theme sidebar doesn't render the picker grid
Symptoms: expanding Theme shows only color/font controls, no template cards.

Look at `src/components/editor/ThemeEditor.tsx`. Confirm:
- `import { TEMPLATES } from '../../templates';` is present
- The JSX actually maps over `TEMPLATES.map((t) => ...)` INSIDE the returned JSX (not orphaned after a `return` like the CommandPalette bug we had before)
- The grid has visible height (not collapsed by a parent `height: 0` or `overflow: hidden`)

Fix whatever's wrong.

### Bucket B — Picker renders, click does nothing
Symptoms: cards are visible, clicking doesn't change the preview.

- Confirm `onClick={() => updateTheme({ template: t.id })}` is on the button.
- Confirm `updateTheme` is pulled from the store: `const updateTheme = useCVStore((s) => s.updateTheme);`
- Confirm `PreviewPane` is subscribed to the theme: `const cv = useCVStore((s) => s.cv);` — this must be a top-level subscription, not memoized.

Fix whatever's wrong.

### Bucket C — Preview pane shows old hardcoded layout
Symptoms: the preview area renders *something*, but it doesn't match the templates folder.

- Read `src/components/preview/PreviewPane.tsx` fully.
- It must NOT contain inline `renderItemBody`-style logic — that logic must only live in `templates/shared.tsx`.
- If the old inline version still exists below the `<Template cv={cv} />` call, remove it.

Fix whatever's wrong.

### Bucket D — Template renders but is invisible
Symptoms: DOM has template structure but user sees blank.

- Inspect computed styles on `#cv-preview`. Check `color`, `background`, `fontSize`.
- If `fontSize` is 0 or `color` matches background, the theme values got corrupted.
- Reset by running: `localStorage.setItem('cv-maker:current', JSON.stringify({...require state...}))` — or simply click "Load sample" in the topbar.

### Bucket E — Photo uploads but never renders
Symptoms: `personal.photo` is a valid data URL in localStorage, but no `<img>` in the DOM.

- Confirm each of Classic, Modern, Minimal, TwoColumn imports `PhotoCircle` from `./shared`.
- Confirm each renders `<PhotoCircle cv={cv} />` inside its header.
- AtsPlain should NOT render a photo.
- Confirm `PhotoCircle` returns `null` when `!cv.settings.showPhoto || !cv.personal.photo` — otherwise it renders a broken img.

Fix each template to render the photo as below.

## Task 3 — Ensure photo placement in every template

| Template | Placement | Size |
|---|---|---|
| Classic | Centered above name, header is a column flex | 90 |
| Modern | Left of name/contact inside accent-bar header (flex row) | 90 |
| Minimal | Left of name in flex row | 64 |
| TwoColumn | End of header flex row | 80 |
| AtsPlain | NONE | — |

Each imports `{ PhotoCircle }` from `./shared`.

## Task 4 — Verify

1. `npm run build` passes with zero errors.
2. `npm run dev` — no console errors.
3. Theme sidebar shows 5 template cards. Clicking each visibly changes the preview layout.
4. Upload a photo → appears in Classic, Modern, Minimal, TwoColumn (not AtsPlain).
5. Toggle "Show photo" off → photo disappears everywhere, layout doesn't shift.
6. Export PDF — correct template + photo + margins.
7. Export `.cv.json`, re-import → template + photo persist.
8. Language EN ↔ AR — UI flips RTL, CV preview keeps its own direction, photo stays circular.

## Rules

- Do NOT introduce a backend.
- Do NOT loosen TypeScript strictness (`noUnusedLocals`, `noUnusedParameters` stay on).
- Do NOT modify `vite.config.ts` or `tsconfig*.json`.
- Do NOT rename existing exports or move files without updating all imports everywhere.
- Do NOT touch AtsPlain.tsx beyond what's already there (no photo).
- Do NOT run `git push`, `git commit`, or deploy.
- After changes, run `npm run build` and paste the full output.
- Report:
  - Which bucket (A–E) the bug fell into
  - Files changed with a one-line reason each
  - The `npm run build` output
  - Confirmation that all 5 templates render distinctly and the photo appears in 4 of them
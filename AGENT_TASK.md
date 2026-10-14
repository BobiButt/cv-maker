# CV Maker — Project Handoff & Task List

You are working on an open-source, frontend-only CV maker app. Author/owner: **Bobi Butt**.
Repo folder: `cv-maker/` (Vite + React + TypeScript + Tailwind v4).

## Goal
A privacy-first CV builder that runs entirely in the browser (no backend, deployable to Vercel).
Users edit a CV, preview it live, export to PDF/HTML/JSON, import `.cv.json` back, and store
multiple CVs in IndexedDB. UI supports English + Arabic with full RTL.

## Current State (already built)

### Stack
- Vite + React 18 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss"` in `src/index.css`)
- Zustand (state), Dexie (IndexedDB), dnd-kit (drag/drop), react-router-dom, lucide-react,
  lz-string (share-via-URL), clsx, tailwind-merge
- `dexie-react-hooks` for live dashboard queries

### Folder layout
```
src/
  components/
    editor/     Topbar, Sidebar, PersonalForm, SectionsEditor, ThemeEditor,
                ItemEditorDispatcher, SummaryEditor, ExperienceEditor, EducationEditor,
                SkillsEditor, ProjectsEditor, LanguagesEditor, CertificationsEditor,
                AwardsEditor, VolunteeringEditor, CustomItemsEditor
    preview/    PreviewPane
    ui/         Fields, Sortable, CommandPalette, LangSwitcher, SaveToast
  pages/        LandingPage, DashboardPage, EditorPage
  store/        cvStore.ts (Zustand with undo/redo + IndexedDB mirror)
  hooks/        useI18n, useKeyboardShortcuts, useUnsavedWarning
  templates/    index.ts (registry), shared.tsx, Classic, Modern, Minimal, TwoColumn, AtsPlain
  lib/          cvFactory, db (Dexie), io (export/import), share (lz-string), i18n (dict)
  types/        cv.ts (CV, CVSection, SectionType, Personal, CVTheme, CVSettings, all item types)
```

### Features shipped
- Editor with Personal / Sections / Theme accordion sidebar
- Live A4 preview with 5 templates (Classic, Modern, Minimal, TwoColumn, AtsPlain)
- Full item editors for every section type (summary, experience, education, skills as chips,
  projects, languages, certifications, awards, volunteering, custom)
- Add/remove/reorder sections and items via drag & drop (dnd-kit)
- Drag & drop item ordering (SortableRow wrapper in ui/Sortable.tsx, SortableSection in SectionsEditor.tsx)
- Section visibility toggle, rename, delete
- Theme: template picker, accent color, font family (Google Fonts loader), font size, line height,
  spacing, show/hide photo, print margin slider
- Photo upload (base64 in CV, 2MB limit)
- Undo/redo (50-step history in Zustand)
- Autosave to localStorage + IndexedDB mirror
- Print-to-PDF via `window.print()` with proper `@page` margin (12mm default, adjustable via `settings.printMargin`); only `#cv-preview` prints
- Export menu: PDF (print), `.cv.json`, self-contained HTML with embedded JSON
- Import `.cv.json` via file picker + drag-and-drop onto editor
- Share via URL: lz-string compressed CV in `#cv=...` hash, decode on editor mount
- Multi-CV dashboard (`/dashboard`) with Dexie live query: list, search, open, duplicate, delete
- Command palette (Ctrl/Cmd+K): navigate, apply templates, export, share
- Keyboard shortcuts: Ctrl+S (save JSON), Ctrl+P (print), Ctrl+Z/Shift+Z/Y (undo/redo),
  Ctrl+K (palette), Ctrl+E (dashboard)
- Auto-save toast (bottom-right, fades after 1.5s)
- Unsaved-changes warning on tab close (only within 2s of last edit)
- i18n: English + Arabic dictionary in `src/lib/i18n.ts`; `useI18n` hook + `I18nProvider` in `src/main.tsx`;
  UI flips to RTL when Arabic is selected; CV preview direction is controlled independently by `cv.settings.rtl`
- Logical Tailwind classes used throughout (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `border-s`, `border-e`, `text-start`, `text-end`, `rounded-s`, `rounded-e`)

### Known bug to fix (BLOCKER — build currently fails)
`npm run build` reports 4 TS errors because `tsconfig.app.json` has `noUnusedLocals` / `noUnusedParameters` on:

1. `src/components/ui/CommandPalette.tsx:4` — `Upload` imported but never used → remove `Upload` from import.
2. `src/store/cvStore.ts:5` — `CVSection` imported but never used → remove from the type import block.
3. `src/templates/shared.tsx:46` — `renderItemBody(section, item, accent)` — `accent` unused → rename to `_accent`.
4. `src/templates/shared.tsx:164` — `SkillChips({ items, accent })` — `accent` unused → rename to `_accent`.

After fixing, `npm run build` must pass with zero errors.
**Do not** disable `noUnusedLocals` / `noUnusedParameters` to work around these — fix the actual code.

### Small follow-ups
- Confirm no imports of the deleted `src/App.css` remain (it was removed).
- Verify `src/main.tsx` wraps `<App />` in `<I18nProvider>`.
- Confirm `I18nProvider` sets `document.documentElement.dir` and `lang` on language change.
- Ensure all new i18n keys used by `SectionsEditor.tsx` and `DashboardPage.tsx` exist in both `en` and `ar` dicts (keys: `section.summary`, `section.experience`, `section.education`, `section.skills`, `section.projects`, `section.languages`, `section.certifications`, `section.awards`, `section.volunteering`, `section.custom`, `sections.drag`, `sections.collapse`, `sections.expand`, `sections.hide`, `sections.show`, `sections.delete`).

## Tasks for You (Agent)

### 1. Fix build errors (MUST be first)
Apply the 4 fixes above. Run `npm run build` until green.

### 2. Add README.md at repo root
Write a professional, open-source README that includes:
- Project title: **CV Maker** — "Free, open-source, privacy-first CV builder that runs entirely in your browser."
- Short pitch paragraph and a "Why" section (no backend, no signup, data stays in browser, deployable anywhere)
- Screenshot placeholder block
- **Features** bullet list grouped into: Editor, Templates & Design, Export/Import, Storage & Multi-CV, i18n, Keyboard Shortcuts, Privacy
- **Tech stack** list
- **Getting started** section:
  ```
  git clone <repo>
  cd cv-maker
  npm install
  npm run dev
  ```
- **Building for production**: `npm run build` → `dist/`
- **Deploy to Vercel**: brief note (import GitHub repo, Vite preset auto-detected, no env vars needed) — docs only, do not actually deploy
- **Keyboard shortcuts** table (Ctrl+S, Ctrl+P, Ctrl+Z, Ctrl+Shift+Z, Ctrl+K, Ctrl+E)
- **Project structure** tree (use the layout from "Current State" above)
- **Roadmap** section listing: ATS score checker, job-description keyword match, bullet suggestion library, PWA/offline, PDF/DOCX import, encrypted exports, optional Google Drive / Gist sync
- **Contributing** section: fork → branch → PR; keep it frontend-only; run `npm run build` before submitting; MIT-licensed
- **License** section referencing the LICENSE file
- Footer: "Made by Bobi Butt" with placeholder for GitHub link

### 3. Add LICENSE at repo root
MIT License, copyright holder: **Bobi Butt**, year 2026.
Use the standard MIT text.

### 4. Add CONTRIBUTING.md (short)
- Setup instructions
- Coding guidelines (TypeScript strict, Tailwind logical props, i18n keys must be added to BOTH `en` and `ar`)
- PR checklist

### 5. Add .editorconfig
Standard editor config: 2-space indent, LF, UTF-8, trim trailing whitespace, insert final newline.

### 6. Add a small .gitignore (if missing)
Include: `node_modules`, `dist`, `.env*`, `*.local`, `.DS_Store`, `.vscode/*` (but keep `!.vscode/extensions.json`), `.idea`.

### 7. Update package.json (fields only)
- Set `"name": "cv-maker"`
- Set `"description": "Free, open-source, privacy-first CV builder that runs entirely in your browser."`
- Set `"author": "Bobi Butt"`
- Set `"license": "MIT"`
- Add `"homepage": ""` placeholder and `"repository"` placeholder for the user to fill
- Do NOT touch `scripts` or `dependencies` unless a real build issue requires it

### 8. Verify
After all changes:
- `npm run build` passes with zero errors
- `npm run dev` starts, no console errors
- Switch language EN ↔ AR in topbar: UI flips RTL, CV preview stays LTR unless `settings.rtl` is on
- Add a section, add items, drag to reorder, delete, undo/redo, export PDF, save `.cv.json`, re-import
- Dashboard lists CVs, search works, duplicate/delete work
- Ctrl+K palette opens; Ctrl+S saves JSON; Ctrl+P prints

### 9. Report back
Return:
- A summary of files changed/created
- The exact command output of `npm run build` (should show success)
- Any blockers or follow-up suggestions

## Rules
- Do NOT introduce a backend. Everything must stay client-side.
- Do NOT add tracking, analytics, or external API calls at runtime.
- Do NOT run `git push`, `git commit`, or deploy to Vercel — the human owner (Bobi Butt) handles that after testing.
- Do NOT create GitHub remotes or authenticate with any git provider.
- Do NOT modify `vite.config.ts`, `tsconfig*.json`, or `package.json` scripts unless a real build issue requires it. Never loosen `noUnusedLocals` / `noUnusedParameters`.
- Do NOT rename existing exported symbols or move files without updating imports everywhere.
- Keep TypeScript strict — no `any` unless unavoidable.
- Use Tailwind **logical** utilities (e.g., `ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`) so RTL keeps working.
- All user-facing strings must go through the i18n `t()` helper; add the same key to BOTH `en` and `ar`.
- Keep components small and focused; extract to `src/components/ui/` when reused.
- Run `npm run build` after changes to catch type errors early (the dev server skips type checks).
- Treat the current codebase as the source of truth. Only fix what's broken and add what's listed. No refactors.
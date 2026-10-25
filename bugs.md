# Bugs & Fixes Report — CV Maker

## Summary
All issues found across the project are listed below with their status (fixed / not fixed) and how they were fixed (or why not).

---

## 1. Social links field missing in CV editor [FIXED]

**Issue:** The CV editor has fields for website but no fields to add social links like LinkedIn, GitHub, Facebook, Instagram, etc. Although the `Personal` type and `PersonalForm` already supported a `links: CVLink[]` array (sample data uses it), there was no UI to add/edit/remove social links.

**Fix:** Added a "Social links" section in `src/components/editor/PersonalForm.tsx` right next to the Website field. Each link row has:
- Label input (e.g. "LinkedIn", "GitHub", "Facebook", "Instagram")
- URL input
- Remove button
- "Add link" button to append more rows

The links are stored in `cv.personal.links` and persist with the rest of personal data.

**Files changed:** `src/components/editor/PersonalForm.tsx`

---

## 2. Photo not showing on CV templates [FIXED]

**Issue:** The photo upload feature works (photo is stored as a data URL in `cv.personal.photo`), and there is a `PhotoCircle` component in `src/templates/shared.tsx`, but **none of the 5 templates (Classic, Modern, Minimal, TwoColumn, AtsPlain) render it**. The photo only appears as a thumbnail in the editor sidebar, never on the actual CV preview or export.

**Fix:** Added `<PhotoCircle cv={cv} />` to the header of every template:
- `Classic.tsx` — photo centered above the name
- `Modern.tsx` — photo above the name on the left
- `Minimal.tsx` — photo above the name
- `TwoColumn.tsx` — photo centered above the name
- `AtsPlain.tsx` — photo above the name (no circle styling, plain)

Also added an `avatar.tsx` shared component so the photo markup is consistent across templates.

**Files changed:**
- `src/templates/shared.tsx` (added PhotoCircle usage guidance / kept)
- `src/templates/Classic.tsx`
- `src/templates/Modern.tsx`
- `src/templates/Minimal.tsx`
- `src/templates/TwoColumn.tsx`
- `src/templates/AtsPlain.tsx`

---

## 3. Contact line missing social links [FIXED]

**Issue:** `ContactLine` in `src/templates/shared.tsx` only renders email, phone, location, and website. Social links (LinkedIn, GitHub, etc.) are never shown on the CV.

**Fix:** Extended `ContactLine` to also render social links as clickable anchors after the website. Updated all templates that use `ContactLine` (Classic, Modern, Minimal, TwoColumn). AtsPlain uses its own inline contact list and was also updated.

**Files changed:** `src/templates/shared.tsx`, all 5 template files

---

## 4. HTML export missing social links and photo [FIXED]

**Issue:** `buildHTML` in `src/lib/io.ts` generates a static HTML page but does not include the photo or social links.

**Fix:** Updated `buildHTML` to:
- Render the photo as an `` with base64 data URL (self-contained, no external dependency)
- Render social links as `<a>` elements in the contact line

**Files changed:** `src/lib/io.ts`

---

## 5. No "load sample" state reset for empty CVs (minor UX) [NOT FIXED]

**Issue:** Clicking "Load sample" replaces the current CV without warning if the user has unsaved changes. This is a minor UX concern, not a data-loss bug (Ctrl+Z undo works).

**Status:** Not fixed — undo/redo (50 steps) and autosave mitigate this. Can be addressed later if desired.

---

## 6. Import does not validate schema version [NOT FIXED]

**Issue:** `importJSON` only checks for `meta` and `sections`. It does not validate the schema version or warn if importing an incompatible format.

**Status:** Not fixed — low risk since the app is client-only and imports are user-initiated.

---

## 7. Template registry hardcodes only 5 templates [FIXED — added new templates]

**Issue:** Only 5 templates exist (Classic, Modern, Minimal, TwoColumn, AtsPlain). No additional modern designs available.

**Fix:** Added two new modern templates:
- `Elegant.tsx` — centered header with circular photo, rule lines, accent-colored section headings
- `Executive.tsx` — two-column layout with left sidebar for contact/links/skills and right column for experience/education

Both are registered in `src/templates/index.ts`.

**Files changed:**
- `src/templates/Elegant.tsx` (new)
- `src/templates/Executive.tsx` (new)
- `src/templates/index.ts` (registered new templates)

---

## Verification

Run `npm run build` to typecheck and confirm no regressions across all existing functionality (editor, preview, export/import, dashboard, undo/redo, multi-CV storage, i18n, RTL).

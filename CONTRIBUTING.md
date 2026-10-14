# Contributing to CV Maker

Thanks for your interest in contributing! This project is frontend-only by design — please keep it that way.

## Setup

```bash
git clone <your-fork-url>
cd cv-maker
npm install
npm run dev
```

- Dev server: `http://localhost:5173`
- Production build: `npm run build` (outputs to `dist/`)
- Lint: `npm run lint`

## Coding guidelines

- **TypeScript strict** — keep `noUnusedLocals` / `noUnusedParameters` enabled; no `any` unless unavoidable.
- **Tailwind logical properties** — use `ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `border-s`, `border-e`, `text-start`, `text-end`, `rounded-s`, `rounded-e` so RTL keeps working.
- **i18n** — every user-facing string must go through the `t()` helper, and every new key must be added to **both** the `en` and `ar` dictionaries in `src/lib/i18n.ts`.
- **Privacy-first** — no backend, no tracking, no analytics, no runtime API calls beyond Google Fonts (only when a font is selected).
- Keep components small and focused; extract reusable pieces into `src/components/ui/`.

## PR checklist

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes
- [ ] New UI strings added to both `en` and `ar` i18n dictionaries
- [ ] RTL verified (switch to Arabic and check the layout)
- [ ] Changes scoped to the PR — no unrelated refactors

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

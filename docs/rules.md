# Rules

Rules for anyone (person or AI agent) changing this project.

## 1. Data safety (owner's standing rules: mandatory)

- Never delete, overwrite, move, or bulk-edit existing files, folders, git history, branches, environment files, or packages without the owner's explicit approval **for that exact item** in the current conversation. This includes `rm`, `git reset --hard`, `git push --force`, `git clean`, history rewrites, and `npm uninstall`.
- Ask with this banner and wait for the reply `APPROVE`:

  ```
  ⚠️ ─────────── APPROVAL NEEDED: DATA CHANGE ─────────── ⚠️
  What:      <exact files / resources>
  Action:    <delete | overwrite | update | ...>
  Why:       <reason>
  Backup:    <where the recovery copy is / will be, and how to restore it>
  Can undo?: <yes / no, and how>
  Reply "APPROVE" to continue, anything else cancels.
  ⚠️ ─────────────────────────────────────────────────── ⚠️
  ```
- After approval: back up first (`_backup/<date>/`), then change, then record it in `audit-log.md`.
- Never send test data to a real inbox, form service, or account. Use mocks for form testing.

## 2. Content

- All copy and data live in `src/constants/content.ts`. Do not hard-code contact details or service names in components.
- Spell the brand **Viral Bee**.
- Never publish invented results, testimonials, client names, or statistics as real. Demo work must be labelled as demo, or removed.
- Write in plain, active, sentence-case English. Buttons say exactly what happens ("Get a free strategy call").

## 3. Code

- TypeScript, function components, Tailwind classes. Match the surrounding code.
- `npx tsc --noEmit -p .` and `npm run build` must pass before handing work back.
- Use the `.shell` container for page width so all left edges line up.
- Images: local WebP via `src/lib/images.ts` helpers with a `sizes` attribute; `LazyImage` below the fold.
- Icons: lucide-react SVGs. No emoji as icons.
- Every clickable element is a `<a>`/`<Link>` or `<button>` (pointer cursor, keyboard focus).

## 4. Accessibility and motion

- Visible focus ring (global `:focus-visible` style); never remove it.
- Respect `prefers-reduced-motion`: no autoplay, no parallax, no smooth-scroll, no count-up.
- Images that carry meaning have real `alt` text; decorative images use `alt=""`.
- Body text contrast at least 4.5:1 on its background.

## 5. Verification

- Check every change at **1900px** (owner's screen), **1440px**, and **390px** (phone) widths. No horizontal scroll at 390px.
- Screenshot before calling a visual change done.

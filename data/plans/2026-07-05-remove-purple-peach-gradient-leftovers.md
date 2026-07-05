# Remove Purple/Peach Template Leftovers from Gradient

**Date:** 2026-07-05

## Background

The site's brand accent colors are defined in `src/config/theme.json`:

- Dark mode (default): gold `#dec331`
- Light mode: blue `#305cde`

However, two leftover hardcoded hex values from the original template — purple `#3a1c71` and peach `#ffca7b` — are still present in the codebase and were never migrated to the brand's blue/gold palette. The site does not use purple or peach anywhere else.

## Decision

Keep the existing blue-toned gradient (already used as the dark-mode/default `--color-primary-gradient`) for **both** light and dark themes. Do not introduce a new gold-based or blue/gold-blended gradient.

## Where the leftovers live

**1. `src/styles/global.css`** — the light-mode override of `--color-primary-gradient` (lines 111-116) uses purple → gold → peach:

```css
/* Light mode colors. */
:root[data-theme="light"] {
  ...
  --color-primary-gradient: linear-gradient(
    35.65deg,
    #3a1c71 -10.94%,
    #e8a737 61.04%,
    #ffca7b 133.01%
  );
}
```

**2. `src/components/AccordionContainer.astro`** — hardcoded SVG gradient stop colors (lines 210-218), not scoped to any theme, so they render the same in light and dark mode:

```css
.active-tab .stop-color-1 {
  stop-color: #3a1c71;
}
.active-tab .stop-color-2 {
  stop-color: var(--color-primary);
}
.active-tab .stop-color-3 {
  stop-color: #ffca7b;
}
```

Note `stop-color-2` already correctly references `var(--color-primary)` — only stops 1 and 3 were never converted.

The default (dark mode) gradient is defined in the `@theme` block and is already blue-toned:

```css
@theme {
  --color-primary-gradient: linear-gradient(
    35.65deg,
    #0a2d5c -10.94%,
    #1354A2 61.04%,
    #5B9BD5 133.01%
  );
}
```

## Plan

### Step 1 — `src/styles/global.css`

Delete the `--color-primary-gradient` override currently inside the `:root[data-theme="light"]` block (lines 111-116) entirely. With no light-mode-specific override remaining, both themes will fall back to the single blue gradient defined in the `@theme` block — removing the need to maintain two separate gradient definitions.

### Step 2 — `src/components/AccordionContainer.astro`

Replace the hardcoded purple/peach stop colors with the same blue tones used in `--color-primary-gradient`, so the accordion icon's gradient matches the card-border/button gradient exactly:

```css
.active-tab .stop-color-1 {
  stop-color: #0a2d5c;
}
.active-tab .stop-color-2 {
  stop-color: var(--color-primary);
}
.active-tab .stop-color-3 {
  stop-color: #5B9BD5;
}
```

## Why this approach

- Single source of truth: the blue gradient is defined once (in `@theme`), and the accordion mirrors its exact stop values instead of using an unrelated palette.
- Removes a dead/duplicate theme-conditional override instead of maintaining two gradient definitions that can drift out of sync.
- After these two edits, there are zero remaining references to `#3a1c71` or `#ffca7b` anywhere in the codebase.

## Out of scope (noted for future follow-up, not part of this plan)

There is a broader, separate inconsistency where most `.mdx` content pages hardcode `#1354A2` (blue) / `#FFC500` (gold) directly in inline `style=` attributes, while `theme.json` defines `#305cde` (blue) / `#dec331` (gold), and `blog.mdx`/`documentation.mdx` use yet another mix. This was explicitly deferred and is not addressed here.

## Verification

- Confirm no remaining matches for `3a1c71` or `ffca7b` in the repo after edits.
- Visually check the accordion active-tab icon, card borders (`LogoCard.astro`, `NewCard.astro`), buttons (`button.css`), and the table-of-contents divider line in both light and dark mode to confirm a consistent blue gradient.

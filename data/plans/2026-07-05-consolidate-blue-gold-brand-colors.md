# Consolidate on a Single Blue + Single Gold Brand Color

**Date:** 2026-07-05

## Decision

Stop maintaining two competing blue/gold pairs (see `data/plans/color-swatches.png`). Pick exactly one canonical value for each color and make every blue/gold reference in the codebase derive from it:

- **Blue** → `#305cde` (currently `theme.json` → `colors.lightmode.theme_color.primary`). No change needed to this value — it already is what we want.
- **Gold** → `#FFC500` (currently hardcoded inline across most `.mdx` pages). This will **replace** `theme.json` → `colors.default.theme_color.primary`, which is currently `#dec331`.

## Key discovery that makes this easy

`--color-primary` (from `colors.default.theme_color.primary`) and `--color-lightmode-primary` (from `colors.lightmode.theme_color.primary`) are **both always defined on `:root` regardless of which theme is active** — they are not swapped based on `data-theme`. Only `--sl-color-accent` (Starlight's single "current accent" variable) flips between them via the `:root[data-theme="light"]` override block in `global.css`.

This means:
- `var(--color-primary)` is always the gold value, in both light and dark mode.
- `var(--color-lightmode-primary)` is always the blue value, in both light and dark mode.

That's exactly the behavior the `.mdx` pages already rely on today (e.g. "Nano" in blue, "Know" in gold, shown together regardless of theme) — so we can point that inline markup at these two CSS variables instead of hardcoded hex, with zero change in theming behavior, and gain a single source of truth.

## Interaction with the purple/peach cleanup plan

The other plan (`2026-07-05-remove-purple-peach-gradient-leftovers.md`) proposes hardcoding the accordion's gradient stops to `#0a2d5c` / `#5B9BD5`, and keeping the gradient's middle stop as literal `#1354A2`. Since this plan retires `#1354A2` as a color everywhere else, do this plan's Stage 4 *after* (or together with) that one, and swap the gradient's stops to be derived from `var(--color-lightmode-primary)` (via `color-mix()` for the darker/lighter ends) instead of standalone hex, so the gradient doesn't reintroduce a color we just deprecated.

## Incremental stages

Each stage is independently shippable and visually checkable before moving to the next.

### Stage 1 — Swap the canonical gold in `theme.json` (lowest risk, single value)

```json
"default": {
  "theme_color": {
    "primary": "#FFC500",
    ...
```

Effect: every place that already uses `var(--color-primary)` / `--sl-color-accent` in dark mode automatically updates — links, search UI outline, sidebar active icon/text, footer link hover, native form control accent, accordion middle gradient stop, Expressive Code theming. No component files need to change for this.

**Visual check:** load the site in dark mode, confirm links/active nav/search focus ring now render `#FFC500` instead of `#dec331`.

### Stage 2 — Point existing `#dec331` / `#FFC500` literals at the variable

Files: `src/content/docs/blog.mdx`, `src/content/docs/documentation.mdx` (icon colors), any other stray `#dec331` or `#FFC500` literal.

Replace with `var(--color-primary)`. No visual change expected (value is now identical after Stage 1) — this is a pure maintainability cleanup so nothing is hardcoded going forward.

### Stage 3 — Replace the `#1354A2` blue literal in `.mdx` content pages

Files (from the earlier audit): `index.mdx`, `vision.mdx`, `sign-up.mdx`, `contact.mdx`, `us-facilities.mdx`, `get-involved.mdx`, `participating-facilities.mdx`, `blog.mdx`, `documentation.mdx`, `legal/privacy-policy.mdx`, `legal/terms-of-service.mdx`, `legal/privacy-choices.mdx`.

Replace `#1354A2` → `var(--color-lightmode-primary)` in all inline `style="color: ...` attributes and `iconColor="..."` props.

**This is a visible color change** — `#1354A2` (muted navy) becomes `#305cde` (brighter blue) everywhere it appears. That's the intended outcome per your request, but worth reviewing a page or two before doing the full sweep.

### Stage 4 — Component-level one-offs

- `src/components/FacilityList.astro`: `#FFC500` (2 occurrences) → `var(--color-primary)`; `#60a5fa` / `#93c5fd` (link colors) → `var(--color-lightmode-primary)` and a lighter `color-mix()` tint of it, respectively.
- `src/components/AirtableEmbed.astro`: `#1354A2` → `var(--color-lightmode-primary)`; `#0f4080` (hover shade) → `color-mix(in srgb, var(--color-lightmode-primary), #000 20%)` or similar.
- Coordinate the gradient stops (`global.css` `@theme` block and `AccordionContainer.astro`) with the purple/peach plan as noted above, deriving from `var(--color-lightmode-primary)` instead of standalone hex.

### Stage 5 — Final audit

Re-run the same grep used for the original color audit (`#[0-9a-fA-F]{3,6}` across `src/`) and confirm the only remaining hardcoded hex values are either:
- Neutral/grayscale colors (fine to keep as-is), or
- The two canonical values themselves, expressed as literals only inside `theme.json`.

## Out of scope

- `#a78bfa` (purple) in `FacilityList.astro` and any other genuinely distinct UI-state colors (e.g. error/warning reds) are not part of this blue/gold consolidation and are left untouched.

## Rollback

Every stage touches either one config value (`theme.json`) or a small, greppable set of literal hex strings, so any stage can be reverted independently via `git diff` / `git checkout` without affecting the others.

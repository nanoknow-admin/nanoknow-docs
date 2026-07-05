# Replace Hardcoded Grays in `FacilityList.astro` with Theme Tokens

**Date:** 2026-07-05
**Status:** Not started — future work
**Context:** Follow-up from `data/docs/color-reference.md`, after auditing every `:hover` rule in the codebase for hardcoded (non-variable) color values.

## Background

`src/components/FacilityList.astro` is the only file in the codebase with genuinely hardcoded, non-variable gray hex values — including the only three literal (non-`var()`/`color-mix()`) `:hover` colors anywhere in the site (`#374151`, `#1f2937` as hover backgrounds, `#d1d5db` as hover text). Everywhere else already draws hover/accent colors from `var(--color-primary)`, `var(--color-lightmode-primary)`, or the generated `--sl-color-gray-N` scale.

Separately, while researching jovian.com's palette (`data/docs/plans/2026-07-05-jovian-color-reference.md`, `data/docs/jovian_color_reference.png`, `data/docs/jovian_grays_links.png`) we confirmed we don't need to adopt Jovian's grayscale or per-theme link-blue values — our own generated Starlight gray scale already lands almost pixel-identical to most of Jovian's tokens (coincidentally, from unrelated `color-mix()` percentages). See the comparison table in `data/docs/color-reference.md`.

## Part 1 — Swap literal hex for existing theme tokens (low risk)

Nearest-match analysis (Euclidean distance in RGB) against tokens we already generate, assuming dark-mode values (`--sl-color-gray-1` `#e8e8e9` … `-6` `#3b424f`, `--color-dark` `#1a2332`, `--color-body` `#000000`):

| Literal in `FacilityList.astro` | Used for | Replace with | Token hex | Distance | Confidence |
|---|---|---|---|---|---|
| `#374151` | toolbar/filter-btn **hover** bg | `var(--sl-color-gray-6)` | `#3b424f` | ~4.6 | Near-perfect |
| `#4b5563` | toolbar/filter-group borders | `var(--sl-color-gray-5)` | `#4a515d` | ~7.3 | Near-perfect |
| `#1f2937` | button bg, facility-summary **hover** bg, `.fl-facility` border | `var(--color-dark)` | `#1a2332` | ~9.3 | Near-perfect |
| `#111827` | state-accordion bg | `var(--color-dark)` | `#1a2332` | ~18 | Close (better than pure black) |
| `#e5e7eb` | facility/state summary text | `var(--sl-color-gray-1)` | `#e8e8e9` | ~3.7 | Near-perfect |
| `#6b7280` | muted icon/no-links text | `var(--sl-color-gray-4)` | `#676c76` | ~12.3 | Good |
| `#9ca3af` | subtitle, city, link-label text | `var(--sl-color-gray-3)` | `#92969d` | ~24.4 | Reasonable, slightly visible |
| `#d1d5db` | filter-btn **hover** text, link/main-site text | `var(--sl-color-gray-2)` | `#c0c3c6` | ~32.5 | Weakest match — will look slightly darker |
| `#1a1a1a` | `.badge-gov` text (on gold bg) | `var(--color-dark)` | `#1a2332` | ~25.6 | Weakest match — our token has a blue tint this literal doesn't |

**Not in scope for this swap** (not grayscale values):
- `#3b599855` — semi-transparent navy border on `.fl-state`. Could eventually become `color-mix(in srgb, var(--color-lightmode-primary), transparent X%)` if we want it theme-derived, but that's a distinct decision (changes hue, not just consolidates).
- `#a78bfa` — purple `:visited` link color. Explicitly out of scope per the original blue/gold consolidation plan.

### Suggested approach
Do the 6 "near-perfect"/"good" swaps (`#374151`, `#4b5563`, `#1f2937`, `#111827`, `#e5e7eb`, `#6b7280`) first — effectively zero visual change, pure de-duplication. Review the 3 "weakest match" ones (`#9ca3af`, `#d1d5db`, `#1a1a1a`) visually before committing, since they'd shift slightly.

## Part 2 — Bigger open question: `FacilityList.astro` ignores theme switching entirely

Every color in this component is a fixed literal or a var that itself doesn't change between themes in this context — there is no `:root[data-theme="light"]` override anywhere in the file. Practically, this means the facility list/accordion always renders with its current dark styling (dark backgrounds, light text) even when the rest of the site is switched to light mode.

Need a decision before doing real theming work here:
- Is this intentional (e.g. the facility list is always meant to sit on a dark section of the page, regardless of global theme)? If so, no code change needed — just worth a code comment saying so, to stop it from looking like an oversight.
- Or should it adapt to light mode like the rest of the site? If so, this is a larger follow-up than Part 1 — would need a light-mode variant for every background/text/border value in the file (not just token substitution), and should probably happen as its own dedicated pass rather than bundled with the Part 1 token cleanup.

## Out of scope / explicitly not doing

- Not importing Jovian's grayscale (`#F2F2F2` … `#151515`) or per-theme link-blue values (`#216EFF` / `#0956E6` / `#58A6FF`) — our existing generated scale already covers most of the same ground closely enough (see `data/docs/color-reference.md` § Jovian comparison), and introducing a second, differently-sourced gray scale would undo the "single source of truth" goal from the original consolidation plan.

## Verification (once implemented)

- Visually diff `FacilityList.astro` (participating-facilities/us-facilities pages) before/after the Part 1 swap — the 6 near-perfect substitutions should be visually indistinguishable; the 3 weaker ones should be reviewed side-by-side.
- Re-run a repo-wide hex audit (`grep -rnoE "#[0-9a-fA-F]{3,8}" src/`) afterward and update the "component-level one-off neutrals" table in `data/docs/color-reference.md` to remove entries that got consolidated.

# NanoKnow Docs — Current Color Reference

**Date:** 2026-07-05
**Purpose:** Living reference of the color scheme actually implemented in this codebase today, for porting the palette over to the App. Supersedes the older audit image (`data/docs/color-swatches.png`), which documents the *pre-consolidation* state.

## Status: consolidation plans are implemented

The `remove-purple-peach-gradient-leftovers` and `consolidate-blue-gold-brand-colors` plans (both dated 2026-07-05) have been fully implemented, in commit `69e2b53` ("removed hardcoding of color variables in individual pages"), and their plan files have since been removed from `data/` now that the work is done. A repo-wide grep confirms zero remaining hardcoded occurrences of the old purple/peach/navy literals (`#3a1c71`, `#ffca7b`, `#1354A2`, `#dec331`, `#305cde`, `#0a2d5c`, `#5B9BD5`, `#60a5fa`, `#93c5fd`) — everything now derives from two theme variables.

**One deviation from the written plan:** the consolidate-blue-gold plan said to keep blue at `#305cde` ("no change needed"). In practice, blue was changed to `#0D61FF` — the exact brand blue from the Jovian color research (`data/docs/plans/2026-07-05-jovian-color-reference.md`). So "some of the Jovian colors" that made it in is specifically this blue; the Jovian grayscale/link-state values were **not** adopted (see [Jovian comparison](#jovian-comparison-what-we-did--didnt-adopt) below).

## The two canonical brand colors

Everything in the site's UI — links, buttons, active borders, hover states, the accordion, the gradient, the ToC divider — traces back to exactly these two values, defined once in `src/config/theme.json`:

| Name | Hex | `theme.json` path |
|---|---|---|
| **Blue** (brand primary) | **`#0D61FF`** | `colors.lightmode.theme_color.primary` |
| **Gold** (brand secondary/accent) | **`#FFC500`** | `colors.default.theme_color.primary` |

Confirms your read — "seems like everything is basically this blue and yellow" is accurate. There are no other brand hues in the codebase (the one exception is `#a78bfa`, a purple used only for `:visited` links in `FacilityList.astro`, explicitly left out of scope by the consolidation plan).

### Important nuance: these are NOT simply "dark mode" vs "light mode" colors

Despite the `default` / `lightmode` naming in `theme.json`, **both colors are defined on `:root` at all times, regardless of which theme is active.** Nothing swaps `--color-primary` and `--color-lightmode-primary` based on `data-theme`. Instead:

- `var(--color-primary)` always resolves to gold `#FFC500`, in both themes.
- `var(--color-lightmode-primary)` always resolves to blue `#0D61FF`, in both themes.
- Individual components/pages simply choose which variable to reference (e.g. the "Know" in the NanoKnow wordmark is hardcoded to always use the gold variable; "Nano" always uses the blue variable — regardless of theme).
- The **only** thing that actually flips based on `data-theme="light"` is Starlight's own single "current accent" token, `--sl-color-accent` (and its `-low`/`-high` variants) — used for the search UI outline, native form control accent, etc. That's a `:root[data-theme="light"]` override block in `global.css` that repoints `--sl-color-accent*` from gold-based to blue-based.

## Full `theme.json` source values

```json
{
  "colors": {
    "default": {
      "theme_color": {
        "primary": "#FFC500",
        "body": "#000000",
        "light": "#f5f5f5",
        "dark": "#1a2332"
      },
      "text_color": { "text": "#e5e5e5" }
    },
    "lightmode": {
      "theme_color": {
        "primary": "#0D61FF",
        "body": "#FAF7F2",
        "light": "#2C2C2C",
        "dark": "#FFFFFF"
      },
      "text_color": { "text": "#5A5450" }
    }
  }
}
```

These get turned into CSS custom properties on `:root` by `src/tailwind-plugin/tw-theme.js` (unprefixed for `default`, `lightmode-` prefixed for `lightmode`):

| CSS variable | Hex | Typical use |
|---|---|---|
| `--color-primary` | `#FFC500` (gold) | Brand accent literal — wordmark, icons, badges, `--sl-color-accent` in dark mode |
| `--color-body` | `#000000` | Page background, dark mode (`dark:bg-body`) |
| `--color-light` | `#f5f5f5` | "Light" neutral end used to build the dark-mode gray scale |
| `--color-dark` | `#1a2332` | "Dark" neutral end used to build the dark-mode gray scale; also `--sl-color-black` |
| `--color-text` | `#e5e5e5` | Body text, dark mode (`dark:text-text`) |
| `--color-lightmode-primary` | `#0D61FF` (blue) | Brand accent literal — wordmark, links, buttons, `--sl-color-accent` in light mode |
| `--color-lightmode-body` | `#FAF7F2` | Page background, light mode (`bg-lightmode-body`) |
| `--color-lightmode-light` | `#2C2C2C` | "Light"-named but actually the *darker* end used to build the light-mode gray scale (see note below) |
| `--color-lightmode-dark` | `#FFFFFF` | "Dark"-named but actually the *lighter* end (white) used to build the light-mode gray scale; also light-mode `--sl-color-black` |
| `--color-lightmode-text` | `#5A5450` | Body text, light mode (`text-lightmode-text`) |

> **Naming gotcha to know before porting to App:** for the `lightmode` group, `light`/`dark` are semantic leftovers from the original template and are *inverted* relative to what you'd expect — `--color-lightmode-dark` is white (`#FFFFFF`) and `--color-lightmode-light` is a dark gray (`#2C2C2C`). Don't rename 1:1 assuming `dark` = a dark color.

## Brand gradient — single source, used in both themes

Defined once in `src/styles/global.css`, inside the `@theme` block (not inside a `data-theme` override), so it's identical in light and dark mode:

```css
--color-primary-gradient: linear-gradient(
  35.65deg,
  color-mix(in srgb, var(--color-lightmode-primary), #000 60%) -10.94%,
  var(--color-lightmode-primary) 61.04%,
  color-mix(in srgb, var(--color-lightmode-primary), #fff 40%) 133.01%
);
```

All three stops are computed from the single blue brand value — no independent literals to keep in sync:

| Stop | Formula | Resolved hex |
|---|---|---|
| Start (-10.94%) | `color-mix(blue, #000 60%)` | `#083a99` |
| Middle (61.04%) | `blue` itself | `#0D61FF` |
| End (133.01%) | `color-mix(blue, #fff 40%)` | `#9ec0ff` |

**Used by:** `PersonCard.astro`, `AccordionContainer.astro` (active-tab card border), `LogoCard.astro`, `NewCard.astro`, `button.css` (`.btn-primary`, `.btn-outline-primary`, outline border), `TableOfContentsList.astro` (ToC divider line), `HeroTabs.astro` (active tab underline). This is exactly the "mouseover" gradient-border effect you're seeing across the card components.

The accordion's active-tab icon stop colors (`AccordionContainer.astro`) mirror the same three values via the same `color-mix()` formulas, so the icon gradient always matches the card border gradient exactly.

## Accent variants (search UI, focus rings, subtle highlights)

Starlight derives lighter/darker tints of whichever primary is "active" for `--sl-color-accent-low` / `-high`:

| Variable | Dark mode (from gold `#FFC500`) | Light mode (from blue `#0D61FF`) |
|---|---|---|
| `--sl-color-accent-low` | `color-mix(primary, #000 90%)` → `#e6b100` | `color-mix(lm-primary, #fff 70%)` → `#5690ff` |
| `--sl-color-accent` | `#FFC500` | `#0D61FF` |
| `--sl-color-accent-high` | `color-mix(primary, #fff 70%)` → `#ffd64d` | `color-mix(lm-primary, #000 90%)` → `#0c57e6` |

## Grayscale / neutral scale

Starlight's gray scale (`--sl-color-gray-1` … `-6`, or `-7` in light mode) is **not** a fixed palette — it's generated at build time via `color-mix()` between the theme's `light`/`dark` neutral values. Computed here using the *current* `theme.json` values:

**Dark mode** — `color-mix(--color-dark #1a2332, --color-light #f5f5f5)`:

| Token | Mix | Resolved hex |
|---|---|---|
| `gray-1` | 6% dark / 94% light | `#e8e8e9` |
| `gray-2` | 24% dark / 76% light | `#c0c3c6` |
| `gray-3` | 45% dark / 55% light | `#92969d` |
| `gray-4` | 65% dark / 35% light | `#676c76` |
| `gray-5` | 78% dark / 22% light | `#4a515d` |
| `gray-6` | 85% dark / 15% light | `#3b424f` |
| `--sl-color-white` | = `--color-light` | `#f5f5f5` |
| `--sl-color-black` | = `--color-dark` | `#1a2332` |

**Light mode** — `color-mix(--color-lightmode-dark #FFFFFF, --color-lightmode-light #2C2C2C)`:

| Token | Mix | Resolved hex |
|---|---|---|
| `gray-1` | 15% white / 85% dark-gray | `#4c4c4c` |
| `gray-2` | 22% white / 78% dark-gray | `#5a5a5a` |
| `gray-3` | 35% white / 65% dark-gray | `#767676` |
| `gray-4` | 55% white / 45% dark-gray | `#a0a0a0` |
| `gray-5` | 76% white / 24% dark-gray | `#cccccc` |
| `gray-6` | 94% white / 6% dark-gray | `#f2f2f2` |
| `gray-7` | 96% white / 4% dark-gray | `#f7f7f7` |
| `--sl-color-white` | = `--color-lightmode-light` | `#2C2C2C` |
| `--sl-color-black` | = `--color-lightmode-dark` | `#FFFFFF` |

Fun coincidence: light-mode `gray-6` (`#f2f2f2`) lands almost exactly on Jovian's `gray-100` (`#F2F2F2`), purely because of the mix percentages chosen — not an intentional adoption of Jovian's grayscale.

**Known documentation bug (not a visual bug):** `global.css` has stale inline comments recording the *old* resolved hex values from before the rebrand (e.g. `/* color-dark: #040404 */`, `/* color-lightmode-light: #181818 */`, and per-token comments like `/* #eeeeee */`). Those comments no longer match the actual computed output shown above, because `theme.json`'s `dark`/`light` values changed but the comments were never updated. The CSS itself is correct (it's all variable-driven); only the comments documenting expected output are outdated. Worth a quick cleanup pass in `global.css` if you want the file to be self-documenting again, but it's cosmetic — nothing renders incorrectly.

**Other hardcoded literals:** `--sl-color-hairline-light: #252525` (used once, in `SidebarSublist.astro`) is a standalone literal, not derived from the color-mix scale above.

## Component-level one-off neutrals (not derived from `theme.json`)

These are outside the two-color system above — plain Tailwind-gray-style literals used ad hoc in a handful of components/pages. Flagging them since you asked to note "all of the grays we're using":

| File | Hex(es) | Context |
|---|---|---|
| `FacilityList.astro` | `#9ca3af`, `#4b5563`, `#1f2937`, `#d1d5db`, `#374151`, `#3b599855`, `#111827`, `#e5e7eb`, `#6b7280`, `#1a1a1a` | Self-contained styling for the facility accordion list (toolbar, borders, backgrounds, text) |
| `FacilityList.astro` | `#a78bfa` | Purple, `:visited` link color only — explicitly out of scope for the blue/gold consolidation |
| `components.css` | `#999999` | Icon mask background color |
| `CTA.astro` | `#f9fafb` | Light-mode CTA background override |
| `override-components/TableOfContents.astro` | `#A3A3A3` | Mobile ToC hamburger icon stroke |
| `us-facilities.mdx` | `#333`, `#6c757d` | Inline map border / caption text |
| `vision.mdx` | `#333`, `#888` | Inline text colors |
| Various `.astro` components | `#fff` / `#000` | Used only as `color-mix()` blend endpoints (to lighten/darken the brand colors) or as literal icon fill — not standalone brand grays |

None of these are part of the blue/gold system and weren't touched by the consolidation plan. If you want a fully unified neutral palette in App, these would need a separate pass.

## Jovian comparison — what we did / didn't adopt

From `data/docs/plans/2026-07-05-jovian-color-reference.md`:

| Jovian value | Adopted here? |
|---|---|
| Brand blue `#0D61FF` | ✅ Yes — this is now our `--color-lightmode-primary`, used in both themes |
| Grayscale (`gray-100` `#F2F2F2` … `gray-900` `#151515`) | ❌ No — we generate our own scale via `color-mix()`, seeded from `theme.json`'s `light`/`dark` values (see above) |
| Link blues (`#216EFF` light default / `#0956E6` light hover / `#58A6FF` dark) | ❌ No — we use a single blue (`#0D61FF`) for links in both modes, no separate hover shade beyond `color-mix()` lightening |
| Full brand blue Tailwind scale (50–900) | ❌ No — not imported; we only took the single 500/brand value |
| "Not quite black/white" text convention | ❌ No — our dark-mode body text is `#e5e5e5` / light-mode is `#5A5450`, chosen independently, not derived from Jovian's `#F2F2F2`/`#151515` |

## Open question — noted, not yet decided or implemented

You mentioned possibly wanting the light-mode pages to use a *different* blue and gold than dark mode (rather than the current single shared pair). **This has not been implemented anywhere in the codebase today** — currently there is exactly one blue (`#0D61FF`) and one gold (`#FFC500`), each used identically regardless of theme. If/when you decide on separate light-mode values, that would be a new, deliberate change on top of the current single-pair architecture (and would need to revisit the `--sl-color-accent*` override block, the shared gradient, and every hardcoded `var(--color-primary)` / `var(--color-lightmode-primary)` reference across `.mdx` pages and components listed above).

## Quick cheat-sheet for porting to App

```
Blue (brand primary, both themes): #0D61FF
Gold (brand accent, both themes):  #FFC500

Dark mode neutrals:
  background: #000000        text: #e5e5e5
  scale ends: light #f5f5f5  dark #1a2332

Light mode neutrals:
  background: #FAF7F2        text: #5A5450
  scale ends: "dark" #FFFFFF (white)  "light" #2C2C2C (dark gray)

Gradient (both themes, blue-derived):
  #083a99 → #0D61FF → #9ec0ff  @ 35.65deg

Purple (visited links only, not brand): #a78bfa
```

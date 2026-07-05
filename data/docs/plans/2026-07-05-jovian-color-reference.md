# Jovian.com Color Reference

**Date:** 2026-07-05
**Purpose:** Reference only — external research on jovian.com's color palette, gathered while exploring brand-blue values for our own consolidation work. Not a plan for our codebase.

**Source:** values extracted directly from jovian.com's compiled production CSS (`_next/static/css/*.css`) and rendered HTML class names, not from marketing/brand pages. Inspected 2026-07-05.

![Jovian color reference](jovian_color_reference.png)

## Key finding: their "white" isn't white

Jovian never uses pure `#FFFFFF` or `#000000` for text, even in "high contrast" spots:

- Dark-mode heading/emphasis text uses `dark:text-gray-100` → **`#F2F2F2`**, not `#FFFFFF`.
- Light-mode heading/emphasis text uses `text-gray-900` → **`#151515`**, not `#000000`.

Pure white (`#FFFFFF`) does appear, but only for **backgrounds** (e.g. the light-mode header bar uses `bg-white`), never for text. This is a common accessibility/eye-strain practice — pure black-on-white or white-on-black has more contrast than is comfortable for extended reading, so text colors are pulled in slightly from the extremes while backgrounds can stay at full white/near-black.

## Grayscale

| Token | Hex | Used for |
|---|---|---|
| `gray-100` | `#F2F2F2` | Dark-mode heading/emphasis text |
| `gray-300` | `#CCCCCC` | Dark-mode body text |
| `gray-400` | `#909090` | Muted/secondary text |
| `gray-500` | `#686868` | Muted/secondary text |
| `gray-600` | `#333333` | Borders / dividers |
| `gray-700` | `#2C2C2C` | Light-mode body text |
| `gray-800` | `#262626` | Light-mode heading text (alt) |
| `gray-900` | `#151515` | Light-mode heading text **and** dark-mode page background |
| `white` | `#FFFFFF` | Backgrounds only (e.g. light-mode header) |

## Link colors (light vs. dark mode)

Found on an actual anchor element (`text-blue-400 hover:text-blue-600 dark:text-blue-link`) on a course page:

| State | Hex | Note |
|---|---|---|
| Light mode (default) | `#216EFF` | Tailwind `blue-400` on their custom scale |
| Light mode (hover) | `#0956E6` | Tailwind `blue-600` on their custom scale |
| Dark mode | `#58A6FF` | Custom semantic token `blue-link` — identical to GitHub's well-known dark-mode link blue |

## Full brand blue scale

Their Tailwind config defines a custom `blue` palette centered on the brand color:

| Shade | Hex |
|---|---|
| 50 | `#F6F9FF` |
| 100 | `#C3D8FF` |
| 200 | `#6A9EFF` |
| 300 | `#3F82FF` |
| 400 | `#216EFF` |
| **500 (brand)** | **`#0D61FF`** |
| 600 | `#0956E6` |
| 900 | `#042C77` |

`blue-500 = #0D61FF` matches the brand color registered in the [Simple Icons](https://iconbuddy.com/simple-icons/jovian) collection, confirming it as their canonical brand blue.

## Dark mode trigger

```html
<style>html.dark { background-color: #151515; color-scheme: dark }</style>
```

Dark mode is a simple `.dark` class on `<html>`, with `#151515` set inline before the main stylesheet loads (avoids flash-of-wrong-background on load).

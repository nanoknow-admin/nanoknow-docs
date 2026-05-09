# Hero Description Box

Add a styled bounding box with descriptive text into the hero section of the home page, below the tagline.

## Context

- The hero is rendered by `src/components/override-components/Hero.astro`
- A previous search bar + quick links section occupied this same slot (removed in commit `56f36c8`) — we follow similar patterns
- Hero height is driven by the background image (`min-height: min(856px, 85vh)`) — preserve this
- The `heroBG` script auto-sizes the background div to match hero content height, so no script changes needed

## Text Content

> NanoKnow is an open AI-enabled knowledge platform for sharing nanofabrication documentation, process expertise, and training resources across labs, institutions, and research communities.

## Changes

### 1. `Hero.astro` — Add description box markup

Insert after the tagline `<p>`, guarded by `!is404`:

```astro
{!is404 && (
  <div class="hero-description-box">
    NanoKnow is an open AI-enabled knowledge platform for sharing
    nanofabrication documentation, process expertise, and training
    resources across labs, institutions, and research communities.
  </div>
)}
```

### 2. `Hero.astro` — Add styles

Add to the existing `<style>` block, inside `@layer starlight.core`:

- `.hero-description-box` — max-width ~700px, rounded corners, translucent background + border using `color-mix` (matching existing site conventions), `backdrop-filter: blur`, subtle box-shadow, centered text
- Light mode variant via `:root[data-theme="light"] .hero-description-box`
- Mobile responsive sizing via `@media (max-width: 940px)`

### 3. `Hero.astro` — Adjust vertical padding

Reduce top padding on the hero div to shift title/tagline up and make room for the box within the existing hero height:

- Current: `pt-36 md:pt-44 lg:pt-56`
- Target: approximately `pt-24 md:pt-32 lg:pt-40` (tune visually)

### 4. No other files need changes

- `index.mdx` — unchanged
- `PageFrame.astro` — unchanged
- Background auto-sizing script — already handles dynamic hero height

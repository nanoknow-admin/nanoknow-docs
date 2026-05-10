# Hero Description Box

Add a styled bounding box with descriptive text into the hero section of the home page, below the tagline.

## Context

- The hero is rendered by `src/components/override-components/Hero.astro`
- A previous search bar + quick links section occupied this same slot (removed in commit `56f36c8`) — we follow similar patterns
- Hero height is driven by the background image (`min-height: min(856px, 85vh)`) — preserve this
- The `heroBG` script auto-sizes the background div to match hero content height, so no script changes needed

## Text Content

> NanoKnow is an open AI-enabled knowledge platform for sharing nanofabrication documentation, process expertise, and training resources across labs, institutions, and research communities.

## Steps

### Step 1: Add the description box markup

File: `src/components/override-components/Hero.astro`

Insert after the tagline `<p>` (line 25), guarded by `!is404`:

```astro
{!is404 && (
  <div class="hero-description-box">
    NanoKnow is an open AI-enabled knowledge platform for sharing
    nanofabrication documentation, process expertise, and training
    resources across labs, institutions, and research communities.
  </div>
)}
```

- [ ] Markup added after tagline
- [ ] Guarded with `!is404` so it doesn't appear on the 404 page

### Step 2: Add dark-mode styles for the box

File: `src/components/override-components/Hero.astro` — inside `<style>` > `@layer starlight.core`

```css
.hero-description-box {
  max-width: 700px;
  margin-top: 2.5rem;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  border: 1.5px solid color-mix(in srgb, var(--sl-color-white) 15%, transparent);
  background: color-mix(in srgb, var(--sl-color-black) 40%, transparent);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
  font-size: 1.15rem;
  line-height: 1.7;
  text-align: center;
  color: var(--sl-color-gray-2);
}
```

- [ ] Box has translucent background with blur
- [ ] Border uses `color-mix` consistent with site conventions
- [ ] Subtle shadow for depth

### Step 3: Add mobile responsive styles

File: same `<style>` block, inside the existing `@media (max-width: 940px)` rule

```css
.hero-description-box {
  font-size: 1rem;
  padding: 1.25rem 1.5rem;
  max-width: 90%;
}
```

- [ ] Smaller font and padding on mobile
- [ ] Box takes up to 90% width on small screens

### Step 4: Adjust hero vertical padding

File: `src/components/override-components/Hero.astro` — the hero `<div>` (line 21)

Reduce top padding to shift title/tagline up and make room for the box within the existing hero height:

- Current: `pt-36 md:pt-44 lg:pt-56`
- Target: approximately `pt-24 md:pt-32 lg:pt-40` (tune visually)

- [ ] Padding reduced
- [ ] Title/tagline/box all fit within the hero background height

### Step 5: Visual verification

- [ ] Box visible with translucent bg, readable text, subtle glow/shadow
- [ ] Mobile: box scales down, text remains readable
- [ ] NanoKnow title and tagline unchanged in appearance
- [ ] Hero background image still covers the full hero section

## Files touched

Only `src/components/override-components/Hero.astro` — no other files need changes.

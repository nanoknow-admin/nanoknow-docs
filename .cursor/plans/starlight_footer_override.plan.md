---
name: Starlight footer override
overview: Replace the custom manually-wired footer with a proper Starlight `Footer` component override that renders on all pages, using a simplified layout (link columns + copyright, no email form).
todos:
  - id: register-override
    content: Add `Footer` to Starlight component overrides in astro.config.mjs
    status: pending
  - id: rewrite-footer
    content: "Rewrite Footer.astro: simplified layout with link columns + copyright, Tailwind styling, no email form"
    status: pending
  - id: clean-pageframe
    content: "Remove manual Footer import/render and `footer { display: none }` from PageFrame.astro"
    status: pending
  - id: clean-config
    content: Remove footer_contact from config.json
    status: pending
isProject: false
---

# Starlight Footer Override

## Current State

- [Footer.astro](src/components/override-components/Footer.astro) is a custom component manually imported in [PageFrame.astro](src/components/override-components/PageFrame.astro) line 74 -- only renders on non-sidebar pages
- Contains: 3 link columns, email form, social icons (empty array), copyright
- 100 lines of custom CSS that doesn't leverage Tailwind (which is installed)
- Not registered as a Starlight component override

## Plan

### 1. Register Footer as a Starlight component override

In [astro.config.mjs](astro.config.mjs), add `Footer` to the `components` object:

```javascript
Footer: "./src/components/override-components/Footer.astro",
```

This makes the footer render automatically on **every page** via Starlight's layout system.

### 2. Rewrite Footer.astro

Simplify to:
- **Link columns** from `menu.en.json` (Community, About, Coming Soon) -- laid out in a responsive grid
- **Copyright line** from `config.json`
- **Drop** the email form and social icons section (social array is empty anyway)
- Use **Tailwind classes** instead of custom `<style>` block for cleaner, more maintainable styling that integrates with Starlight's design tokens
- Keep the `@layer starlight.core` wrapper only if needed for specificity; prefer Tailwind utilities

### 3. Remove manual Footer import from PageFrame.astro

- Remove the `import Footer` line (line 3) and the `{!hasSidebar && <Footer />}` render (line 74) from [PageFrame.astro](src/components/override-components/PageFrame.astro)
- Remove the now-unnecessary `footer { display: none; }` CSS rule (line 103-105)

### 4. Clean up config

- Remove `footer_contact` from [config.json](src/config/config.json) since the email form is being dropped
- Social icons can stay in [social.json](src/config/social.json) for the header; footer won't reference them

### Files changed
- `astro.config.mjs` -- add Footer override
- `src/components/override-components/Footer.astro` -- rewrite
- `src/components/override-components/PageFrame.astro` -- remove manual footer
- `src/config/config.json` -- remove `footer_contact`

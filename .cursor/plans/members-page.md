# Members Page Plan

## Goal
Create a "Members" page showcasing NanoKnow member facilities with their logos.

## Layout (top to bottom)

1. **Splash heading** — "Our Members" in the site's blue/gold style, subtitle about partnership
2. **Combined logo banner** — `CNF_PMI_ASRC_SNF_combined_logos.png` centered and prominent
3. **Individual logo cards** — 4 cards in a horizontal row (1 per member), each with:
   - Logo image (centered, white background for contrast)
   - Facility name
   - Optional link to external site
4. **CTA section** — "Become a Member" prompt linking to `/contact/`

## Files to create/modify

### New files
- `src/content/docs/members.mdx` — the page itself (splash template)
- `src/components/user-components/LogoCard.astro` — reusable card for displaying a logo image

### Modified files
- `src/config/sidebar.json` — add "Members" entry to nav

## Implementation details

### `LogoCard.astro`
- Props: `src` (image src string), `alt` (alt text), `name` (facility name), `href` (optional link)
- White/light rounded card background so logos pop on the dark theme
- Image centered with `object-fit: contain`
- Facility name centered below the image
- Hover effect matching existing card style (gradient border)
- If `href` provided, entire card links externally

### `members.mdx`
- `template: splash` (full-width, no sidebar — matches facilities/get-involved pages)
- Import existing `Section` and `LinkButton` components
- Import all 5 logo PNGs from `~/assets/nanofab_logos/`
- Use a flex row (`display: flex; justify-content: center`) for the 4 individual logo cards
- Combined logo displayed as a centered `<img>` above the cards

### `sidebar.json`
- Add `{ "label": "Members", "slug": "members" }` entry

## Component reuse
- `Section.astro` — page section wrapper (existing)
- `LinkButton.astro` — CTA button (existing)
- `LogoCard.astro` — new, placed in `user-components/`
- No changes to override-components

## Logo files (already in place)
| File | Facility |
|------|----------|
| `stanford_at_nano_transparent.png` | Stanford nano@stanford |
| `PMI-color-transbkgd.png` | Princeton Materials Institute |
| `cornell_cnf_transparent.png` | Cornell NanoScale (CNF) |
| `ASRC_GC_Color.png` | ASRC, CUNY Graduate Center |
| `CNF_PMI_ASRC_SNF_combined_logos.png` | Combined banner |

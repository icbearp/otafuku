---
name: Xiongqi Corporate Hub
description: A restrained Chinese corporate gateway routing visitors through three independent businesses with clarity and trust.
colors:
  forest-deep: "#0e2b22"
  forest-dark: "#123a2d"
  forest-brand: "#174c3a"
  forest-action: "#257357"
  paper: "#f4f1e8"
  paper-raised: "#faf8f2"
  mist: "#e4e9e3"
  ink: "#151a17"
  muted: "#5f6963"
  focus: "#76bd9e"
  error: "#a63d32"
typography:
  display:
    fontFamily: '"Noto Sans SC Variable", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "clamp(58px, 7.2vw, 100px)"
    fontWeight: 760
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Noto Sans SC Variable", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "clamp(42px, 6vw, 82px)"
    fontWeight: 740
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  body:
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif'
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif'
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: "0.12em"
rounded:
  field: "12px"
  panel: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.forest-deep}"
    rounded: "{rounded.pill}"
    padding: "13px 21px"
    height: "50px"
  button-dark:
    backgroundColor: "{colors.forest-brand}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "13px 21px"
    height: "50px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "14px 15px"
  portal-card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
---

# Design System: Xiongqi Corporate Hub

## Overview

**Creative North Star: "The Corporate Field Guide"**

Xiongqi is a high-end Chinese corporate transfer station, not a marketplace collage. Its visual world combines the decisiveness of a transit map with the material calm of a well-made field guide: a deep forest-green opening, direct routing, large editorial typography, and clearly separated business territories. The parent brand feels established and warm while apparel, ceramics, and AI retain distinct material expressions.

The system is spacious but not ceremonial. Asymmetric splits, thin rules, restrained labels, and explicit operating boundaries organize information. Motion explains entry, direction, and state; it never becomes ambient spectacle. Future sub-sites inherit the parent system's type, navigation discipline, interaction color, and truthfulness while developing product-specific imagery and density.

**Key Characteristics:**

- Forest-green authority against warm paper, with green as the only shared interaction accent.
- Oversized variable sans display type paired with dependable system CJK body text.
- Asymmetric desktop compositions that collapse into an explicit single-column reading order.
- Route lines, numbered labels, and field-guide structures that clarify direction and boundaries.
- Thin dividers, small corner radii, limited shadows, and restrained state-driven motion.

## Colors

The palette is botanical, warm, and credible. Forest greens establish the parent brand; paper neutrals keep Chinese copy approachable; portal materials remain subordinate to navigation.

### Primary

- **Deep Forest** (`forest-deep`): hero and footer grounds.
- **Brand Forest** (`forest-brand`): primary dark controls and parent-brand actions.
- **Action Fern** (`forest-action`): links, hover states, and successful outcomes.

### Secondary

- **Focus Mint** (`focus`): keyboard focus and rare route-point activation, never decoration.
- **Boundary Red** (`error`): form errors only.

### Neutral

- **Warm Paper** (`paper`): default page surface and light-on-dark text.
- **Raised Paper** (`paper-raised`): portal, form, and mobile-menu surfaces.
- **Quiet Mist** (`mist`): secondary grounds and low-emphasis hover fills.
- **Near-Black Ink** (`ink`): primary text.
- **Slate Moss** (`muted`): descriptions, captions, and secondary navigation.

**The One Green Rule.** Forest green is the only shared interactive accent. Apparel navy, ceramic clay, and AI silver may describe portal material, but must not become competing CTA colors.

**The Boundary Color Rule.** Red is reserved for errors and mint for focus or route activation; neither is general decoration.

## Typography

**Display Font:** Noto Sans SC Variable with PingFang SC and Microsoft YaHei fallbacks  
**Body Font:** PingFang SC / Microsoft YaHei / Noto Sans CJK SC, with Arial for Latin fallback

**Character:** Display type is broad, heavy, tightly tracked, and architectural. Body type is intentionally ordinary and dependable so company claims, product boundaries, and forms remain effortless to read.

### Hierarchy

- **Display** (760, fluid 58–100px, 0.98): hero slogans only; mobile uses 52–68px.
- **Headline** (740, fluid 42–82px, 1.05): section and company-level propositions.
- **Portal Title** (strong variable weight, fluid 40–70px, 1.03): short business names, normally near nine characters wide.
- **Body** (400, 17px, 1.8): explanations and boundaries; keep blocks near 40–52 Chinese characters in visual width.
- **Label** (700, 10–13px, tracking up to 0.12em): English identifiers, route metadata, captions, and compact states.

**The Two-Voice Rule.** Use Noto Sans SC Variable only for display roles; body, navigation, fields, and supporting copy stay on the system CJK stack.

**The Compression Rule.** Tight tracking belongs to large headings only, never paragraphs, fields, or status copy.

## Layout

The content container is capped at 1400px with 24px desktop side insets and 16px mobile insets. Desktop uses unequal columns rather than centered card grids: hero copy occupies roughly two-thirds, statements pair a wide headline with narrow explanation, and portals alternate copy/media dominance. Major sections use roughly 120–150px vertical space; components follow the 8/12/16/24/48 rhythm.

At 960px, navigation becomes a contained menu and portal/cooperation splits become one column. At 767px, the route rail becomes a vertical list, reverse ordering disappears, media follows its heading, and form pairs become single fields. Semantic reading order must remain correct without CSS order.

**The Alternating Portal Rule.** Wide screens alternate copy and media. Narrow screens always resolve to copy first and evidence second.

**The Route-First Rule.** Visitors encounter the three destinations before company exposition; sub-sites inherit the same clarity of primary route.

## Elevation & Depth

The system is flat by default. Thin rules, tonal changes, clipping, and material contrast establish most hierarchy. Forest-tinted shadows are reserved for portals, forms, and the mobile menu. The translucent fixed header may use blur with an opaque paper fallback.

### Shadow Vocabulary

- **Portal lift** (`0 26px 72px rgba(14, 43, 34, 0.16)`): portals and mobile navigation.
- **Form lift** (`0 20px 54px rgba(14, 43, 34, 0.12)`): inquiry form only.
- **AI offset** (`20px 24px 0 rgba(18, 58, 45, 0.16)`): the structural field-guide artifact only.

**The Flat-by-Default Rule.** Use either a structural border or a raised shadow to define a generic surface, not both.

## Shapes

Major portal, menu, form, and cooperation containers use a 16px radius; fields use 12px; buttons, chips, icon controls, and route points use pills or circles. The AI guide stays rectilinear. Full-bleed dark sections and the footer remain square.

**The Small-Corner Rule.** Sixteen pixels is the maximum for ordinary panels; full pills are reserved for compact controls and taxonomy.

## Components

### Buttons

- **Shape:** compact full pill, at least 50px high for primary actions.
- **Dark / light:** Brand Forest on Warm Paper; reverse this on Deep Forest.
- **Hover / active:** hover lifts 1–2px within the same color family; active presses 1px and scales to 0.985.
- **Focus / disabled:** 3px Focus Mint outline with 4px offset; disabled reduces opacity and loses available-state motion.

### Chips

- **Style:** transparent fill, 1px quiet divider, pill shape, 13px muted text, 8px × 12px padding.
- **Role:** factual capability taxonomy only, never alternate CTAs.

### Cards / Containers

- **Portal:** alternating copy/media split, 16px clipping radius, Raised Paper copy ground, one evidence field.
- **Material:** apparel uses cool product presentation, ceramics tactile studio imagery, and AI a structured silver-green guide.
- **Caption:** every provisional or directional image carries a small muted status or boundary caption.

### Inputs / Fields

- **Style:** Warm Paper fill, 1px divider, 12px radius, 14px × 15px padding, 14px semibold label.
- **Focus:** border becomes Action Fern with a restrained translucent 3px ring.
- **States:** success uses Action Fern, errors use Boundary Red, loading replaces the submit label, and messages use live regions.

### Navigation

- **Desktop:** fixed translucent paper header, brand left, centered links, utilities right, and one forest pill CTA.
- **Mobile:** raised full-width menu below the 68px header; Escape closes and focus returns to the trigger.
- **Route map:** thin line with three circular stops on desktop; bordered vertical list on mobile.

### Business Portal

The signature inheritable pattern contains a short title, one positioning statement, concise boundary-aware description, capability chips, destination state, material/evidence field, and caption. Pending destinations are unavailable statuses, never deceptive links.

## Do's and Don'ts

### Do:

- **Do** preserve the forest-green parent frame and approved bear mark across the hub and sub-sites.
- **Do** use oversized Chinese display type for conviction, then ordinary system body type for explanation.
- **Do** make route, destination state, evidence status, and operating boundaries explicit.
- **Do** keep content and destinations configurable rather than encoding claims in presentational components.
- **Do** provide visible focus, semantic order, 44px-plus targets, and reduced-motion behavior.
- **Do** let each sub-site develop one material world while retaining the parent interaction color and discipline.

### Don't:

- **Don't** turn the hub into a generic SaaS gradient page, centered dashboard grid, or interchangeable card collection.
- **Don't** introduce decorative serif, monospace costume, neon gradients, glass panels, or rainbow category CTAs.
- **Don't** combine multiple shadows, heavy borders, and large radii on one surface.
- **Don't** animate continuously, hijack scroll, or make meaning depend on reveal motion.
- **Don't** fabricate prices, inventory, statistics, customer proof, certifications, or destination availability.
- **Don't** present a concept image or pending sub-site as a confirmed commercial offer.

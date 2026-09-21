# Apple iOS 26 / Liquid Glass — Design Language Reference

> Project design reference for tech//site, alongside the production-SaaS quality bar.
> Principle: **content-first + floating controls + depth + translucency + hierarchy + restraint + responsiveness.**
> This is a hierarchical, content-first, dynamically layered interface influenced by modern iOS design principles — NOT a glassmorphism website.

## 1. Two-Layer Interface Model

**Content layer (primary, dominant):** data, pages, lists, genuinely-useful cards, charts, images, editorial/product content, workflows, dashboards, forms, tables, user content. Do NOT cover primary content with unnecessary glass.

**UI / navigation layer (floating, functional):** navigation, tab bars, top toolbars, search controls, floating actions, contextual/compact utility controls, overlays, transient controls. Liquid Glass is a functional layer floating above content, not a universal surface.

## 2. Transparency Must Be Functional

Every translucent surface must answer: **why should the user see content behind this element?**

Use when it creates: spatial depth, context, continuity, separation, floating navigation, persistent controls, UI↔content connection.

Avoid when it: reduces readability, makes dense content harder to scan, adds noise, lets surfaces compete, or looks like generic glassmorphism.

## 3. Liquid Glass Behavior

Translucent, dynamic, adaptive, lightweight, spatial, responsive, integrated with content beneath. Should feel like background sampling, adaptive blur, subtle translucency, light response, edge highlights, depth separation — never static CSS blur.

## 4. No Glass-on-Glass (HARD RULE)

No nested glass surfaces: glass container → glass card → glass button → glass badge produces mud and destroys hierarchy. For elements sitting on glass, use solid/semantic fills, subtle opacity, vibrancy, typography, spacing, contrast.

## 5. Regular vs Clear Materials

- **Regular (default):** more adaptable, better legibility, stronger separation. For most navigation/control surfaces.
- **Clear (rare):** more transparent, needs careful contrast management. Only where underlying content genuinely benefits from staying visible. Never mix indiscriminately.

## 6. Hierarchy Over Decoration

Never use borders/shadows/gradients/backgrounds just to "look designed." Hierarchy comes from: position → scale → grouping → spacing → typography → contrast → material → motion → color.

## 7. Depth System

```
BACKGROUND → CONTENT → FLOATING NAVIGATION → CONTEXTUAL CONTROLS → MODAL / TEMPORARY SURFACE
```

Communicate depth with blur, transparency, subtle shadows, edge highlights, scale, motion, contrast shifts. No heavy shadows. Depth should feel almost physical but extremely subtle.

## 8. Edge-to-Edge Content

Let content extend beneath floating navigation/toolbar regions. Navigation floats above; content continues underneath. Don't box everything in rigid rectangles.

## 9. Floating Navigation

Prefer detached controls (floating tab bar / toolbar / search / pill) over the `HEADER / CONTENT` slab sandwich. But don't turn every control into a pill — group by importance.

## 10. Scroll Interaction

- **At rest:** navigation more translucent, integrated, less prominent.
- **Scrolling:** more contrast, adapted opacity, condensed, more distinct.
- **Focus change:** recede secondary controls, promote the active surface.

## 11. Interaction States

Hover/press: subtle illumination, tonal change, tiny scale/position response, increased contrast, gentle highlight, immediate feedback. No large scaling, bounce, strong glow, neon, or excess spring. Fluid and physical, not playful.

## 12. Color Philosophy

Color communicates action, selection, status, focus, meaning. Don't flood UI with brand color; let content carry personality. Structure: content (personality) → navigation (restrained) → primary action (strongest accent) → secondary (subdued) → metadata (low emphasis).

## 13. Typographic Hierarchy

Display → page title → section heading → primary → secondary → metadata → supporting. Typography does most hierarchy work via weight, size, contrast, line-height, spacing, position. System-style type for dense UI; custom fonts only where brand benefits.

## 14. Corner Geometry

Deliberate radius system, not giant rounded rectangles everywhere: large surfaces softer; floating controls medium/capsule where apt; buttons and inputs restrained; lists grouped rather than card-like.

## 15–16. Lists First, Cards Earned

Prefer grouped lists, section headers, dividers, disclosure rows, inline metadata for dense screens. A card must represent meaningful grouping (separation, scannability, independent actions) — never `Card Card Card Card` where a list communicates better.

## 17. Modals / Sheets

Temporary UI must feel temporary: dimmed background where apt, strong spatial separation, clear hierarchy, strong primary action, natural motion. Content stays recognizable where context matters.

## 18. Toolbars and Controls

Lightweight: icon, label, spacing, grouping, material — over border, heavy background, shadow, gradient, glow. Prominence from context and grouping.

## 19. Accessibility Must Survive Transparency

Always verify: text contrast, symbol visibility, focus states, reduced transparency, reduced motion, dynamic type, keyboard nav, touch targets, screen-reader semantics. If translucency hurts legibility, add backing/contrast.

## 20. Responsive Materials

- **Desktop:** spacious, floating nav, side panels, larger hierarchy.
- **Tablet:** adaptive splits, flexible nav, more simultaneous content.
- **Mobile:** compact floating controls, bottom patterns, edge-to-edge, primary-content focus.
Never just scale desktop down.

## 21. Design Tokens

Centralize materials instead of hard-coding: glass opacity/blur/saturation/border/highlight/shadow/tint; surface background/secondary/elevated; text primary/secondary/tertiary; separator; accent/success/warning/error; radius sm–xl; space xs–xl.

## 22. Visual Test (per screen)

Hierarchy (what/w primary/primary action/secondary/nav instantly clear?) · Material (does glass improve it?) · Depth (foreground vs background legible?) · Restraint (anything shouting?) · Content (content still the star?) · Native feel (believable in Apple's ecosystem?) · Consistency (same system as every other screen?).

## 23. Absolute Anti-Patterns

Blur/glass everything · glass-in-glass · huge translucent panels · excessive pills · heavy shadows · excessive gradients · neon · white borders · fake reflections · glow · decorative glassmorphism · every section a floating card · oversized type · excessive animation · fake depth · random floating buttons.

## 24. Final Target

Apple-like hierarchy + Liquid Glass-inspired depth + professional SaaS precision + modern minimalism + excellent IA + real-time responsiveness + original identity. Polish must come from the whole system — no single gimmicky effect.

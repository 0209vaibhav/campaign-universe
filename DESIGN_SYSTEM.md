# Campaign Universe — Design System

## Concept

The visual language is built around a single constraint: everything serves the map. The tool should feel like a creative agency's internal instrument — precise, editorial, and quietly confident. No decoration that doesn't carry meaning. The orbital metaphor extends into the UI: the sidebar recedes, the canvas commands, and the typography creates hierarchy through weight and tracking rather than size.

---

## Color

One accent color per layout. Campaign Universe uses Burn Rust throughout.

| Role | Value |
|---|---|
| Canvas background | `#111111` |
| Panel / card background | `#161616` |
| Elevated surface | `#0E0E0E` |
| Primary text | `#F2EFE8` — Burn cream |
| Secondary text | `#9A958C` — warm muted |
| Tertiary / disabled | `#6B6B6B` |
| Accent | `#BF4723` — Burn rust |
| Border | `#333333` |
| Subtle border | `#444444` |

The accent color appears on: active node rings, connection lines, the orbit tracks, the BUILD UNIVERSE button, the active preset indicator, and platform labels in the detail panel. Nowhere else.

---

## Typography

Three typefaces. Each has a single job.

**ABC Camera Plain Medium** — display headings, node titles, panel headers, campaign title bar. Never used for labels or metadata.

**ABC Camera Plain Regular** — body text, descriptions, input fields, placeholders. 12–13px. Line height 1.5–1.6.

**SimpsonCW Medium** — labels, metadata, tags, button text, legend items. Always uppercase. Always wide tracking (0.15–0.20em). Never below 7px or above 10px. This font only appears in contexts where you'd use a badge or a caption — never in running text.

The discipline: if you're writing a sentence, it's ABC Camera. If you're writing a label, it's Simpson.

---

## Surface & Texture

Dark surfaces carry a diagonal crosshatch overlay — two repeating linear gradients at ±45°, `rgba(255,255,255,0.04)`, 12–16px spacing. Subtle enough that it reads as texture, not pattern. Applied to both the left panel and the canvas background.

Panels use `#161616` with a `1px solid #333` border. No box-shadow. No blur. Elevation is communicated through color step alone.

---

## Shape

No rounded corners on any primary container, panel, button, or input. `border-radius: 0` everywhere. This is non-negotiable — it defines the editorial character of the tool and distinguishes it from consumer SaaS.

The only curves in the interface are the orbital rings and node circles on the canvas, which are part of the visualization metaphor, not UI chrome.

---

## The Campaign Map

The map is an SVG canvas that fills the available viewport. Key measurements:

| Element | Value |
|---|---|
| Canvas viewBox | 900 × 680 |
| Hero node radius | 50px |
| Ring 1 orbit radius | 158px |
| Ring 2 orbit radius | 272px |
| Ring 1 satellite radius | 28px |
| Ring 2 satellite radius | 24px |

**Hero node** — solid rust fill, play icon, locked to canvas center. Not draggable. Clicking opens the detail panel.

**Ring 1 nodes** — solid rust stroke, full opacity platform label. These are launch-tier assets derived directly from the hero film.

**Ring 2 nodes** — dashed rust stroke, reduced opacity. These are reach-extension assets that exist independently within the campaign world.

**Orbit tracks** — Ring 1 at `rgba(191,71,35,0.45)`, Ring 2 at `rgba(191,71,35,0.30)`. Dashed. Visible enough to read as structural guides, not decorative.

**Connection lines** — dashed rust lines from hero center to each satellite. Opacity reduces when a node is selected, drawing focus to the active node.

**Dragging** — satellite nodes are draggable, constrained to their orbit ring. The pointer angle from center is projected onto the fixed ring radius. This preserves the orbital hierarchy even when the user rearranges nodes.

---

## Interaction States

**Default** — node at rest, connection lines at 22% opacity.

**Hover** — soft glow filter, hover ring at 30% opacity. Connection line to that node brightens.

**Selected** — 2.5px solid rust selection ring, node scales to 110%, fill becomes `rgba(191,71,35,0.2)`. All other nodes and lines dim to 40% opacity.

**Dragging** — cursor becomes `grabbing`, stroke width increases to 1.5px.

Transitions on fill, opacity, and stroke-width: `0.2s ease`. Scale transition: `0.2s ease` via CSS transform on an isolated `<g>` wrapper (keeps entry animation separate from state animation).

---

## Panels & Modals

**Detail panel** — slides up from bottom-right on node click. 288px wide. Shows platform (rust label), title (ABC Camera Medium 16px), a three-column meta grid (Format / Duration / Orbit), and description. Satellite nodes show Edit Node and Remove Node actions.

**Add / Edit modal** — centered overlay with `rgba(0,0,0,0.72)` backdrop. 460px wide. Same typographic and color rules as the detail panel. In edit mode, fields are pre-populated and the submit button reads "Save Changes." The title field is editable in add mode; in edit mode the title persists.

**Left panel** — 200px fixed width. Crosshatch texture. Sections divided by `1px solid #333` rules. Contains: logo, brand input, concept textarea, BUILD UNIVERSE button, preset list, active campaign summary, and Add Node trigger.

---

## Logo

The Burn Studio wordmark sits in the top-left corner of the left panel — the primary anchor position in the six-position rule. Displayed at 120px wide, inverted for dark backgrounds, with "CAMPAIGN UNIVERSE" set in SimpsonCW at 8px below it in `#5A5A5A`.

---

## Canvas Overlays

Two persistent overlays sit outside the SVG element as HTML absolutely-positioned elements, ensuring they remain flush to the container edge regardless of SVG scaling:

**Top-right** — orbit ring legend. "RING 1 — LAUNCH" with a solid ring indicator. "RING 2 — EXTEND" with a dashed ring indicator. SimpsonCW 7–7.5px, `#5A5A5A`.

**Bottom-left** — satellite count. "N EXTENSIONS" in SimpsonCW 9px, `#5A5A5A`.

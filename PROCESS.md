# Process Notes — Campaign Universe

## The Visual Metaphor

A campaign isn't a network — it has gravity. The hero asset pulls everything else into orbit, and the distance from center should communicate the strength of that relationship. That's why I chose an orbital layout over a network graph or flow diagram. Both alternatives imply roughly equal weight between nodes, which misrepresents how a campaign actually works. The orbit makes hierarchy legible at a glance: one thing is the sun, everything else is a planet.

Ring 1 holds content *derived directly from the hero film* — cuts, edits, platform-native versions. Ring 2 holds content that *exists independently but belongs to the same campaign world* — activations, podcasts, social series. That distinction drives the ring assignment, not the order nodes were added.

## How I Used Claude

I broke the build into three sequential phases: core functionality first, brand fidelity second, visual polish third. Each phase had an explicit spec before any code was written — component structure, data shape, interaction model. I gave Claude the brief's non-negotiables directly rather than describing the aesthetic in vague terms. Prompts referenced specific hex values, font names, and behaviour rules from the brief — not the DESIGN.md in the repo, which describes a different Burn Studio product and contradicts the brief on rounded corners, typography, and overall feel. Vague prompts produce vague code.

## Decisions I Made

**Orbit-constrained dragging.** Claude's default drag implementation let nodes move freely anywhere on the canvas. I changed it to project the pointer angle onto the ring radius, so nodes snap to their orbit. Free dragging would let users accidentally break the visual hierarchy the whole metaphor depends on.

**Sharp corners everywhere.** The brief is unambiguous: no rounded corners on primary containers. Claude defaults to Tailwind's `rounded` utilities throughout. I caught this and overrode every instance with `borderRadius: 0`.

**Ring logic as editorial, not structural.** Claude initially assigned rings by index — first N nodes go to Ring 1, the rest to Ring 2. I rewrote the seed data and the `generateFromConcept` template to assign rings based on content relationship to the hero, not position in the array.

## What Claude Got Wrong

Three things required correction. First, it reached for system fonts before the custom faces were wired up — I noticed because the tracking and weight looked generic. Second, it introduced rounded corners on the detail panel and modal despite the spec, which I traced back to Tailwind component defaults. Third, the Ring 1/Ring 2 assignments in the generated campaigns were arbitrary rather than meaningful, which would have made the legend useless. Each of these was a taste failure, not a logic failure — the code ran fine, it just didn't reflect the brief.

---

*Stack: Next.js 15 · TypeScript · Tailwind (layout only) · SVG for the map*

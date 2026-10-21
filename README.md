# Ranfession

A quiet, interactive confession with a single-screen invitation, a scroll-led story, and one deliberate Final Click. Built with React, TypeScript, Vite, GSAP ScrollTrigger, Zod, and the Web Audio API.

## Local development

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
npm run lint
npm test
```

## Personalize the story

The automated checks cover scene validation and reordering, the invitation/scroll transition, the confession gate, replay, safe text rendering, unique heading IDs, and the default muted audio UI. They do not replace a visual mobile/browser review or listening to the ambience on a real device.

Edit `src/content/story.ts`. It is the source for the recipient/sender names, dedication, chapter text, button labels, and scene sequence. Empty names use natural neutral copy. The default story is illustrative; replace personal statements with your own true words before sharing.

`visuals.orbitalAccent` and `visuals.grain` let you simplify the atmosphere. Section-specific ornaments (heart, thread, dots, quotation, orbit, pulse, and constellation motifs) live in `src/components/SectionDecor.tsx`; their shared styling is in `src/scroll-story.css`. Theme colors, typography, and spacing live in the CSS variables at the top of `src/index.css`.

Each scene has a unique `id`, a `type`, a label, and a heading. Narrative scenes also have a `layout` and a `fragments` array. Supported layouts are `editorial`, `fragments`, `quotation`, `realization`, and `quiet`. Optional `emphasis` is an italic second heading line. `continueLabel` customizes the invitation button and `revealLabel` customizes the Final Click.

Keep exactly one `invitation` first, one `confession` before the end, and one `closing` last. Add, remove, or reorder narrative scenes freely. You can move the confession among the middle scenes; its interaction follows its type. Progress and navigation use the actual validated list. Invalid or duplicate optional scenes are skipped; broken essential roles use a safe three-scene fallback. Syntactically invalid TypeScript must be corrected before building.

The invitation mounts by itself. Begin transitions into native vertical scrolling; all narrative text is present for reading and assistive technology. ScrollTrigger adds entrances, a moving orbital line, and progress updates. Desktop Little Things uses a sticky heading with staggered, spacious fragments; mobile stacks them in normal flow.

The story stops at the confession until the reader presses Reveal. This action reveals the confession and mounts the remaining scenes, including the ending. The reader can scroll on or use the One last page link. The wordmark returns to the opening while preserving the confession within the visit; Read again resets it. Refresh starts at the invitation. Chapter anchors use normal browser hash navigation. No scroll is intercepted or forced into snap points.

## Motion and sound

GSAP handles the invitation entrance, word-level text reveals, scroll-based chapter choreography, subtle numeral parallax, the orbital line, section ornaments, and the deliberate Final Click. System reduced motion and the on-page Reduce motion control remove these effects while keeping narrative text readable and the Final Click manual. ScrollTrigger instances are cleaned up whenever the view or motion preference changes.

Sound starts off. The Sound off button creates one low-volume procedural audio graph in a user gesture. Its volume control is available while sound is on. Muting fades out and suspends audio, hidden tabs suspend it, and the graph is disposed when the app unmounts. Unsupported or rejected audio falls back to silence.

## Publishing

`npm run build` outputs a static website in `dist`. Deploy this directory to any static host. There is no backend, database, login, response form, analytics, or recipient tracking. All content is public to anyone with the URL. `noindex, nofollow` is set during preparation; this is a search visibility request, not access protection. There are no runtime external fonts, images, audio, or video dependencies.

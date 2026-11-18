# Futures Mixing Desk

An interactive futures generator used as stimulus for a series of futures workshops on AI, the future of work and customers' financial lives. People answer five questions about the world in 2050, press Generate, watch a short "tuning" animation, and get a pre-written future world for their exact combination (title, nutshell, tension, what it challenges for financial services, three provocations), a How we got here timeline, three sourced figures and three sub-futures with a customer story and How Might We.

It is provocation, not a forecast. The audience is mixed product, design, strategy and operations teams in UK financial services. They are not futurists and will not read instructions.

## Run it

- Open `index.html` in a browser. No build step and no backend.
- Or serve the folder locally, for example `npx serve .` or `python3 -m http.server`.
- To produce one shareable file: `python3 scripts/build_single_file.py`, which writes `dist/futures-mixing-desk.html`.

## Files

| Path | What it holds |
| --- | --- |
| `index.html` | Page structure: hero, How the desk works intro with Start tuning, Set the forces (hidden until Start), output (tuner + results), sources drop-down |
| `styles.css` | Design tokens (light and dark), specimen cards, controls, tuner, sub-future cards |
| `js/data.js` | `SRC` sources, `PAL` palettes, `FORCES` (each choice carries a sourced fact), empty `WORLDS`, `LEAD_LOOK`, `DRIVER_LOOK`, `DRIVER_LABEL`, `SUBS` |
| `js/worlds/a{1-3}g{1-3}.js` | The 243 pre-written worlds, 27 per file, grouped by Who decides (a) and Who prospers (g) |
| `js/specimens.js` | Canvas drawing of the sound-form objects and the slow ambient animation |
| `js/app.js` | State, question controls, world lookup, force ranking, sub-future selection, tuning animation, rendering, copy for Mural |
| `docs/` | Design brief (docx and pdf) and the ChatGPT handoff with recommendations |
| `archive/` | Earlier versions kept for reference (see Decision log) |

## How it works

1. **Intro first.** The page opens on a short three-step How the desk works card. Set the forces stays hidden until Start tuning is pressed. Sources sit in a closed drop-down at the bottom; inline citations still link straight to each report.
2. **Five forces, three choices each.** Nothing is selected at load and the output area stays hidden until all five are answered. Generate is disabled until then. Each question shows its sub-question; each choice has a one-line description and an "Explore" prompt shown in the playback.
   - CH 01 Who is making the decisions? Human-led · Shared control · AI-led
   - CH 02 Who shares in the prosperity? Concentrated · Uneven · Widespread
   - CH 03 How do people earn a living? Stable jobs · Mixed income · Fluid work
   - CH 04 What holds society together? Institutions · Communities · Individuals
   - CH 05 How does society respond to climate change? React · Adapt · Transform
3. **Worlds.** Every one of the 243 combinations has its own pre-written world in `WORLDS`, keyed by the five choices in order (e.g. `"31213"`). Fields: `t` title, `n` world in a nutshell, `x` unexpected tension, `f` what this challenges for financial services, `v` three provocations, `p` 2030s step, `s` 2040s step.
   - **How we got here** is Now (a sourced fact, tagged Evidence), 2030s (Plausible), 2040s (Speculative), then the 2050 title.
   - **Ranking.** Forces with an extreme choice (1 or 3) rank above middle choices. The lead force rotates among the extremes by combination; it sets the window's palette and material (`LEAD_LOOK`) and supplies the Now fact. The next three forces supply the three figure readouts.
4. **Sub-futures.** Each of the 18 `SUBS` has a score function over the answers (scaled 0–1; `u.self`, `u.comm` and `u.inst` come from CH 04). The top three with different drivers are shown as compact tiles; clicking one opens a single tinted panel below them (one at a time) with an "In 2050" description, the customer story and the How Might We. The timeline lives on the main future, not here. "Draw other sub-futures" samples from the strong pool and closes the panel.
5. **Play back your choices.** The future card has a "Play back your choices" button that reveals each of the five choices with its description and Explore prompt. It starts hidden so the future's description gets the focus, and stays open across sub-future redraws until the next Generate.
6. **Tuning animation.** About 1.9 seconds: five channel waveforms converge into one signal, level meters settle per channel, and the frequency counts up to the future's Hz. Reduced motion gets a short static version.

## Content rules

- Every number carries a source key from `SRC` and renders as a numbered citation. Never add a figure without a source.
- World text contains no statistics, so it needs no sources. Keep it that way: numbers in worlds are story details only ("a fifth of her earnings"), never facts about today. Avoid digits in world text.
- World-writing principles (from the user's brief): explore consequences of how the forces interact, not a restatement of them; treat odd combinations as interesting and explain how they coexist; no pure utopias or dystopias, always winners, losers and unintended consequences; make it tangible through recognisable situations (named customers live in the sub-futures, not the main future); provocations are short, arguable statements aimed at the room, never questions and never a restatement of the world's own tension, nutshell, timeline or financial-services text; challenge assumptions about financial services without prescribing products; keep 2030s plausible and 2040s clearly speculative.
- Global scenario figures (mostly BCG Henderson Institute 2050 scenarios) are labelled as global. UK figures describe today.
- Customer stories are illustrative composites, labelled as such, with no real customer data. Each names one person or household and touches at least two parts of financial life.
- How Might Wes sit at the level of financial life (income, saving, credit, protection, pensions, payments, care, home), not a single product such as mortgages.
- Some figures came from reputable secondary coverage because the primary PDF could not be opened, including parts of the BCG 2050 report. The OECD trust figure (`OEC`, 33% trust in national government) came from a search summary and could not be opened from the build environment. Verify against primary sources before wider release.

## Design system

- **Specimen cards:** white cards with a saturated gradient window, a notched corner tab and a mono code. Each future shows its own frequency in Hz (a hash of the answers and name), and questions are labelled CH 01–CH 05.
- **Type:** Archivo (bold wide caps for names), Newsreader (serif for descriptions and How Might Wes), IBM Plex Mono (labels and data). All from Google Fonts with fallbacks.
- **Sound-form objects** (`js/specimens.js`): glass Lissajous trace, pearl ripples, studded radial spectrum, waveform ribbons, gold frequency ridges, pulsing speaker. Each future and sub-future driver maps to one palette and material.
- **Restraint:** the user asked for the theme and animation to stay subtle. Keep strokes thin, motion slow and colour soft, and avoid adding effects.
- **Platform rules:** light and dark modes via tokens; works at 400 px; keyboard and screen-reader friendly; `prefers-reduced-motion` respected.
- **Layout:** each question sits directly above its three choices, in a responsive grid.

## Decision log

- Started from seven forces with five stages each. That was too hard to read, so it was cut to five forces with three choices, plus givens for ageing.
- Climate was kept as its own force at the user's request.
- BCG's 2050 scenarios are one source among about twenty, not the core frame.
- **A v2 "participatory vertical slice" was tried and rejected as too complicated to use.** It had tension doors, change-one-thing comparisons, evidence labels and a takeaway card, and was based on `docs/handoff-v2-chatgpt-recommendations.docx`. It is in `archive/v2-vertical-slice-rejected.html`. Borrow single ideas from it only if asked; do not reintroduce the multi-step flow.
- Givens (older population, thin buffers) and the separate Life in this world panel were removed; the five choices now sit inside the future card.
- **Five forces v2 (Nov 2026):** the forces were replaced with the user's new set (decisions, prosperity, earning, what holds society together, climate response). Generation moved from eight archetypes to 243 pre-written worlds, one per combination; the user chose pre-written over live AI generation so the desk works anywhere, including offline. The six-part output, sourced figures and sub-futures were kept, and the timeline moved from the sub-futures to the main future. The user then removed the everyday-life glimpse from the main future (customer stories stay in the sub-futures) and replaced the three workshop questions with three provocations.
- The output is blank until all five questions are answered. A sonic, frequency theme was added and then toned down to be subtle.

## Open questions

- Verify secondary-sourced figures against primary documents and add a review date.
- Whether to grow the sub-future library so repeated draws stay fresh across a workshop series.
- Whether a facilitator view or shareable link to a specific future is needed.

---
name: rappiopedia-research
description: Research and expand Rappiopedia with sourced Finnish articles and new Rappioverse graph connections. Use when asked to investigate a person, event, streamer, controversy, public rumour, unexplored network connection, or research backlog; also when asked to autonomously find and publish new subjects. A starting point is optional.
---

# Rappiopedia research skill

**Goal:** produce substantive new or improved Rappiopedia articles, source records and graph relations during the current run, not just a research plan.

## Start: focused or self-guided

- **User provides a starting point:** accept a person, alias, pair of people, programme, event, theme, article or source. Identify the matching node(s) and article(s), search outward through associated events and people, and follow promising discoveries beyond the initial node. If not yet in the graph, research the new subject before creating it.
- **No starting point:** choose one independently. Read `research/leads.json`, inspect missing/thin articles and the existing graph, and run `npm run research:candidates` when available. Prefer useful unanswered leads, central people missing biographies, new events and connections between otherwise separate areas. Choose a line likely to yield real sources and substantive new writing. Do not ask the user for a topic when they deliberately delegated the choice.
- **User asks to steer yourself after a seed:** begin at that seed, then pursue adjacent leads and newly discovered subjects that seem worthwhile.

Read `AGENTS.md`, `docs/RESEARCH_PLAYBOOK.md`, `docs/CONTENT_AUTHORING.md`, and current `src/data/network.json`, `src/data/relation-types.json` before edits. Inspect existing prose so good content is retained.

## Investigate and write

1. Establish who or what the subject is: aliases, background, past career, channels, key public incidents, controversies and events. A person's biography must stand on its own; a PactHouse or PactTalks appearance alone is not enough.
2. Find and follow original videos, VODs, stream archives, interviews, news, event rosters, public posts and discussion threads (including Reddit and Ylilauta). Examine dates, additional named people and later developments. Use exact source URLs rather than guessing from search snippets; try alternatives when a source cannot be accessed.
3. Cover relevant public rumours, competing stories, disputes and personal events naturally, with sources attributed near the relevant claims. Do not convert rumours to facts, but don't sanitise away those topics or append robotic caveat sections.
4. Look for new connections through shared broadcasts, trips, productions and events. Record the concrete documented occurrence rather than inventing a more personal relationship.

## Publish together: sources, nodes, edges, articles

- `src/data/network.json` owns `nodes`, `edges`, `sources`. Reuse existing node/source IDs; don't duplicate identities. Each edge uses valid `a`/`b`, reusable `type`, event-specific `label`, `level` (`verified`/`reported`/`observed`/`lead`), and nonempty `src` source IDs. Add `date` and `detail` when useful.
- **No filler in graph connections:** `edge.detail` is optional. Use it only for a new, relationship-specific fact absent from `label`, `date`, `level` and the source citation. Never put research-process notes, repeated source metadata, boilerplate disclaimers about what a shared appearance “does not prove”, or duplicate paragraphs into `detail`. Write the actual documented action in `label`, choose the honest confidence `level`, and move outstanding verification work to `research/leads.json`. For disputed conduct, retain a specific and relevant denial, attributed to the person who made it. Before committing, review every newly added or changed `edge.detail` as reader-facing encyclopedia text.
- **Define relationship types before referencing them:** `src/data/relation-types.json` contains reusable types. Directional: `forward` and `reverse` (e.g. `on isä` / `on poika`). Symmetric: `symmetric: true` and `verb` (e.g. `esiintyi yhdessä`). Never add inline `edge.verb`.
- `src/articles/<node-id>.md`: start with an informative introduction; explain the person's own work, history and significant life events, not just a list of connections. Write ordinary Finnish with useful subject-specific headings. Internal links: `[[node-id|Name]]`. Sources: `[@P123]` (existing source IDs). Avoid repetitive "Yhteenveto", "Tulkinnan rajat" and research-process text.
- `node.note` is a short standalone introduction for the map, not a substitute for an article. Preserve existing good content rather than replacing it with thinner text.
- See `docs/CONTENT_AUTHORING.md` for field requirements, media and Markdown support.

## Save unfinished work without putting it on the wiki

`research/leads.json` is the agent's working backlog. Update matching leads instead of creating duplicates. Link known `nodeIds`, `sourceIds` and new `sourceUrls`. Record specific `questions`, `queries`, `notes` and executable `nextSteps`. Use `open` / `in-progress` / `blocked` / `done` according to progress; publishing a partial article doesn't automatically close a lead. Update `updatedAt` when edited. Use `docs/RESEARCH_LOG.md` for substantial dated findings when helpful. Keep research TODOs out of articles.

## 3D skene placement: recurring layout-test regression

When adding a node or changing `pos3`, `group`, `src/data/skenes.json`, `src/lib/hierarchy.js`, or scene placement, validate **the entire parent/child 3D hierarchy**: unrelated visible skene volumes must remain disjoint, parent volumes must enclose their children's full padded bounds, direct parent nodes must stay outside child boxes, and unrelated parents or skenes must never intersect. The generic hierarchy registry is `src/lib/hierarchy.js`: PACT has 145 units of parent padding and Rappiostriimaus 160 units; ordinary child skenes use padding from `src/data/skenes.json` (100 by default). `rappio` is the direct-member rootGroup; `pottu-streams` is its only currently supported child, containing Pottukoira-centered productions, **not every occasional guest**. See `tests/layout.test.mjs` and `AGENTS.md`. This has repeatedly failed with errors like `rappio intersects PACT` and `talks intersects rappio`. Run `node --test tests/layout.test.mjs` before committing changes affecting positions, and run the complete `npm test` and `npm run build` checks. Fix coordinates instead of weakening the tests. If testing is unavailable, check the geometric constraints programmatically and report that the full tests were not run.

## Finish the batch

Make concrete edits in the current run when repository access permits. If one topic is unproductive, try another relevant line and leave useful leads. Test with `npm test` and `npm run build` where possible, or check JSON, source IDs, article links and relation types with available tools. Review diffs to prevent loss of previously researched material. Commit/push when permitted.

Report which topic was supplied or self-selected, what was actually discovered and edited, remaining questions, test results and commit/PR links. This skill does not initiate background research or automatically run later.

## Example requests

- "Tutki Ruusutossun yhteyksiä ja kirjoita puuttuvat artikkelit."
- "Selvitä X:n ja Y:n yhteistä historiaa."
- "Jatka Rappiopedian tutkimusta itsenäisesti, lisää uusia solmuja ja artikkeleita."
- "Valitse tutkimusjonosta lupaava aihe ja vie se julkaisukuntoon."

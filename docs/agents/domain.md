# Domain Docs

How the agent skills in `.agents/skills/` consume this repo's domain documentation. Layout: **single-context**: one root `GLOSSARY.md`, one `docs/adr/`.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.
- Any `AGENTS.md` in the directories you touch.

If a term or decision isn't documented yet, **proceed silently**. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) adds entries lazily when terms or decisions actually get resolved.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_

# Almalgo Mode

Almalgo's agentic development loop as installable agent skills. One entry point (`/almalgo-mode`), alignment before big work, nine playbooks, a project-specific verify ladder, two-axis code review, and narrow ready PRs. It works in Cursor, OpenCode, and Codex.

```
big / ambiguous:  /grill-with-docs → /to-spec → /to-tickets ─┐
                                                             ▼
small / clear:    ──────────────────────────────► /almalgo-mode  (9 playbooks)
                                                             │
                     verify ladder → /code-review → pr → a human merges
```

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/Almalgo/Almalgo-Mode/main/install.sh | bash
```

Then run `/setup-almalgo-mode` in your agent. Full walkthrough, upgrades and customizing: [docs/bootstrap.md](docs/bootstrap.md).

## What's inside

- **28 skills** in [`.agents/skills/`](.agents/skills/README.md), grouped by stage:
  - **Entry:** `almalgo-mode` (router, principles, autonomy rules) and `setup-almalgo-mode`.
  - **Align:** `grill-me`, `grill-with-docs`, `grilling`, `domain-modeling`, `triage`.
  - **Plan:** `to-spec`, `to-tickets`, `wayfinder`, `research`.
  - **Understand and design:** `how`, `why`, `architect`, `codebase-design`, `improve-codebase-architecture`, `prototype`.
  - **Build:** `implement`, `implement-spec`, `tdd`, `diagnosing-bugs`, `wizard`.
  - **Review and ship:** `code-review`, `pr`.
  - **Session:** `handoff`, `retro`, `wait-what`, `writing-for-agents`.
- **9 playbooks** in `almalgo-mode/playbooks/`: investigation, bug fix, feature, refactoring, perf, babysit and ship, autonomous run, multi-phase plan, and authoring a skill.
- **The `almalgo-agent` subagent** in `.cursor/agents/`. It uses `model: inherit`, so no models are pinned.
- **A team guide.** [`.agents/agentic-loop-guide.pdf`](.agents/agentic-loop-guide.pdf) is a 27-page walkthrough, built from an interactive HTML page. Each project rebuilds it with its own name and verify ladder.
- **`check.mjs`.** It fails when skills, links, guide coverage or project setup drift, or when the PDF is stale. The skills tell agents to rebuild the guide whenever the loop changes.

## This repo

The repo uses the kit on itself: [`docs/agents/`](docs/agents) holds its own verify ladder, and [`AGENTS.md`](AGENTS.md) explains how to change the kit without leaking project-specific detail into it.

## Credits

The skills are adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, © Matt Pocock) and [pstack](https://github.com/cursor/plugins/tree/main/pstack) (MIT, © Lauren Tan). The `pr` skill's summary visuals come from Dex Horthy's `show-me` (see `.agents/skills/pr/CREDITS.md`). Almalgo Mode is released under the MIT license; see [LICENSE](LICENSE).

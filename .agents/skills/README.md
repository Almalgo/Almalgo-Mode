# Agent skills (Almalgo Mode)

Installed from [Almalgo/Almalgo-Mode](https://github.com/Almalgo/Almalgo-Mode); the installed version is in `.agents/ALMALGO_MODE_VERSION`. Team skills for coding agents working in this repo. Cursor, OpenCode, and Codex discover `.agents/skills/*/SKILL.md` automatically. Type `/<skill-name>` to run one.

**Start with `/almalgo-mode`** for any non-trivial task. It sizes the work, picks a playbook, and routes to the rest. In Cursor, pick it from the `/` menu with Alt+Enter (Option+Enter on Mac) to keep it on for the whole session. Its subagent is `.cursor/agents/almalgo-agent.md`.

## The loop

```
big or ambiguous:  /grill-with-docs → /to-spec → /to-tickets ─┐
                                                              ▼
small and clear:   ─────────────────────────────────► /almalgo-mode (per ticket)
                                                              │
                         playbook → verify → /code-review → pr skill
```

## Skills

| Skill | What it's for | Invoked by |
|---|---|---|
| `almalgo-mode` | Entry point: playbooks, principles, autonomy rules | you |
| `setup-almalgo-mode` | One-time setup: writes `docs/agents/` (verify ladder, tracker, labels, domain docs) | you |
| `grill-me`, `grill-with-docs` | Interview you until a plan is fully specified; `-with-docs` also updates `GLOSSARY.md` and ADRs | you |
| `grilling`, `domain-modeling` | The interview loop and glossary/ADR upkeep behind the grill skills | agent |
| `to-spec`, `to-tickets` | Turn a conversation into a GitHub spec issue, then into sub-issue tickets | you |
| `implement`, `implement-spec` | Build tickets on one branch, or a whole spec with parallel subagents | you |
| `triage` | Move issues through `needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix` | you |
| `wayfinder` | Plan work too big for one session as a map of decision tickets | you |
| `how`, `why` | Walk through a subsystem; find out why it's built this way from git, PRs, issues, and docs | you |
| `architect` | Sketch types and module shape before code | you |
| `codebase-design`, `improve-codebase-architecture` | Deep-module vocabulary; survey for refactor candidates | agent / you |
| `tdd` | Red-green loop at agreed seams, with an escape when no runner exists | agent |
| `diagnosing-bugs` | Phase-gated debugging loop | agent |
| `prototype` | Throwaway code to settle a design question | agent |
| `research` | Cited answers from primary sources, saved as Markdown | agent |
| `wizard` | Interactive bash script for human-only setup steps | agent |
| `code-review` | Two-axis review (standards, spec) with act-on/consider/dismissed triage | agent |
| `pr` | PR title, process, and body (summary visual, evidence, merge danger) | agent |
| `handoff` | Pause cleanly and write a resume doc; resume protocol | you |
| `retro` | Turn a session's friction into checks, `AGENTS.md` edits, or skill edits | you |
| `wait-what` | Re-explain the last message plainly | you |
| `writing-for-agents` | How to write skills and `AGENTS.md` | agent |

Project config these skills read, all written by `/setup-almalgo-mode` and never touched by upgrades: `docs/agents/verify.md` (the verify ladder), `docs/agents/guide.js` (project data for the guide), `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`, plus `GLOSSARY.md` and `docs/adr/`.

## Editing

Skills are code: change them in a PR. Follow the Authoring a skill playbook in `almalgo-mode`. Everything under `.agents/` and `.cursor/agents/` is kit-owned: re-running `install.sh` replaces it, so a change every project should get belongs upstream in Almalgo-Mode. Project-specific behavior goes in `docs/agents/` or `AGENTS.md`; a project-only skill is registered in `docs/agents/guide.js`.

## Team guide (keep it in sync)

`.agents/agentic-loop-guide.pdf` is the onboarding walkthrough of this loop. It is rendered from `.agents/loop-guide/index.html` (serve the repo root over HTTP and open it for the interactive version). Kit content lives in `.agents/loop-guide/data.js`; project content (name, verify ladder) in `docs/agents/guide.js`.

Any change under `.agents/`, `.cursor/agents/` or `docs/agents/` must also:

1. Update the guide data if the loop changed: `data.js` for a skill, its callers, a playbook step, a principle or a flow; `docs/agents/guide.js` for a verify rung or the project name.
2. Run `bash .agents/loop-guide/build.sh`. It rebuilds the PDF (using local Chrome, or the Playwright Docker image) and rewrites `.agents/loop-guide/pdf-source.sha256`.
3. Commit the source change, the guide data, the PDF, and the stamp together.

`node .agents/skills/check.mjs` fails when a skill, playbook, principle or verify rung is missing from the guide, when `docs/agents/` still has `TODO(setup)` lines, or when the PDF is older than its sources.

## Credits

Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) via [Almalgo/engineering-skills](https://github.com/Almalgo/engineering-skills) (MIT, © Matt Pocock) and [pstack](https://github.com/cursor/plugins/tree/main/pstack) (MIT, © Lauren Tan). The `pr` skill's summary visuals come from Dex Horthy's `show-me` skill (see `pr/CREDITS.md`).

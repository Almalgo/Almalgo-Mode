# Almalgo-Mode: agent cheat sheet

This repo IS the Almalgo Mode kit: the skills, the loop guide, and the installer other repos run. It also uses the kit on itself.

## Layout
```
.agents/skills/                 kit skills (copied into projects by install.sh)
  setup-almalgo-mode/templates/ the docs/agents/ stubs a new project starts from
.agents/loop-guide/             guide source (index.html + data.js) and the PDF builder
.agents/agentic-loop-guide.pdf  the built guide (this repo's own copy)
.cursor/agents/almalgo-agent.md subagent shipped to projects
docs/agents/                    THIS repo's project config (not shipped; projects get templates)
docs/bootstrap.md               how a project installs, sets up, and upgrades the kit
install.sh                      installer / upgrader
```

## Rules for changing the kit
- Kit vs project: anything in `.agents/` or `.cursor/agents/` lands in every project and is overwritten on upgrade, so it must not mention a specific project's paths, commands, or stack. Project specifics belong in a project's `docs/agents/` (here: templates under `setup-almalgo-mode/templates/`).
- Changing the `docs/agents/verify.md` shape or the `guide.js` format breaks existing installs on upgrade, because `check.mjs` reads both. Note the migration in the PR body.
- Prove `install.sh` changes with rung 3 of `docs/agents/verify.md` (install into a scratch repo, then upgrade).

## Agent skills
Team skills live in `.agents/skills/` (index: `.agents/skills/README.md`). Start non-trivial work with
`/almalgo-mode`; this repo's verify ladder is `docs/agents/verify.md`.
Issue tracker: `docs/agents/issue-tracker.md`. Triage labels: `docs/agents/triage-labels.md`.
Domain terms: `GLOSSARY.md`, decisions in `docs/adr/` (`docs/agents/domain.md`).
**Touching `.agents/`, `.cursor/agents/` or `docs/agents/`?** Rebuild the team guide in the same
change: `bash .agents/loop-guide/build.sh`. `node .agents/skills/check.mjs` fails until you do.

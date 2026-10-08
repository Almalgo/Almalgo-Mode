# Bootstrapping Almalgo Mode in a project

About 15 minutes. You need a git repository, Node 22+, and either a local Chrome/Chromium or Docker (to build the guide PDF).

## 1. Install

From the project root:

```bash
curl -fsSL https://raw.githubusercontent.com/Almalgo/Almalgo-Mode/main/install.sh | bash
```

Pin a version with `bash -s -- --ref <tag-or-sha>`. Or from a clone of this repo: `./install.sh --target /path/to/project`.

The installer copies the kit and creates stubs for anything project-owned that's missing:

| Path | Owner | On upgrade |
|---|---|---|
| `.agents/skills/<kit skills>`, `README.md`, `check.mjs` | kit | replaced |
| `.agents/loop-guide/` | kit | replaced |
| `.cursor/agents/almalgo-agent.md` | kit | replaced |
| `.agents/ALMALGO_MODE_VERSION` | kit | rewritten |
| `docs/agents/verify.md`, `guide.js`, `issue-tracker.md`, `triage-labels.md`, `domain.md` | **project** | never touched |
| `AGENTS.md`, `GLOSSARY.md`, `docs/adr/` | **project** | never touched |
| Your own skills in `.agents/skills/` | **project** | never touched |
| `.gitattributes` | shared | an `almalgo-mode` block appended once |

`node .agents/skills/check.mjs` now fails and lists every `TODO(setup)` line. That's expected until the next step.

## 2. Set up

Open the project in Cursor (or OpenCode / Codex) and run:

```
/setup-almalgo-mode
```

It explores the repo and goes section by section, proposing an answer for each:

1. **Issue tracker**: GitHub, GitLab, local markdown under `.scratch/`, or something you describe.
2. **Triage labels**: the five state labels, or your existing ones. Missing labels are created only if you say yes.
3. **Domain docs**: single or multi-context glossary layout.
4. **Verify ladder** (`docs/agents/verify.md` + `docs/agents/guide.js`): your real typecheck, test, run, and smoke commands, which rungs each kind of change needs, and a merge-danger checklist. Every playbook ends here, so get this one right.
5. **`AGENTS.md`**: adds the "Agent skills" section.
6. **Build**: `bash .agents/loop-guide/build.sh` writes `.agents/agentic-loop-guide.pdf`.

Done when `node .agents/skills/check.mjs` prints `ok`.

## 3. Commit

```bash
git add .agents .cursor/agents docs/agents AGENTS.md .gitattributes
git commit -m "chore(skills): add Almalgo Mode"
```

Point the team at `.agents/agentic-loop-guide.pdf`. That walkthrough covers the loop, every skill, every playbook, and your verify ladder.

## 4. Use it

Type `/almalgo-mode` and press Alt+Enter (Option+Enter on Mac) in Cursor to keep it on for the session. Big or fuzzy work starts with `/grill-with-docs`, then `/to-spec` and `/to-tickets`.

## Upgrading

```bash
curl -fsSL https://raw.githubusercontent.com/Almalgo/Almalgo-Mode/main/install.sh | bash
bash .agents/loop-guide/build.sh && node .agents/skills/check.mjs
git diff   # review, then commit
```

The installer refuses to run over uncommitted changes in `.agents/` or `.cursor/agents/` (pass `--force` to override). If a release changes the `verify.md` / `guide.js` format, its notes say how to migrate. Skills dropped from the kit are reported, never deleted.

## Customizing

- **Project behavior** (commands, conventions, gotchas) goes in `docs/agents/verify.md` or `AGENTS.md`, never in kit files: upgrades overwrite kit files.
- **A project-only skill**: add a new folder in `.agents/skills/` and register it in `docs/agents/guide.js` (`window.SKILLS['name'] = {...}`; the template shows the shape). The guide and `check.mjs` then cover it, and upgrades leave both alone.
- **A change every project should get**: open a PR on Almalgo-Mode.

## Tools

| Tool | Reads skills from |
|---|---|
| Cursor | `.agents/skills/` (+ the `almalgo-agent` subagent in `.cursor/agents/`) |
| OpenCode | `.agents/skills/` |
| Codex | `.agents/skills/` |
| Claude Code | `.claude/skills/` only: `ln -s ../.agents/skills .claude/skills` |

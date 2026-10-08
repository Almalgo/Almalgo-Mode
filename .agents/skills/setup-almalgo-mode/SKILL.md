---
name: setup-almalgo-mode
description: Configure Almalgo Mode for this repo after install.sh copied it in. Writes the project-owned docs/agents/ files (verify ladder, guide data, issue tracker, triage labels, domain docs), adds the Agent skills section to AGENTS.md, and builds the team guide PDF. Run once per repo, and again to re-check.
disable-model-invocation: true
---

# Set up Almalgo Mode

The kit (`.agents/`, `.cursor/agents/`) is generic. Everything project-specific lives in `docs/agents/`, which this skill writes and upgrades never touch. Done means `node .agents/skills/check.mjs` passes.

Explore first, then go one section at a time: show what you found, propose an answer, wait for the user, write it. Lead each section with the recommended answer so it can be accepted in a word. Skip a section the exploration already settled, and say so.

## 1. Explore

Read, don't assume:

- `git remote -v`: GitHub, GitLab, or neither.
- Root `AGENTS.md` / `CLAUDE.md`, and any nested `AGENTS.md`. Note an existing `## Agent skills` section.
- `GLOSSARY.md`, `GLOSSARY-MAP.md`, `docs/adr/`.
- `docs/agents/`: files already there are kept unless the user asks to redo them. Files still holding `TODO(setup)` lines are the work left.
- How the project is built, run and checked: `package.json` scripts, `Makefile`, `justfile`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `docker-compose*`, `.github/workflows/*`, `README`. Run the cheap ones (`--help`, a typecheck) to confirm they exist and work.
- The labels the tracker already has (`gh label list`, `glab label list`).

## 2. Issue tracker → `docs/agents/issue-tracker.md`

Recommend from the remote: GitHub (`templates/issue-tracker-github.md`), GitLab (`templates/issue-tracker-gitlab.md`), or local markdown under `.scratch/` (`templates/issue-tracker-local.md`). For anything else (Jira, Linear), write the file from the user's one-paragraph description, covering the same operations as the GitHub template. Add a line naming the labels the project already uses (area, type, priority) so skills apply them instead of inventing new ones.

## 3. Triage labels → `docs/agents/triage-labels.md`

Ask one question: keep the default state labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`)? Recommended: yes. On no, collect the existing strings that map to each role. Copy `templates/triage-labels.md` and fill the table.

On GitHub or GitLab, list the labels that don't exist yet and offer to create them (`gh label create <name> --color <hex> --description <meaning>`). Creating labels changes the shared repo: create them only on an explicit yes.

## 4. Domain docs → `docs/agents/domain.md`

Default to single-context (one root `GLOSSARY.md`, one `docs/adr/`) and copy `templates/domain.md` without asking. Offer multi-context (a root `GLOSSARY-MAP.md` pointing at per-package glossaries) only when the repo is a monorepo whose packages genuinely speak different domain languages. Don't create `GLOSSARY.md` or ADRs now; `domain-modeling` creates them when a term or decision is actually settled.

## 5. Verify ladder → `docs/agents/verify.md` + `docs/agents/guide.js`

This is the most important file: every playbook ends with it. Copy `templates/verify.md` and replace every `TODO(setup)` with this project's real commands, found in step 1.

- Keep the shape: numbered `## N. Name` rungs, the "Diff touches → minimum rungs" table, **Merge danger checklist**, **Reporting**. Add, split, rename or drop rungs to fit the project (a library may need no "Run it"; a web stack may want separate API and browser rungs).
- Every command in it must be one you ran or saw working. Mark anything you couldn't run as unverified and tell the user.
- Write the gotchas a newcomer would hit (stale images, required env, ports, seed data).

Then copy `templates/guide.js` and mirror the ladder: the project name, one `rungs` entry per `## N.` heading in the same order, and one `changes` row per table row (zero-based rung indexes).

## 6. `AGENTS.md`

Add (or update in place) this section in the root `AGENTS.md`, or `CLAUDE.md` if that's the one the repo uses. Never create one when the other exists, and if neither exists, ask which to create.

```markdown
## Agent skills
Team skills live in `.agents/skills/` (index: `.agents/skills/README.md`). Start non-trivial work with
`/almalgo-mode`; this project's verify ladder is `docs/agents/verify.md`.
Issue tracker: `docs/agents/issue-tracker.md`. Triage labels: `docs/agents/triage-labels.md`.
Domain terms: `GLOSSARY.md`, decisions in `docs/adr/` (`docs/agents/domain.md`).
**Touching `.agents/`, `.cursor/agents/` or `docs/agents/`?** Rebuild the team guide in the same
change: `bash .agents/loop-guide/build.sh`. `node .agents/skills/check.mjs` fails until you do.
```

## 7. Build and check

```bash
bash .agents/loop-guide/build.sh   # needs a local Chrome/Chromium or Docker
node .agents/skills/check.mjs      # must print "ok"
```

Fix whatever `check.mjs` reports and re-run until it passes. Then tell the user what was written, which commands in `verify.md` are unverified, which labels still need creating, and that `/almalgo-mode` is ready.

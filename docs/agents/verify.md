# Verify

<!-- Project-owned (this is the Almalgo-Mode kit repo's own ladder). Keep the "## N." shape;
     mirror changes in docs/agents/guide.js, then: bash .agents/loop-guide/build.sh -->

Prove the change on the real artifact before you call it done. In this repo the artifact is the kit itself: the skills, the guide, and what `install.sh` puts into another repository.

| Diff touches | Minimum rungs |
|---|---|
| README or docs only | none (read it rendered) |
| A skill, playbook or principle | 1, 2 |
| Guide (`loop-guide/`) | 1, 2 |
| `install.sh`, templates, `check.mjs` | 1, 3 |

## 1. Static

```bash
node .agents/skills/check.mjs
bash -n install.sh .agents/loop-guide/build.sh && node --check .agents/loop-guide/render.mjs
```

`check.mjs` validates names, links, cross-references, guide coverage, and PDF freshness.

## 2. Guide

```bash
bash .agents/loop-guide/build.sh
```

Open `.agents/agentic-loop-guide.pdf` and look at the pages your change touched. For the interactive page, serve the repo root (`python3 -m http.server`) and open `/.agents/loop-guide/`.

## 3. Install into a scratch repo

```bash
S=$(mktemp -d) && git -C "$S" init -q && ./install.sh --target "$S"
node "$S/.agents/skills/check.mjs"     # expect only unfinished-setup failures
./install.sh --target "$S" --force     # upgrade: docs/agents/ must be unchanged
```

Confirm a fresh install creates the `docs/agents/` stubs, `check.mjs` lists every unfinished setup line, and a second run leaves edited `docs/agents/` files untouched.

## Merge danger checklist

- Renaming or removing a skill: every installed project keeps the old folder until someone deletes it (`install.sh` prints a note).
- Changing the `docs/agents/verify.md` shape or `guide.js` format that `check.mjs` expects: existing installs fail the check on upgrade until they're migrated. Say how in the PR.
- Anything that makes `install.sh` write outside `.agents/`, `.cursor/agents/`, `docs/agents/`, or `.gitattributes`.

## Reporting

- **Passed**: name the rung, the command, and the observed output.
- **Not run**: say which rung and why. Never report a rung you didn't run as passed.
- **Inconclusive, or run on the wrong surface**: that isn't a pass. Flag it.

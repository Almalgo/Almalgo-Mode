# Authoring a skill

**You own the skill's voice.** Team skills live in `.agents/skills/<name>/SKILL.md`.

1. Load `writing-for-agents` and follow it.
2. Frontmatter: `name` matches the folder (lowercase, hyphens), and `description` says what it does and when to use it. Add `disable-model-invocation: true` for skills a human types on purpose.
3. Keep `SKILL.md` short. Move reference material into sibling files it links to. Delegate to other skills by name; don't restate them.
4. Validate: `node .agents/skills/check.mjs` (names match folders, descriptions present, links resolve, referenced skills exist). Then check what it can't: no instruction points at a tool, path, or command this repo doesn't have. Spot-check commands by running them.
5. Update everything that documents the loop: the skill map in `almalgo-mode/SKILL.md`, `.agents/skills/README.md`, and the loop guide. For the guide, see "Team guide" in `.agents/skills/README.md`. `check.mjs` fails until the PDF matches the current sources.
6. Try it once on a real task before opening the PR, and note what happened in the PR's Evidence.
7. Open the PR with the `pr` skill, scope `skills`. Commit the PDF and `.agents/loop-guide/pdf-source.sha256` in the same PR. A change meant for every project belongs upstream in the Almalgo-Mode repo; local edits are overwritten by re-running `install.sh`.

When in doubt, delete. Keep only prose that changes a decision. If you keep writing the same instruction, encode it as a check instead.

**Reply:** what the skill does, the key decisions, and the trial run.

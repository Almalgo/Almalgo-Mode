# Refactoring

**You own the contract. The structure changes; the behavior does not.** If cleanup reveals a bug or a missing feature, split it out: ship the structural change first against the pinned behavior.

1. **Pin the behavior first.** Run `how` to learn the contract, then capture current behavior before moving anything: a test where a runner exists, otherwise recorded request, script, or DB output or screenshots you can diff afterwards. Typecheck and lint are not a pin.
2. **Name the target shape**: the module layout, types, and call graph you'd build today. If it crosses a boundary, run `architect`. The reshape must delete branches, layers, or invalid states, not add indirection.
3. **Subtract first.** Delete dead code, one-caller wrappers, redundant validation, and orphan references before introducing the new shape.
4. **Move in small steps**, each keeping the pin green. For an API reshape, migrate every caller and delete the old API in the same change; no shims. Grep every rename across code, SQL, docs, and `AGENTS.md`: renames silently miss strings and prose.
5. **Prove behavior is unchanged** by re-running the pin and diffing it against step 1, plus `docs/agents/verify.md` for what the diff touches.
6. **Confirm it earned its place.** The result must be easier to read (fewer layers between a question and its answer, less hidden state). If it isn't, revert.
7. Commits: subtraction, then reshape, then follow-ups. `/code-review`, then the `pr` skill.

**Reply:** what structure changed, the pin and how you held it, the equivalence evidence, the reader-load gain, and what you reverted.

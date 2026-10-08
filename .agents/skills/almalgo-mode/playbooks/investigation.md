# Investigation

**You own the answer.** Read-only: the output is a cited explanation or a recommendation, not a code change.

1. Run the `how` skill over the subsystem. For "why is it like this" questions, also run `why`.
2. Produce the `how`-shaped output (Overview, Key Concepts, How It Works, Where Things Live, Gotchas), or, for a decision between options, a recommendation with a tradeoffs table.
3. If the answer depends on behavior you could observe (what a query returns, how a page renders), run it instead of reasoning about it (the runtime rungs in `docs/agents/verify.md`).
4. If an `AGENTS.md` or `GLOSSARY.md` claim turned out wrong, say so and offer the one-line fix.

No PR and no `architect`. If the investigation turns into a code change, stop and re-route to Bug fix or Feature.

**Reply:** the investigation output. For "are we sure?" questions, give your real judgement with reasons, and push back if the premise is wrong.

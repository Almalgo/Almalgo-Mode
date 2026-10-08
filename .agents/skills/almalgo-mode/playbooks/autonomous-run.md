# Autonomous run

**You own the exit condition.** For "run until done", "I'm going to bed", or a `/loop`.

1. State the exit condition as a checkable predicate before starting ("all tickets under #N closed with merged PRs", "`docs/agents/verify.md` passes on PR M", "p50 under 200 ms").
2. Pick the wake mechanism: Cursor's `/loop` with a sensible interval, or a watcher on an event (a PR merge, a push).
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if it advanced, and discards it if it didn't.
4. Fix what you hit on the way (a broken skill, a flaky check, a stale `AGENTS.md` line) in its own commit or PR. Don't park reversible work for the human. Still stop for anything on the **Always stop and ask** list in `SKILL.md`.
5. Keep a running log (what changed, did the predicate move) in `$TMPDIR`, and point to it in the reply.
6. Stop when the predicate is met. A plateau is not a stop: change approach. A genuine dead end gets surfaced, not spun on. Never relax the predicate.

**Reply:** the exit condition, iterations run, what landed, what was discarded, and the final predicate state.

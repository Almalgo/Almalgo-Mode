# Feature

**You own the design. Plan, delegate, review, verify.**

1. Confirm the work is aligned. For a GitHub issue labelled `ready-for-agent` or a ticket from `/to-tickets`, read it and its parent spec. If "done" is unclear, stop and run `/grill-with-docs` first.
2. Run `how` over each subsystem the feature touches.
3. **Name the data shape** before any logic: the types, the tables or columns, the API/contract shapes, and how each access pattern walks them. For schema work, read the data layer's `AGENTS.md` first.
4. If the feature changes signatures across a function or package boundary, run `architect` (which uses `codebase-design`). Ship the type sketch as its own commit when it's large.
5. Write the throughput checkpoint as four todo items, each filled in or marked `n/a: <reason>`:
   - **Blocking first steps** (schema and contracts before the backend, backend before the UI).
   - **Independent workstreams** (disjoint files or packages that can run in parallel).
   - **Shared mutable state** (the same file, table, or contract written by two workstreams; split it or serialize).
   - **Smallest safe decomposition** (if one worker is best, say why).
6. Implement. Delegate code-writing to `almalgo-agent` subagents with a precise scope: file paths, the named data shape, success criteria. Use `tdd` at agreed seams where a runner exists. Review every diff yourself. Commit liberally.
7. Verify with `docs/agents/verify.md` on the matching surface. "Inconclusive" or the wrong surface is not a pass.
8. Rebase into small, ordered commits (schema, then backend, then UI). If the result is large, split it into stacked PRs.
9. `/code-review` against `main` (Spec axis: the issue), fix every **Act on**, then open the PR with the `pr` skill.

**Reply:** what you built and for whom, what you chose and why (a table for real alternatives), the throughput checkpoint, verification evidence, and open decisions.

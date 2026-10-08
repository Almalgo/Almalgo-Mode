# Bug fix

**You own this fix. Every shipped line traces to runtime evidence.** A change that "might help" is a hypothesis, not a fix, and it doesn't ship. When evidence refutes a hypothesis, revert what it motivated.

1. Load the `diagnosing-bugs` skill and follow its phases. Its feedback loop must go **red on this bug** before any fix. Build it on the same surface the bug shows up on (see `docs/agents/verify.md`: a request, a script, a DB read, the browser). Don't hand reproduction to the human unless you've driven the surface as far as it goes and can name what blocks you.
2. Seed hypotheses with `how` over the subsystem and `why` for regression history (`git log -S`, the PR that introduced it). Eliminate them with runtime evidence (logs, instrumentation, a query), not by reading code.
3. Plan the fix at the root cause. If it changes a signature or crosses packages, run `architect` first.
4. If the package has a test runner and the bug has a cheap seam, follow `tdd`: commit the failing test before the fix. Otherwise keep the red check from step 1 as your regression evidence.
5. Verify on the same surface: the original repro now passes. Then run the rest of `docs/agents/verify.md` for what the diff touches.
6. `/code-review` against `main`, fix every **Act on**, then open the PR with the `pr` skill, linking the issue (`Closes #N`).

**Reply:** what was broken, the root cause, the fix, and how you verified it. Paste the red-then-green output.

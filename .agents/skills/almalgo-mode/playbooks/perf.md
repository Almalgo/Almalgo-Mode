# Perf

**You own the measurement story.** Tie every change to a number; never claim a speedup from reading code.

## One-off fix

1. **Baseline** on a realistic workload (seed data or larger): `EXPLAIN (ANALYZE, BUFFERS)` for a query, `curl -w '%{time_total}'` repeated N times (report the median) for an endpoint, or browser performance timings for a page. Check the number measures what you think: cold vs warm cache, query timeouts, errors counted as fast responses.
2. Ground hypotheses with `how`. Try the cheapest first:
   1. Don't do it (stop work nothing uses).
   2. Don't do it again (cache, memoize, a denormalized column kept by a trigger).
   3. Do less (narrower select, a partial index, pagination).
   4. Do it later or off the request path (background jobs, precomputed rollups).
   5. Do it concurrently.
   6. Do it cheaper.
3. One change at a time. Re-measure after each and keep it only if it moves the number past noise. Revert the rest.
4. Verify behavior is unchanged (`docs/agents/verify.md`), then `/code-review` and the `pr` skill with `before → after` and its unit in Evidence.

## Hillclimb (sustained improvement against a target)

Same as above, plus:
- Fix the metric, the direction, and a stop rule up front (for example "p50 under 200 ms and at least 8 attempts").
- Freeze the measurement command before the first change, and record the baseline.
- Keep a log of each attempt (hypothesis, before, after, kept or reverted) outside the repo, in `$TMPDIR`.
- One commit per accepted win. Don't stop at the first plateau while cheap ideas remain; don't relax the target to finish.

**Reply:** baseline, final number, delta, the measurement command, and what you'd try next.

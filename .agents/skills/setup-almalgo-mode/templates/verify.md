# Verify

<!-- Project-owned. Written by /setup-almalgo-mode; upgrades never touch it. Keep the shape:
     numbered "## N. Name" rungs (check.mjs counts them), the table, and the two closing sections.
     Mirror every change in docs/agents/guide.js, then run: bash .agents/loop-guide/build.sh -->

Prove the change on the real artifact before you call it done. Climb only as far as the diff needs, but always reach the rung that exercises the behavior you changed. Record each rung you ran, with its command and outcome, for the PR's **Evidence** section.

| Diff touches | Minimum rungs |
|---|---|
| Docs, skills, comments only | none (read it rendered) |
| TODO(setup): one row per kind of change in this project | TODO(setup) |

## 1. Static

```bash
TODO(setup): typecheck + lint command(s)
```

## 2. Tests

```bash
TODO(setup): test command, or "none yet"
```

TODO(setup): which parts of the project have a test runner, and where tests live. No runner for the code you touched? Use the runtime rungs below as your executable check; the `tdd` skill covers the fallback.

## 3. Run it

```bash
TODO(setup): how to start the app / stack locally and confirm it is healthy
```

TODO(setup): gotchas, e.g. "plain `make dev` reuses old images, use `make dev-build`".

## 4. Exercise the change

TODO(setup): how to hit what you changed: an endpoint (`curl`), a CLI command, a job, a DB query, a browser page. Real inputs, assert the field you changed.

## Merge danger checklist

TODO(setup): project-specific changes a PR must call out under Merge Danger (schema migrations, public API contracts, dependency or Dockerfile changes, auth, anything a separate consumer relies on).

## Reporting

- **Passed**: name the rung, the command, and the observed output.
- **Not run**: say which rung and why. Never report a rung you didn't run as passed.
- **Inconclusive, or run on the wrong surface** (typecheck for a UI change, say): that isn't a pass. Flag it.

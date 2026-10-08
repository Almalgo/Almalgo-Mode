---
name: almalgo-mode
description: Almalgo's engineering loop for any non-trivial task. Picks a playbook (investigation, bug fix, feature, refactor, perf, babysit/ship, autonomous run, multi-phase plan, skill authoring), applies the team principles, and proves the work on the real stack before opening a PR. Use for /almalgo-mode.
disable-model-invocation: true
mode: true
icon: rocket
color: blue
---

# Almalgo mode

Rigorous, small, verified changes. Write less code, prove it works, ship it in narrow PRs.

## Start every task here

1. **Size it.**
   - **Big or ambiguous** (new surface, crosses packages, unclear what "done" is): align first. Run `/grill-with-docs`, then `/to-spec`, then `/to-tickets` (GitHub sub-issues labelled `ready-for-agent`). Then come back here once per ticket.
   - **Small and clear** (a bug, a labelled `ready-for-agent` issue, a contained change): go straight to step 2.
2. **Read the ground truth for the area**: root `AGENTS.md`, any `AGENTS.md` in the directories you touch, `GLOSSARY.md`, and any ADR in `docs/adr/` that touches it. Those docs are leads, not proof. Spot-check load-bearing claims against the code, and fix a wrong one in the same change.
3. **Pick one playbook** below, open its file, and copy its steps verbatim as the first items of your todo list. A step you skip stays in the list as `skip: <reason>`.
4. **End every code playbook the same way**: verify with this project's ladder in `docs/agents/verify.md`, run `/code-review` against `main` and fix every **Act on** finding, then open the PR with the `pr` skill.
5. **Changed anything under `.agents/` or `.cursor/agents/`?** That includes this file, a playbook, any skill, or `docs/agents/guide.js`. Update the team guide in the same change (see "Team guide" in `.agents/skills/README.md`). `node .agents/skills/check.mjs` must pass.

## Playbooks

| Playbook | Use when | File |
|---|---|---|
| Investigation | Read-only: how does X work, why is Y like this, should we do A or B | [playbooks/investigation.md](playbooks/investigation.md) |
| Bug fix | Something is broken, throwing, wrong, or flaky | [playbooks/bug-fix.md](playbooks/bug-fix.md) |
| Feature | New or changed behavior | [playbooks/feature.md](playbooks/feature.md) |
| Refactoring | Structure changes, behavior must not | [playbooks/refactoring.md](playbooks/refactoring.md) |
| Perf | Something measured is slow; one-off fix or sustained hillclimb | [playbooks/perf.md](playbooks/perf.md) |
| Babysit and ship | Drive an open PR or stack to merge-ready, then land it | [playbooks/babysit-and-ship.md](playbooks/babysit-and-ship.md) |
| Autonomous run | "Run until done", "I'm stepping away", long unattended work | [playbooks/autonomous-run.md](playbooks/autonomous-run.md) |
| Multi-phase plan | Work that spans phases or several PRs; the plan is the deliverable | [playbooks/multi-phase-plan.md](playbooks/multi-phase-plan.md) |
| Authoring a skill | Writing or editing anything in `.agents/skills/` | [playbooks/authoring-a-skill.md](playbooks/authoring-a-skill.md) |

Pausing mid-task or picking up someone else's branch: the `handoff` skill. A question you can't answer alone and the human can: ask it, but see **Autonomy** first.

## Principles

Name the principle that shaped a decision when you explain it. Each line says when it applies.

**Core**

- **Laziness.** Always. The best code is the code never written. Prefer deletion, the stdlib, a platform feature (a DB constraint over app code, CSS over JS), or an existing dependency before new code. Smallest diff that solves the problem. No abstraction with one implementation.
- **Data shape first.** Before writing logic. Name the core types and data structures and how each access pattern walks them. Encode the domain in a structure (a typed model, a table, a state machine, a DB constraint or trigger) rather than scattered conditionals. When the right structure is unclear, load `codebase-design`.
- **Subtract before you add.** Before an addition or refactor. Delete dead code, one-caller wrappers, and redundant validators first, then build on the simpler base.
- **Redesign, don't bolt on.** When a new requirement doesn't fit. Redesign as if it had been a day-one assumption. Before a first release, a clean shape costs less than it ever will again.
- **Attack the premise.** When two fixes sharing one assumption have failed the same check. Stop fixing and question the assumption.

**Architecture**

- **Boundary discipline.** Validate at trust boundaries (incoming requests, webhooks, uploads, env and config, external APIs) and trust internal types after that. Keep auth where the project's `AGENTS.md` says it lives; don't scatter it.
- **Type discipline.** Make illegal states unrepresentable. Parse external data into domain types at the boundary No `any`, no unchecked casts to silence the compiler. Derive types from the authoritative schema (ORM models, API schemas, generated clients) instead of re-declaring them.
- **Idempotent operations.** For imports, migrations, jobs, webhooks, and anything retried. Running it twice, or after a crash halfway, must converge to the same state (upserts on natural keys, not insert-then-fix).
- **Migrate callers, then delete.** When replacing an internal API. Move every caller and delete the old one in the same change. No compatibility shims inside the codebase.

**Verification**

- **Prove it works.** Before saying done. Verify on the real artifact: run it, hit the endpoint, look at the page, read the row. "It compiles" and "the subagent said so" are not proof. See `docs/agents/verify.md`.
- **Fix root causes.** When debugging. Reproduce first, then ask why until you reach the cause. No guard that silences a symptom.
- **Small verifiable units.** For multi-step work and for commits. Each unit ends in a passing check before the next starts; commits are ordered so the history proves itself (failing repro before fix).
- **Test behavior, not implementation.** When writing a test. Call the code the way its users do, assert a literal expected value. If the test would pass with every import stubbed to `undefined`, delete it. Details in `tdd`.
- **Explain the number.** Before reporting a measurement. Say what limits it and rule out that it measured something else.

**Delegation**

- **Guard the context window.** Send bulk reading, searches, and log-heavy runs to subagents and keep summaries in the main thread.
- **Observe, don't ask.** When a "which approach / how does it behave / what does it look like" question could be settled by running something, build a throwaway (`prototype` skill) and let the result decide. Ask the human only for product or preference calls no experiment can settle.

**Meta**

- **Encode lessons in structure.** When you write the same instruction twice, make it a lint rule, a type, a DB constraint, or a script instead. `/retro` captures these at the end of a session.

## Autonomy

**Just do it** for reversible work: editing, committing on a feature branch, running the local stack, opening a ready PR when the task asks for one, commenting on issues.

**Always stop and ask** before anything irreversible or shared:
- force-pushing a shared branch, or pushing to `main`
- wiping a database or volume, or deleting data you didn't create for this task
- merging a PR (unless the user explicitly asked to merge, land, or ship)
- deploys and anything touching a hosted environment or production data
- creating or deleting GitHub labels, milestones, or repo settings
- messages to people outside this session

**"Keep going", "I'm going to bed", "run until done"** switch to the Autonomous run playbook.

**No is an acceptable answer.** If asked whether to do something or shown an approach, give your real judgement. Push back when the premise is wrong or the work doesn't earn its place.

## Subagents

Use the `almalgo-agent` subagent (`.cursor/agents/almalgo-agent.md`) for any code-writing or investigation subagent you spawn inside a playbook. It reads this skill first. Skills that prescribe their own subagents (`how`, `why`, `architect`, `code-review`, `implement-spec`) keep their own setup. Don't pin models; subagents inherit the engineer's choice.

You own every subagent's output. Read the diff yourself and write your own summary; don't pass its report through. Give new work to a fresh subagent with the full brief (original ask, later directives, prior report, branch) rather than resuming a finished one. Subagents editing in parallel each get their own git worktree.

## Writing the reply

- Lead with what changed for the user or the next engineer, then implementation detail.
- Every claim carries its evidence or its label in the same sentence: **measured** (with the command), **inferred**, or **guess**. Never hand the human a check you could have run yourself.
- Never invent a link, issue number, or command output. Link only what you produced or read this session.
- Short sentences. Keep every section the playbook's **Reply** line names; terse is not an excuse to drop content.

## Skill map

| Need | Skill |
|---|---|
| Align on a plan or design before work | `grill-me` (any topic), `grill-with-docs` (also updates `GLOSSARY.md` and ADRs) |
| Turn a conversation into a GitHub spec / tickets | `to-spec`, `to-tickets` |
| Plan something too big for one session | `wayfinder` |
| Build a spec or tickets | `implement` (one branch), `implement-spec` (parallel across tickets) |
| Sort incoming issues | `triage` |
| Walk through a subsystem / find out why it is so | `how`, `why` |
| Design types and module shape before code | `architect` (workflow), `codebase-design` (vocabulary) |
| Find refactor candidates | `improve-codebase-architecture` |
| Name things / record a decision | `domain-modeling` |
| Test-first loop | `tdd` |
| Hard bug | `diagnosing-bugs` |
| Cheap throwaway to settle a question | `prototype` |
| Gather external facts with citations | `research` |
| Script a human-only setup step | `wizard` |
| Review a diff | `code-review` |
| Open a PR | `pr` |
| Pause / resume | `handoff` |
| Improve the environment after a session | `retro` |
| "I didn't follow that" | `wait-what` |
| Write for agents (skills, AGENTS.md) | `writing-for-agents` |

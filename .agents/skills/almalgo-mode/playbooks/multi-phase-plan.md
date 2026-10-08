# Multi-phase plan

**You own the plan, not the code.** The deliverable is a plan someone can execute ticket by ticket. Don't implement.

1. If the change is one or two files with an obvious approach, skip the plan, say so, and route to Feature.
2. Settle empirical open questions with the `prototype` skill before writing. Ask the human only about product or preference calls.
3. Explore in `almalgo-agent` subagents. Each returns file pointers, conventions, and entry points, not dumps.
4. Write the plan through the tracker, not a loose file:
   - **One session can hold it**: `/to-spec` for the parent issue, then `/to-tickets` for one sub-issue per PR, with blocking edges in dependency order.
   - **Too big for one session, many open decisions**: `/wayfinder` builds a map issue of decision tickets first.
5. Each ticket names: the files it touches, the change, what the reviewer will see, and its verification (the `docs/agents/verify.md` rungs and the exact scenario). Mark tickets that change user-facing UI as needing human review with screenshots before merge.
6. Hand back and stop. Execution starts on the human's go, one Feature, Bug fix, or Refactoring playbook per ticket.

**Reply:** the parent issue link, the tickets in order with their dependencies, what prototypes settled, and what stays open.

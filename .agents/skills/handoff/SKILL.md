---
name: handoff
description: Pause the current work cleanly and compact the conversation into a handoff document another agent can resume from. Also the resume protocol when picking that work up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

## Pausing (writing a handoff)

1. **Stop at a safe boundary.** Finish the current atomic step or back out of it. Start nothing new, and cancel any running subagents.
2. **Make the work durable.** Commit uncommitted edits as one `wip:` commit on the current branch. If the tree is broken, say so in one line of the commit body. Take no irreversible action to pause: no new PR, no force-push.
3. **Write the handoff document** to the OS temp directory (`$TMPDIR`, else `/tmp`), not the workspace. Cover:
   - Intent, and the issue/spec it serves (link, don't copy).
   - Branch, last commit, and whether the tree is clean.
   - What is done and **verified** (name the check that proved it), versus done but unverified.
   - The next action on resume, then the remaining steps.
   - Key files, gotchas, and dead ends already ruled out.
   - A "suggested skills" section naming which skills the next agent should load.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, `.env` values, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

Reply with the handoff path, the branch and commit, and the first action on resume.

## Resuming (picking up a handoff or another agent's branch)

1. **Read the trail first**: the handoff doc, `git log`/`git diff` against the base branch, the linked issue. The trail is authoritative input. Don't re-derive it or redo completed work.
2. **Name the resume point**: done vs pending, compared against the original goal.
3. **Route the remaining work** to the matching `almalgo-mode` playbook.
4. **Verify inherited claims** on the real artifact before building on them. A prior agent's "done" is not proof.

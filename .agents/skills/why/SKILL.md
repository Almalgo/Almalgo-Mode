---
name: why
description: "Use for 'why does X work this way', 'why we picked Y', design rationale, regressions, or postmortems. Investigates git history, PRs, GitHub issues, and repo docs (AGENTS.md, GLOSSARY.md, ADRs) in parallel, then returns a cited read on decisions and tradeoffs. Use how for runtime behavior."
disable-model-invocation: true
---

# Why

Investigate the motivation and intent behind code.

Companion to the `how` skill. `how` answers what the code does and how it works. `why` answers what forces led to its shape.

## Operating Posture

Operate as a **careful, cautious, and precise investigator**. Be honest about what you know vs what you're inferring. Read `references/epistemics.md` for the full confidence framework and phrasing guide. The synthesizer must follow it.

## Step 1. Understand the Target and the Question

Parse what the user is asking. The **target** is usually a chunk of code, a pattern, a feature, or a named design decision. The **question** is usually a design rationale, a tradeoff, a motivating edge case, an external constraint, dead code, or a broad history sweep.

If the target is vague ("why do we do it this way?" with no clear referent), make your best guess from conversation context (open files, recent edits, cursor location, what was just discussed). State your interpretation briefly so the user can redirect if you're off, then proceed.

## Step 2. Establish the Code Anchor

Before spawning investigators, anchor the investigation in concrete code. You need:

- The relevant file path(s) and line range(s)
- The key symbols (function names, class names, constants)
- An initial commit list. The last few commits touching the target.
- PR numbers from merge commits (pattern `(#1234)` in the subject line)

Build this inline.

```bash
# Blame target lines for last-touch commits
git blame -L <start>,<end> <file>

# Full file history, with patches, through renames
git log --follow -p -- <file>

# Last N commits touching the file, PR numbers visible
git log --oneline -20 -- <file>

# Extract PR numbers from a commit message
git log -1 --format=%B <commit>
```

Pull PR bodies and discussion via `gh` for any substantive commits:

```bash
gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews
```

Capture this as seed context (file paths, symbols, commits, PR numbers, linked ticket IDs). Pass it to the investigators.

## Step 3. Spawn Parallel Investigators (default posture)

**Default to the full parallel investigation.** Launch every investigator in a single message so they run concurrently, one per evidence source. Each owns exactly one source; don't ask one agent to cover several.

| Investigator | Source | Best at surfacing |
|---|---|---|
| **Source control** (always) | `git log`/`blame`/`-S`, `gh pr view` bodies, reviews and comments, code comments, tests. Playbook: `references/sources/code-archaeology.md` | Implementation-time rationale captured during review |
| **GitHub issues** (always) | `gh issue list --state all --search "<terms>"`, `gh issue view <n> --comments`, linked and parent issues | The product or business forcing function |
| **Repo docs** (always) | Root and area `AGENTS.md`, `GLOSSARY.md`, `docs/adr/`, `docs/*.md` (PRD, 12-week plan, research notes), and their `git log` | Written-down design rationale and planning intent |
| **Other** (only if available) | Any MCP or CLI connected in this session that reaches team chat, analytics, logs or error tracking | Runtime or conversational reality the paper trail lacks |

Add `references/sources/incident-postmortem.md` to an investigator's prompt **if the target code looks defensive** (null checks, retry logic, timeouts, rate limiting, statement-timeout opt-outs, guards).

Subagent config (each): a general-purpose subagent in agent mode, not read-only (read-only can strip MCP access). Investigators still write nothing. Don't pin a model; inherit the session's.

Each investigator gets:
1. The base prompt from `references/investigator-prompt.md`
2. Its row from the table above, plus the playbook file if one is named
3. The code anchor from Step 2 (file paths, symbols, commit hashes, PR numbers, issue numbers)
4. The user's original question

Skip an investigator only with a written reason that goes in "Sources Consulted". If the target is a single-commit change whose PR body already holds the complete answer, you may answer inline; say so explicitly.

## Step 4. Synthesize

Spawn one synthesizer subagent (agent mode, inherit model). It gets:
1. The investigator findings, including null results and skipped sources with reasons
2. The code anchor from Step 2
3. The user's original question
4. The epistemics framework from `references/epistemics.md`
5. The synthesizer prompt template from `references/synthesizer-prompt.md`

## Step 5. Present

Take the synthesizer's output and present it to the user. You may lightly edit for clarity or add context from the conversation, but **do not rewrite the confidence language**.

## Output Format

The output structure is the one in `references/synthesizer-prompt.md`: The Question, The Code in Question, What We Found, What We Can Reasonably Infer, Competing Hypotheses, What We Don't Know, Sources Consulted, Confidence Summary. Adapt as needed, but keep the confidence separation intact, and keep Sources Consulted as one line per investigator, including the ones that returned nothing or were skipped, with the reason.

After the Sources Consulted block, if the user's `why` question is a precursor to actually changing this code, convert the lineage findings into a Preserve / Change / Avoid / Risk constraint set suitable for planning the change.

## Common Failure Modes to Avoid

- **Recency bias**. Assuming the most recent commit is authoritative. The current shape is often the accretion of many earlier decisions. Trace back.

## Reference Files

- `references/epistemics.md`. Confidence tiers and phrasing guide. The synthesizer must follow it.
- `references/investigator-prompt.md`. Base prompt template for investigator subagents.
- `references/sources/code-archaeology.md`. Playbook for the source-control investigator.
- `references/sources/incident-postmortem.md`. Cross-cutting queries for defensive code.
- `references/synthesizer-prompt.md`. Prompt template for the synthesizer subagent, including the output format.

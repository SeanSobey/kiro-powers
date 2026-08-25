---
name: handoff
description: Compact the current session into a handoff document — reasoning, decisions, process, results, state, and next steps — so a cold-start agent can resume. Given a path to an existing handoff, resume from it instead.
disable-model-invocation: true
---

# Handoff Skill

This skill preserves **session state**: a dated, moment-in-time snapshot of the reasoning behind the approach, the decisions and why they were made, what was tried and abandoned, what verifiably works, and exactly what remains — detailed enough that a fresh agent with zero context can recover and continue.

> **Not this skill:** durable, time-agnostic knowledge (verified facts about the codebase, external source takeaways, reference material). That belongs in nested `CONTEXT.md` files via the `context` skill. A handoff *links* to CONTEXT.mds; it does not duplicate them.

Handoffs are immutable — each is a new file, consumed once by the resuming agent. Never edit or merge an existing one.

This skill operates in two modes.

---

## Mode 1: Resume from Handoff

**Trigger:** The user provides a path to an existing handoff file (e.g. `.kiro/handoffs/2026-07-09_1430_logging-improvements.md`), or asks to "load", "resume", "pick up", or "continue from" a handoff.

For "latest": search the configured handoff location (see below) and any existing `.kiro/handoffs/` or `.handoff/` directories; pick the newest by the timestamp-prefixed filename. If several repos are candidates, ask which.

**Behaviour:**

1. Read the handoff file in full. Treat its contents as your working context — you are the cold-start agent it was written for.
2. **Load linked context.** For each CONTEXT.md listed under Context/Artifacts, run the `context` skill's load procedure (it walks up and reads ancestor CONTEXT.mds too).
3. **Verify before trusting:**
   - Confirm the branch and HEAD still match the frontmatter (`git -C <repo> log -1 --format="%h %d"`). If they've moved, diff what changed since.
   - Re-check every **Ephemeral** item — assume all of it is gone until proven otherwise.
   - Spot-check one or two **Durable** claims (the file exists, the change is present).
4. Summarise the state in 2–3 sentences so the user knows you've absorbed it — including anything that no longer holds.
5. Begin working on the **Next Steps** section unless the user redirects you.

Do NOT create a new handoff document in this mode.

---

## Mode 2: Create Handoff

**Trigger:** The user asks to "create a handoff", "write a handoff", "compact this session", or there is meaningful work in the conversation that needs to be preserved.

The output is the information and detail a cold-start agent needs to continue this work without re-reading the full session history.

### Step 1: Extract durable knowledge first

If the session produced *time-agnostic* knowledge — code traces, external source takeaways, verified behaviour that will still be true months from now — run the `context` skill's save procedure first. The handoff then **links** those CONTEXT.mds under Context/Artifacts instead of duplicating them. This keeps knowledge from rotting inside a dated handoff.

Skip this step if the session produced only state and no durable findings.

### Step 2: Resolve the output location

Repo-agnostic, resolved in this order — take the first that applies:

1. A **`## Handoff Location`** section in the repo's agent config. Check `AGENTS.md` (repo root, then `.kiro/steering/`), then `CLAUDE.md`, then other steering files:
   ```bash
   grep -rl '## Handoff Location' <repo>/*.md <repo>/.kiro/steering/*.md 2>/dev/null
   ```
   ```powershell
   Select-String -Path '<repo>\*.md','<repo>\.kiro\steering\*.md' -Pattern '## Handoff Location'
   ```
2. An existing `.kiro/handoffs/` directory.
3. An existing `.handoff/` directory at the workspace root.
4. **None of the above** → ask the user where handoffs should live for this repo.

Whenever the location comes from step 4 (or the user overrides it), **persist it** — add this to the repo's `AGENTS.md`, or `CLAUDE.md` if there's no AGENTS.md, so no future session has to ask:

```markdown
## Handoff Location

Session handoffs are written to `{chosen-path}/` as `{YYYY-MM-DD_HHmm}_{topic-slug}.md`.
```

**Filename:** `{YYYY-MM-DD_HHmm}_{topic-slug}.md` (e.g. `2026-07-09_1430_logging-improvements.md`). The time is the time of the handoff invocation. If the session's work spans multiple repos, write one handoff per repo and cross-link them.

### Step 3: Document header

Start the document with a metadata block:

```yaml
---
created: 2026-07-09T14:30:00
session_id: <machine-id or conversation identifier if available>
workspace: <workspace path>
branches: <active git branches worked on, if any>
head: <short-sha at time of handoff>
---
```

### Step 4: Structure

1. **Project Context** — One paragraph max. What is this project, what does it do, what's the tech stack. A cold agent should understand the domain without reading any other file. Skip if the handoff is a continuation within the same day.

2. **Threads** — Each distinct goal or line of work, in the order they emerged:
   - Name / one-line objective
   - **Status:** completed | in-progress | parked | abandoned
   - **Reasoning & process** — why this approach was chosen; what was tried, in what order. The "why" over the "what" — git history already shows the what, and the next agent needs the reasoning to make consistent choices.
   - **Key decisions & rationale** — include rejected alternatives where the reasoning prevents re-exploration. Architectural decisions: one line + a reference to the ADR (or the ADR tool), not a duplicate of its rationale.
   - **Results** — what verifiably works now, with evidence: build output, test IDs, `file:line`.
   - **Dead ends** — approaches tried and failed, one-line reason each. Mandatory whenever they exist; they are the most expensive thing to rediscover.
   - **Unresolved items** (if any)

   Keep completed/abandoned threads to one or two lines. Expand only in-progress and parked threads. For completed threads with many changes, list the key files touched — not every file, just the entry points a debugger would need.

3. **Current State** — Two subsections, both mandatory. This is the most cold-start-critical section: the resuming agent must know what to trust and what to re-verify.
   - **Durable** (survives restart): code compiles, tests pass/fail count, config changes, hooks enabled/disabled, branches, files written
   - **Ephemeral** (runtime-specific, may be stale): server status, model loaded, auth tokens, MCP connections, pending scheduler jobs, uncommitted state

   Bullets only. Include the build/run command if non-obvious.

4. **Gotchas** — Non-obvious constraints or traps that cost time if rediscovered. Include only if the session surfaced them. Max 5 bullets. Examples: silent truncation behaviours, framework quirks, assertion pitfalls, build/deploy ordering dependencies. Skip this section if none apply.

5. **Context** — What the next agent should read to get up to speed, in two tiers:
   - **CONTEXT.md files** written or updated in Step 1 — list the paths; their content is not repeated here.
   - **Session-specific pointers** — file paths (workspace-relative), URLs (docs, PRs, issues, design docs), steering files or specs that informed decisions.

   For each entry: one-line description of what it contains and why it's relevant. Order by importance. Add a reading-order hint if there's a natural sequence (e.g. "Read A first, then B if working on X").

6. **Next Steps** — Ordered, actionable, detailed enough to execute without re-deriving the plan. If the user passed arguments, treat them as the focus for the next session and weight this section accordingly. Include the exact command or tool call where possible — not just "do X" but "run `npm run build` then `POST /api/reindex`".

7. **Artifacts** — Paths, URLs, commits, PRs, specs, ADRs. One-line description + reference. Never duplicate their content. Only include artifacts created or significantly modified in this session.

8. **Suggested Skills** — Optional. Table of `Skill | When` for skills the next agent will likely need. Skip if none apply.

9. **Entities** — Optional. Domain objects, components, or relationships clarified during the session that aren't obvious from code or docs alone. Format: `Name` — one-line definition or relationship. Only include if the session produced understanding that would otherwise require re-derivation. Skip if all concepts are adequately documented.

### Rules

- Redact secrets (API keys, tokens, passwords, PII) → `[REDACTED]`.
- Prioritise decisions and context that would be lost if the conversation disappeared. Omit routine tool output and incremental debugging steps.
- If multiple threads or sub-tasks ran in parallel, summarise each separately under Threads before merging into unified Next Steps.
- Keep under 300 lines. Readable in under 2 minutes.
- Absolute dates only (`YYYY-MM-DD`), never "today"/"yesterday".
- Knowledge goes to CONTEXT.md (via the `context` skill), state goes to the handoff — link, don't duplicate.
- Never write a handoff outside the resolved location without asking.
- If the conversation contains no meaningful work to hand off, say so in one sentence.

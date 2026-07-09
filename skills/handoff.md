---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
---

Compact the current conversation into a handoff document for another agent to pick up.

The output is a `handoff.md` — the information and detail a cold-start agent needs to continue this work without re-reading the full session history.

## Output Location

Save to `.kiro/handoffs/` (preferred) or `.handoff/` at workspace root if `.kiro` doesn't exist.

Filename: `YYYY-MM-DD_HHmm_handoff.md` (e.g. `2026-07-09_1430_handoff.md`)

## Document Header

Start the document with a metadata block:

```yaml
---
created: 2026-07-09T14:30:00
session_id: <machine-id or conversation identifier if available>
workspace: <workspace path>
branches: <active git branches worked on, if any>
---
```

## Structure

1. **Project Context** — One paragraph max. What is this project, what does it do, what's the tech stack. A cold agent should understand the domain without reading any other file. Skip if the handoff is a continuation within the same day.

2. **Threads** — Each distinct goal or line of work, in the order they emerged:
   - Name / one-line objective
   - Status: completed | in-progress | parked | abandoned
   - Key decisions & rationale (include rejected alternatives where the reasoning prevents re-exploration)
   - Dead ends (approaches tried and failed, one-line reason each)
   - Unresolved items (if any)
   
   Keep completed/abandoned threads to one or two lines. Expand only in-progress and parked threads.

3. **Current State** — Two subsections:
   - **Durable** (survives restart): code compiles, tests pass/fail count, config changes, hooks enabled/disabled, branches
   - **Ephemeral** (runtime-specific, may be stale): server status, model loaded, pending scheduler jobs
   
   Bullets only. Include the build/run command if non-obvious.

4. **Context** — Files, URLs, docs, or resources the next agent should read to get up to speed. These are things referenced or consulted during the session that provide necessary background:
   - File paths (relative to workspace root)
   - URLs (documentation, PRs, issues, design docs)
   - Steering files or specs that informed decisions
   
   For each entry: one-line description of what it contains and why it's relevant. Order by importance. Add a reading-order hint if there's a natural sequence (e.g. "Read A first, then B if working on X").

5. **Next Steps** — Ordered, actionable. If the user passed arguments, treat them as the focus for the next session and weight this section accordingly. Include the exact command or tool call where possible (not just "do X" but "run `npm run build` then `POST /api/reindex`").

6. **Artifacts** — Paths, URLs, commits, PRs, specs, ADRs. One-line description + reference. Never duplicate their content. Only include artifacts created or significantly modified in this session.

7. **Suggested Skills** — Skills (by exact name) the next agent should invoke at session start, with a one-line reason.

## Rules

- Redact secrets (API keys, tokens, passwords, PII) → `[REDACTED]`.
- Prioritise decisions and context that would be lost if the conversation disappeared. Omit routine tool output and incremental debugging steps.
- If multiple threads or sub-tasks ran in parallel, summarise each separately under Threads before merging into unified Next Steps.
- Keep under 300 lines. Readable in under 2 minutes.
- If the conversation contains no meaningful work to hand off, say so in one sentence.
- For completed threads with many changes, list the key files touched (not every file, just the entry points a debugger would need).
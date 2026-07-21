---
name: handoff
description: Compact the current conversation into a handoff document, or resume from an existing one.
disable-model-invocation: true
---

# Handoff Skill

This skill operates in two modes:

## Mode 1: Resume from Handoff

**Trigger:** The user provides a path to an existing handoff file (e.g. `.kiro/handoffs/2026-07-09_1430_logging-improvements.md`), or asks to "load", "resume", "pick up", or "continue from" a handoff.

**Behaviour:**
1. Read the handoff file.
2. Treat its contents as your working context — you are the cold-start agent it was written for.
3. Summarise the state in 2–3 sentences so the user knows you've absorbed it.
4. Begin working on the **Next Steps** section unless the user redirects you.

Do NOT create a new handoff document in this mode.

---

## Mode 2: Create Handoff

**Trigger:** The user asks to "create a handoff", "write a handoff", "compact this session", or there is meaningful work in the conversation that needs to be preserved.

The output is a `handoff.md` — the information and detail a cold-start agent needs to continue this work without re-reading the full session history.

### Output Location

Save to `.kiro/handoffs/` (preferred) or `.handoff/` at workspace root if `.kiro` doesn't exist.

Filename: `{YYYY-MM-DD_HHmm}_{topic-slug}.md` (e.g. `2026-07-09_1430_logging-improvements.md`). Note the time is the time of the handoff invocation.

### Document Header

Start the document with a metadata block:

```yaml
---
created: 2026-07-09T14:30:00
session_id: <machine-id or conversation identifier if available>
workspace: <workspace path>
branches: <active git branches worked on, if any>
---
```

### Structure

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

4. **Gotchas** — Non-obvious constraints or traps that cost time if rediscovered. Include only if the session surfaced them. Max 5 bullets. Examples: silent truncation behaviours, framework quirks, assertion pitfalls, build/deploy ordering dependencies. Skip this section if none apply.

5. **Context** — Files, URLs, docs, or resources the next agent should read to get up to speed. These are things referenced or consulted during the session that provide necessary background:
   - File paths (relative to workspace root)
   - URLs (documentation, PRs, issues, design docs)
   - Steering files or specs that informed decisions
   
   For each entry: one-line description of what it contains and why it's relevant. Order by importance. Add a reading-order hint if there's a natural sequence (e.g. "Read A first, then B if working on X").

6. **Next Steps** — Ordered, actionable. If the user passed arguments, treat them as the focus for the next session and weight this section accordingly. Include the exact command or tool call where possible (not just "do X" but "run `npm run build` then `POST /api/reindex`").

7. **Artifacts** — Paths, URLs, commits, PRs, specs, ADRs. One-line description + reference. Never duplicate their content. Only include artifacts created or significantly modified in this session.

8. **Entities** — Optional. Domain objects, components, or relationships clarified during the session that aren't obvious from code or docs alone. Format: `Name` — one-line definition or relationship. Only include if the session produced understanding that would otherwise require re-derivation. Skip if all concepts are adequately documented.

### Rules

- Redact secrets (API keys, tokens, passwords, PII) → `[REDACTED]`.
- Prioritise decisions and context that would be lost if the conversation disappeared. Omit routine tool output and incremental debugging steps.
- If multiple threads or sub-tasks ran in parallel, summarise each separately under Threads before merging into unified Next Steps.
- Keep under 300 lines. Readable in under 2 minutes.
- If the conversation contains no meaningful work to hand off, say so in one sentence.
- For completed threads with many changes, list the key files touched (not every file, just the entry points a debugger would need).
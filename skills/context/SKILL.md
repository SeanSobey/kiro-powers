---
name: manage-context
description: Save time-agnostic investigation findings (facts, file references, external sources, open questions) into a nested CONTEXT.md for future agents, or — given a path to an existing CONTEXT.md — ingest it plus all ancestor CONTEXT.mds as session context. Use after research/investigation, or at session start to avoid re-investigating.
---

# Manage Context (CONTEXT.md)

This skill preserves **knowledge** across agent sessions. After a session has investigated something — traced code, fetched URLs, verified behaviour, resolved ambiguities — it distills the *time-agnostic* results into a `CONTEXT.md` at the folder the findings are about. Later agents ingest that file (plus its ancestors) instead of repeating the investigation.

CONTEXT.md files are **nested**: a file high up the tree holds general context; the deeper the file, the more specific its content. A future agent working in a deep folder reads the whole chain, general → specific.

> **Not this skill:** session state — reasoning narrative, what remains to do, running services, unfinished threads. That is a *moment-in-time* snapshot and belongs to the `handoff` skill (`C:\GitHub\DocumedPtyLtd\HANDOFF.md`). If the user wants a resume point rather than durable knowledge, use that instead.

## When to Use

- After an investigation/research phase produced findings worth keeping (code traces, external docs, verified behaviour, decisions)
- Before ending a session that discovered anything expensive to rediscover
- At session start, when pointed at an existing CONTEXT.md, to warm-start from prior work
- When the user says "save this as context", "capture what we found", "load the context from {path}"

## Mode Detection

| Invocation | Mode |
|---|---|
| Given a path to an existing `CONTEXT.md`, or a directory containing one | **Load** — ingest it |
| Anything else (optionally with instructions about topic/scope) | **Save** — capture the session's findings |

The optional instruction narrows the topic — e.g. "just the ERA matching findings" from a session that covered several things. If the session spans multiple topics and no guidance is given, ask the user which to capture, or capture each topic to its own location.

## Ancestor Discovery (shared by both modes)

Discover every CONTEXT.md from a target directory up to the workspace root. Stop at (and include) `C:\GitHub\DocumedPtyLtd` — never go above it.

PowerShell:

```powershell
$root='C:\GitHub\DocumedPtyLtd'; $d=Get-Item '<target-dir>'
while ($d) { $p=Join-Path $d.FullName 'CONTEXT.md'; if (Test-Path $p) { $p }
  if ($d.FullName -ieq $root) { break }; $d=$d.Parent }
```

Bash:

```bash
d='<target-dir>'; root='/c/GitHub/DocumedPtyLtd'
while :; do [ -f "$d/CONTEXT.md" ] && echo "$d/CONTEXT.md"
  [ "$d" = "$root" ] && break; d=$(dirname "$d"); done
```

Output is deepest-first. Reverse it when reading (general → specific).

---

## Save Mode

### 1. Pick the target folder

The **most specific directory the findings are about** — a spec directory, a component folder, a docs folder, a repo root. Anywhere in the workspace is valid; this is not restricted to `.kiro/specs/`. If findings genuinely span two unrelated areas, write two CONTEXT.mds rather than one vague one.

### 2. Read the ancestor chain

Run the walk-up from the target folder. Read every ancestor CONTEXT.md found.

**Rule: deeper = more specific.** Never duplicate content an ancestor already holds — link to it. Parents index; leaves detail.

### 3. Write or merge the target CONTEXT.md

- **No file exists** → create it from the template below.
- **File exists** → merge in place. Read it first. Update stale sections, append new findings, bump `Last Updated`. Respect its existing heading structure (the existing `.kiro/specs` CONTEXT.mds are valid merge targets — don't force the template onto them). Never clobber sections you didn't investigate.

### 4. Refresh ancestor indexes (runtime check)

For each **existing** ancestor CONTEXT.md, check whether it references the child:

```powershell
Select-String -Path '<ancestor>\CONTEXT.md' -SimpleMatch '<child-folder-name>'
```

```bash
grep -F '<child-folder-name>' '<ancestor>/CONTEXT.md'
```

If the reference is missing or stale, add/refresh a **one-line link entry** in the ancestor's index or Cross-References section. **Never create a new ancestor CONTEXT.md** — only touch ones that already exist.

### 5. Route decisions to the ADR system

Durable architectural decisions belong in ADRs, not buried here. In this workspace ADRs live as `docs/implementation-status/*-adr.md` files and via the codebase-memory MCP `manage_adr` tool. In CONTEXT.md record only a **one-line decision + reference** to the ADR — never duplicate the rationale. If a decision has no ADR yet, note that under Open Questions rather than inventing an ADR location.

### 6. Select content for token value

Capture what was **expensive** to obtain:

- External sources fetched — summarize the takeaway, keep the URL so nobody re-fetches
- Cross-repo/cross-service traces
- Verified behaviour with exact `file:line` references (e.g. `AccountingController.cs:154`)
- Resolved ambiguities and their answers
- Dead ends only if they're timeless facts ("X API does not support Y"), not session narrative

Omit what is **cheap** to re-derive: anything one Glob/Grep away, directory listings, and code dumps — use a `path:line` reference instead of pasting code.

### 7. Keep it time-agnostic

No session narrative, no "what remains", no task checklists, no environment state (services, tokens, branches). Everything written must still be true when read months later. Use absolute dates (`YYYY-MM-DD`), never "today" or "last week".

### Template (new files)

```markdown
# {Topic} — Context

**Scope:** {what this covers}
**Last Updated:** {YYYY-MM-DD}
**Sources:** {issues, URLs, meetings that fed this}

---

## Overview
{1–2 paragraphs: what this is, why it matters}

## Findings
{Verified facts with exact file:line refs}

## Key Decisions
{One-liners + ADR references — no duplicated rationale}

## Key Files
| File | Role |
|---|---|

## External Sources
| URL / Doc | What it told us |
|---|---|

## Open Questions
{What remains unknown}

## Cross-References
{Parent/child CONTEXT.mds, related specs — use #[[file:...]] syntax for Kiro compatibility}
```

All sections are optional — include only what the investigation actually produced. Parent-level files lean toward index tables; leaf files lean toward specifics.

---

## Load Mode

1. **Resolve the path.** If given a directory, use `<dir>/CONTEXT.md`. Error clearly if no CONTEXT.md exists there.
2. **Walk up** from its directory (commands above). Read results **root-most first, target last** — general context first, most specific last. On conflicting statements, the most specific (deepest) file wins.
3. **Don't eagerly follow `#[[file:...]]` cross-references.** List them and read on demand only if the session's task needs them — that's the token optimization.
4. **Confirm ingestion** with a 2–4 sentence summary: what context is now loaded, from which files. Flag any file whose `Last Updated` is older than ~1 month as possibly stale — verify its file references before relying on them.

---

## Rules

- Walk stops at `C:\GitHub\DocumedPtyLtd` — never above.
- Merge, never overwrite blind; always read a file before editing it.
- Deeper = more specific; parents index, leaves detail; never duplicate ancestor content.
- Never create ancestor CONTEXT.mds at save time — only update existing ones.
- Absolute dates only.
- Architectural decisions → ADR reference, not duplication.
- Session state (resume points, remaining work, environment) → use the `handoff` skill instead.

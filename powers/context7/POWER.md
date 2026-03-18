---
name: "context7"
displayName: "Context7"
description: "Up-to-date library documentation and code examples via Context7 MCP. Resolve library IDs and query current docs for any npm package, framework, or language library."
keywords: ["context7", "documentation", "docs", "library", "api", "examples", "code-examples", "packages"]
author: "Sean Sobey"
---

# Context7

## Overview

Context7 provides real-time, up-to-date documentation and code examples for programming libraries and frameworks through the Model Context Protocol. Instead of relying on potentially outdated training data, Context7 fetches current documentation directly from source — giving you accurate API references, working code snippets, and version-specific guidance.

This is especially useful when:
- Working with recently released library versions
- Needing accurate API signatures and parameters
- Looking for working code examples for a specific use case
- Verifying that a pattern or method still exists in the latest version

## Available Steering Files

- **workflows** — Common documentation lookup patterns and advanced usage

## Onboarding

### Prerequisites
- Node.js and npx installed

### How It Works

Context7 uses a two-step process:

1. **Resolve Library ID** — Search for a library by name to get its Context7-compatible identifier
2. **Query Documentation** — Use the resolved ID to fetch relevant docs and code examples

No API keys or additional configuration are required for basic usage.

## Common Workflows

### Look Up Library Documentation

**Step 1: Resolve the library ID**
```
resolve-library-id with libraryName="next.js"
```

This returns matching libraries with:
- Library ID (e.g., `/vercel/next.js`)
- Description
- Number of available code snippets
- Source reputation score

**Step 2: Query the docs**
```
get-library-docs with context7CompatibleLibraryID="/vercel/next.js", topic="app router middleware"
```

### Search for Specific Patterns

Be specific with your topic to get the most relevant results:

```
resolve-library-id with libraryName="express"
get-library-docs with context7CompatibleLibraryID="/expressjs/express", topic="error handling middleware"
```

### Version-Specific Documentation

If the resolve step returns version information, you can target a specific version:

```
get-library-docs with context7CompatibleLibraryID="/vercel/next.js/v14.3.0", topic="server actions"
```

### Compare Libraries

Resolve and query multiple libraries to compare approaches:

```
# Check React Query
resolve-library-id with libraryName="tanstack react query"
get-library-docs with context7CompatibleLibraryID="/tanstack/query", topic="mutations and optimistic updates"

# Check SWR
resolve-library-id with libraryName="swr"
get-library-docs with context7CompatibleLibraryID="/vercel/swr", topic="mutations and optimistic updates"
```

## Tool Reference

### resolve-library-id

Resolves a package or product name to a Context7-compatible library ID.

**Parameters:**
- `libraryName` (string, required) — The library or package name to search for
- `query` (string, required) — Description of what you need help with, used to rank results by relevance

**Returns:** List of matching libraries with IDs, descriptions, snippet counts, and reputation scores.

**Tips:**
- Use the official package name for best results
- Include the ecosystem if ambiguous (e.g., "react query" not just "query")
- Check snippet count — higher counts mean more documentation coverage

### get-library-docs

Fetches documentation and code examples for a resolved library.

**Parameters:**
- `context7CompatibleLibraryID` (string, required) — The library ID from resolve step (format: `/org/project` or `/org/project/version`)
- `topic` (string, required) — Specific topic or question to search for

**Returns:** Relevant documentation sections and code examples.

**Tips:**
- Be specific with topics: "JWT authentication setup" beats "auth"
- Include the use case: "React useEffect cleanup function examples" beats "hooks"
- Query multiple topics for comprehensive coverage

## Best Practices

- Always resolve the library ID first before querying docs — don't guess IDs
- Use specific, descriptive topics for better results
- Prefer libraries with higher reputation scores and snippet counts
- Cross-reference Context7 results with official docs for critical implementations
- When a library has multiple versions listed, use the version matching your project
- Limit to 3 resolve calls and 3 query calls per question to stay efficient

## Troubleshooting

### No Results for Library Name
**Cause:** Library name doesn't match Context7's index.
**Solution:** Try alternative names — e.g., "nextjs" vs "next.js", or the npm package name directly.

### Outdated or Missing Documentation
**Cause:** Context7 may not have indexed the very latest release yet.
**Solution:** Fall back to the library's official documentation site. Context7 covers most popular libraries but coverage varies.

### Irrelevant Results
**Cause:** Topic query too vague.
**Solution:** Be more specific. Instead of "routing", try "dynamic route parameters with TypeScript in app router".

## Configuration

No additional configuration required beyond the MCP server installation. The server runs via npx and fetches documentation on demand.

If you have a Context7 API key, you can pass it as an argument:
```
"args": ["-y", "@upstash/context7-mcp@latest", "--api-key", "YOUR_API_KEY"]
```

---

**Package:** `@upstash/context7-mcp`
**MCP Server:** context7

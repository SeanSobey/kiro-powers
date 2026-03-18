# Kiro Powers

A collection of custom [Kiro](https://kiro.dev) powers that extend your AI assistant with MCP-based tools for browser automation, Git, GitHub, npm, and library documentation lookup.

## Powers

### Chrome DevTools MCP

Control Chrome from your AI assistant. Navigate pages, click elements, fill forms, take screenshots, inspect network requests, run Lighthouse audits, and trace performance.

| | |
|---|---|
| MCP Server | `chrome-devtools` |
| Package | [`chrome-devtools-mcp`](https://www.npmjs.com/package/chrome-devtools-mcp) |
| Command | `npx -y chrome-devtools-mcp@latest --no-usage-statistics` |
| Prerequisites | Google Chrome or Chromium, Node.js 18+ |
| Env vars | None |

Steering files:
- `testing-and-debugging` — E2E testing patterns, debugging console errors, network inspection, form testing
- `performance-and-audits` — Lighthouse audits, performance tracing, Core Web Vitals, emulation

---

### Context7

Look up live, up-to-date documentation and code examples for any library or framework directly from your AI assistant.

| | |
|---|---|
| MCP Server | `context7` |
| Package | [`@upstash/context7-mcp`](https://www.npmjs.com/package/@upstash/context7-mcp) |
| Command | `npx -y @upstash/context7-mcp@latest` |
| Prerequisites | Node.js 18+ |
| Env vars | None |

Documentation: [context7.com](https://context7.com)

---

### Git

Comprehensive Git operations via MCP. Clone, commit, push, pull, branch, diff, log, stash, rebase, cherry-pick, worktrees, and more.

| | |
|---|---|
| MCP Server | `git` |
| Package | [`@cyanheads/git-mcp-server`](https://www.npmjs.com/package/@cyanheads/git-mcp-server) |
| Command | `npx -y @cyanheads/git-mcp-server` |
| Prerequisites | Git installed, Node.js 18+ |
| Env vars | None |

Steering files:
- `advanced-workflows` — Rebasing, cherry-picking, stashing, worktrees, interactive history
- `collaboration` — Remote management, pushing, pulling, fetching, team collaboration patterns

---

### GitHub

Full GitHub platform operations via MCP. Manage repositories, issues, pull requests, branches, releases, code search, and Copilot agent integration.

| | |
|---|---|
| MCP Server | `github` |
| Package | [`@modelcontextprotocol/server-github`](https://www.npmjs.com/package/@modelcontextprotocol/server-github) |
| Command | `npx -y @modelcontextprotocol/server-github` |
| Prerequisites | GitHub account, Personal Access Token, Node.js 18+ |
| Env vars | `GITHUB_PERSONAL_ACCESS_TOKEN` |

**Setup:** After installing, replace `YOUR_GITHUB_TOKEN_HERE` in `mcp.json` with your [GitHub PAT](https://github.com/settings/tokens). Required scopes: `repo`, `read:org`, `read:user`.

Steering files:
- `pull-requests` — Creating, reviewing, merging PRs, code review workflows
- `issues-and-projects` — Issue management, labels, sub-issues, search patterns
- `advanced-operations` — Releases, tags, Copilot agent delegation, secret scanning, repo management

---

### npm

npm package management via MCP. Search, install, update, audit, analyze dependencies, check bundle sizes, and manage licenses.

| | |
|---|---|
| MCP Server | `npm` |
| Package | [`@anthropic/npm-mcp-server`](https://www.npmjs.com/package/@anthropic/npm-mcp-server) |
| Command | `npx -y @anthropic/npm-mcp-server` |
| Prerequisites | Node.js (npm comes bundled) |
| Env vars | None |

Steering files:
- `advanced-workflows` — Workspaces, publishing, linking, caching, CI/CD patterns

## Installation

Copy any power folder into your Kiro workspace's `.kiro/powers/` directory (or install via the Kiro Powers panel). Each power contains:

- `mcp.json` — MCP server configuration
- `POWER.md` — Full documentation and usage examples
- `steering/` — Optional workflow guides that provide additional context to the AI assistant

## License

See [LICENSE](LICENSE).

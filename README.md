# Kiro Powers

A collection of custom [Kiro](https://kiro.dev) powers that extend your AI assistant with MCP-based tools for browser automation, Git, GitHub, npm, library documentation, charts, file management, PDF reading, YouTube, and Notion.

## Powers

| Power | Description |
|-------|-------------|
| [Chart Generator](#chart-generator) | Generate charts using Chart.js v4 — bar, line, pie, radar, scatter, and more |
| [Chrome DevTools](#chrome-devtools-mcp) | Control Chrome — navigate, click, screenshot, Lighthouse audits, performance tracing |
| [Context7](#context7) | Look up live documentation and code examples for any library or framework |
| [Filesystem](#filesystem) | Sandboxed local file operations — read, write, move, search, and manage files |
| [Git](#git) | Comprehensive Git operations — clone, commit, branch, diff, rebase, stash, and more |
| [GitHub](#github) | Full GitHub platform — repos, issues, PRs, releases, code search, Copilot |
| [Notion](#notion) | Notion workspace — pages, databases, blocks, comments, users, and search |
| [npm](#npm) | npm package management — search, install, audit, bundle size, licenses |
| [PDF Reader](#pdf-reader) | Read and extract content from PDFs — text, pages, metadata, tables, images |
| [YouTube](#youtube) | YouTube platform — search videos, transcripts, channels, and playlists |

---

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

---

### Chart Generator

Generate charts using Chart.js v4 via MCP. Create bar, line, pie, doughnut, radar, scatter, and bubble charts as PNG images, interactive HTML, or raw JSON config.

| | |
|---|---|
| MCP Server | `chart` |
| Package | [`@ax-crew/chartjs-mcp-server`](https://www.npmjs.com/package/@ax-crew/chartjs-mcp-server) |
| Command | `npx -y @ax-crew/chartjs-mcp-server@latest` |
| Prerequisites | Node.js 18+ |
| Env vars | None |

---

### Filesystem

Local filesystem operations via MCP. Read, write, move, search, and manage files and directories with sandboxed access to allowed directories only.

| | |
|---|---|
| MCP Server | `filesystem` |
| Package | [`@modelcontextprotocol/server-filesystem`](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem) |
| Command | `npx -y @modelcontextprotocol/server-filesystem@latest <allowed-dirs>` |
| Prerequisites | Node.js 18+ |
| Env vars | None |

**Setup:** Add one or more allowed directory paths as arguments in `mcp.json`. The server only accesses directories you explicitly permit.

Steering files:
- `advanced-operations` — Batch file operations, directory trees, search patterns, file management workflows

---

### Notion

Full Notion workspace operations via MCP. Manage pages, databases, blocks, comments, users, and search across your Notion workspace.

| | |
|---|---|
| MCP Server | `notionApi` |
| Package | [`@notionhq/notion-mcp-server`](https://www.npmjs.com/package/@notionhq/notion-mcp-server) |
| Command | `npx -y @notionhq/notion-mcp-server` |
| Prerequisites | Notion account, Internal Integration, Node.js 18+ |
| Env vars | `OPENAPI_MCP_HEADERS` (contains Authorization header with API key) |

**Setup:** Create an [internal integration](https://www.notion.so/profile/integrations), copy the secret, and replace `YOUR_NOTION_API_KEY_HERE` in `mcp.json`. Share pages/databases with your integration via the "Connections" menu.

Steering files:
- `databases-and-pages` — Creating, querying, and managing databases and pages with property schemas
- `blocks-and-content` — Working with block content, comments, and advanced content manipulation

---

### PDF Reader

Read and extract content from PDF files via MCP. Supports local files and URLs with options for full text, specific pages, metadata, images, and table extraction.

| | |
|---|---|
| MCP Server | `pdf-reader` |
| Package | [`@sylphx/pdf-reader-mcp`](https://www.npmjs.com/package/@sylphx/pdf-reader-mcp) |
| Command | `npx @sylphx/pdf-reader-mcp@latest` |
| Prerequisites | Node.js 18+ |
| Env vars | None |

---

### YouTube

YouTube platform operations via MCP. Search videos, get video details, read transcripts, explore channels, and browse playlists.

| | |
|---|---|
| MCP Server | `youtube` |
| Package | [`@sfiorini/youtube-mcp`](https://www.npmjs.com/package/@sfiorini/youtube-mcp) |
| Command | `npx -y @sfiorini/youtube-mcp@latest` |
| Prerequisites | Google account, YouTube Data API v3 key, Node.js 18+ |
| Env vars | `YOUTUBE_API_KEY` |

**Setup:** Enable [YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com) in Google Cloud Console, create an API key, and replace `YOUR_YOUTUBE_API_KEY_HERE` in `mcp.json`.

Steering files:
- `research-and-analysis` — Video research workflows, transcript analysis, channel exploration, content comparison

## Installation

Copy any power folder into your Kiro workspace's `.kiro/powers/` directory (or install via the Kiro Powers panel). Each power contains:

- `mcp.json` — MCP server configuration
- `POWER.md` — Full documentation and usage examples
- `steering/` — Optional workflow guides that provide additional context to the AI assistant

## License

See [LICENSE](LICENSE).

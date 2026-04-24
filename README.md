# Kiro Powers

A collection of custom [Kiro](https://kiro.dev) powers that extend your AI assistant with MCP-based tools — served over HTTP via Docker or locally via stdio.

## Architecture

Powers run as MCP servers inside Docker containers, exposed over Streamable HTTP through an nginx reverse proxy on port 3000. Each power's `mcp.json` connects to `http://localhost:3000/<server>/mcp` by default, with a disabled stdio fallback for running locally.

```
Kiro IDE → http://localhost:3000/<power>/mcp → nginx → supergateway → MCP server
```

### Tiers

| Tier | Powers | Description |
|------|--------|-------------|
| API-only | context7, fetch, github, github-extras, notion, youtube | Pure network services, no host access needed |
| Staging | chart, markitdown, pdf-reader | Read/write files via a shared staging volume |
| CDP | chrome-devtools | Connects to Chrome on the host via DevTools Protocol |
| Host-only | docx-reader, filesystem, git, npm, playwright, sqlite | Disabled by default — need direct host access |

## Quick Start

1. Copy `.env.example` to `.env` and fill in your API keys and staging path
2. Build: `docker compose build`
3. Start: `docker compose up -d`
4. Install powers into Kiro from the `powers/` directory

## Powers

| Power | Transport | Description |
|-------|-----------|-------------|
| [Chart Generator](#chart-generator) | Docker (staging) | Generate charts using Chart.js v4 |
| [Chrome DevTools](#chrome-devtools) | Docker (CDP) | Control Chrome — navigate, click, screenshot, Lighthouse |
| [Context7](#context7) | Docker | Live documentation and code examples for any library |
| [Docx Reader](#docx-reader) | Host (disabled) | Read, write, search, merge, and convert Word documents |
| [Fetch](#fetch) | Docker | Fetch and extract content from URLs |
| [Filesystem](#filesystem) | Host (disabled) | Sandboxed local file operations |
| [Git](#git) | Host (disabled) | Comprehensive Git operations |
| [GitHub](#github) | Docker | Full GitHub platform — repos, issues, PRs, releases |
| [MarkItDown](#markitdown) | Docker (staging) | Convert 20+ file formats to Markdown |
| [Notion](#notion) | Docker | Notion workspace — pages, databases, blocks, search |
| [npm](#npm) | Host (disabled) | npm package management |
| [PDF Reader](#pdf-reader) | Docker (staging) | Extract text, metadata, tables, images from PDFs |
| [Playwright](#playwright) | Host (disabled) | Browser automation via Playwright |
| [SQLite](#sqlite) | Host (disabled) | SQLite database operations |
| [YouTube](#youtube) | Docker | YouTube — search, transcripts, channels, playlists |

---

## Docker Powers

### Context7

Live documentation and code examples for any library or framework.

| | |
|---|---|
| Package | [`@upstash/context7-mcp`](https://www.npmjs.com/package/@upstash/context7-mcp) |
| URL | `http://localhost:3000/context7/mcp` |
| Env vars | `CONTEXT7_API_KEY` (optional) |

### Fetch

Fetch and extract content from URLs as markdown, text, or raw HTML.

| | |
|---|---|
| Package | [`fetch-mcp`](https://www.npmjs.com/package/fetch-mcp) |
| URL | `http://localhost:3000/fetch/mcp` |
| Env vars | None |

### GitHub

Full GitHub platform operations. Includes a custom `github-extras` server for labels, milestones, releases, workflows, gists, collaborators, tags, and projects.

| | |
|---|---|
| Packages | [`@modelcontextprotocol/server-github`](https://www.npmjs.com/package/@modelcontextprotocol/server-github) + custom `github-extras` |
| URLs | `http://localhost:3000/github/mcp`, `http://localhost:3000/github-extras/mcp` |
| Env vars | `GITHUB_PERSONAL_ACCESS_TOKEN` |

Steering: `pull-requests`, `issues-and-projects`, `advanced-operations`

### Notion

Full Notion workspace operations — pages, databases, blocks, comments, users, and search.

| | |
|---|---|
| Package | [`@notionhq/notion-mcp-server`](https://www.npmjs.com/package/@notionhq/notion-mcp-server) |
| URL | `http://localhost:3000/notion/mcp` |
| Env vars | `NOTION_API_KEY` |

Steering: `databases-and-pages`, `blocks-and-content`

### YouTube

Search videos, get details, read transcripts, explore channels, and browse playlists.

| | |
|---|---|
| Package | [`@sfiorini/youtube-mcp`](https://www.npmjs.com/package/@sfiorini/youtube-mcp) |
| URL | `http://localhost:3000/youtube/mcp` |
| Env vars | `YOUTUBE_API_KEY` |

---

## Staging Powers

These powers run in Docker but need file access. A shared staging directory on the host is mounted into each container at `/staging`. The AI discovers the host path by reading `STAGING_DIR` from the `.env` file at runtime.

Each service gets its own subfolder: `STAGING_DIR/chart`, `STAGING_DIR/markitdown`, `STAGING_DIR/pdf-reader`.

### Chart Generator

Generate bar, line, pie, doughnut, radar, scatter, and bubble charts as PNG, HTML, or JSON.

| | |
|---|---|
| Package | [`@ax-crew/chartjs-mcp-server`](https://www.npmjs.com/package/@ax-crew/chartjs-mcp-server) |
| URL | `http://localhost:3000/chart/mcp` |
| Staging | `STAGING_DIR/chart` → `/staging` |

### MarkItDown

Convert Word, PDF, PowerPoint, Excel, images, audio, HTML, and 20+ formats to Markdown.

| | |
|---|---|
| Source | [microsoft/markitdown](https://github.com/microsoft/markitdown) |
| URL | `http://localhost:3000/markitdown/mcp` |
| Staging | `STAGING_DIR/markitdown` → `/staging` |

Steering: `staging`, `convert-and-save`

### PDF Reader

Extract text, metadata, tables, and images from PDFs. Supports local files and URLs.

| | |
|---|---|
| Package | [`@sylphx/pdf-reader-mcp`](https://www.npmjs.com/package/@sylphx/pdf-reader-mcp) |
| URL | `http://localhost:3000/pdf-reader/mcp` |
| Staging | `STAGING_DIR/pdf-reader` → `/staging` |

Steering: `staging`

---

## CDP Power

### Chrome DevTools

Control Chrome from your AI assistant. Navigate, click, fill forms, screenshot, inspect network, run Lighthouse audits.

| | |
|---|---|
| Package | [`chrome-devtools-mcp`](https://www.npmjs.com/package/chrome-devtools-mcp) |
| URL | `http://localhost:3000/chrome-devtools/mcp` |
| Host setup | Launch Chrome with `--remote-debugging-port=9222` |

Steering: `testing-and-debugging`, `performance-and-audits`

---

## Host-Only Powers (Disabled)

These powers need direct host access and are disabled by default. Enable them in `mcp.json` to run via stdio. Docker configs exist commented out in `docker-compose.yml`.

### Docx Reader

Read, write, search, merge, and convert Word documents (.docx).

| | |
|---|---|
| Server | Custom Node.js server (mammoth + docx) |
| Command | `node mcp/docx-reader/server.js` |

### Filesystem

Sandboxed local file operations — read, write, move, search, manage files.

| | |
|---|---|
| Package | [`@modelcontextprotocol/server-filesystem`](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem) |
| Command | `npx -y @modelcontextprotocol/server-filesystem@latest <allowed-dirs>` |

Steering: `advanced-operations`

### Git

Clone, commit, push, pull, branch, diff, log, stash, rebase, cherry-pick, and more.

| | |
|---|---|
| Package | [`@cyanheads/git-mcp-server`](https://www.npmjs.com/package/@cyanheads/git-mcp-server) |
| Command | `npx -y @cyanheads/git-mcp-server@latest` |

Steering: `advanced-workflows`, `collaboration`

### npm

Search, install, update, audit, analyze dependencies, check bundle sizes, manage licenses.

| | |
|---|---|
| Package | [`npmplus-mcp-server`](https://www.npmjs.com/package/npmplus-mcp-server) |
| Command | `npx --yes npmplus-mcp-server@latest` |

Steering: `advanced-workflows`

### Playwright

Browser automation — navigate, click, fill forms, screenshot, accessibility snapshots.

| | |
|---|---|
| Package | [`@playwright/mcp`](https://www.npmjs.com/package/@playwright/mcp) |
| Command | `npx -y @playwright/mcp@latest` |

Steering: `browser-testing`

### SQLite

Query, inspect, and manage SQLite databases with full CRUD and schema introspection.

| | |
|---|---|
| Package | [`mcp-sqlite`](https://www.npmjs.com/package/mcp-sqlite) |
| Command | `npx -y mcp-sqlite <database-path>` |

Steering: `query-workflows`

---

## Configuration

### .env

Copy `.env.example` to `.env` and configure:

```env
# Staging directory — absolute path, no variable expansion
STAGING_DIR=C:/Users/YourName/mcp-staging

# API keys
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
NOTION_API_KEY=ntn_...
YOUTUBE_API_KEY=AIza...
CONTEXT7_API_KEY=ctx7sk-...
```

### Docker

```bash
docker compose build    # Build all images
docker compose up -d    # Start all services
docker compose logs -f  # Watch logs
docker compose down     # Stop everything
```

### Dockerfiles

| File | Used by | Description |
|------|---------|-------------|
| `docker/node.Dockerfile` | Most services | Generic Node.js + supergateway + one MCP package (via `MCP_PACKAGE` build arg) |
| `docker/local-server.Dockerfile` | docx-reader, github-extras | Copies and installs a local Node.js MCP server |
| `docker/markitdown.Dockerfile` | markitdown | Python + Node.js hybrid for MarkItDown |
| `docker/youtube.Dockerfile` | youtube | Pins `youtube-transcript` to a compatible version |
| `docker/playwright.Dockerfile` | playwright | Node.js + Chromium only (~800MB) |
| `docker/playwright-local.Dockerfile` | playwright (CDP) | No browser — connects to host Chrome via CDP (~200MB) |
| `docker/playwright-all.Dockerfile` | — | Full Playwright image with all browsers (~2GB) |

### Power Structure

Each power folder contains:

```
powers/<name>/
├── mcp.json          # MCP server config (SSE URL + disabled stdio fallback)
├── POWER.md          # Documentation, tools, workflows, troubleshooting
└── steering/         # Auto-included workflow guides for the AI
```

## Installation

Copy any power folder into your Kiro workspace's `.kiro/powers/` directory or install via the Kiro Powers panel.

## License

See [LICENSE](LICENSE).

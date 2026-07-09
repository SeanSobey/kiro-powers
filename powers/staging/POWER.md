---
name: "staging"
version: "1.0.0"
displayName: "📂 Staging"
description: "Stage files in and out of Docker-mounted powers (chart, markitdown, pandoc, pdf-reader). Eliminates the need to know or manage the STAGING_DIR path."
keywords: ["@staging", "staging"]
author: "Kiro Community"
---

# Staging

## Overview

Staging is a utility power that manages file transfer between the host and Docker-mounted MCP services. Four powers (chart, markitdown, pandoc, pdf-reader) run inside Docker containers with a shared staging volume. This power handles copying files in and out of that volume so neither you nor the agent need to know the host path.

## Onboarding

### Prerequisites
- Node.js 18+
- `STAGING_DIR` configured in `.env` (absolute path to the host staging directory)

### Installation

Run from the repo root:

```bash
cd mcp/staging && npm install
```

### Configuration

The server reads `STAGING_DIR` from the `.env` file in the repo root (or from the environment). Each service gets its own subfolder automatically.

## Tools

### stage_file

Copy a file into a service's staging directory so it becomes accessible at `/staging/<filename>` inside the Docker container.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service` | enum | yes | `chart`, `markitdown`, `pandoc`, or `pdf-reader` |
| `filename` | string | yes | Destination filename inside `/staging/` |
| `sourcePath` | string | no | Absolute host path to copy from |
| `content` | string | no | Inline content to write directly |
| `encoding` | enum | no | `utf-8` (default) or `base64` for binary |

Provide either `sourcePath` or `content`.

### unstage_file

Copy a file out of a service's staging directory to a target path on the host. Use this to retrieve output files produced by Docker-based tools.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service` | enum | yes | `chart`, `markitdown`, `pandoc`, or `pdf-reader` |
| `filename` | string | yes | Filename inside `/staging/` to copy out |
| `targetPath` | string | yes | Absolute destination path on the host |

### read_staged_file

Read the content of a file in staging directly. Best for text outputs (converted `.md` files, JSON configs) — avoids needing filesystem access.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service` | enum | yes | `chart`, `markitdown`, `pandoc`, or `pdf-reader` |
| `filename` | string | yes | Filename inside `/staging/` to read |
| `encoding` | enum | no | `utf-8` (default) or `base64` |
| `maxLength` | number | no | Max characters to return (default: 100000) |

### list_staged_files

List all files currently in a service's staging directory.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service` | enum | yes | `chart`, `markitdown`, `pandoc`, or `pdf-reader` |

### clean_staging

Remove files from a service's staging directory.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service` | enum | yes | `chart`, `markitdown`, `pandoc`, or `pdf-reader` |
| `filename` | string | no | Specific file to remove. If omitted, removes all files. |

## Common Workflows

### Convert a local file with markitdown

```
1. stage_file(service="markitdown", filename="report.docx", sourcePath="C:/Users/Sean/docs/report.docx")
2. convert_to_markdown(uri="file:///staging/report.docx", output_path="/staging/report.md")
3. read_staged_file(service="markitdown", filename="report.md")
4. clean_staging(service="markitdown")
```

### Generate a chart and save to workspace

```
1. generateChart(chartConfig={...}, outputFormat="png", saveToFile=true)
2. unstage_file(service="chart", filename="chart.png", targetPath="C:/project/docs/chart.png")
3. clean_staging(service="chart")
```

### Convert a document with pandoc

```
1. stage_file(service="pandoc", filename="readme.md", sourcePath="C:/project/README.md")
2. convert_document(input_file="/staging/readme.md", output_file="/staging/readme.pdf", to_format="pdf")
3. unstage_file(service="pandoc", filename="readme.pdf", targetPath="C:/project/docs/readme.pdf")
4. clean_staging(service="pandoc")
```

### Read a PDF

```
1. stage_file(service="pdf-reader", filename="paper.pdf", sourcePath="C:/Users/Sean/papers/paper.pdf")
2. read_pdf(filePath="/staging/paper.pdf")
3. clean_staging(service="pdf-reader")
```

## Important

- Paths passed to Docker-based tools must use `/staging/` as the root — never the host path
- Remote URLs (`http://`, `https://`) work directly with the tools — no staging needed
- Always clean up staging after workflows to avoid stale files
- The staging server resolves `STAGING_DIR` once at startup from `.env` or the environment

## Troubleshooting

### "STAGING_DIR is not configured"
The server couldn't find `STAGING_DIR`. Ensure it's set in the `.env` file at the repo root or exported as an environment variable.

### "Source file not found"
The `sourcePath` doesn't exist on the host. Use an absolute path.

### "File not found in staging"
The file hasn't been staged yet, or the tool wrote it with a different filename. Use `list_staged_files` to see what's there.

---

**Server:** `mcp/staging/server.js`
**MCP Server:** staging

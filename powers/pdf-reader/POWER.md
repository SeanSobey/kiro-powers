---
name: "pdf-reader"
version: "1.0.1"
displayName: "PDF Reader"
description: "Read and extract content from PDF files via MCP. Supports local files and URLs with options for full text, specific pages, metadata, images, and table extraction."
keywords: ["@pdf-reader"]
author: "Kiro Community"
---

# PDF Reader

## Overview

PDF Reader MCP provides the ability to read and extract content from PDF documents through the Model Context Protocol. It handles both local files and remote URLs, with fine-grained control over what to extract — full text, specific pages, metadata, embedded images, and tabular data.

This power is useful for analyzing documents, extracting data from reports, reading specifications, and processing any PDF content directly from your AI assistant.

## Onboarding

### Prerequisites
- Docker (default) or Node.js 18+ (local fallback)

### Configuration
Default config connects to Docker via Streamable HTTP. Run `docker compose up -d` from the repo root. Files in the staging directory are accessible at `/staging` inside the container. A disabled `pdf-reader-nodejs` entry in `mcp.json` is available for local stdio fallback.

### Staging Workflow
This power runs in Docker and can only access files inside the `/staging` volume. See the **staging** steering file for the full workflow — the AI reads `STAGING_DIR` from `${powerDir}/../../.env` at runtime to discover the host path, copies files there, and references them as `/staging/<filename>` in tool calls.

## Common Workflows

### Read Full Text from a Local PDF

```
read_pdf with sources=[{ "path": "docs/report.pdf" }], include_full_text=true
```

### Read a PDF from a URL

```
read_pdf with sources=[{ "url": "https://example.com/document.pdf" }], include_full_text=true
```

### Read Specific Pages

```
read_pdf with sources=[{ "path": "docs/report.pdf", "pages": [1, 2, 5] }]
```

Page ranges as a string:
```
read_pdf with sources=[{ "path": "docs/report.pdf", "pages": "1-5" }]
```

### Get PDF Metadata

```
read_pdf with sources=[{ "path": "docs/report.pdf" }], include_metadata=true
```

Returns author, title, creation date, modification date, and other document info.

### Get Page Count

```
read_pdf with sources=[{ "path": "docs/report.pdf" }], include_page_count=true
```

### Extract Tables

```
read_pdf with sources=[{ "path": "docs/financial-report.pdf" }], include_tables=true
```

Uses spatial clustering of text coordinates to detect and extract tabular structures from PDF pages.

### Extract Embedded Images

```
read_pdf with sources=[{ "path": "docs/presentation.pdf" }], include_images=true
```

Returns embedded images as base64-encoded data.

### Read Multiple PDFs at Once

```
read_pdf with sources=[
  { "path": "docs/q1-report.pdf" },
  { "path": "docs/q2-report.pdf" },
  { "url": "https://example.com/q3-report.pdf" }
], include_full_text=true
```

### Combine Multiple Options

```
read_pdf with sources=[{ "path": "docs/report.pdf", "pages": [1, 2, 3] }], include_metadata=true, include_tables=true, include_page_count=true
```

## Tool Reference

### read_pdf

The single tool provided by this MCP server.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `sources` | array | Array of PDF sources. Each source has `path` (local) or `url` (remote), and optional `pages` |
| `include_full_text` | boolean | Include full text content (only when `pages` is not specified for that source) |
| `include_metadata` | boolean | Include document metadata and info objects |
| `include_page_count` | boolean | Include total page count |
| `include_tables` | boolean | Detect and extract tables using spatial text clustering |
| `include_images` | boolean | Extract embedded images as base64-encoded data |

**Source object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | Path to a local PDF file (absolute or relative to cwd) |
| `url` | string | URL of a remote PDF file |
| `pages` | array or string | Specific pages to extract (e.g., `[1, 3, 5]` or `"1-5"`) |

Each source must have either `path` or `url`, not both.

## Troubleshooting

### "File not found" errors
**Cause:** The path is incorrect or relative to a different working directory.
**Solution:**
1. Use an absolute path to the PDF file
2. Or ensure the relative path is correct from the workspace root

### Empty text extraction
**Cause:** The PDF may be image-based (scanned document) rather than text-based.
**Solution:**
1. Try `include_images=true` to extract the scanned images
2. Image-based PDFs require OCR, which this tool does not perform
3. Consider using an OCR tool to convert the images to text first

### Table extraction returns unexpected results
**Cause:** Tables in PDFs don't have explicit structure — extraction relies on spatial text positioning.
**Solution:**
1. Results work best with well-formatted, grid-aligned tables
2. Complex merged cells or rotated text may not extract cleanly
3. For critical data, verify extracted tables against the original

### Large PDF performance
**Cause:** Very large PDFs take longer to process.
**Solution:**
1. Use `pages` to extract only the pages you need
2. Avoid `include_images=true` unless you specifically need images
3. Use `include_page_count=true` first to understand the document size

## Best Practices

- Use `include_page_count` first on unfamiliar documents to understand their size
- Extract specific pages rather than full text for large documents
- Use `include_metadata` to get document context (author, dates, title) before reading content
- Combine `include_tables=true` with specific pages for targeted data extraction
- For multiple related PDFs, batch them in a single `read_pdf` call using the `sources` array
- Prefer local file paths over URLs when the file is available locally (faster, no network dependency)

---

**Package:** `@sylphx/pdf-reader-mcp`
**MCP Server:** pdf-reader

---
name: "markitdown"
version: "1.0.1"
displayName: "✏️ MarkItDown"
description: "Convert Word documents, PDFs, PowerPoint, Excel, images, audio, HTML, and 20+ other file formats to Markdown via MCP. Powered by Microsoft's MarkItDown."
keywords: ["@markitdown"]
author: "Kiro Community"
---

# MarkItDown

## Overview

MarkItDown MCP converts files and documents to Markdown and writes the result directly to disk. It wraps Microsoft's [MarkItDown](https://github.com/microsoft/markitdown) library, exposing a single tool — `convert_to_markdown` — that accepts any `file:`, `http:`, `https:`, or `data:` URI.

Unlike the official `markitdown-mcp` package, this server writes output to a file and returns only a short confirmation with file path and preview. This avoids flooding the AI context with large document content.

Supported formats include Word (.docx), PDF, PowerPoint (.pptx), Excel (.xlsx/.xls), images (with EXIF/OCR), audio (with transcription), HTML, CSV, JSON, XML, ZIP archives, YouTube URLs, EPubs, and more.

## Onboarding

### Prerequisites
- Python 3.10+
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (for `uvx`)

### Installation
No manual install needed. The `uvx` command will automatically download dependencies on first use.

### Configuration
Default config connects to Docker via Streamable HTTP. Run `docker compose up -d` from the repo root. Files in the staging directory are accessible at `/staging` inside the container. A disabled `markitdown-python` entry in `mcp.json` is available for local stdio fallback.

### Staging Workflow
This power runs in Docker and can only access files inside the `/staging` volume. See the **staging** steering file for the full workflow — the AI reads `STAGING_DIR` from `${powerDir}/../../.env` at runtime to discover the host path, copies files there, and references them as `file:///staging/<filename>` in tool calls. Use `output_path="/staging/<output>.md"` to write results back to the host.

## Common Workflows

### Convert a Local Word Document

```
convert_to_markdown with uri="file:///path/to/document.docx"
```
Writes `document.md` alongside the source file.

### Convert with a Custom Output Path

```
convert_to_markdown with uri="file:///path/to/report.pdf", output_path="/path/to/output/report.md"
```

### Convert a Remote File

```
convert_to_markdown with uri="https://example.com/slides.pptx"
```

### Convert an Excel Spreadsheet

```
convert_to_markdown with uri="file:///path/to/data.xlsx"
```

### Convert a PowerPoint Presentation

```
convert_to_markdown with uri="file:///path/to/presentation.pptx", output_path="/path/to/notes.md"
```

## Tool Reference

### convert_to_markdown

Converts a file to Markdown and writes the output to disk.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `uri` | string | URI of the file to convert. Supports `file:`, `http:`, `https:`, and `data:` schemes |
| `output_path` | string (optional) | Absolute path for the output `.md` file. If omitted, writes alongside the source with `.md` extension |

**Returns:** A short confirmation with the output file path, size info, and a brief content preview (first 300 chars).

**Supported file formats:**

| Format | Extensions |
|--------|-----------|
| Word | `.docx` |
| PDF | `.pdf` |
| PowerPoint | `.pptx` |
| Excel | `.xlsx`, `.xls` |
| Images | `.jpg`, `.png`, `.gif`, etc. (EXIF metadata, OCR) |
| Audio | `.mp3`, `.wav`, etc. (metadata, transcription) |
| HTML | `.html`, `.htm` |
| Text formats | `.csv`, `.json`, `.xml` |
| Archives | `.zip` (iterates over contents) |
| EPub | `.epub` |
| YouTube | YouTube URLs |

## Troubleshooting

### "uvx: command not found"
**Cause:** `uv` is not installed.
**Solution:** Install uv following the [official guide](https://docs.astral.sh/uv/getting-started/installation/):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Local file not found
**Cause:** The `file:` URI path is incorrect or relative.
**Solution:** Use absolute paths: `file:///C:/Users/you/doc.docx` (Windows) or `file:///home/you/doc.docx` (Linux/Mac). Use forward slashes on Windows.

### Empty or poor conversion output
**Cause:** The file may be image-based (scanned) or unsupported.
**Solution:** The server installs `markitdown[all]` which includes OCR and transcription support. Verify the file format is in the supported list.

## Best Practices

- Use `file:` URIs with absolute paths for local files
- Use `output_path` to control where the Markdown file lands
- For batch processing, call `convert_to_markdown` once per file
- After conversion, use standard file reading tools to inspect the output if needed

---

**Source:** [microsoft/markitdown](https://github.com/microsoft/markitdown)
**MCP Server:** markitdown

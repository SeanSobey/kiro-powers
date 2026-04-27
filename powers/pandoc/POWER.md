---
name: "pandoc"
version: "1.0.0"
displayName: "🔄 Pandoc"
description: "Convert Markdown to PDF, DOCX, HTML, LaTeX, EPUB, and 10+ other document formats via MCP. Powered by Pandoc."
keywords: ["@pandoc"]
author: "Kiro Community"
---

# Pandoc

## Overview

Pandoc MCP converts documents between formats and writes the result directly to disk. It wraps [Pandoc](https://pandoc.org/) via the `pypandoc_binary` Python package, exposing a single tool — `convert_document` — that accepts either a file path or inline content.

Unlike raw pandoc CLI usage, this server writes output to a file and returns only a short confirmation with file path and preview. This avoids flooding the AI context with large document content.

Supported formats: Markdown, HTML, PDF, DOCX, RST, LaTeX, EPUB, TXT, IPYNB, and ODT.

## Onboarding

### Prerequisites
- Python 3.10+
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (for local stdio mode)

### Installation
No manual install needed. The `uv` command will automatically download dependencies on first use. The `pypandoc_binary` package bundles Pandoc, so no separate Pandoc installation is required.

### Configuration
Default config connects to Docker via Streamable HTTP. Run `docker compose up -d` from the repo root. Files in the staging directory are accessible at `/staging` inside the container. A disabled `pandoc-python` entry in `mcp.json` is available for local stdio fallback.

### Staging Workflow
This power runs in Docker and can only access files inside the `/staging` volume. See the **staging** steering file for the full workflow — the AI reads `STAGING_DIR` from `${powerDir}/../../.env` at runtime to discover the host path, copies files there, and references them as `/staging/<filename>` in tool calls.

## Common Workflows

### Convert Markdown to PDF

```
convert_document with input_file="/staging/report.md", output_format="pdf", output_file="/staging/report.pdf"
```

### Convert Markdown to DOCX

```
convert_document with input_file="/staging/notes.md", output_format="docx", output_file="/staging/notes.docx"
```

### Convert Markdown to HTML

```
convert_document with input_file="/staging/readme.md", output_format="html", output_file="/staging/readme.html"
```

### Convert HTML to Markdown

```
convert_document with input_file="/staging/page.html", input_format="html", output_format="markdown", output_file="/staging/page.md"
```

### Convert Inline Content

```
convert_document with contents="# Hello\n\nWorld", input_format="markdown", output_format="html"
```

### Convert Markdown to LaTeX

```
convert_document with input_file="/staging/paper.md", output_format="latex", output_file="/staging/paper.tex"
```

## Tool Reference

### convert_document

Converts a document between formats using Pandoc and writes the output to disk.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `input_file` | string | Absolute path to the source file. Required if `contents` is not provided |
| `contents` | string | Source content string to convert. Required if `input_file` is not provided |
| `input_format` | string | Source format (default: `markdown`) |
| `output_format` | string | Target format (default: `html`) |
| `output_file` | string | Absolute path for the output file. Required for binary formats (pdf, docx, epub, odt) |

**Returns:** A short confirmation with the output file path, size info, and a brief content preview (first 300 chars) for text formats, or file size for binary formats.

**Supported formats:**

| Format | ID | Notes |
|--------|----|-------|
| Markdown | `markdown` | Default input format |
| HTML | `html` | Default output format |
| PDF | `pdf` | Output only, requires `output_file` |
| Word | `docx` | Requires `output_file` |
| reStructuredText | `rst` | |
| LaTeX | `latex` | |
| EPUB | `epub` | Requires `output_file` |
| Plain text | `txt` | |
| Jupyter Notebook | `ipynb` | |
| OpenDocument | `odt` | Requires `output_file` |

**Conversion matrix:** All formats can convert to all other formats, except PDF which is output-only.

## Troubleshooting

### "uv: command not found"
**Cause:** `uv` is not installed (local mode only).
**Solution:** Install uv following the [official guide](https://docs.astral.sh/uv/getting-started/installation/).

### Conversion fails for PDF output
**Cause:** Missing LaTeX engine inside the container.
**Solution:** The Docker image includes `texlive-latex-base` and `texlive-fonts-recommended`. For complex LaTeX, you may need to extend the Dockerfile with additional TeX packages.

### File not found
**Cause:** The file path is not accessible inside the Docker container.
**Solution:** Use the staging workflow — copy files to `STAGING_DIR/pandoc` on the host, then reference them as `/staging/<filename>` in tool calls.

## Best Practices

- Use absolute paths for `input_file` and `output_file`
- Always set `output_file` for binary formats (pdf, docx, epub, odt)
- For batch processing, call `convert_document` once per file
- Use the staging workflow for Docker-based conversions
- After conversion, use standard file reading tools to inspect the output if needed

---

**Source:** [Pandoc](https://pandoc.org/) via [pypandoc](https://github.com/JessicaTegworthy/pypandoc)
**MCP Server:** pandoc

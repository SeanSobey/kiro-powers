---
inclusion: auto
---

# Staging Directory

This power runs in Docker and can only access files mounted at `/staging` inside the container.

## File Transfer

Use the **staging** power's tools to move files in and out:

- `stage_file(service="pdf-reader", ...)` — copy a PDF into the container's `/staging/`
- `list_staged_files(service="pdf-reader")` — see what's currently staged
- `clean_staging(service="pdf-reader")` — remove staged files

## Workflow

1. Stage the PDF: `stage_file(service="pdf-reader", filename="paper.pdf", sourcePath="<absolute path>")`
2. Read it: `read_pdf(filePath="/staging/paper.pdf")`
3. Clean up: `clean_staging(service="pdf-reader")`

## Important

- Paths passed to this tool must use `/staging/` as the root, not the host path
- Remote URLs (`http://`, `https://`) work without staging — only local files need this workflow

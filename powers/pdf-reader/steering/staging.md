---
inclusion: auto
---

# Staging Directory

This power runs in Docker and can only access files mounted at `/staging` inside the container.

## Discovering the host staging path

1. Read the `.env` file at `#[[file:../../.env]]`
2. Find the `STAGING_DIR` value — this is the base host path
3. Append `/pdf-reader` — the full host path is `STAGING_DIR/pdf-reader`

This host path maps to `/staging` inside the container.

## Workflow

1. Discover the host path as above
2. Copy the PDF file from the workspace to `STAGING_DIR/pdf-reader` on the host
3. Call `read_pdf` with `sources=[{ "path": "/staging/<filename>.pdf" }]`
4. The extracted text/metadata is returned directly over MCP — no need to copy output back

## Important

- Paths passed to `read_pdf` must use `/staging/` as the root, not the host path
- Remote URLs work without staging — only local files need this workflow

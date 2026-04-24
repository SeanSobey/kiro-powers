---
inclusion: auto
---

# Staging Directory

This power runs in Docker and can only access files mounted at `/staging` inside the container.

## Discovering the host staging path

1. Read the `.env` file at `#[[file:../../.env]]`
2. Find the `STAGING_DIR` value — this is the base host path
3. Append `/chart` — the full host path is `STAGING_DIR/chart`

This host path maps to `/staging` inside the container.

## Workflow

1. Discover the host path as above
2. Copy input files from the workspace to `STAGING_DIR/chart` on the host
3. Call the tool using `/staging/<filename>` as the path inside the container
4. If the tool writes output files (e.g. `saveToFile=true`), they appear in `STAGING_DIR/chart` on the host — copy them back to the workspace if needed

## Important

- Paths passed to this tool must use `/staging/` as the root, not the host path
- For `saveToFile=true` (PNG output), the file is only accessible on the host if saved under `/staging/`
- For `html` and `json` output formats, content is returned directly over MCP — no staging needed
- Remote URLs work without staging

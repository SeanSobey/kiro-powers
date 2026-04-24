---
inclusion: auto
---

# Staging Directory

This power runs in Docker and can only access files mounted at `/staging` inside the container.

## Discovering the host staging path

1. Read the `.env` file at `#[[file:../../.env]]`
2. Find the `STAGING_DIR` value — this is the base host path
3. Append `/markitdown` — the full host path is `STAGING_DIR/markitdown`

This host path maps to `/staging` inside the container.

## Workflow

1. Discover the host path as above
2. Copy the source file from the workspace to `STAGING_DIR/markitdown` on the host
3. Call `convert_to_markdown` with `uri="file:///staging/<filename>"` and `output_path="/staging/<output>.md"`
4. Copy the output `.md` file from `STAGING_DIR/markitdown` back to the workspace

## Important

- The `uri` must use `file:///staging/` as the root, not the host path
- Always set `output_path` to a `/staging/` path so the output is accessible on the host
- Remote URLs (`http://`, `https://`) work without staging — only local files need this workflow

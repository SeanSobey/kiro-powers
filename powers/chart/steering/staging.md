---
inclusion: auto
---

# Staging Directory

This power runs in Docker and can only access files mounted at `/staging` inside the container.

## File Transfer

Use the **staging** power's tools to move files in and out:

- `stage_file(service="chart", ...)` — copy a file into the container's `/staging/`
- `unstage_file(service="chart", ...)` — copy an output file from `/staging/` to the host
- `read_staged_file(service="chart", ...)` — read a staged file's content directly
- `list_staged_files(service="chart")` — see what's currently staged
- `clean_staging(service="chart")` — remove staged files

## Workflow

1. If using `saveToFile=true` for PNG output, the file is saved under `/staging/` inside the container
2. Use `unstage_file` to copy the PNG to the desired host location
3. Clean up with `clean_staging`

## Important

- For `html` and `json` output formats, content is returned directly over MCP — no staging needed
- Remote URLs work without staging
- Paths passed to this tool must use `/staging/` as the root, not the host path

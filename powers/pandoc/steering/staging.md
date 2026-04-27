---
inclusion: auto
---

# Staging Directory

This power runs in Docker and can only access files mounted at `/staging` inside the container.

## Discovering the host staging path

1. Read the `.env` file at `#[[file:../../.env]]`
2. Find the `STAGING_DIR` value — this is the base host path
3. Append `/pandoc` — the full host path is `STAGING_DIR/pandoc`

This host path maps to `/staging` inside the container.

## Workflow

1. Discover the host path as above
2. Copy the source file from the workspace to `STAGING_DIR/pandoc` on the host
3. Call `convert_document` with `input_file="/staging/<filename>"` and `output_file="/staging/<output>.<ext>"`
4. Copy the output file from `STAGING_DIR/pandoc` back to the workspace

## Important

- Paths inside the container always start with `/staging/`
- Always set `output_file` to a `/staging/` path so the output is accessible on the host
- For binary formats (pdf, docx, epub, odt), `output_file` is required
- When converting inline `contents` (no input file), staging is only needed for the output file

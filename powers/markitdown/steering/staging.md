---
inclusion: auto
---

# Staging Directory

This power runs in Docker and can only access files mounted at `/staging` inside the container.

## File Transfer

Use the **staging** power's tools to move files in and out:

- `stage_file(service="markitdown", ...)` — copy a file into the container's `/staging/`
- `unstage_file(service="markitdown", ...)` — copy an output file from `/staging/` to the host
- `read_staged_file(service="markitdown", ...)` — read a staged file's content directly (ideal for `.md` output)
- `list_staged_files(service="markitdown")` — see what's currently staged
- `clean_staging(service="markitdown")` — remove staged files

## Workflow

1. Stage the source file: `stage_file(service="markitdown", filename="report.docx", sourcePath="<absolute path>")`
2. Convert: `convert_to_markdown(uri="file:///staging/report.docx", output_path="/staging/report.md")`
3. Read the result: `read_staged_file(service="markitdown", filename="report.md")`
4. Clean up: `clean_staging(service="markitdown")`

## Important

- The `uri` must use `file:///staging/` as the root, not the host path
- Always set `output_path` to a `/staging/` path so the output is accessible
- Remote URLs (`http://`, `https://`) work without staging — only local files need this workflow

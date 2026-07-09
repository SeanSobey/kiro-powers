---
inclusion: auto
---

# Staging Directory

This power runs in Docker and can only access files mounted at `/staging` inside the container.

## File Transfer

Use the **staging** power's tools to move files in and out:

- `stage_file(service="pandoc", ...)` — copy a file into the container's `/staging/`
- `unstage_file(service="pandoc", ...)` — copy an output file from `/staging/` to the host
- `read_staged_file(service="pandoc", ...)` — read a staged file's content directly
- `list_staged_files(service="pandoc")` — see what's currently staged
- `clean_staging(service="pandoc")` — remove staged files

## Workflow

1. Stage the source file: `stage_file(service="pandoc", filename="readme.md", sourcePath="<absolute path>")`
2. Convert: `convert_document(input_file="/staging/readme.md", output_file="/staging/readme.pdf", to_format="pdf")`
3. Retrieve output: `unstage_file(service="pandoc", filename="readme.pdf", targetPath="<destination>")`
4. Clean up: `clean_staging(service="pandoc")`

## Important

- Paths inside the container always start with `/staging/`
- Always set `output_file` to a `/staging/` path so the output is accessible on the host
- For binary formats (pdf, docx, epub, odt), use `unstage_file` to copy output to the host
- When converting inline `contents` (no input file), staging is only needed for the output file

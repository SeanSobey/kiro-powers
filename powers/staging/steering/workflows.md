---
inclusion: auto
---

# Staging Workflows

This power provides file transfer between the host and Docker-mounted MCP services. Use it whenever a Docker-based power (chart, markitdown, pandoc, pdf-reader) needs access to local files or produces output files.

## When to use staging

- A tool needs a local file → `stage_file` to copy it in
- A tool produces an output file → `unstage_file` or `read_staged_file` to get it out
- Remote URLs (http/https) do NOT need staging — pass them directly to the tool

## General pattern

1. **Stage** input files with `stage_file`
2. **Call** the Docker-based tool using `/staging/<filename>` paths
3. **Retrieve** output with `read_staged_file` (text) or `unstage_file` (binary/save to disk)
4. **Clean up** with `clean_staging`

## Tips

- Use `content` parameter on `stage_file` to write inline text without needing a source file on disk
- Use `encoding: "base64"` for binary files when staging inline content
- Use `list_staged_files` to check what's already in a service's staging area
- Always clean up after a workflow to avoid stale files accumulating

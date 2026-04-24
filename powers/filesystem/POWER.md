---
name: "filesystem"
version: "1.0.0"
displayName: "Filesystem"
description: "Local filesystem operations via MCP. Read, write, move, search, and manage files and directories with sandboxed access to allowed directories only."
keywords: ["@filesystem"]
author: "Kiro Community"
---

# Filesystem

## Overview

Filesystem MCP provides sandboxed access to local files and directories through the Model Context Protocol. It supports reading, writing, creating, moving, searching, and inspecting files — all restricted to explicitly allowed directories for security.

This power enables your AI assistant to work with local files outside the workspace: read configuration files, write output, manage project assets, and explore directory structures.

## Available Steering Files

- **advanced-operations** — Batch file operations, directory trees, search patterns, and file management workflows

## Onboarding

### Prerequisites
- Node.js 18+ (for npx)

### Configuration

The server requires you to specify which directories it can access. Add one or more directory paths as arguments in `mcp.json`.

**Single directory:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@latest", "/path/to/allowed/dir"]
    }
  }
}
```

**Multiple directories:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/server-filesystem@latest",
        "/path/to/first/dir",
        "/path/to/second/dir"
      ]
    }
  }
}
```

Subdirectories within allowed directories are also accessible. The server will refuse any operations outside these paths.

This power is disabled by default. Enable it in `mcp.json` and configure the allowed directories. A Docker config exists commented out in `docker-compose.yml`.

## Common Workflows

### Check Allowed Directories

```
list_allowed_directories
```

Always start here to confirm which directories the server can access.

### List Directory Contents

```
list_directory with path="/path/to/directory"
```

Results show `[FILE]` and `[DIR]` prefixes to distinguish entries.

### List with File Sizes

```
list_directory_with_sizes with path="/path/to/directory"
```

Sort by size:
```
list_directory_with_sizes with path="/path/to/directory", sortBy="size"
```

### Read a File

```
read_text_file with path="/path/to/file.txt"
```

Read only the first N lines:
```
read_text_file with path="/path/to/file.txt", head=20
```

Read only the last N lines:
```
read_text_file with path="/path/to/file.txt", tail=50
```

### Read Multiple Files

```
read_multiple_files with paths=["/path/to/file1.txt", "/path/to/file2.json"]
```

### Read an Image or Audio File

```
read_media_file with path="/path/to/image.png"
```

Returns base64-encoded data and MIME type.

### Write a File

```
write_file with path="/path/to/output.txt", content="Hello, world!"
```

This creates a new file or overwrites an existing one.

### Edit a File (Line-Based)

```
edit_file with path="/path/to/file.txt", edits=[
  { "oldText": "old line content", "newText": "new line content" }
]
```

Preview changes without applying:
```
edit_file with path="/path/to/file.txt", edits=[
  { "oldText": "original", "newText": "replacement" }
], dryRun=true
```

### Create a Directory

```
create_directory with path="/path/to/new/directory"
```

Creates nested directories in one operation if needed.

### Move or Rename a File

```
move_file with source="/path/to/old-name.txt", destination="/path/to/new-name.txt"
```

Move to a different directory:
```
move_file with source="/path/to/file.txt", destination="/other/path/file.txt"
```

### Get File Info

```
get_file_info with path="/path/to/file.txt"
```

Returns size, creation time, last modified time, permissions, and type.

### Search for Files

```
search_files with path="/path/to/directory", pattern="**/*.json"
```

Exclude patterns:
```
search_files with path="/path/to/directory", pattern="**/*.ts", excludePatterns=["**/node_modules/**"]
```

### Directory Tree

```
directory_tree with path="/path/to/directory"
```

With exclusions:
```
directory_tree with path="/path/to/project", excludePatterns=["node_modules", ".git", "dist"]
```

Returns a JSON structure with `name`, `type`, and `children` for each entry.

## Troubleshooting

### "Access denied" or path errors
**Cause:** The path is outside the allowed directories.
**Solution:**
1. Run `list_allowed_directories` to check what's accessible
2. Add the needed directory to the `args` array in mcp.json
3. Restart the MCP server

### "File not found" errors
**Cause:** The file path is incorrect or the file doesn't exist.
**Solution:**
1. Use `list_directory` to verify the file exists
2. Check for typos in the path
3. Ensure you're using the correct path separator for your OS

### Write operations fail silently
**Cause:** `write_file` overwrites without warning.
**Solution:**
1. Use `get_file_info` to check if a file exists before writing
2. Use `edit_file` with `dryRun=true` to preview changes
3. Read the file first if you need to preserve existing content

### Search returns too many results
**Cause:** Glob pattern is too broad.
**Solution:**
1. Use more specific patterns (e.g., `**/*.config.json` instead of `**/*`)
2. Add `excludePatterns` to filter out `node_modules`, `.git`, etc.
3. Narrow the search `path` to a specific subdirectory

## Best Practices

- Always check `list_allowed_directories` first to understand the sandbox boundaries
- Use `edit_file` with `dryRun=true` to preview changes before applying
- Use `read_text_file` with `head` or `tail` for large files to avoid loading everything
- Use `read_multiple_files` instead of multiple single reads for efficiency
- Add `excludePatterns` to `search_files` and `directory_tree` to skip `node_modules`, `.git`, and build output
- Use `get_file_info` to check file size before reading large files
- Prefer `edit_file` over `write_file` when modifying existing files to avoid accidental overwrites

## MCP Config Placeholders

**`YOUR_ALLOWED_DIRECTORY_HERE`**: The directory path(s) the server is allowed to access.
- **How to set it:** Replace with one or more absolute paths to directories you want accessible. Add multiple paths as separate arguments in the `args` array.
- **Examples:**
  - macOS/Linux: `/Users/yourname/projects`, `/home/yourname/data`
  - Windows: `C:/Users/yourname/projects`, `D:/data`

---

**Package:** `@modelcontextprotocol/server-filesystem`
**MCP Server:** filesystem

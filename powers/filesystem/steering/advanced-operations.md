---
inclusion: manual
---

# Advanced Operations

## Batch File Operations

### Read and Compare Multiple Files

```
read_multiple_files with paths=[
  "/path/to/config.dev.json",
  "/path/to/config.prod.json"
]
```

Useful for comparing configurations across environments.

### Bulk Rename Pattern

1. Search for files matching a pattern:
   ```
   search_files with path="/path/to/dir", pattern="**/*.old.ts"
   ```
2. Move/rename each file:
   ```
   move_file with source="/path/to/file.old.ts", destination="/path/to/file.ts"
   ```

### Create a Project Structure

```
create_directory with path="/path/to/project/src"
create_directory with path="/path/to/project/tests"
create_directory with path="/path/to/project/docs"
write_file with path="/path/to/project/src/index.ts", content="export {};"
write_file with path="/path/to/project/README.md", content="# My Project"
```

## Directory Exploration

### Full Project Overview

```
directory_tree with path="/path/to/project", excludePatterns=["node_modules", ".git", "dist", "coverage", ".next"]
```

### Find Large Files

```
list_directory_with_sizes with path="/path/to/directory", sortBy="size"
```

### Find All Files of a Type

```
search_files with path="/path/to/project", pattern="**/*.env*"
```

### Find Files Excluding Build Output

```
search_files with path="/path/to/project", pattern="**/*.ts", excludePatterns=["**/node_modules/**", "**/dist/**", "**/.next/**"]
```

## File Editing Patterns

### Multi-Edit in One Operation

```
edit_file with path="/path/to/config.json", edits=[
  { "oldText": "\"port\": 3000", "newText": "\"port\": 8080" },
  { "oldText": "\"debug\": false", "newText": "\"debug\": true" }
]
```

### Preview Before Applying

```
edit_file with path="/path/to/important-file.ts", edits=[
  { "oldText": "const API_URL = 'http://localhost'", "newText": "const API_URL = 'https://api.example.com'" }
], dryRun=true
```

Review the git-style diff output, then run again without `dryRun` to apply.

### Append to a File

Read the file, then write with appended content:
1. Read current content:
   ```
   read_text_file with path="/path/to/log.txt"
   ```
2. Write with new content appended:
   ```
   write_file with path="/path/to/log.txt", content="...existing content...\nNew line appended"
   ```

## Search Patterns

### Glob Pattern Reference

| Pattern | Matches |
|---------|---------|
| `*.ts` | TypeScript files in current directory |
| `**/*.ts` | TypeScript files in all subdirectories |
| `**/*.{ts,tsx}` | TypeScript and TSX files |
| `**/test/**` | Anything inside test directories |
| `**/*.config.*` | All config files regardless of extension |
| `src/**/*.ts` | TypeScript files under src/ |

### Common Search Recipes

Find all config files:
```
search_files with path="/path/to/project", pattern="**/*.config.*"
```

Find all test files:
```
search_files with path="/path/to/project", pattern="**/*.{test,spec}.{ts,tsx,js,jsx}"
```

Find environment files:
```
search_files with path="/path/to/project", pattern="**/.env*"
```

Find all markdown docs:
```
search_files with path="/path/to/project", pattern="**/*.md", excludePatterns=["**/node_modules/**"]
```

## File Management Workflows

### Backup Before Editing

1. Read the original:
   ```
   read_text_file with path="/path/to/important.config"
   ```
2. Create a backup:
   ```
   write_file with path="/path/to/important.config.bak", content="...original content..."
   ```
3. Edit the original:
   ```
   edit_file with path="/path/to/important.config", edits=[...]
   ```

### Migrate File Structure

1. Map the current structure:
   ```
   directory_tree with path="/path/to/old-structure"
   ```
2. Create new directories:
   ```
   create_directory with path="/path/to/new-structure/src"
   create_directory with path="/path/to/new-structure/lib"
   ```
3. Move files to new locations:
   ```
   move_file with source="/path/to/old-structure/utils.ts", destination="/path/to/new-structure/lib/utils.ts"
   ```

### Inspect File Before Processing

1. Check file metadata:
   ```
   get_file_info with path="/path/to/data.csv"
   ```
2. Preview the first few lines:
   ```
   read_text_file with path="/path/to/data.csv", head=10
   ```
3. Decide on processing approach based on size and content.

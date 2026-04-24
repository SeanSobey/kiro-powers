---
inclusion: manual
---

# Convert and Save Workflow

When a user asks to convert a document to Markdown, follow this workflow to convert the file and write the output to disk.

## Default Behavior

1. Convert the source file using `convert_to_markdown`
2. Write the Markdown output to a file
3. The default output path is the same as the source file but with a `.md` extension (e.g., `report.docx` → `report.md`)
4. If the user specifies a different output path, use that instead

## Workflow Steps

### Step 1: Determine the source URI

For local files, construct a `file:` URI from the path. Use absolute paths:
- Windows: `file:///C:/Users/you/docs/report.docx`
- Linux/Mac: `file:///home/you/docs/report.docx`

For remote files, use the URL directly as the URI.

### Step 2: Convert

```
convert_to_markdown with uri="file:///absolute/path/to/document.docx"
```

### Step 3: Write the output

Write the converted Markdown to the output path. By default, replace the original extension with `.md`:

- `report.docx` → `report.md`
- `slides.pptx` → `slides.md`
- `data.xlsx` → `data.md`
- `paper.pdf` → `paper.md`

If the user specified a custom output path, use that instead.

### Step 4: Confirm

Tell the user the output file path and a brief summary of what was converted.

## Batch Conversion

When converting multiple files:

1. Identify all source files
2. For each file, delegate the conversion to a sub-agent with a prompt like:
   "Convert the file at `<uri>` to Markdown using `convert_to_markdown` and write the result to `<output_path>`"
3. Report results when all conversions complete

## Examples

### Single file, default output
User: "Convert report.docx to markdown"
→ Convert `file:///absolute/path/to/report.docx`, write to `report.md`

### Single file, custom output
User: "Convert report.docx to markdown and save as docs/report-converted.md"
→ Convert `file:///absolute/path/to/report.docx`, write to `docs/report-converted.md`

### Multiple files
User: "Convert all the docx files in the docs folder"
→ Find all `.docx` files, convert each, write each as `.md` alongside the original

### Remote file
User: "Convert https://example.com/spec.pdf to markdown"
→ Convert `https://example.com/spec.pdf`, write to `spec.md` in the workspace root

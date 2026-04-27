# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "pypandoc_binary",
#     "mcp[cli]",
# ]
# ///
"""Pandoc MCP Server — converts documents between formats and writes to disk."""

import sys
from pathlib import Path

import pypandoc
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("pandoc")

SUPPORTED_FORMATS = [
    "markdown", "html", "pdf", "docx", "rst",
    "latex", "epub", "txt", "ipynb", "odt",
]


def _resolve_output_path(input_file: str | None, output_format: str) -> Path | None:
    """Derive an output path from the input file and target format."""
    if not input_file:
        return None
    ext_map = {
        "markdown": ".md", "html": ".html", "pdf": ".pdf",
        "docx": ".docx", "rst": ".rst", "latex": ".tex",
        "epub": ".epub", "txt": ".txt", "ipynb": ".ipynb", "odt": ".odt",
    }
    source = Path(input_file)
    ext = ext_map.get(output_format, f".{output_format}")
    return source.with_suffix(ext)


@mcp.tool()
def convert_document(
    input_file: str | None = None,
    contents: str | None = None,
    input_format: str = "markdown",
    output_format: str = "html",
    output_file: str | None = None,
) -> str:
    """Convert a document between formats using Pandoc and write the result to disk.

    Args:
        input_file: Absolute path to the source file. Required if contents is not provided.
        contents: Source content string to convert. Required if input_file is not provided.
        input_format: Source format (default: markdown). Supported: markdown, html, pdf, docx, rst, latex, epub, txt, ipynb, odt.
        output_format: Target format (default: html). Supported: markdown, html, pdf, docx, rst, latex, epub, txt, ipynb, odt.
        output_file: Absolute path for the output file. Required for binary formats (pdf, docx, epub, odt).
                     If omitted for text formats, derives from input_file or returns content directly.

    Returns:
        A confirmation with the output file path and a content preview, or the converted text.
    """
    if not input_file and not contents:
        return "Error: Provide either input_file or contents."

    if input_format not in SUPPORTED_FORMATS:
        return f"Error: Unsupported input_format '{input_format}'. Supported: {', '.join(SUPPORTED_FORMATS)}"
    if output_format not in SUPPORTED_FORMATS:
        return f"Error: Unsupported output_format '{output_format}'. Supported: {', '.join(SUPPORTED_FORMATS)}"

    binary_formats = {"pdf", "docx", "epub", "odt"}
    needs_file = output_format in binary_formats

    # Resolve output path
    out_path = None
    if output_file:
        out_path = Path(output_file).resolve()
    elif needs_file:
        if input_file:
            out_path = _resolve_output_path(input_file, output_format)
        else:
            return f"Error: output_file is required when output_format is '{output_format}'."

    # Map format names to pandoc format identifiers
    fmt_map = {"markdown": "md", "txt": "plain", "latex": "latex"}
    pandoc_input = fmt_map.get(input_format, input_format)
    pandoc_output = fmt_map.get(output_format, output_format)

    try:
        if input_file:
            source = str(Path(input_file).resolve())
            if out_path:
                out_path.parent.mkdir(parents=True, exist_ok=True)
                pypandoc.convert_file(source, pandoc_output, format=pandoc_input, outputfile=str(out_path))
            else:
                result_text = pypandoc.convert_file(source, pandoc_output, format=pandoc_input)
                if not output_file:
                    # Derive output path from input
                    out_path = _resolve_output_path(input_file, output_format)
                    if out_path:
                        out_path.parent.mkdir(parents=True, exist_ok=True)
                        out_path.write_text(result_text, encoding="utf-8")
                    else:
                        return result_text
        else:
            if out_path:
                out_path.parent.mkdir(parents=True, exist_ok=True)
                pypandoc.convert_text(contents, pandoc_output, format=pandoc_input, outputfile=str(out_path))
            else:
                result_text = pypandoc.convert_text(contents, pandoc_output, format=pandoc_input)
                return f"Converted content ({input_format} → {output_format}):\n\n{result_text}"
    except Exception as e:
        return f"Error during conversion: {e}"

    # Read back for preview if text format
    if out_path and out_path.exists():
        if output_format not in binary_formats:
            content = out_path.read_text(encoding="utf-8")
            line_count = content.count("\n") + 1
            char_count = len(content)
            preview = content[:300].strip()
            if len(content) > 300:
                preview += "\n..."
            return (
                f"Converted and saved to: {out_path}\n"
                f"Size: {char_count} chars, {line_count} lines\n\n"
                f"Preview:\n{preview}"
            )
        else:
            size_kb = out_path.stat().st_size / 1024
            return f"Converted and saved to: {out_path}\nSize: {size_kb:.1f} KB"

    return f"Converted and saved to: {out_path}"


if __name__ == "__main__":
    mcp.run()

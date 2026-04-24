# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "markitdown[all]",
#     "mcp[cli]",
# ]
# ///
"""MarkItDown MCP Server — converts files to Markdown and writes to disk."""

import sys
from pathlib import Path
from urllib.parse import urlparse, unquote

from markitdown import MarkItDown
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("markitdown")
md = MarkItDown()


def _resolve_output_path(uri: str, output_path: str | None) -> Path:
    """Determine the output file path."""
    if output_path:
        return Path(output_path).resolve()

    parsed = urlparse(uri)
    if parsed.scheme == "file":
        raw_path = unquote(parsed.path)
        # On Windows, file:///C:/path produces /C:/path — strip the leading /
        if sys.platform == "win32" and len(raw_path) >= 3 and raw_path[0] == "/" and raw_path[2] == ":":
            raw_path = raw_path[1:]
        source = Path(raw_path)
    elif parsed.scheme in ("http", "https"):
        source = Path(unquote(parsed.path.split("/")[-1] or "output"))
    else:
        source = Path("output")

    return source.with_suffix(".md") if source.suffix != ".md" else source.with_suffix(".converted.md")


@mcp.tool()
def convert_to_markdown(uri: str, output_path: str | None = None) -> str:
    """Convert a file to Markdown and write the result to disk.

    Args:
        uri: URI of the file to convert. Supports file:, http:, https:, and data: schemes.
             For local files use file:///absolute/path/to/file.docx
        output_path: Optional. Absolute path for the output .md file.
                     If omitted, writes alongside the source file with a .md extension.

    Returns:
        A short confirmation with the output file path and a content preview.
    """
    result = md.convert(uri)
    content = result.text_content

    out = _resolve_output_path(uri, output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(content, encoding="utf-8")

    line_count = content.count("\n") + 1
    char_count = len(content)
    preview = content[:300].strip()
    if len(content) > 300:
        preview += "\n..."

    return (
        f"Converted and saved to: {out}\n"
        f"Size: {char_count} chars, {line_count} lines\n\n"
        f"Preview:\n{preview}"
    )


if __name__ == "__main__":
    mcp.run()

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  rmSync,
} from "fs";
import { resolve, dirname, basename, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────────────────────────

const STAGING_SERVICES = ["chart", "markitdown", "pandoc", "pdf-reader"];

function findEnvFile() {
  let dir = __dirname;
  for (let i = 0; i < 5; i++) {
    const candidate = resolve(dir, ".env");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function parseStagingDir() {
  const envFile = findEnvFile();
  if (!envFile) return null;
  const content = readFileSync(envFile, "utf-8");
  const match = content.match(/^STAGING_DIR\s*=\s*(.+)$/m);
  if (!match) return null;
  return match[1].replace(/^["']|["']$/g, "").trim();
}

const STAGING_DIR = process.env.STAGING_DIR || parseStagingDir();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function configError() {
  return {
    content: [{ type: "text", text: "Error: STAGING_DIR is not configured. Set it in .env or as an environment variable." }],
    isError: true,
  };
}

function serviceDir(service) {
  const dir = resolve(STAGING_DIR, service);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function ok(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

// ─── Server ──────────────────────────────────────────────────────────────────

const server = new McpServer({ name: "staging", version: "1.0.0" });

// ── stage_file ───────────────────────────────────────────────────────────────

server.tool(
  "stage_file",
  "Copy a file into a staging service's directory so it becomes accessible inside the Docker container at /staging/<filename>. Provide either a source path (to copy from disk) or inline content (to write directly).",
  {
    service: z.enum(STAGING_SERVICES).describe("Target service: chart, markitdown, pandoc, or pdf-reader"),
    filename: z.string().describe("Destination filename inside /staging (e.g. 'report.docx')"),
    sourcePath: z.string().optional().describe("Absolute path to a file on the host to copy into staging"),
    content: z.string().optional().describe("Inline text content to write as the staged file (use for text formats)"),
    encoding: z.enum(["utf-8", "base64"]).optional().describe("Encoding for inline content (default: utf-8). Use base64 for binary files."),
  },
  async ({ service, filename, sourcePath, content, encoding }) => {
    if (!STAGING_DIR) return configError();

    if (!sourcePath && content === undefined) {
      return {
        content: [{ type: "text", text: "Error: Provide either 'sourcePath' or 'content'." }],
        isError: true,
      };
    }

    const dir = serviceDir(service);
    const dest = join(dir, filename);

    if (sourcePath) {
      if (!existsSync(sourcePath)) {
        return {
          content: [{ type: "text", text: `Error: Source file not found: ${sourcePath}` }],
          isError: true,
        };
      }
      copyFileSync(sourcePath, dest);
    } else {
      const enc = encoding === "base64" ? "base64" : "utf-8";
      writeFileSync(dest, content, enc);
    }

    return ok({
      staged: true,
      service,
      filename,
      containerPath: `/staging/${filename}`,
      size: statSync(dest).size,
    });
  }
);

// ── unstage_file ─────────────────────────────────────────────────────────────

server.tool(
  "unstage_file",
  "Copy a file out of a staging service's directory to a target path on the host. Use this to retrieve output files produced by Docker-based tools.",
  {
    service: z.enum(STAGING_SERVICES).describe("Source service: chart, markitdown, pandoc, or pdf-reader"),
    filename: z.string().describe("Filename inside /staging to copy out"),
    targetPath: z.string().describe("Absolute destination path on the host"),
  },
  async ({ service, filename, targetPath }) => {
    if (!STAGING_DIR) return configError();

    const src = join(resolve(STAGING_DIR, service), filename);
    if (!existsSync(src)) {
      return {
        content: [{ type: "text", text: `Error: File not found in staging: ${filename} (service: ${service})` }],
        isError: true,
      };
    }

    const targetDir = dirname(targetPath);
    mkdirSync(targetDir, { recursive: true });
    copyFileSync(src, targetPath);

    return ok({
      unstaged: true,
      service,
      filename,
      targetPath: targetPath.replace(/\\/g, "/"),
      size: statSync(targetPath).size,
    });
  }
);

// ── read_staged_file ─────────────────────────────────────────────────────────

server.tool(
  "read_staged_file",
  "Read the content of a file in a staging service's directory. Best for text outputs (e.g. converted .md files). Returns content directly so the agent doesn't need filesystem access.",
  {
    service: z.enum(STAGING_SERVICES).describe("Service: chart, markitdown, pandoc, or pdf-reader"),
    filename: z.string().describe("Filename inside /staging to read"),
    encoding: z.enum(["utf-8", "base64"]).optional().describe("Encoding to use when reading (default: utf-8). Use base64 for binary files."),
    maxLength: z.number().optional().describe("Max characters to return (default: 100000). Truncates with a notice if exceeded."),
  },
  async ({ service, filename, encoding, maxLength }) => {
    if (!STAGING_DIR) return configError();

    const filePath = join(resolve(STAGING_DIR, service), filename);
    if (!existsSync(filePath)) {
      return {
        content: [{ type: "text", text: `Error: File not found in staging: ${filename} (service: ${service})` }],
        isError: true,
      };
    }

    const enc = encoding === "base64" ? "base64" : "utf-8";
    let text = readFileSync(filePath, enc);
    const limit = maxLength || 100000;
    let truncated = false;

    if (text.length > limit) {
      text = text.slice(0, limit);
      truncated = true;
    }

    return {
      content: [{
        type: "text",
        text: truncated
          ? `${text}\n\n[truncated — ${limit} char limit reached]`
          : text,
      }],
    };
  }
);

// ── list_staged_files ────────────────────────────────────────────────────────

server.tool(
  "list_staged_files",
  "List all files currently in a staging service's directory.",
  {
    service: z.enum(STAGING_SERVICES).describe("Service to list: chart, markitdown, pandoc, or pdf-reader"),
  },
  async ({ service }) => {
    if (!STAGING_DIR) return configError();

    const dir = resolve(STAGING_DIR, service);
    if (!existsSync(dir)) {
      return ok({ service, files: [] });
    }

    const files = readdirSync(dir)
      .map((name) => {
        const stat = statSync(join(dir, name));
        if (!stat.isFile()) return null;
        return { name, size: stat.size, modified: stat.mtime.toISOString() };
      })
      .filter(Boolean);

    return ok({ service, files });
  }
);

// ── clean_staging ────────────────────────────────────────────────────────────

server.tool(
  "clean_staging",
  "Remove files from a staging service's directory. Removes a specific file or all files.",
  {
    service: z.enum(STAGING_SERVICES).describe("Service to clean: chart, markitdown, pandoc, or pdf-reader"),
    filename: z.string().optional().describe("Specific file to remove. If omitted, removes all files in the service's staging directory."),
  },
  async ({ service, filename }) => {
    if (!STAGING_DIR) return configError();

    const dir = resolve(STAGING_DIR, service);
    if (!existsSync(dir)) {
      return ok({ cleaned: true, service, removed: 0 });
    }

    if (filename) {
      const filePath = join(dir, filename);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        return ok({ cleaned: true, service, removed: 1, files: [filename] });
      }
      return {
        content: [{ type: "text", text: `Error: File not found: ${filename}` }],
        isError: true,
      };
    }

    // Remove all files in the directory
    const entries = readdirSync(dir);
    let removed = 0;
    for (const entry of entries) {
      const entryPath = join(dir, entry);
      const stat = statSync(entryPath);
      if (stat.isFile()) {
        unlinkSync(entryPath);
        removed++;
      } else if (stat.isDirectory()) {
        rmSync(entryPath, { recursive: true });
        removed++;
      }
    }

    return ok({ cleaned: true, service, removed });
  }
);

// ─── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);

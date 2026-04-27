# Security

Security audit of this MCP power server setup, mapped against the [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) specification and common [MCP attack patterns](https://socprime.com/blog/mcp-security-risks-and-mitigations/).

> Last reviewed: April 2026

## Architecture Overview

```
Kiro IDE → http://localhost:3000/<power>/mcp → nginx (no auth) → supergateway → MCP server (root)
```

All MCP servers run as Docker containers behind a single nginx reverse proxy on port 3000. Containers run as root, communicate over plain HTTP, and have direct access to API keys via environment variables. Host-only powers run as stdio processes with the same privileges as the Kiro IDE.

---

## Critical

### 1. No Authentication on HTTP Proxy

**Risk:** Local Server Compromise, DNS Rebinding

The nginx proxy on `localhost:3000` was originally unauthenticated. A rogue browser tab could use DNS rebinding to reach `localhost:3000` and call MCP tools with your API keys.

**MCP spec reference:** [Local MCP Server Compromise](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices#local-mcp-server-compromise) — "Restrict access if using an HTTP transport"

**Mitigation (applied):** DNS rebinding protection via `Host` header validation. Nginx rejects any request where the `Host` header isn't `localhost` or `127.0.0.1`. Browsers always send the attacker's domain as the `Host` in a rebinding attack, so this blocks it without token management. A bearer token approach is more appropriate if the proxy is ever exposed beyond localhost.

### 2. Containers Run as Root

**Risk:** Privilege Escalation, Container Escape

None of the Dockerfiles create a non-root user. If any MCP package has a vulnerability, the attacker gets root inside the container. Staging volumes are writable as root, and a container escape would grant host-level root access.

**Affected files:** `docker/node.Dockerfile`, `docker/local-server.Dockerfile`, `docker/markitdown.Dockerfile`, `docker/pandoc.Dockerfile`, `docker/youtube.Dockerfile`

**Mitigation:**
```dockerfile
RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
```

### 3. Unpinned Package Versions (`@latest`)

**Risk:** Tool Poisoning, Supply Chain Attack

Almost every service uses `@latest` in build args. A compromised npm publish injects malicious code that runs with your API keys and network access. This is the MCP equivalent of a supply chain attack — the tool definition and behavior can change silently between builds.

**MCP spec reference:** Tool Poisoning — "Treat tool metadata as untrusted input, review tool definitions like code, and require integrity checks before updates"

**Affected services:** context7, fetch, github, chart, pdf-reader, chrome-devtools, npm, git, filesystem, playwright

**Mitigation:**
- Pin exact versions: `@upstash/context7-mcp@1.0.17` instead of `@latest`
- Use `npm audit` in the build step
- Use `--ignore-scripts` where possible to prevent post-install hooks
- Rebuild on a schedule with version bump reviews, not blindly

### 4. GitHub PAT Scope Unknown / Potentially Overbroad

**Risk:** Scope Minimization Failure, Confused Deputy

The GitHub PAT is passed to both `github` and `github-extras` containers. The `github-extras` server exposes destructive tools: `delete_release`, `delete_project`, `remove_collaborator`, `trigger_workflow`, `delete_tag`, `delete_milestone`. If the PAT has broad scopes (`repo`, `admin:org`, `delete_repo`), a prompt injection attack could trigger destructive actions.

**MCP spec reference:** [Scope Minimization](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices#scope-minimization) — "Split read and write tools, review scopes regularly, and keep scope sets minimal and task-specific"

**Mitigation:**
- Create a fine-grained PAT with only the scopes you actually use
- Consider separate read-only and read-write tokens for different servers
- Audit the PAT scopes: `gh auth status` or check GitHub Settings → Developer settings → Fine-grained tokens

---

## Medium

### 5. No Path Validation in `docx-reader`

**Risk:** Path Traversal, Arbitrary File Read/Write

The `read_file`, `write_file`, `read_docx`, and other tools in `mcp/docx-reader/server.js` accept arbitrary absolute paths with no sandboxing. `resolve(filePath)` does not restrict traversal. A prompt injection could read `~/.ssh/id_rsa`, `.env`, or write to system files.

**MCP spec reference:** [Local MCP Server Compromise](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices#local-mcp-server-compromise) — "Restrict file system access outside expected directories"

**Mitigation:**
```javascript
const ALLOWED_ROOTS = ['/staging', '/workspace'];

function safePath(filePath) {
  const abs = resolve(filePath);
  if (!ALLOWED_ROOTS.some(root => abs.startsWith(root + '/'))) {
    throw new Error(`Access denied: ${abs} is outside allowed directories`);
  }
  return abs;
}
```

### 6. Overly Broad `autoApprove` Lists

**Risk:** Prompt Injection, Unintended Tool Execution

Several powers auto-approve tools, bypassing Kiro's consent mechanism — the primary guardrail against prompt injection:

| Power | Auto-approved tools |
|-------|-------------------|
| `docx-reader` | 9 tools including `read_file` (reads any file type) |
| `fetch` | `fetch_url` (can be used for SSRF or data exfiltration) |
| `markitdown` | `convert_to_markdown` |
| `pandoc` | `convert_document` |
| `pdf-reader` | `read_pdf` |

**MCP spec reference:** Indirect Prompt Injection — "Restrict tool access, enforce call policies"

**Mitigation:**
- Remove `autoApprove` for tools that read/write arbitrary paths or fetch URLs
- Keep `autoApprove` only for truly safe, read-only, sandboxed operations
- Use Kiro hooks (`preToolUse`) to add approval gates for destructive operations

### 7. Regex Injection in `search_docx`

**Risk:** ReDoS (Regular Expression Denial of Service)

`mcp/docx-reader/server.js` passes user input directly to `new RegExp(query, "gi")`. A crafted pattern like `(a+)+$` against a long string causes catastrophic backtracking, hanging the server.

**Mitigation:**
```javascript
function safeRegex(pattern) {
  try {
    const re = new RegExp(pattern, 'gi');
    // Test for catastrophic backtracking with a timeout or use a safe regex library
    return re;
  } catch {
    throw new Error(`Invalid regex pattern: ${pattern}`);
  }
}
```
Or use a library like `re2` that guarantees linear-time matching.

### 8. No Rate Limiting or Request Size Limits

**Risk:** Resource Exhaustion, API Abuse

The nginx config has no `limit_req`, `client_max_body_size`, or connection limits. A runaway agent loop could hammer the GitHub API and exhaust rate limits, or a large payload could consume container memory.

**Mitigation:**
```nginx
http {
    limit_req_zone $binary_remote_addr zone=mcp:10m rate=30r/m;
    client_max_body_size 10m;

    server {
        location /github/ {
            limit_req zone=mcp burst=10 nodelay;
            # ...
        }
    }
}
```

### 9. API Keys Visible in Container Metadata

**Risk:** Credential Exposure

API keys passed as environment variables are visible via `docker inspect`, `/proc/*/environ` inside the container, and process listings. The Notion key is embedded as inline JSON in `OPENAPI_MCP_HEADERS`.

**Mitigation:**
- Use Docker secrets or a `.env` file with `env_file:` instead of inline `environment:`
- For production, use a secrets manager (Vault, AWS Secrets Manager, etc.)

---

## Low / Informational

### 10. No TLS on Localhost

Traffic between Kiro and nginx is plain HTTP. Low risk when bound to localhost, but any local process can sniff the traffic including API keys in headers.

**Mitigation:** Use a self-signed cert or mTLS if the threat model includes local network sniffing.

### 11. No Health Checks

`restart: unless-stopped` without health checks means a crashed MCP server silently restarts and may serve errors or stale state without visibility.

**Mitigation:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/mcp"]
  interval: 30s
  timeout: 5s
  retries: 3
```

### 12. SSRF via URL-Accepting Tools

`markitdown` (`convert_to_markdown`) and `pandoc` (`convert_document`) accept `http:`/`https:` URIs. If the container has network access to internal services, these tools could be used for SSRF.

**MCP spec reference:** [SSRF](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices#server-side-request-forgery-ssrf) — "Block requests to private and reserved IP address ranges"

**Mitigation:**
- Restrict container network access with Docker network policies
- Validate URLs against private IP ranges before fetching
- Use an egress proxy

### 13. Secrets in `.env` File

The `.env` file contains live API keys (GitHub PAT, Notion, YouTube, Context7). While `.gitignore` excludes it from version control, it's readable by any process with workspace access — including every MCP tool that can read files.

**Mitigation:**
- Ensure `.env` permissions are restricted: `chmod 600 .env`
- Consider using a system keychain or secrets manager instead of a flat file
- Rotate keys if they've ever been committed to git history

---

## Summary

| # | Issue | Severity | Category | Status |
|---|-------|----------|----------|--------|
| 1 | No auth on HTTP proxy | 🔴 Critical | Local Server Compromise | ✅ Fixed |
| 2 | Containers run as root | 🔴 Critical | Privilege Escalation | ✅ Fixed |
| 3 | Unpinned `@latest` packages | 🔴 Critical | Supply Chain / Tool Poisoning | |
| 4 | Overbroad GitHub PAT | 🔴 Critical | Scope Minimization | ✅ Fixed |
| 5 | No path validation in docx-reader | 🟡 Medium | Path Traversal | |
| 6 | Overly broad autoApprove | 🟡 Medium | Prompt Injection | |
| 7 | Regex injection in search_docx | 🟡 Medium | ReDoS | ✅ Fixed |
| 8 | No rate limiting | 🟡 Medium | Resource Exhaustion | |
| 9 | API keys in container metadata | 🟡 Medium | Credential Exposure | |
| 10 | No TLS on localhost | 🟢 Low | Eavesdropping | |
| 11 | No health checks | 🟢 Low | Availability | |
| 12 | SSRF via URL tools | 🟢 Low | SSRF | |
| 13 | Secrets in .env file | 🟢 Low | Credential Exposure | |

---

## References

- [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) — Official MCP specification security guidance
- [MCP Security Risks & Mitigations](https://socprime.com/blog/mcp-security-risks-and-mitigations/) — SOC Prime's practical risk analysis

Content was rephrased for compliance with licensing restrictions.

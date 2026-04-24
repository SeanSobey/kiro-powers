---
name: "npm"
version: "1.0.0"
displayName: "npm"
description: "npm package management via MCP. Search, install, update, audit, analyze dependencies, check bundle sizes, and manage licenses — all from your AI assistant."
keywords: ["@npm"]
author: "Sean Sobey"
---

# npm

## Overview

npm MCP provides direct access to npm package management operations through the Model Context Protocol. It enables your AI assistant to search packages, install/remove dependencies, audit for vulnerabilities, analyze dependency trees, check bundle sizes, and manage licenses — without you needing to switch to a terminal.

This power covers both the MCP tools for programmatic operations and CLI reference for when you need to run commands directly.

## Available Steering Files

- **advanced-workflows** — Workspaces, publishing, linking, caching, and CI/CD patterns

## Onboarding

### Prerequisites
- Node.js installed (npm comes bundled with it)

### Verify Installation
```bash
node --version
npm --version
```

### Update npm Itself
```bash
npm install -g npm@latest
```

### Initialize a New Project
```bash
npm init -y
```

This creates a `package.json` with defaults. Edit it to set name, version, description, etc.

## Common Workflows

### Search for Packages
```
search_packages with query="express web framework"
```

Optionally limit results or include pre-release versions:
```
search_packages with query="testing", limit=10, includeUnstable=true
```

### Get Package Info
```
package_info with packageName="express"
```

**Specific version:**
```
package_info with packageName="express", version="4.18.0"
```

### Install Packages
```
install_packages with packages=["express", "cors"]
```

**Dev dependencies:**
```
install_packages with packages=["jest", "@types/jest"], dev=true
```

**Exact versions:**
```
install_packages with packages=["lodash@4.17.21"], exact=true
```

**Global:**
```
install_packages with packages=["typescript"], global=true
```

### Remove Packages
```
remove_packages with packages=["old-package"]
```

### Update Packages

**Update all:**
```
update_packages
```

**Update specific packages:**
```
update_packages with packages=["express", "cors"]
```

**Update to latest (ignoring semver):**
```
update_packages with latest=true
```

### Check Outdated
```
check_outdated
```

Shows current, wanted, and latest versions for all dependencies.

### Check Bundle Size (Before Installing)
```
check_bundle_size with packageName="moment"
```

Compare alternatives before choosing:
```
check_bundle_size with packageName="dayjs"
```

## Security

### Audit for Vulnerabilities
```
audit_dependencies
```

### Auto-fix Vulnerabilities
```
audit_dependencies with fix=true
```

### Force-fix (may include breaking changes)
```
audit_dependencies with fix=true, force=true
```

### Production-only Audit
```
audit_dependencies with production=true
```

### Check a Specific Package
```
check_vulnerability with packageName="lodash"
```

**Specific version:**
```
check_vulnerability with packageName="lodash", version="4.17.20"
```

## Dependency Analysis

### View Dependency Tree
```
dependency_tree
```

**Limit depth:**
```
dependency_tree with depth=2
```

**Production only:**
```
dependency_tree with production=true
```

### Analyze for Issues
```
analyze_dependencies
```

Checks for circular dependencies and orphaned files.

### Check Licenses
```
list_licenses
```

**Production only:**
```
list_licenses with production=true
```

**Check a specific package:**
```
check_license with packageName="express"
```

### Download Stats
```
download_stats with packageName="express", period="last-month"
```

## package.json Essentials

### Version Ranges
- `^1.2.3` — Compatible with 1.x.x (default when installing)
- `~1.2.3` — Patch-level changes only (1.2.x)
- `1.2.3` — Exact version
- `*` — Any version
- `>=1.0.0 <2.0.0` — Range

### Common Fields
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {},
  "devDependencies": {},
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Peer Dependencies
Used by libraries to declare what the host project must provide:
```json
{
  "peerDependencies": {
    "react": ">=18.0.0"
  }
}
```

## Troubleshooting

### "EACCES: permission denied"
**Cause:** Global install without proper permissions.
**Solution:**
```bash
# Option 1: Use a Node version manager (nvm) — recommended
nvm install --lts

# Option 2: Change npm's default directory
npm config set prefix ~/.npm-global
# Add ~/.npm-global/bin to your PATH
```

### "ERESOLVE: unable to resolve dependency tree"
**Cause:** Conflicting peer dependencies.
**Solution:**
```bash
# See the conflict details
npm install --legacy-peer-deps

# Or force resolution
npm install --force
```

### "Module not found" after install
**Cause:** Package not installed, or wrong import path.
**Solution:**
1. Verify it's in `package.json`
2. Run `npm install`
3. Check the import path matches the package's exports

### Stale node_modules
**Cause:** Lock file and node_modules are out of sync.
**Solution:**
```bash
rm -rf node_modules
npm install
```

On Windows:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### "npm WARN deprecated"
**Cause:** A dependency uses a deprecated package.
**Solution:** Check `npm outdated` and update the parent package. If it's a transitive dependency, you may need to wait for the maintainer to update.

## Best Practices

- Always commit `package-lock.json` to version control
- Use `npm ci` in CI/CD pipelines instead of `npm install`
- Pin exact versions for critical production dependencies
- Run `npm audit` regularly and address high/critical vulnerabilities
- Use `--save-dev` for build tools, linters, and test frameworks
- Avoid global installs when possible — use `npx` for one-off commands
- Set `engines` in package.json to enforce Node.js version requirements
- Use `.npmrc` for project-specific npm configuration

## Configuration

This power is disabled by default. Enable it in `mcp.json` to run on the host via stdio. A Docker config exists commented out in `docker-compose.yml`.

---

**Package:** `npmplus-mcp-server`
**MCP Server:** npm

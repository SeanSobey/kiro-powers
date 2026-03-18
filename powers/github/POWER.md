---
name: "github"
displayName: "GitHub"
description: "Full GitHub platform operations via MCP. Manage repositories, issues, pull requests, branches, releases, code search, and Copilot agent integration from your AI assistant."
keywords: ["github", "pull-request", "issues", "repository", "code-review"]
author: "Sean Sobey"
---

# GitHub MCP

## Overview

GitHub MCP provides comprehensive access to the GitHub platform through the Model Context Protocol. It covers the full GitHub workflow — repositories, issues, pull requests, branches, releases, code search, file management, and even GitHub Copilot agent delegation.

This power enables your AI assistant to interact with GitHub without leaving your editor: create PRs, review code, manage issues, search across repositories, and automate release workflows.

## Available Steering Files

- **pull-requests** — Creating, reviewing, merging PRs, and code review workflows
- **issues-and-projects** — Issue management, labels, sub-issues, and search patterns
- **advanced-operations** — Releases, tags, Copilot agent delegation, secret scanning, and repository management

## Onboarding

### Prerequisites
- A GitHub account
- A Personal Access Token (PAT) with appropriate scopes
- Node.js 18+ (for npx)

### Getting Your GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes based on what you need:
   - `repo` — Full repository access (issues, PRs, code)
   - `read:org` — Read org and team membership
   - `read:user` — Read user profile data
4. Copy the generated token

### Configuration

After installing this power, replace the placeholder in `mcp.json` with your actual token.

## Common Workflows

### Check Your Identity

```
get_me
```

Returns your authenticated GitHub username, name, and profile info. Useful to confirm the token is working.

### Search Repositories

```
search_repositories with query="machine learning language:python stars:>1000"
```

Supports GitHub's full search syntax: language filters, star counts, topics, org filters, etc.

### Search Code

```
search_code with query="content:useState language:TypeScript org:my-org"
```

Fast, precise code search across all GitHub repositories. Supports exact matching, language filters, path filters.

### Get File Contents

```
get_file_contents with owner="user", repo="my-repo", path="src/index.ts"
```

**From a specific branch or PR:**
```
get_file_contents with owner="user", repo="my-repo", path="src/index.ts", ref="refs/heads/develop"
```

### Create or Update a File

```
create_or_update_file with owner="user", repo="my-repo", path="docs/README.md", content="# Hello", message="docs: add readme", branch="main"
```

For updating existing files, you need the file's SHA. Get it with:
```bash
git rev-parse main:docs/README.md
```

### Push Multiple Files

```
push_files with owner="user", repo="my-repo", branch="main", message="feat: add config files", files=[{"path": "config.json", "content": "..."}, {"path": ".env.example", "content": "..."}]
```

### List and Create Branches

**List:**
```
list_branches with owner="user", repo="my-repo"
```

**Create:**
```
create_branch with owner="user", repo="my-repo", branch="feature/new-thing"
```

**From a specific branch:**
```
create_branch with owner="user", repo="my-repo", branch="hotfix/urgent", from_branch="release/1.0"
```

### View Commits

**List recent commits:**
```
list_commits with owner="user", repo="my-repo"
```

**Get commit details with diff:**
```
get_commit with owner="user", repo="my-repo", sha="abc1234"
```

### Search Users

```
search_users with query="location:seattle followers:>100"
```

### Fork a Repository

```
fork_repository with owner="original-owner", repo="cool-project"
```

## Troubleshooting

### "Bad credentials" or 401 errors
**Cause:** Token is invalid, expired, or not set.
**Solution:**
1. Verify your token at https://github.com/settings/tokens
2. Ensure `GITHUB_PERSONAL_ACCESS_TOKEN` is set correctly in mcp.json
3. Check the token hasn't expired

### "Not Found" on private repos
**Cause:** Token doesn't have `repo` scope.
**Solution:** Regenerate your token with the `repo` scope enabled.

### "Resource not accessible by integration"
**Cause:** Token lacks the required scope for the operation.
**Solution:** Check which scopes your token has and add the missing ones.

### Rate limiting (403)
**Cause:** GitHub API rate limit exceeded.
**Solution:** Wait for the rate limit to reset (usually 1 hour), or use a token with higher limits.

### Search returns no results
**Cause:** Search syntax may be incorrect or the index hasn't caught up.
**Solution:** Simplify the query, check GitHub search syntax docs, or wait a few minutes for newly pushed code to be indexed.

## Best Practices

- Use a fine-grained PAT with minimal scopes for security
- Always check `get_me` first to verify authentication
- Use `search_code` for finding symbols across repos — it's faster than cloning
- Prefer `push_files` over multiple `create_or_update_file` calls for batch changes
- Use descriptive branch names and commit messages
- Request Copilot review before human reviewers to catch obvious issues early

## MCP Config Placeholders

**`YOUR_GITHUB_TOKEN_HERE`**: Your GitHub Personal Access Token.
- **How to get it:**
  1. Go to https://github.com/settings/tokens
  2. Click "Generate new token (classic)"
  3. Select required scopes (`repo`, `read:org`, `read:user`)
  4. Copy the token and paste it as the value

---

**Package:** `@modelcontextprotocol/server-github`
**MCP Server:** github

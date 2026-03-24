---
name: "github"
displayName: "GitHub"
description: "Full GitHub platform operations via MCP. Manage repositories, issues, pull requests, branches, releases, labels, milestones, workflows, gists, collaborators, tags, projects, and lightweight issue summaries from your AI assistant."
keywords: ["github", "pull-request", "issues", "repository", "code-review", "releases", "labels", "milestones", "actions", "workflows", "gists", "collaborators", "tags", "projects"]
author: "Sean Sobey"
---

# GitHub MCP

## Overview

GitHub MCP provides comprehensive access to the GitHub platform through the Model Context Protocol. It covers the full GitHub workflow — repositories, issues, pull requests, branches, releases, labels, milestones, workflows, gists, collaborators, tags, and projects.

This power combines the `@modelcontextprotocol/server-github` package with a custom `github-extras` server that fills in the gaps — label CRUD, milestones, releases, GitHub Actions, gists, collaborators, tags, projects, and a lightweight issues summary tool.

## Available Steering Files

- **pull-requests** — Creating, reviewing, merging PRs, and code review workflows
- **issues-and-projects** — Issue management, labels, milestones, projects, and search patterns
- **advanced-operations** — Releases, tags, workflows/actions, gists, collaborators, and repository management

## Onboarding

### Prerequisites
- A GitHub account
- A Personal Access Token (PAT) with appropriate scopes
- Node.js 18+ (for npx)

### Getting Your GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes based on what you need:
   - `repo` — Full repository access (issues, PRs, code, labels, milestones, collaborators)
   - `read:org` — Read org and team membership
   - `read:user` — Read user profile data
   - `workflow` — Trigger and manage GitHub Actions workflows
   - `gist` — Create and list gists
   - `project` — Manage projects
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

### Create a Label

```
create_label with owner="user", repo="my-repo", name="bug", color="d73a4a", description="Something isn't working"
```

The `color` parameter is a 6-character hex string without the `#` prefix.

### List Labels

```
list_labels with owner="user", repo="my-repo"
```

### Update a Label

```
update_label with owner="user", repo="my-repo", current_name="bug", new_name="bugfix", color="e4e669"
```

### Delete a Label

```
delete_label with owner="user", repo="my-repo", name="obsolete-label"
```

### Fork a Repository

```
fork_repository with owner="original-owner", repo="cool-project"
```

### Milestones

**Create:**
```
create_milestone with owner="user", repo="my-repo", title="v1.0", due_on="2025-12-31T00:00:00Z"
```

**List:**
```
list_milestones with owner="user", repo="my-repo", state="open"
```

**Update:**
```
update_milestone with owner="user", repo="my-repo", milestone_number=1, state="closed"
```

**Delete:**
```
delete_milestone with owner="user", repo="my-repo", milestone_number=1
```

### Releases

**Create:**
```
create_release with owner="user", repo="my-repo", tag_name="v1.0.0", name="Version 1.0", generate_release_notes=true
```

**List:**
```
list_releases with owner="user", repo="my-repo"
```

**Get by tag:**
```
get_release with owner="user", repo="my-repo", tag="v1.0.0"
```

**Delete:**
```
delete_release with owner="user", repo="my-repo", release_id=12345
```

### Workflows / Actions

**List workflows:**
```
list_workflows with owner="user", repo="my-repo"
```

**List runs (optionally filtered):**
```
list_workflow_runs with owner="user", repo="my-repo", workflow_id="ci.yml", status="failure"
```

**Get run details:**
```
get_workflow_run with owner="user", repo="my-repo", run_id=123456
```

**Trigger a workflow:**
```
trigger_workflow with owner="user", repo="my-repo", workflow_id="deploy.yml", ref="main", inputs={"environment": "production"}
```

### Gists

**Create:**
```
create_gist with description="My snippet", files={"example.js": {"content": "console.log('hi')"}}, public=true
```

**List:**
```
list_gists
```

### Collaborators

**List:**
```
list_collaborators with owner="user", repo="my-repo"
```

**Add:**
```
add_collaborator with owner="user", repo="my-repo", username="contributor", permission="push"
```

**Remove:**
```
remove_collaborator with owner="user", repo="my-repo", username="contributor"
```

### Tags

**List:**
```
list_tags with owner="user", repo="my-repo"
```

**Create annotated tag:**
```
create_tag with owner="user", repo="my-repo", tag="v1.0.0", message="Release 1.0", sha="abc1234"
```

**Delete:**
```
delete_tag with owner="user", repo="my-repo", tag="v1.0.0"
```

### Issues Summary

**List issues (lightweight):**
```
list_issues_summary with owner="user", repo="my-repo"
```

Returns only `number`, `title`, and `labels` (name + color) for each issue. Pull requests are excluded.

**Filter by state and labels:**
```
list_issues_summary with owner="user", repo="my-repo", state="open", labels="bug,urgent"
```

**Filter by assignee or milestone:**
```
list_issues_summary with owner="user", repo="my-repo", assignee="octocat", milestone=3
```

### Projects

**List org projects:**
```
list_org_projects with org="my-org"
```

**List repo projects:**
```
list_repo_projects with owner="user", repo="my-repo"
```

**Create org project:**
```
create_org_project with org="my-org", title="Q1 Roadmap", body="Planning for Q1"
```

**Create repo project:**
```
create_repo_project with owner="user", repo="my-repo", title="Sprint 1"
```

**Get / Update / Delete by ID:**
```
get_project with project_id=12345
update_project with project_id=12345, title="Updated Title", state="closed"
delete_project with project_id=12345
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
  3. Select required scopes (`repo`, `read:org`, `read:user`, `workflow`, `gist`, `project`)
  4. Copy the token and paste it as the value

---

**Packages:** `@modelcontextprotocol/server-github` + custom `github-extras`
**MCP Servers:** github, github-extras

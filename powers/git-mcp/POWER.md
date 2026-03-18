---
name: "git-mcp"
displayName: "Git MCP"
description: "Comprehensive Git operations via MCP. Clone, commit, push, pull, branch, diff, log, stash, rebase, cherry-pick, and more — all from your AI assistant."
keywords: ["git", "version-control", "repository", "commits", "branches"]
author: "Sean Sobey"
---

# Git MCP

## Overview

Git MCP provides a full-featured interface to Git repositories through the Model Context Protocol. It enables your AI assistant to perform virtually any Git operation — from basic commits and pushes to advanced rebasing, cherry-picking, and worktree management.

This power covers the complete Git lifecycle: repository setup, daily development workflows, branch management, history inspection, and collaboration via remotes. Whether you're committing changes, resolving merge conflicts, or managing complex branching strategies, Git MCP has you covered.

## Available Steering Files

- **advanced-workflows** — Rebasing, cherry-picking, stashing, worktrees, and interactive history management
- **collaboration** — Remote management, pushing, pulling, fetching, and team collaboration patterns

## Onboarding

### Prerequisites
- Git installed on your system (`git --version` to verify)
- Node.js 18+ (for npx to run the MCP server)

### Configuration

No special configuration is needed. The MCP server works with any Git repository accessible on your local filesystem.

### Setting a Working Directory

Before running Git operations, set the working directory for your session so you don't need to pass `path` to every command:

```
git_set_working_dir with path="/absolute/path/to/your/repo"
```

This persists for the session. Clear it with `git_clear_working_dir` if needed.

## Common Workflows

### Initialize or Clone a Repository

**New repo:**
```
git_init with path="/path/to/project", initialBranch="main"
```

**Clone existing:**
```
git_clone with repositoryUrl="https://github.com/user/repo.git", targetPath="/path/to/clone"
```

You can also clone a specific branch or create a shallow clone:
```
git_clone with repositoryUrl="...", targetPath="...", branch="develop", depth=1
```

### Check Repository Status

```
git_status
```

Returns current branch, staged/unstaged changes, untracked files, and conflict information — all structured as JSON.

### Stage and Commit Changes

**Stage all changes:**
```
git_add with files="."
```

**Stage specific files:**
```
git_add with files=["src/app.ts", "src/utils.ts"]
```

**Commit with a message:**
```
git_commit with message="feat(auth): add login endpoint"
```

**Stage and commit in one step:**
```
git_commit with message="fix(ui): correct button alignment", filesToStage=["src/button.css"]
```

### View Diffs

**Unstaged changes:**
```
git_diff
```

**Staged changes:**
```
git_diff with staged=true
```

**Between two branches:**
```
git_diff with commit1="main", commit2="feature/login"
```

**Specific file:**
```
git_diff with file="src/app.ts"
```

**Include untracked files:**
```
git_diff with includeUntracked=true
```

### View Commit History

```
git_log with maxCount=10
```

**Filter by author or date:**
```
git_log with author="sean", since="2 weeks ago"
```

**Log for a specific file:**
```
git_log with branchOrFile="src/app.ts"
```

### Branch Management

**List branches:**
```
git_branch with mode="list"
```

**Show current branch:**
```
git_branch with mode="show-current"
```

**Create a branch:**
```
git_branch with mode="create", branchName="feature/new-dashboard"
```

**Create from a specific commit:**
```
git_branch with mode="create", branchName="hotfix/urgent", startPoint="v2.1.0"
```

**Switch branches:**
```
git_checkout with branchOrPath="feature/new-dashboard"
```

**Create and switch in one step:**
```
git_checkout with branchOrPath="main", newBranch="feature/quick-fix"
```

**Delete a branch:**
```
git_branch with mode="delete", branchName="feature/old-branch"
```

**Rename a branch:**
```
git_branch with mode="rename", branchName="old-name", newBranchName="new-name"
```

### Merging

```
git_merge with branch="feature/login"
```

**No fast-forward merge (always create merge commit):**
```
git_merge with branch="feature/login", noFf=true
```

**Squash merge:**
```
git_merge with branch="feature/login", squash=true
```

**Abort a conflicted merge:**
```
git_merge with abort=true
```

### Tags

**List tags:**
```
git_tag with mode="list"
```

**Create lightweight tag:**
```
git_tag with mode="create", tagName="v1.0.0"
```

**Create annotated tag:**
```
git_tag with mode="create", tagName="v1.0.0", annotate=true, message="Release 1.0.0"
```

**Delete a tag:**
```
git_tag with mode="delete", tagName="v1.0.0-beta"
```

### Inspect Objects

**Show a commit:**
```
git_show with ref="HEAD"
```

**Show a file at a specific commit:**
```
git_show with ref="main", filePath="src/config.ts"
```

### Reset

**Unstage files (mixed reset):**
```
git_reset
```

**Soft reset (keep changes staged):**
```
git_reset with mode="soft", commit="HEAD~1"
```

**Hard reset (discard all changes — use with caution):**
```
git_reset with mode="hard", commit="HEAD~3"
```

### Clean Untracked Files

**Dry run first:**
```
git_clean with force=false, dryRun=true
```

**Actually clean:**
```
git_clean with force=true, directories=true
```

### Wrap-Up Workflow

The `git_wrapup_instructions` tool provides a guided wrap-up: review diffs, update docs, and make logical commits.

```
git_wrapup_instructions with acknowledgement="Y"
```

## Troubleshooting

### "Path is not a Git repository"
**Cause:** Working directory isn't set or points to a non-repo directory.
**Solution:** Call `git_set_working_dir` with the correct absolute path, or pass `path` directly to the tool.

### "Merge conflict"
**Cause:** Conflicting changes during merge, rebase, or cherry-pick.
**Solution:**
1. Check `git_status` to see conflicted files
2. Resolve conflicts in the files
3. `git_add` the resolved files
4. Continue the operation (`git_merge`, `git_rebase with mode="continue"`, or `git_cherry_pick`)

### "Detached HEAD"
**Cause:** Checked out a commit or tag directly instead of a branch.
**Solution:** Create a branch from the current state: `git_checkout with branchOrPath="HEAD", newBranch="my-branch"`

### "Nothing to commit"
**Cause:** No staged changes.
**Solution:** Stage files with `git_add` first, or use `filesToStage` parameter in `git_commit`.

## Best Practices

- Always set the working directory at the start of a session with `git_set_working_dir`
- Use Conventional Commits format for messages: `type(scope): subject`
- Check `git_status` before committing to verify what's staged
- Use `git_diff with staged=true` to review exactly what you're about to commit
- Prefer `git_clean with dryRun=true` before actually cleaning
- Use `--force-with-lease` over `--force` when force-pushing
- Create annotated tags for releases (lightweight tags for temporary markers)

## Configuration

No additional configuration required — works with any local Git repository after the MCP server is installed.

---

**Package:** `@cyanheads/git-mcp-server`
**MCP Server:** git

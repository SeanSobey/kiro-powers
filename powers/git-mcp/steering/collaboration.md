# Git Collaboration

## Remote Management

### List remotes
```
git_remote with mode="list"
```

### Show remote details
```
git_remote with mode="show", name="origin"
```

### Add a remote
```
git_remote with mode="add", name="upstream", url="https://github.com/original/repo.git"
```

### Remove a remote
```
git_remote with mode="remove", name="old-remote"
```

## Fetching

### Fetch from default remote
```
git_fetch
```

### Fetch from a specific remote
```
git_fetch with remote="upstream"
```

### Fetch all remotes
```
git_fetch with all=true
```

### Fetch and prune stale branches
```
git_fetch with prune=true
```

### Fetch tags
```
git_fetch with tags=true
```

## Pulling

### Basic pull
```
git_pull
```

### Pull from specific remote/branch
```
git_pull with remote="origin", branch="main"
```

### Pull with rebase (cleaner history)
```
git_pull with rebase=true
```

### Pull fast-forward only (safe — fails if diverged)
```
git_pull with ffOnly=true
```

## Pushing

### Push current branch
```
git_push
```

### Push and set upstream
```
git_push with setUpstream=true
```

### Push a specific branch
```
git_push with branch="feature/login"
```

### Push to a different remote branch
```
git_push with branch="local-branch", remoteBranch="remote-branch"
```

### Force push (with lease — safer)
```
git_push with forceWithLease=true
```

### Force push (use with extreme caution)
```
git_push with force=true
```

### Push all tags
```
git_push with tags=true
```

### Delete a remote branch
```
git_push with branch="old-feature", delete=true
```

## Collaboration Patterns

### Fork and contribute workflow
1. Clone your fork: `git_clone with repositoryUrl="https://github.com/you/repo.git", targetPath="/path"`
2. Add upstream: `git_remote with mode="add", name="upstream", url="https://github.com/original/repo.git"`
3. Create feature branch: `git_checkout with branchOrPath="main", newBranch="feature/my-change"`
4. Make changes and commit
5. Fetch upstream: `git_fetch with remote="upstream"`
6. Rebase onto upstream: `git_rebase with upstream="upstream/main"`
7. Push to your fork: `git_push with setUpstream=true`
8. Create PR on GitHub

### Sync fork with upstream
1. Fetch upstream: `git_fetch with remote="upstream"`
2. Checkout main: `git_checkout with branchOrPath="main"`
3. Merge upstream: `git_merge with branch="upstream/main"`
4. Push to origin: `git_push`

### Review a PR locally
1. Fetch the PR: `git_fetch with remote="origin"`
2. Checkout PR branch: `git_checkout with branchOrPath="origin/pr-branch", newBranch="review/pr-123"`
3. Review changes: `git_log`, `git_diff with commit1="main", commit2="HEAD"`
4. Clean up: `git_checkout with branchOrPath="main"`, `git_branch with mode="delete", branchName="review/pr-123"`

### Release workflow
1. Create release branch: `git_checkout with branchOrPath="main", newBranch="release/2.0"`
2. Bump version, update changelog, commit
3. Tag the release: `git_tag with mode="create", tagName="v2.0.0", annotate=true, message="Release 2.0.0"`
4. Merge to main: `git_checkout with branchOrPath="main"`, `git_merge with branch="release/2.0", noFf=true`
5. Push with tags: `git_push`, `git_push with tags=true`
6. Clean up: `git_branch with mode="delete", branchName="release/2.0"`

## Inspecting Remote State

### List remote branches
```
git_branch with mode="list", remote=true
```

### List all branches (local + remote)
```
git_branch with mode="list", all=true
```

### Compare local and remote
```
git_diff with commit1="main", commit2="origin/main"
```

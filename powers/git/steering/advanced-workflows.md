---
inclusion: manual
---

# Advanced Git Workflows

## Stashing

Stash lets you save uncommitted changes temporarily without committing them.

### Save current changes
```
git_stash with mode="save", message="WIP: refactoring auth module"
```

### List stashes
```
git_stash with mode="list"
```

### Apply a stash (keep it in the stash list)
```
git_stash with mode="apply", stashRef="stash@{0}"
```

### Pop a stash (apply and remove from list)
```
git_stash with mode="pop", stashRef="stash@{0}"
```

### Drop a stash
```
git_stash with mode="drop", stashRef="stash@{1}"
```

## Rebasing

Rebase replays commits on top of another base, creating a linear history.

### Basic rebase onto main
```
git_rebase with upstream="main"
```

### Rebase with strategy (resolve conflicts by preferring theirs)
```
git_rebase with upstream="main", strategy="theirs"
```

### Interactive rebase
```
git_rebase with upstream="HEAD~5", interactive=true
```

### Continue after resolving conflicts
```
git_rebase with mode="continue"
```

### Abort a rebase
```
git_rebase with mode="abort"
```

### Skip a problematic commit
```
git_rebase with mode="skip"
```

### Rebase onto a specific commit
```
git_rebase with upstream="feature-base", onto="main"
```

## Cherry-Picking

Apply specific commits from one branch to another.

### Pick a single commit
```
git_cherry_pick with commitRef="abc1234"
```

### Pick without committing (stage changes only)
```
git_cherry_pick with commitRef="abc1234", noCommit=true
```

### Pick a range of commits
```
git_cherry_pick with commitRef="abc1234..def5678"
```

### Cherry-pick a merge commit
```
git_cherry_pick with commitRef="merge-commit-hash", mainline=1
```

### Resolve conflicts during cherry-pick
1. Check `git_status` for conflicted files
2. Resolve the conflicts
3. `git_add` resolved files
4. `git_cherry_pick` will continue automatically (or use `git_commit`)

## Worktrees

Worktrees let you check out multiple branches simultaneously in separate directories.

### List worktrees
```
git_worktree with mode="list"
```

### Add a worktree for an existing branch
```
git_worktree with mode="add", worktreePath="../repo-hotfix", commitish="hotfix/urgent"
```

### Add a worktree with a new branch
```
git_worktree with mode="add", worktreePath="../repo-experiment", newBranch="experiment/new-idea"
```

### Remove a worktree
```
git_worktree with mode="remove", worktreePath="../repo-hotfix"
```

### Move a worktree
```
git_worktree with mode="move", worktreePath="../repo-hotfix", newPath="../repo-hotfix-v2"
```

### Prune stale worktrees
```
git_worktree with mode="prune"
```

### Dry-run prune
```
git_worktree with mode="prune", dryRun=true
```

## Advanced Reset Patterns

### Undo last commit but keep changes staged
```
git_reset with mode="soft", commit="HEAD~1"
```

### Undo last 3 commits, unstage changes
```
git_reset with mode="mixed", commit="HEAD~3"
```

### Completely discard last commit and all changes
```
git_reset with mode="hard", commit="HEAD~1"
```

### Reset to match remote branch exactly
```
git_fetch
git_reset with mode="hard", commit="origin/main"
```

## Combining Workflows

### Feature branch with rebase workflow
1. Create feature branch: `git_branch with mode="create", branchName="feature/x"`
2. Switch to it: `git_checkout with branchOrPath="feature/x"`
3. Make commits as you work
4. Before merging, rebase onto main: `git_rebase with upstream="main"`
5. Switch to main: `git_checkout with branchOrPath="main"`
6. Fast-forward merge: `git_merge with branch="feature/x"`

### Hotfix with cherry-pick
1. Identify the fix commit hash from the feature branch
2. Switch to release branch: `git_checkout with branchOrPath="release/1.0"`
3. Cherry-pick the fix: `git_cherry_pick with commitRef="fix-hash"`
4. Tag the release: `git_tag with mode="create", tagName="v1.0.1", annotate=true, message="Hotfix release"`

### Stash and switch context
1. Stash current work: `git_stash with mode="save", message="WIP: feature X"`
2. Switch branch: `git_checkout with branchOrPath="hotfix/urgent"`
3. Do the hotfix work and commit
4. Switch back: `git_checkout with branchOrPath="feature/x"`
5. Restore work: `git_stash with mode="pop", stashRef="stash@{0}"`

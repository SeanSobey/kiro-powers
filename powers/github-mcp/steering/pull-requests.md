# Pull Requests

## Creating Pull Requests

### Basic PR
```
create_pull_request with owner="user", repo="my-repo", title="feat: add login page", head="feature/login", base="main", body="Adds the login page with OAuth support"
```

### Draft PR
```
create_pull_request with owner="user", repo="my-repo", title="WIP: dashboard redesign", head="feature/dashboard", base="main", draft=true
```

### Create PR with Copilot Agent
Delegate a task to GitHub Copilot to implement and create a PR:
```
create_pull_request_with_copilot with owner="user", repo="my-repo", title="Add user settings page", problem_statement="Create a user settings page with profile editing, notification preferences, and theme selection"
```

Check the job status:
```
get_copilot_job_status with owner="user", repo="my-repo", id="job-id"
```

## Listing and Searching PRs

### List open PRs
```
list_pull_requests with owner="user", repo="my-repo", state="open"
```

### Search PRs by author
```
search_pull_requests with query="author:username", owner="user", repo="my-repo"
```

### Search PRs across repos
```
search_pull_requests with query="is:open review-requested:me"
```

## Reviewing Pull Requests

### Get PR details
```
pull_request_read with method="get", owner="user", repo="my-repo", pullNumber=42
```

### Get the diff
```
pull_request_read with method="get_diff", owner="user", repo="my-repo", pullNumber=42
```

### Get changed files
```
pull_request_read with method="get_files", owner="user", repo="my-repo", pullNumber=42
```

### Get review comments (threaded)
```
pull_request_read with method="get_review_comments", owner="user", repo="my-repo", pullNumber=42
```

### Get CI/CD check runs
```
pull_request_read with method="get_check_runs", owner="user", repo="my-repo", pullNumber=42
```

### Get combined commit status
```
pull_request_read with method="get_status", owner="user", repo="my-repo", pullNumber=42
```

## Writing Reviews

### Approve a PR
```
pull_request_review_write with method="create", owner="user", repo="my-repo", pullNumber=42, event="APPROVE", body="Looks good!"
```

### Request changes
```
pull_request_review_write with method="create", owner="user", repo="my-repo", pullNumber=42, event="REQUEST_CHANGES", body="Please fix the error handling in auth.ts"
```

### Create a pending review (add comments first, submit later)
```
pull_request_review_write with method="create", owner="user", repo="my-repo", pullNumber=42
```

Then add comments to the pending review:
```
add_comment_to_pending_review with owner="user", repo="my-repo", pullNumber=42, path="src/auth.ts", line=25, body="This should handle the null case", subjectType="LINE", side="RIGHT"
```

Submit the pending review:
```
pull_request_review_write with method="submit_pending", owner="user", repo="my-repo", pullNumber=42, event="REQUEST_CHANGES", body="A few things to address"
```

### Delete a pending review
```
pull_request_review_write with method="delete_pending", owner="user", repo="my-repo", pullNumber=42
```

### Reply to a review comment
```
add_reply_to_pull_request_comment with owner="user", repo="my-repo", pullNumber=42, commentId=12345, body="Good point, I'll fix that"
```

### Request Copilot review
```
request_copilot_review with owner="user", repo="my-repo", pullNumber=42
```

## Updating and Merging PRs

### Update PR details
```
update_pull_request with owner="user", repo="my-repo", pullNumber=42, title="Updated title", body="Updated description"
```

### Mark as ready for review
```
update_pull_request with owner="user", repo="my-repo", pullNumber=42, draft=false
```

### Request reviewers
```
update_pull_request with owner="user", repo="my-repo", pullNumber=42, reviewers=["teammate1", "teammate2"]
```

### Update PR branch (merge base into PR)
```
update_pull_request_branch with owner="user", repo="my-repo", pullNumber=42
```

### Merge a PR
```
merge_pull_request with owner="user", repo="my-repo", pullNumber=42, merge_method="squash", commit_title="feat: add login page (#42)"
```

Merge methods: `merge`, `squash`, `rebase`

### Close a PR
```
update_pull_request with owner="user", repo="my-repo", pullNumber=42, state="closed"
```

## PR Review Workflow Pattern

1. List open PRs: `list_pull_requests`
2. Get PR details: `pull_request_read with method="get"`
3. Review the diff: `pull_request_read with method="get_diff"`
4. Check CI status: `pull_request_read with method="get_check_runs"`
5. Add review: `pull_request_review_write with method="create", event="APPROVE"`
6. Merge: `merge_pull_request with merge_method="squash"`

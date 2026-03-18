# Issues and Projects

## Creating Issues

### Basic issue
```
issue_write with method="create", owner="user", repo="my-repo", title="Bug: login fails on mobile", body="Steps to reproduce:\n1. Open on mobile\n2. Click login\n3. Page crashes"
```

### Issue with labels and assignees
```
issue_write with method="create", owner="user", repo="my-repo", title="Add dark mode", labels=["enhancement", "ui"], assignees=["teammate1"]
```

### Issue with milestone
```
issue_write with method="create", owner="user", repo="my-repo", title="Migrate to v2 API", milestone=3
```

## Reading Issues

### Get issue details
```
issue_read with method="get", owner="user", repo="my-repo", issue_number=15
```

### Get issue comments
```
issue_read with method="get_comments", owner="user", repo="my-repo", issue_number=15
```

### Get issue labels
```
issue_read with method="get_labels", owner="user", repo="my-repo", issue_number=15
```

### Get sub-issues
```
issue_read with method="get_sub_issues", owner="user", repo="my-repo", issue_number=15
```

## Listing and Searching Issues

### List open issues
```
list_issues with owner="user", repo="my-repo", state="OPEN"
```

### List issues by label
```
list_issues with owner="user", repo="my-repo", labels=["bug"]
```

### Search issues across repos
```
search_issues with query="is:open label:bug assignee:me"
```

### Search with sorting
```
search_issues with query="is:open", owner="user", repo="my-repo", sort="updated", order="desc"
```

## Updating Issues

### Update title and body
```
issue_write with method="update", owner="user", repo="my-repo", issue_number=15, title="Updated title", body="Updated description"
```

### Close an issue
```
issue_write with method="update", owner="user", repo="my-repo", issue_number=15, state="closed", state_reason="completed"
```

### Close as not planned
```
issue_write with method="update", owner="user", repo="my-repo", issue_number=15, state="closed", state_reason="not_planned"
```

### Close as duplicate
```
issue_write with method="update", owner="user", repo="my-repo", issue_number=15, state="closed", state_reason="duplicate", duplicate_of=10
```

### Add labels
```
issue_write with method="update", owner="user", repo="my-repo", issue_number=15, labels=["bug", "priority-high"]
```

### Reassign
```
issue_write with method="update", owner="user", repo="my-repo", issue_number=15, assignees=["new-assignee"]
```

## Comments

### Add a comment to an issue
```
add_issue_comment with owner="user", repo="my-repo", issue_number=15, body="I can reproduce this. Working on a fix."
```

This also works for PRs — pass the PR number as `issue_number`.

## Sub-Issues

### Add a sub-issue
```
sub_issue_write with method="add", owner="user", repo="my-repo", issue_number=15, sub_issue_id=20
```

### Remove a sub-issue
```
sub_issue_write with method="remove", owner="user", repo="my-repo", issue_number=15, sub_issue_id=20
```

### Reprioritize a sub-issue
```
sub_issue_write with method="reprioritize", owner="user", repo="my-repo", issue_number=15, sub_issue_id=20, after_id=18
```

## Labels

### Get a label
```
get_label with owner="user", repo="my-repo", name="bug"
```

### List issue types for an org
```
list_issue_types with owner="my-org"
```

## Copilot Issue Assignment

Assign GitHub Copilot to work on an issue:
```
assign_copilot_to_issue with owner="user", repo="my-repo", issue_number=15
```

With custom instructions:
```
assign_copilot_to_issue with owner="user", repo="my-repo", issue_number=15, custom_instructions="Use TypeScript, follow existing patterns in src/services/"
```

## Teams

### Get your teams
```
get_teams
```

### Get team members
```
get_team_members with org="my-org", team_slug="frontend-team"
```

## Workflow Patterns

### Bug triage
1. Search for new bugs: `search_issues with query="is:open label:bug no:assignee"`
2. Review each: `issue_read with method="get"`
3. Assign and label: `issue_write with method="update", assignees=[...], labels=[...]`
4. Add triage comment: `add_issue_comment`

### Sprint planning
1. List open issues: `list_issues with state="OPEN"`
2. Filter by milestone: check milestone field
3. Assign to team: `issue_write with method="update", assignees=[...]`
4. Create sub-issues for large items: `issue_write with method="create"` then `sub_issue_write`

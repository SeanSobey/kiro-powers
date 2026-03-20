# Issues and Projects

## Creating Issues

### Basic issue
```
create_issue with owner="user", repo="my-repo", title="Bug: login fails on mobile", body="Steps to reproduce:\n1. Open on mobile\n2. Click login\n3. Page crashes"
```

### Issue with labels and assignees
```
create_issue with owner="user", repo="my-repo", title="Add dark mode", labels=["enhancement", "ui"], assignees=["teammate1"]
```

### Issue with milestone
```
create_issue with owner="user", repo="my-repo", title="Migrate to v2 API", milestone=3
```

## Reading Issues

### Get issue details
```
get_issue with owner="user", repo="my-repo", issue_number=15
```

## Listing and Searching Issues

### List open issues
```
list_issues with owner="user", repo="my-repo", state="open"
```

### List issues by label
```
list_issues with owner="user", repo="my-repo", labels=["bug"]
```

### Search issues across repos
```
search_issues with q="is:open label:bug assignee:me"
```

### Search with sorting
```
search_issues with q="is:open repo:user/my-repo", sort="updated", order="desc"
```

## Updating Issues

### Update title and body
```
update_issue with owner="user", repo="my-repo", issue_number=15, title="Updated title", body="Updated description"
```

### Close an issue
```
update_issue with owner="user", repo="my-repo", issue_number=15, state="closed"
```

### Add labels
```
update_issue with owner="user", repo="my-repo", issue_number=15, labels=["bug", "priority-high"]
```

### Reassign
```
update_issue with owner="user", repo="my-repo", issue_number=15, assignees=["new-assignee"]
```

## Comments

### Add a comment to an issue
```
add_issue_comment with owner="user", repo="my-repo", issue_number=15, body="I can reproduce this. Working on a fix."
```

This also works for PRs — pass the PR number as `issue_number`.

## Labels (github-extras)

### Create a label
```
create_label with owner="user", repo="my-repo", name="bug", color="d73a4a", description="Something isn't working"
```

### List all labels
```
list_labels with owner="user", repo="my-repo"
```

### Update a label
```
update_label with owner="user", repo="my-repo", current_name="bug", new_name="bugfix", color="e4e669"
```

### Delete a label
```
delete_label with owner="user", repo="my-repo", name="obsolete-label"
```

## Milestones (github-extras)

### Create a milestone
```
create_milestone with owner="user", repo="my-repo", title="v1.0", due_on="2025-12-31T00:00:00Z"
```

### List milestones
```
list_milestones with owner="user", repo="my-repo", state="open"
```

### Update a milestone
```
update_milestone with owner="user", repo="my-repo", milestone_number=1, state="closed"
```

### Delete a milestone
```
delete_milestone with owner="user", repo="my-repo", milestone_number=1
```

## Projects (github-extras)

### List organization projects
```
list_org_projects with org="my-org"
```

### List repository projects
```
list_repo_projects with owner="user", repo="my-repo"
```

### Create an organization project
```
create_org_project with org="my-org", title="Q1 Roadmap", body="Planning for Q1"
```

### Create a repository project
```
create_repo_project with owner="user", repo="my-repo", title="Sprint 1"
```

### Get project details
```
get_project with project_id=12345
```

### Update a project
```
update_project with project_id=12345, title="Updated Title", state="closed"
```

### Delete a project
```
delete_project with project_id=12345
```

## Workflow Patterns

### Bug triage
1. Search for new bugs: `search_issues with q="is:open label:bug no:assignee"`
2. Review each: `get_issue with owner, repo, issue_number`
3. Assign and label: `update_issue with assignees=[...], labels=[...]`
4. Add triage comment: `add_issue_comment`

### Sprint planning with milestones
1. Create a milestone: `create_milestone with title="Sprint 5", due_on="2025-07-15T00:00:00Z"`
2. List open issues: `list_issues with state="open"`
3. Assign issues to milestone: `update_issue with milestone=5`
4. Track progress: `list_milestones with state="open"`

### Project board setup
1. Create a project: `create_repo_project with title="Feature Work"`
2. Create labels for columns: `create_label` for "todo", "in-progress", "done"
3. Create issues and assign labels: `create_issue with labels=["todo"]`

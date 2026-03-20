# Advanced GitHub Operations

## Releases

### Create a release
```
create_release with owner="user", repo="my-repo", tag_name="v2.0.0", name="Version 2.0", generate_release_notes=true
```

### Create a draft pre-release
```
create_release with owner="user", repo="my-repo", tag_name="v2.0.0-rc.1", name="2.0 Release Candidate", draft=true, prerelease=true
```

### List releases
```
list_releases with owner="user", repo="my-repo"
```

### Get release by tag
```
get_release with owner="user", repo="my-repo", tag="v2.0.0"
```

### Get release by ID
```
get_release with owner="user", repo="my-repo", release_id=12345
```

### Delete a release
```
delete_release with owner="user", repo="my-repo", release_id=12345
```

## Tags

### List tags
```
list_tags with owner="user", repo="my-repo"
```

### Create an annotated tag
```
create_tag with owner="user", repo="my-repo", tag="v1.0.0", message="Release 1.0.0", sha="abc1234"
```

### Delete a tag
```
delete_tag with owner="user", repo="my-repo", tag="v1.0.0"
```

## Milestones

### Create a milestone
```
create_milestone with owner="user", repo="my-repo", title="v2.0", description="Major release", due_on="2025-12-31T00:00:00Z"
```

### List milestones
```
list_milestones with owner="user", repo="my-repo", state="open", sort="due_on"
```

### Update a milestone
```
update_milestone with owner="user", repo="my-repo", milestone_number=1, state="closed"
```

### Delete a milestone
```
delete_milestone with owner="user", repo="my-repo", milestone_number=1
```

## Workflows / GitHub Actions

### List workflows in a repo
```
list_workflows with owner="user", repo="my-repo"
```

### List workflow runs
```
list_workflow_runs with owner="user", repo="my-repo"
```

### List runs for a specific workflow
```
list_workflow_runs with owner="user", repo="my-repo", workflow_id="ci.yml"
```

### Filter runs by status and branch
```
list_workflow_runs with owner="user", repo="my-repo", workflow_id="ci.yml", status="failure", branch="main"
```

### Get run details
```
get_workflow_run with owner="user", repo="my-repo", run_id=123456
```

### Trigger a workflow dispatch
```
trigger_workflow with owner="user", repo="my-repo", workflow_id="deploy.yml", ref="main", inputs={"environment": "production"}
```

## Gists

### Create a public gist
```
create_gist with description="Debug helper", files={"debug.js": {"content": "console.log('debug')"}}, public=true
```

### Create a private gist with multiple files
```
create_gist with description="Config templates", files={"dev.json": {"content": "{}"}, "prod.json": {"content": "{}"}}, public=false
```

### List your gists
```
list_gists
```

### List gists updated since a date
```
list_gists with since="2025-01-01T00:00:00Z"
```

## Collaborators

### List collaborators
```
list_collaborators with owner="user", repo="my-repo"
```

### List outside collaborators only
```
list_collaborators with owner="user", repo="my-repo", affiliation="outside"
```

### Add a collaborator
```
add_collaborator with owner="user", repo="my-repo", username="contributor", permission="push"
```

Permission levels: `pull`, `triage`, `push`, `maintain`, `admin`

### Remove a collaborator
```
remove_collaborator with owner="user", repo="my-repo", username="contributor"
```

## Repository Management

### Create a repository
```
create_repository with name="my-new-project", description="A cool project", private=true, autoInit=true
```

### Fork a repository
```
fork_repository with owner="original-owner", repo="cool-project"
```

### Fork to an organization
```
fork_repository with owner="original-owner", repo="cool-project", organization="my-org"
```

## Secret Scanning

Scan files for accidentally committed secrets:
```
run_secret_scanning with owner="user", repo="my-repo", files=["content of file 1", "content of file 2"]
```

## Copilot Agent

### Create a PR with Copilot
```
create_pull_request_with_copilot with owner="user", repo="my-repo", title="Add user settings", problem_statement="Create a settings page with profile editing and notification preferences"
```

### Assign Copilot to an issue
```
assign_copilot_to_issue with owner="user", repo="my-repo", issue_number=42
```

### Check Copilot job status
```
get_copilot_job_status with owner="user", repo="my-repo", id="job-id-or-pr-number"
```

## Release Workflow Pattern

1. List recent commits since last release:
   ```
   list_commits with owner="user", repo="my-repo"
   ```
2. Check the latest release:
   ```
   list_releases with owner="user", repo="my-repo", per_page=1
   ```
3. Create a tag:
   ```
   create_tag with owner="user", repo="my-repo", tag="v2.1.0", message="Release 2.1.0", sha="abc1234"
   ```
4. Create the release with auto-generated notes:
   ```
   create_release with owner="user", repo="my-repo", tag_name="v2.1.0", name="Version 2.1.0", generate_release_notes=true
   ```

## CI/CD Monitoring Pattern

1. List workflows to find the right one:
   ```
   list_workflows with owner="user", repo="my-repo"
   ```
2. Check recent failures:
   ```
   list_workflow_runs with owner="user", repo="my-repo", workflow_id="ci.yml", status="failure"
   ```
3. Get details on a failed run:
   ```
   get_workflow_run with owner="user", repo="my-repo", run_id=123456
   ```
4. Re-trigger after a fix:
   ```
   trigger_workflow with owner="user", repo="my-repo", workflow_id="ci.yml", ref="main"
   ```

## Cross-Repository Operations

### Search code across an org
```
search_code with query="deprecated language:TypeScript org:my-org"
```

### Find repos by topic
```
search_repositories with query="topic:microservices org:my-org"
```

### Find active contributors
```
search_users with query="org:my-org repos:>5"
```

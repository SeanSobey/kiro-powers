# Advanced GitHub Operations

## Releases

### List releases
```
list_releases with owner="user", repo="my-repo"
```

### Get latest release
```
get_latest_release with owner="user", repo="my-repo"
```

### Get release by tag
```
get_release_by_tag with owner="user", repo="my-repo", tag="v2.0.0"
```

## Tags

### List tags
```
list_tags with owner="user", repo="my-repo"
```

### Get tag details
```
get_tag with owner="user", repo="my-repo", tag="v1.0.0"
```

## Repository Management

### Create a repository
```
create_repository with name="my-new-project", description="A cool project", private=true, autoInit=true
```

### Create in an organization
```
create_repository with name="team-tool", organization="my-org", private=true, autoInit=true
```

### Fork a repository
```
fork_repository with owner="original-owner", repo="cool-project"
```

### Fork to an organization
```
fork_repository with owner="original-owner", repo="cool-project", organization="my-org"
```

### Delete a file
```
delete_file with owner="user", repo="my-repo", path="old-config.json", message="chore: remove deprecated config", branch="main"
```

## Secret Scanning

Scan files for accidentally committed secrets:
```
run_secret_scanning with owner="user", repo="my-repo", files=["content of file 1", "content of file 2"]
```

This scans raw file contents (not paths) for API keys, passwords, tokens, and credentials. Use it before committing sensitive files or when reviewing diffs.

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
   get_latest_release with owner="user", repo="my-repo"
   ```
3. Create a branch for release prep:
   ```
   create_branch with owner="user", repo="my-repo", branch="release/2.1.0"
   ```
4. Push changelog updates:
   ```
   create_or_update_file with owner="user", repo="my-repo", path="CHANGELOG.md", content="...", message="docs: update changelog for v2.1.0", branch="release/2.1.0"
   ```
5. Create PR for review:
   ```
   create_pull_request with owner="user", repo="my-repo", title="Release 2.1.0", head="release/2.1.0", base="main"
   ```
6. After merge, tag will trigger release pipeline

## Security Audit Pattern

1. Search for potential secrets in code:
   ```
   search_code with query="password OR api_key OR secret repo:user/my-repo"
   ```
2. Scan suspicious files:
   ```
   run_secret_scanning with owner="user", repo="my-repo", files=["file contents..."]
   ```
3. Create issues for findings:
   ```
   issue_write with method="create", owner="user", repo="my-repo", title="Security: rotate exposed API key", labels=["security", "priority-critical"]
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

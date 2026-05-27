import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2022-11-28",
};

function tokenError() {
  return {
    content: [{ type: "text", text: "Error: GITHUB_PERSONAL_ACCESS_TOKEN is not set." }],
    isError: true,
  };
}

function apiError(status, data) {
  return {
    content: [{ type: "text", text: `GitHub API error (${status}): ${JSON.stringify(data)}` }],
    isError: true,
  };
}

function ok(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

async function ghFetch(path, opts = {}) {
  const res = await fetch(`https://api.github.com${path}`, { headers: HEADERS, ...opts });
  return res;
}

const server = new McpServer({ name: "github-extras", version: "1.0.0" });

// ─── Labels ──────────────────────────────────────────────────────────────────

server.tool(
  "create_label",
  "Create a new label in a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    name: z.string().describe("Label name"),
    color: z.string().regex(/^[0-9a-fA-F]{6}$/).describe("6-char hex color without #"),
    description: z.string().optional().describe("Short description"),
  },
  async ({ owner, repo, name, color, description }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/labels`, {
      method: "POST", body: JSON.stringify({ name, color, description }),
    });
    const data = await res.json();
    return res.ok ? ok({ id: data.id, name: data.name, color: data.color, description: data.description }) : apiError(res.status, data);
  }
);

server.tool(
  "list_labels",
  "List all labels in a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ owner, repo, per_page, page }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    const qs = params.toString();
    const res = await ghFetch(`/repos/${owner}/${repo}/labels${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    return ok(data.map((l) => ({ id: l.id, name: l.name, color: l.color, description: l.description })));
  }
);

server.tool(
  "update_label",
  "Update an existing label in a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    current_name: z.string().describe("Current label name"),
    new_name: z.string().optional().describe("New label name"),
    color: z.string().regex(/^[0-9a-fA-F]{6}$/).optional().describe("New 6-char hex color"),
    description: z.string().optional().describe("New description"),
  },
  async ({ owner, repo, current_name, new_name, color, description }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const body = {};
    if (new_name) body.new_name = new_name;
    if (color) body.color = color;
    if (description !== undefined) body.description = description;
    const res = await ghFetch(`/repos/${owner}/${repo}/labels/${encodeURIComponent(current_name)}`, {
      method: "PATCH", body: JSON.stringify(body),
    });
    const data = await res.json();
    return res.ok ? ok({ id: data.id, name: data.name, color: data.color, description: data.description }) : apiError(res.status, data);
  }
);

server.tool(
  "delete_label",
  "Delete a label from a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    name: z.string().describe("Label name to delete"),
  },
  async ({ owner, repo, name }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/labels/${encodeURIComponent(name)}`, { method: "DELETE" });
    if (res.status === 204) return ok({ deleted: name });
    const data = await res.json();
    return apiError(res.status, data);
  }
);

// ─── Milestones ──────────────────────────────────────────────────────────────

server.tool(
  "create_milestone",
  "Create a milestone in a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    title: z.string().describe("Milestone title"),
    description: z.string().optional().describe("Description"),
    due_on: z.string().optional().describe("Due date (ISO 8601, e.g. 2025-12-31T00:00:00Z)"),
    state: z.enum(["open", "closed"]).optional().describe("State (default: open)"),
  },
  async ({ owner, repo, title, description, due_on, state }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/milestones`, {
      method: "POST", body: JSON.stringify({ title, description, due_on, state }),
    });
    const data = await res.json();
    return res.ok ? ok({ number: data.number, title: data.title, description: data.description, due_on: data.due_on, state: data.state, open_issues: data.open_issues, closed_issues: data.closed_issues }) : apiError(res.status, data);
  }
);

server.tool(
  "list_milestones",
  "List milestones in a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    state: z.enum(["open", "closed", "all"]).optional().describe("Filter by state"),
    sort: z.enum(["due_on", "completeness"]).optional().describe("Sort field"),
    direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ owner, repo, state, sort, direction, per_page, page }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (sort) params.set("sort", sort);
    if (direction) params.set("direction", direction);
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    const qs = params.toString();
    const res = await ghFetch(`/repos/${owner}/${repo}/milestones${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    return ok(data.map((m) => ({ number: m.number, title: m.title, description: m.description, due_on: m.due_on, state: m.state, open_issues: m.open_issues, closed_issues: m.closed_issues })));
  }
);

server.tool(
  "update_milestone",
  "Update a milestone in a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    milestone_number: z.number().describe("Milestone number"),
    title: z.string().optional().describe("New title"),
    description: z.string().optional().describe("New description"),
    due_on: z.string().optional().describe("New due date (ISO 8601)"),
    state: z.enum(["open", "closed"]).optional().describe("New state"),
  },
  async ({ owner, repo, milestone_number, title, description, due_on, state }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const body = {};
    if (title) body.title = title;
    if (description !== undefined) body.description = description;
    if (due_on) body.due_on = due_on;
    if (state) body.state = state;
    const res = await ghFetch(`/repos/${owner}/${repo}/milestones/${milestone_number}`, {
      method: "PATCH", body: JSON.stringify(body),
    });
    const data = await res.json();
    return res.ok ? ok({ number: data.number, title: data.title, description: data.description, due_on: data.due_on, state: data.state }) : apiError(res.status, data);
  }
);

server.tool(
  "delete_milestone",
  "Delete a milestone from a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    milestone_number: z.number().describe("Milestone number"),
  },
  async ({ owner, repo, milestone_number }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/milestones/${milestone_number}`, { method: "DELETE" });
    if (res.status === 204) return ok({ deleted: milestone_number });
    const data = await res.json();
    return apiError(res.status, data);
  }
);

// ─── Releases ────────────────────────────────────────────────────────────────

server.tool(
  "create_release",
  "Create a release in a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    tag_name: z.string().describe("Tag name for the release"),
    name: z.string().optional().describe("Release title"),
    body: z.string().optional().describe("Release notes (Markdown)"),
    draft: z.boolean().optional().describe("Create as draft"),
    prerelease: z.boolean().optional().describe("Mark as pre-release"),
    target_commitish: z.string().optional().describe("Branch or commit SHA (defaults to default branch)"),
    generate_release_notes: z.boolean().optional().describe("Auto-generate release notes"),
  },
  async ({ owner, repo, tag_name, name, body, draft, prerelease, target_commitish, generate_release_notes }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/releases`, {
      method: "POST",
      body: JSON.stringify({ tag_name, name, body, draft, prerelease, target_commitish, generate_release_notes }),
    });
    const data = await res.json();
    return res.ok ? ok({ id: data.id, tag_name: data.tag_name, name: data.name, draft: data.draft, prerelease: data.prerelease, html_url: data.html_url, created_at: data.created_at }) : apiError(res.status, data);
  }
);

server.tool(
  "list_releases",
  "List releases in a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ owner, repo, per_page, page }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    const qs = params.toString();
    const res = await ghFetch(`/repos/${owner}/${repo}/releases${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    return ok(data.map((r) => ({ id: r.id, tag_name: r.tag_name, name: r.name, draft: r.draft, prerelease: r.prerelease, html_url: r.html_url, created_at: r.created_at })));
  }
);

server.tool(
  "get_release",
  "Get a specific release by ID or tag",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    release_id: z.number().optional().describe("Release ID"),
    tag: z.string().optional().describe("Tag name (used if release_id not provided)"),
  },
  async ({ owner, repo, release_id, tag }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const path = release_id
      ? `/repos/${owner}/${repo}/releases/${release_id}`
      : `/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`;
    const res = await ghFetch(path);
    const data = await res.json();
    return res.ok ? ok({ id: data.id, tag_name: data.tag_name, name: data.name, body: data.body, draft: data.draft, prerelease: data.prerelease, html_url: data.html_url, created_at: data.created_at }) : apiError(res.status, data);
  }
);

server.tool(
  "delete_release",
  "Delete a release from a GitHub repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    release_id: z.number().describe("Release ID"),
  },
  async ({ owner, repo, release_id }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/releases/${release_id}`, { method: "DELETE" });
    if (res.status === 204) return ok({ deleted: release_id });
    const data = await res.json();
    return apiError(res.status, data);
  }
);

// ─── Workflows / Actions ─────────────────────────────────────────────────────

server.tool(
  "list_workflow_runs",
  "List workflow runs for a repository or specific workflow",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    workflow_id: z.string().optional().describe("Workflow ID or filename (e.g. 'ci.yml')"),
    branch: z.string().optional().describe("Filter by branch"),
    status: z.enum(["completed", "action_required", "cancelled", "failure", "neutral", "skipped", "stale", "success", "timed_out", "in_progress", "queued", "requested", "waiting", "pending"]).optional().describe("Filter by status"),
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ owner, repo, workflow_id, branch, status, per_page, page }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (branch) params.set("branch", branch);
    if (status) params.set("status", status);
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    const qs = params.toString();
    const base = workflow_id
      ? `/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflow_id)}/runs`
      : `/repos/${owner}/${repo}/actions/runs`;
    const res = await ghFetch(`${base}${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    return ok(data.workflow_runs.map((r) => ({ id: r.id, name: r.name, status: r.status, conclusion: r.conclusion, branch: r.head_branch, event: r.event, html_url: r.html_url, created_at: r.created_at })));
  }
);

server.tool(
  "get_workflow_run",
  "Get details of a specific workflow run",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    run_id: z.number().describe("Workflow run ID"),
  },
  async ({ owner, repo, run_id }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/actions/runs/${run_id}`);
    const data = await res.json();
    return res.ok ? ok({ id: data.id, name: data.name, status: data.status, conclusion: data.conclusion, branch: data.head_branch, event: data.event, html_url: data.html_url, created_at: data.created_at, updated_at: data.updated_at, run_attempt: data.run_attempt }) : apiError(res.status, data);
  }
);

server.tool(
  "trigger_workflow",
  "Trigger a workflow dispatch event",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    workflow_id: z.string().describe("Workflow ID or filename (e.g. 'deploy.yml')"),
    ref: z.string().describe("Branch or tag ref to run the workflow on"),
    inputs: z.record(z.string()).optional().describe("Input key-value pairs for the workflow"),
  },
  async ({ owner, repo, workflow_id, ref, inputs }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflow_id)}/dispatches`, {
      method: "POST", body: JSON.stringify({ ref, inputs }),
    });
    if (res.status === 204) return ok({ triggered: workflow_id, ref });
    const data = await res.json();
    return apiError(res.status, data);
  }
);

server.tool(
  "list_workflows",
  "List workflows in a repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ owner, repo, per_page, page }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    const qs = params.toString();
    const res = await ghFetch(`/repos/${owner}/${repo}/actions/workflows${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    return ok(data.workflows.map((w) => ({ id: w.id, name: w.name, path: w.path, state: w.state })));
  }
);

// ─── Gists ───────────────────────────────────────────────────────────────────

server.tool(
  "create_gist",
  "Create a new gist",
  {
    description: z.string().optional().describe("Gist description"),
    files: z.record(z.object({ content: z.string() })).describe("Files object: { 'filename.ext': { content: '...' } }"),
    public: z.boolean().optional().describe("Whether the gist is public (default: false)"),
  },
  async ({ description, files, public: isPublic }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch("/gists", {
      method: "POST", body: JSON.stringify({ description, files, public: isPublic }),
    });
    const data = await res.json();
    return res.ok ? ok({ id: data.id, html_url: data.html_url, description: data.description, public: data.public, files: Object.keys(data.files) }) : apiError(res.status, data);
  }
);

server.tool(
  "list_gists",
  "List gists for the authenticated user",
  {
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
    since: z.string().optional().describe("Only gists updated after this time (ISO 8601)"),
  },
  async ({ per_page, page, since }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    if (since) params.set("since", since);
    const qs = params.toString();
    const res = await ghFetch(`/gists${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    return ok(data.map((g) => ({ id: g.id, html_url: g.html_url, description: g.description, public: g.public, files: Object.keys(g.files), created_at: g.created_at })));
  }
);

// ─── Collaborators ───────────────────────────────────────────────────────────

server.tool(
  "list_collaborators",
  "List collaborators for a repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    affiliation: z.enum(["outside", "direct", "all"]).optional().describe("Filter by affiliation"),
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ owner, repo, affiliation, per_page, page }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (affiliation) params.set("affiliation", affiliation);
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    const qs = params.toString();
    const res = await ghFetch(`/repos/${owner}/${repo}/collaborators${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    return ok(data.map((c) => ({ login: c.login, id: c.id, role_name: c.role_name, permissions: c.permissions })));
  }
);

server.tool(
  "add_collaborator",
  "Add a collaborator to a repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    username: z.string().describe("Username to add"),
    permission: z.enum(["pull", "triage", "push", "maintain", "admin"]).optional().describe("Permission level (default: push)"),
  },
  async ({ owner, repo, username, permission }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const body = permission ? { permission } : {};
    const res = await ghFetch(`/repos/${owner}/${repo}/collaborators/${username}`, {
      method: "PUT", body: JSON.stringify(body),
    });
    if (res.status === 201) {
      const data = await res.json();
      return ok({ invited: username, invitation_id: data.id });
    }
    if (res.status === 204) return ok({ added: username, message: "Already a collaborator or invitation updated" });
    const data = await res.json();
    return apiError(res.status, data);
  }
);

server.tool(
  "remove_collaborator",
  "Remove a collaborator from a repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    username: z.string().describe("Username to remove"),
  },
  async ({ owner, repo, username }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/collaborators/${username}`, { method: "DELETE" });
    if (res.status === 204) return ok({ removed: username });
    const data = await res.json();
    return apiError(res.status, data);
  }
);

// ─── Tags ────────────────────────────────────────────────────────────────────

server.tool(
  "list_tags",
  "List tags in a repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ owner, repo, per_page, page }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    const qs = params.toString();
    const res = await ghFetch(`/repos/${owner}/${repo}/tags${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    return ok(data.map((t) => ({ name: t.name, sha: t.commit.sha })));
  }
);

server.tool(
  "create_tag",
  "Create an annotated tag object and its ref",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    tag: z.string().describe("Tag name"),
    message: z.string().describe("Tag message"),
    sha: z.string().describe("SHA of the commit to tag"),
  },
  async ({ owner, repo, tag, message, sha }) => {
    if (!GITHUB_TOKEN) return tokenError();
    // Step 1: create the tag object
    const tagRes = await ghFetch(`/repos/${owner}/${repo}/git/tags`, {
      method: "POST", body: JSON.stringify({ tag, message, object: sha, type: "commit" }),
    });
    const tagData = await tagRes.json();
    if (!tagRes.ok) return apiError(tagRes.status, tagData);
    // Step 2: create the ref pointing to the tag
    const refRes = await ghFetch(`/repos/${owner}/${repo}/git/refs`, {
      method: "POST", body: JSON.stringify({ ref: `refs/tags/${tag}`, sha: tagData.sha }),
    });
    const refData = await refRes.json();
    if (!refRes.ok) return apiError(refRes.status, refData);
    return ok({ tag: tagData.tag, sha: tagData.sha, message: tagData.message, ref: refData.ref });
  }
);

server.tool(
  "delete_tag",
  "Delete a tag from a repository",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    tag: z.string().describe("Tag name to delete"),
  },
  async ({ owner, repo, tag }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await ghFetch(`/repos/${owner}/${repo}/git/refs/tags/${encodeURIComponent(tag)}`, { method: "DELETE" });
    if (res.status === 204) return ok({ deleted: tag });
    const data = await res.json();
    return apiError(res.status, data);
  }
);

// ─── Projects (v2 GraphQL API) ───────────────────────────────────────────────

async function ghGraphQL(query, variables = {}) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, status: res.status, data };
  if (data.errors) return { ok: false, status: 200, data: { errors: data.errors } };
  return { ok: true, data: data.data };
}

function graphqlError(status, data) {
  return {
    content: [{ type: "text", text: `GitHub GraphQL error (${status}): ${JSON.stringify(data)}` }],
    isError: true,
  };
}

server.tool(
  "list_org_projects",
  "List projects (v2) for an organization",
  {
    org: z.string().describe("Organization login name"),
    first: z.number().optional().describe("Number of projects to return (max 100, default 20)"),
    after: z.string().optional().describe("Cursor for pagination"),
  },
  async ({ org, first, after }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const query = `
      query($org: String!, $first: Int!, $after: String) {
        organization(login: $org) {
          projectsV2(first: $first, after: $after) {
            nodes {
              id
              number
              title
              shortDescription
              public
              closed
              url
              createdAt
              updatedAt
            }
            pageInfo { hasNextPage endCursor }
            totalCount
          }
        }
      }`;
    const result = await ghGraphQL(query, { org, first: first || 20, after: after || null });
    if (!result.ok) return graphqlError(result.status, result.data);
    const { nodes, pageInfo, totalCount } = result.data.organization.projectsV2;
    return ok({ projects: nodes, pageInfo, totalCount });
  }
);

server.tool(
  "list_user_projects",
  "List projects (v2) for a user",
  {
    user: z.string().describe("GitHub username"),
    first: z.number().optional().describe("Number of projects to return (max 100, default 20)"),
    after: z.string().optional().describe("Cursor for pagination"),
  },
  async ({ user, first, after }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const query = `
      query($user: String!, $first: Int!, $after: String) {
        user(login: $user) {
          projectsV2(first: $first, after: $after) {
            nodes {
              id
              number
              title
              shortDescription
              public
              closed
              url
              createdAt
              updatedAt
            }
            pageInfo { hasNextPage endCursor }
            totalCount
          }
        }
      }`;
    const result = await ghGraphQL(query, { user, first: first || 20, after: after || null });
    if (!result.ok) return graphqlError(result.status, result.data);
    const { nodes, pageInfo, totalCount } = result.data.user.projectsV2;
    return ok({ projects: nodes, pageInfo, totalCount });
  }
);

server.tool(
  "get_project",
  "Get a project (v2) by owner and project number",
  {
    owner: z.string().describe("Organization or user login"),
    number: z.number().describe("Project number (from the project URL)"),
    owner_type: z.enum(["organization", "user"]).optional().describe("Owner type (default: organization)"),
  },
  async ({ owner, number, owner_type }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const type = owner_type || "organization";
    const query = `
      query($owner: String!, $number: Int!) {
        ${type}(login: $owner) {
          projectV2(number: $number) {
            id
            number
            title
            shortDescription
            readme
            public
            closed
            url
            createdAt
            updatedAt
            fields(first: 30) {
              nodes {
                ... on ProjectV2FieldCommon {
                  id
                  name
                  dataType
                }
              }
            }
          }
        }
      }`;
    const result = await ghGraphQL(query, { owner, number });
    if (!result.ok) return graphqlError(result.status, result.data);
    const project = result.data[type].projectV2;
    return ok(project);
  }
);

server.tool(
  "create_project",
  "Create a new project (v2) for an organization or user",
  {
    owner: z.string().describe("Organization or user login (owner of the new project)"),
    title: z.string().describe("Project title"),
  },
  async ({ owner, title }) => {
    if (!GITHUB_TOKEN) return tokenError();
    // First resolve the owner node ID
    const ownerQuery = `
      query($login: String!) {
        repositoryOwner(login: $login) { id }
      }`;
    const ownerResult = await ghGraphQL(ownerQuery, { login: owner });
    if (!ownerResult.ok) return graphqlError(ownerResult.status, ownerResult.data);
    const ownerId = ownerResult.data.repositoryOwner?.id;
    if (!ownerId) return graphqlError(404, { message: `Owner '${owner}' not found` });

    const mutation = `
      mutation($ownerId: ID!, $title: String!) {
        createProjectV2(input: { ownerId: $ownerId, title: $title }) {
          projectV2 {
            id
            number
            title
            url
            createdAt
          }
        }
      }`;
    const result = await ghGraphQL(mutation, { ownerId, title });
    if (!result.ok) return graphqlError(result.status, result.data);
    return ok(result.data.createProjectV2.projectV2);
  }
);

server.tool(
  "update_project",
  "Update a project (v2) settings",
  {
    project_id: z.string().describe("Project node ID (starts with PVT_)"),
    title: z.string().optional().describe("New title"),
    short_description: z.string().optional().describe("New short description"),
    readme: z.string().optional().describe("New README content (Markdown)"),
    closed: z.boolean().optional().describe("Set to true to close, false to reopen"),
    public: z.boolean().optional().describe("Set project visibility"),
  },
  async ({ project_id, title, short_description, readme, closed, public: isPublic }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const input = { projectId: project_id };
    if (title !== undefined) input.title = title;
    if (short_description !== undefined) input.shortDescription = short_description;
    if (readme !== undefined) input.readme = readme;
    if (closed !== undefined) input.closed = closed;
    if (isPublic !== undefined) input.public = isPublic;

    const mutation = `
      mutation($input: UpdateProjectV2Input!) {
        updateProjectV2(input: $input) {
          projectV2 {
            id
            number
            title
            shortDescription
            readme
            public
            closed
            url
            updatedAt
          }
        }
      }`;
    const result = await ghGraphQL(mutation, { input });
    if (!result.ok) return graphqlError(result.status, result.data);
    return ok(result.data.updateProjectV2.projectV2);
  }
);

server.tool(
  "delete_project",
  "Delete a project (v2)",
  {
    project_id: z.string().describe("Project node ID (starts with PVT_)"),
  },
  async ({ project_id }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const mutation = `
      mutation($projectId: ID!) {
        deleteProjectV2(input: { projectId: $projectId }) {
          projectV2 { id title }
        }
      }`;
    const result = await ghGraphQL(mutation, { projectId: project_id });
    if (!result.ok) return graphqlError(result.status, result.data);
    return ok({ deleted: result.data.deleteProjectV2.projectV2 });
  }
);

server.tool(
  "list_project_items",
  "List items in a project (v2)",
  {
    project_id: z.string().describe("Project node ID (starts with PVT_)"),
    first: z.number().optional().describe("Number of items to return (max 100, default 20)"),
    after: z.string().optional().describe("Cursor for pagination"),
  },
  async ({ project_id, first, after }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const query = `
      query($projectId: ID!, $first: Int!, $after: String) {
        node(id: $projectId) {
          ... on ProjectV2 {
            items(first: $first, after: $after) {
              nodes {
                id
                type
                createdAt
                updatedAt
                fieldValues(first: 10) {
                  nodes {
                    ... on ProjectV2ItemFieldTextValue { text field { ... on ProjectV2FieldCommon { name } } }
                    ... on ProjectV2ItemFieldNumberValue { number field { ... on ProjectV2FieldCommon { name } } }
                    ... on ProjectV2ItemFieldDateValue { date field { ... on ProjectV2FieldCommon { name } } }
                    ... on ProjectV2ItemFieldSingleSelectValue { name field { ... on ProjectV2FieldCommon { name } } }
                    ... on ProjectV2ItemFieldIterationValue { title startDate duration field { ... on ProjectV2FieldCommon { name } } }
                  }
                }
                content {
                  ... on Issue { number title state url }
                  ... on PullRequest { number title state url }
                  ... on DraftIssue { title body }
                }
              }
              pageInfo { hasNextPage endCursor }
              totalCount
            }
          }
        }
      }`;
    const result = await ghGraphQL(query, { projectId: project_id, first: first || 20, after: after || null });
    if (!result.ok) return graphqlError(result.status, result.data);
    const { nodes, pageInfo, totalCount } = result.data.node.items;
    return ok({ items: nodes, pageInfo, totalCount });
  }
);

server.tool(
  "add_project_item",
  "Add an issue or pull request to a project (v2)",
  {
    project_id: z.string().describe("Project node ID (starts with PVT_)"),
    content_id: z.string().describe("Node ID of the issue or pull request to add"),
  },
  async ({ project_id, content_id }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const mutation = `
      mutation($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
          item { id }
        }
      }`;
    const result = await ghGraphQL(mutation, { projectId: project_id, contentId: content_id });
    if (!result.ok) return graphqlError(result.status, result.data);
    return ok({ item_id: result.data.addProjectV2ItemById.item.id });
  }
);

server.tool(
  "add_project_draft_issue",
  "Add a draft issue to a project (v2)",
  {
    project_id: z.string().describe("Project node ID (starts with PVT_)"),
    title: z.string().describe("Draft issue title"),
    body: z.string().optional().describe("Draft issue body (Markdown)"),
  },
  async ({ project_id, title, body }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const mutation = `
      mutation($projectId: ID!, $title: String!, $body: String) {
        addProjectV2DraftIssue(input: { projectId: $projectId, title: $title, body: $body }) {
          projectItem { id }
        }
      }`;
    const result = await ghGraphQL(mutation, { projectId: project_id, title, body: body || null });
    if (!result.ok) return graphqlError(result.status, result.data);
    return ok({ item_id: result.data.addProjectV2DraftIssue.projectItem.id });
  }
);

server.tool(
  "update_project_item_field",
  "Update a field value on a project item (v2)",
  {
    project_id: z.string().describe("Project node ID (starts with PVT_)"),
    item_id: z.string().describe("Project item node ID (starts with PVTI_)"),
    field_id: z.string().describe("Field node ID (get from get_project fields)"),
    value: z.object({
      text: z.string().optional().describe("For text fields"),
      number: z.number().optional().describe("For number fields"),
      date: z.string().optional().describe("For date fields (ISO 8601, e.g. 2025-12-31)"),
      singleSelectOptionId: z.string().optional().describe("For single select fields (option ID)"),
      iterationId: z.string().optional().describe("For iteration fields (iteration ID)"),
    }).describe("Field value object — provide exactly one property matching the field type"),
  },
  async ({ project_id, item_id, field_id, value }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const mutation = `
      mutation($input: UpdateProjectV2ItemFieldValueInput!) {
        updateProjectV2ItemFieldValue(input: $input) {
          projectV2Item { id }
        }
      }`;
    const input = { projectId: project_id, itemId: item_id, fieldId: field_id, value };
    const result = await ghGraphQL(mutation, { input });
    if (!result.ok) return graphqlError(result.status, result.data);
    return ok({ item_id: result.data.updateProjectV2ItemFieldValue.projectV2Item.id });
  }
);

server.tool(
  "delete_project_item",
  "Remove an item from a project (v2)",
  {
    project_id: z.string().describe("Project node ID (starts with PVT_)"),
    item_id: z.string().describe("Project item node ID (starts with PVTI_)"),
  },
  async ({ project_id, item_id }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const mutation = `
      mutation($projectId: ID!, $itemId: ID!) {
        deleteProjectV2Item(input: { projectId: $projectId, itemId: $itemId }) {
          deletedItemId
        }
      }`;
    const result = await ghGraphQL(mutation, { projectId: project_id, itemId: item_id });
    if (!result.ok) return graphqlError(result.status, result.data);
    return ok({ deleted_item_id: result.data.deleteProjectV2Item.deletedItemId });
  }
);

// ─── Workflow Job Logs ────────────────────────────────────────────────────────

server.tool(
  "list_workflow_run_jobs",
  "List jobs for a specific workflow run",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    run_id: z.number().describe("Workflow run ID"),
    filter: z.enum(["latest", "all"]).optional().describe("Filter jobs (default: latest)"),
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ owner, repo, run_id, filter, per_page, page }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (filter) params.set("filter", filter);
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    const qs = params.toString();
    const res = await ghFetch(`/repos/${owner}/${repo}/actions/runs/${run_id}/jobs${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    return ok(data.jobs.map((j) => ({
      id: j.id,
      name: j.name,
      status: j.status,
      conclusion: j.conclusion,
      started_at: j.started_at,
      completed_at: j.completed_at,
      steps: j.steps?.map((s) => ({ name: s.name, status: s.status, conclusion: s.conclusion, number: s.number })),
    })));
  }
);

server.tool(
  "get_workflow_job_logs",
  "Get the plain-text logs for a specific workflow job",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    job_id: z.number().describe("Job ID (get from list_workflow_run_jobs)"),
  },
  async ({ owner, repo, job_id }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/jobs/${job_id}/logs`, {
      headers: HEADERS,
      redirect: "follow",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return apiError(res.status, data);
    }
    const logs = await res.text();
    // Truncate if excessively large to avoid overwhelming context
    const maxLen = 200_000;
    const truncated = logs.length > maxLen ? logs.slice(0, maxLen) + "\n\n[...truncated — log exceeded 200KB]" : logs;
    return { content: [{ type: "text", text: truncated }] };
  }
);

// ─── Issues Summary ──────────────────────────────────────────────────────────

server.tool(
  "list_issues_summary",
  "List GitHub issues returning only number, title, and labels (lightweight summary)",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    state: z.enum(["open", "closed", "all"]).optional().describe("Filter by state (default: open)"),
    labels: z.string().optional().describe("Comma-separated list of label names"),
    assignee: z.string().optional().describe("Filter by assignee username"),
    milestone: z.number().optional().describe("Filter by milestone number"),
    sort: z.enum(["created", "updated", "comments"]).optional().describe("Sort field"),
    direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    per_page: z.number().optional().describe("Results per page (max 100)"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ owner, repo, state, labels, assignee, milestone, sort, direction, per_page, page }) => {
    if (!GITHUB_TOKEN) return tokenError();
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (labels) params.set("labels", labels);
    if (assignee) params.set("assignee", assignee);
    if (milestone) params.set("milestone", String(milestone));
    if (sort) params.set("sort", sort);
    if (direction) params.set("direction", direction);
    if (per_page) params.set("per_page", String(per_page));
    if (page) params.set("page", String(page));
    const qs = params.toString();
    const res = await ghFetch(`/repos/${owner}/${repo}/issues${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    if (!res.ok) return apiError(res.status, data);
    const issues = data
      .filter((i) => !i.pull_request)
      .map((i) => ({
        number: i.number,
        title: i.title,
        labels: i.labels.map((l) => ({ name: l.name, color: l.color })),
      }));
    return ok(issues);
  }
);

// ─── Transport ───────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);

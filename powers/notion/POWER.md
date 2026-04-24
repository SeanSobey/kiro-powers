---
name: "notion"
version: "1.0.1"
displayName: "Notion"
description: "Full Notion workspace operations via MCP. Manage pages, databases, blocks, comments, users, and search across your Notion workspace from your AI assistant."
keywords: ["@notion"]
author: "Kiro Community"
---

# Notion

## Overview

Notion MCP provides comprehensive access to the Notion platform through the Model Context Protocol. It covers the full Notion API surface — pages, databases (data sources), blocks, comments, users, and search.

This power enables your AI assistant to interact with your Notion workspace without leaving your editor: create and update pages, query databases, manage block content, search across your workspace, and automate documentation workflows.

## Available Steering Files

- **databases-and-pages** — Creating, querying, and managing databases and pages with property schemas
- **blocks-and-content** — Working with block content, comments, and advanced content manipulation

## Onboarding

### Prerequisites
- A Notion account
- A Notion Internal Integration (API key)
- Docker (default) or Node.js 18+ (local fallback)

### Creating a Notion Integration

1. Go to https://www.notion.so/profile/integrations
2. Click "New integration"
3. Give it a name (e.g., "Kiro MCP")
4. Select the workspace you want to connect
5. Under "Capabilities", enable the permissions you need:
   - Read content
   - Update content
   - Insert content
   - Read comments
   - Create comments
   - Read user information
6. Click "Save" and copy the "Internal Integration Secret"

### Connecting Pages and Databases

Notion integrations don't have access to any pages by default. You must explicitly share content with your integration:

1. Open the page or database in Notion
2. Click the "..." menu in the top-right corner
3. Scroll to "Connections" and click "Connect to"
4. Search for your integration name and select it

Any child pages under a shared parent page are also accessible.

### Configuration

After installing this power, replace `YOUR_NOTION_API_KEY_HERE` in `mcp.json` with your actual integration secret.

The default config connects to Docker via Streamable HTTP. Run `docker compose up -d` from the repo root. Set your API key in `.env`. A disabled `notionApi-nodejs` entry in `mcp.json` is available for local stdio fallback.

## Common Workflows

### Search Your Workspace

```
post_search with query="meeting notes"
```

Filter to only pages:
```
post_search with query="project plan", filter={ "property": "object", "value": "page" }
```

Filter to only databases:
```
post_search with query="tasks", filter={ "property": "object", "value": "data_source" }
```

### Retrieve a Page

```
retrieve_a_page with page_id="page-uuid-here"
```

### Create a Page

Create a page inside another page:
```
post_page with parent={ "page_id": "parent-page-uuid" }, properties={ "title": [{ "text": { "content": "My New Page" } }] }
```

Create a page in a database:
```
post_page with parent={ "database_id": "database-uuid" }, properties={ "Name": { "title": [{ "text": { "content": "New Entry" } }] }, "Status": { "select": { "name": "In Progress" } } }
```

### Update Page Properties

```
patch_page with page_id="page-uuid", properties={ "Status": { "select": { "name": "Done" } } }
```

Add an icon and cover:
```
patch_page with page_id="page-uuid", icon={ "emoji": "🚀" }, cover={ "external": { "url": "https://example.com/cover.jpg" } }
```

### Archive (Delete) a Page

```
patch_page with page_id="page-uuid", archived=true
```

### Read Page Content (Blocks)

```
get_block_children with block_id="page-uuid"
```

Pages are also blocks, so you use the page ID as the block ID to get its content.

### Append Content to a Page

```
patch_block_children with block_id="page-uuid", children=[
  { "type": "paragraph", "paragraph": { "rich_text": [{ "type": "text", "text": { "content": "Hello from Kiro!" } }] } }
]
```

Add a bulleted list:
```
patch_block_children with block_id="page-uuid", children=[
  { "type": "bulleted_list_item", "bulleted_list_item": { "rich_text": [{ "type": "text", "text": { "content": "First item" } }] } },
  { "type": "bulleted_list_item", "bulleted_list_item": { "rich_text": [{ "type": "text", "text": { "content": "Second item" } }] } }
]
```

### Query a Database

```
query_data_source with data_source_id="database-uuid"
```

With filters:
```
query_data_source with data_source_id="database-uuid", filter={ "property": "Status", "select": { "equals": "In Progress" } }
```

With sorting:
```
query_data_source with data_source_id="database-uuid", sorts=[{ "property": "Created", "direction": "descending" }]
```

### Retrieve Database Schema

```
retrieve_a_database with database_id="database-uuid"
```

This returns the database properties (columns) and their types, useful for understanding the schema before querying or creating entries.

### List All Users

```
get_users
```

### Check Your Bot Identity

```
get_self
```

Returns the bot user associated with your integration token. Useful to verify authentication is working.

### Add a Comment to a Page

```
create_a_comment with parent={ "page_id": "page-uuid" }, rich_text=[{ "text": { "content": "This looks great!" } }]
```

### Retrieve Comments

```
retrieve_a_comment with block_id="page-uuid"
```

## Troubleshooting

### "Could not find ..." or 404 errors
**Cause:** The integration doesn't have access to the page or database.
**Solution:**
1. Open the page/database in Notion
2. Click "..." → "Connections" → "Connect to"
3. Select your integration
4. Retry the operation

### "Unauthorized" or 401 errors
**Cause:** API key is invalid or not set.
**Solution:**
1. Verify your integration secret at https://www.notion.so/profile/integrations
2. Ensure `OPENAPI_MCP_HEADERS` is set correctly in mcp.json
3. Check the key hasn't been rotated

### "Validation error" or 400 errors
**Cause:** Property names or types don't match the database schema.
**Solution:**
1. Retrieve the database schema first: `retrieve_a_database`
2. Check property names are exact (case-sensitive)
3. Verify property value types match the schema (select, multi_select, date, etc.)

### "Rate limited" or 429 errors
**Cause:** Too many API requests in a short period.
**Solution:** Wait a moment and retry. Notion's rate limit is approximately 3 requests per second per integration.

### Empty search results
**Cause:** Content not shared with integration, or search index delay.
**Solution:**
1. Verify the content is shared with your integration
2. Wait a few minutes for newly created content to be indexed
3. Try a broader search query

## Best Practices

- Always share pages/databases with your integration before trying to access them
- Use `retrieve_a_database` to check the schema before creating or updating entries
- Use `post_search` to find page/database IDs rather than hardcoding them
- Prefer `query_data_source` with filters over fetching all entries and filtering locally
- Use pagination (`start_cursor`) for large result sets
- Keep rich text content concise — Notion has a 2000-character limit per rich text block
- Use `get_self` to verify your integration is authenticated correctly

## MCP Config Placeholders

**`YOUR_NOTION_API_KEY_HERE`**: Your Notion Internal Integration Secret.
- **How to get it:**
  1. Go to https://www.notion.so/profile/integrations
  2. Click "New integration" (or select an existing one)
  3. Copy the "Internal Integration Secret" (starts with `ntn_` or `secret_`)
  4. Paste it into the `OPENAPI_MCP_HEADERS` value in mcp.json, replacing `YOUR_NOTION_API_KEY_HERE`

---

**Package:** `@notionhq/notion-mcp-server`
**MCP Server:** notionApi

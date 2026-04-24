---
inclusion: manual
---

# Databases and Pages

## Working with Databases

### Retrieve Database Schema

Before creating or querying entries, check the database schema:
```
retrieve_a_database with database_id="database-uuid"
```

This returns all properties with their types (title, rich_text, select, multi_select, date, number, checkbox, url, email, phone_number, formula, relation, rollup, people, files, created_time, last_edited_time, status).

### Retrieve via Data Source API

```
retrieve_a_data_source with data_source_id="database-uuid"
```

### Query with Filters

**Select property filter:**
```
query_data_source with data_source_id="database-uuid", filter={ "property": "Status", "select": { "equals": "Done" } }
```

**Checkbox filter:**
```
query_data_source with data_source_id="database-uuid", filter={ "property": "Archived", "checkbox": { "equals": true } }
```

**Date filter:**
```
query_data_source with data_source_id="database-uuid", filter={ "property": "Due Date", "date": { "on_or_before": "2025-12-31" } }
```

**Text contains filter:**
```
query_data_source with data_source_id="database-uuid", filter={ "property": "Name", "rich_text": { "contains": "meeting" } }
```

**Compound filter (AND):**
```
query_data_source with data_source_id="database-uuid", filter={
  "and": [
    { "property": "Status", "select": { "equals": "In Progress" } },
    { "property": "Priority", "select": { "equals": "High" } }
  ]
}
```

**Compound filter (OR):**
```
query_data_source with data_source_id="database-uuid", filter={
  "or": [
    { "property": "Status", "select": { "equals": "Done" } },
    { "property": "Status", "select": { "equals": "Archived" } }
  ]
}
```

### Sorting Results

**Single sort:**
```
query_data_source with data_source_id="database-uuid", sorts=[{ "property": "Created", "direction": "descending" }]
```

**Multiple sorts:**
```
query_data_source with data_source_id="database-uuid", sorts=[
  { "property": "Priority", "direction": "ascending" },
  { "property": "Due Date", "direction": "ascending" }
]
```

### Pagination

For large databases, use pagination:
```
query_data_source with data_source_id="database-uuid", page_size=10
```

If `has_more` is true in the response, use the `next_cursor`:
```
query_data_source with data_source_id="database-uuid", page_size=10, start_cursor="cursor-from-previous-response"
```

### Create a Database

Create an inline database inside a page:
```
create_a_data_source with parent={ "page_id": "parent-page-uuid" }, title=[{ "type": "text", "text": { "content": "Project Tasks" } }], properties={
  "Name": { "title": {} },
  "Status": { "select": { "options": [{ "name": "Not Started" }, { "name": "In Progress" }, { "name": "Done" }] } },
  "Priority": { "select": { "options": [{ "name": "Low" }, { "name": "Medium" }, { "name": "High" }] } },
  "Due Date": { "date": {} },
  "Assignee": { "people": {} }
}
```

### Update Database Schema

Add or modify properties:
```
update_a_data_source with data_source_id="database-uuid", properties={
  "Tags": { "multi_select": { "options": [{ "name": "Bug" }, { "name": "Feature" }, { "name": "Docs" }] } }
}
```

Update the database title:
```
update_a_data_source with data_source_id="database-uuid", title=[{ "type": "text", "text": { "content": "Updated Title" } }]
```

### List Database Templates

```
list_data_source_templates with data_source_id="database-uuid"
```

## Working with Pages

### Create a Page in a Database

Match properties to the database schema:
```
post_page with parent={ "database_id": "database-uuid" }, properties={
  "Name": { "title": [{ "text": { "content": "Fix login bug" } }] },
  "Status": { "select": { "name": "In Progress" } },
  "Priority": { "select": { "name": "High" } },
  "Due Date": { "date": { "start": "2025-06-15" } },
  "Tags": { "multi_select": [{ "name": "Bug" }] }
}
```

### Create a Standalone Page

```
post_page with parent={ "page_id": "parent-page-uuid" }, properties={
  "title": [{ "text": { "content": "Meeting Notes - Q2 Planning" } }]
}
```

### Create a Page with Content

```
post_page with parent={ "page_id": "parent-page-uuid" }, properties={
  "title": [{ "text": { "content": "Design Doc" } }]
}, children=[
  { "type": "paragraph", "paragraph": { "rich_text": [{ "type": "text", "text": { "content": "This document outlines the design for..." } }] } }
]
```

### Retrieve a Page Property

Get a specific property value:
```
retrieve_a_page_property with page_id="page-uuid", property_id="property-id"
```

The `property_id` can be found in the page object returned by `retrieve_a_page`.

### Move a Page

Move a page to a different parent:
```
move_page with page_id="page-uuid", parent={ "type": "page_id", "page_id": "new-parent-uuid" }
```

Move a page into a database:
```
move_page with page_id="page-uuid", parent={ "type": "database_id", "database_id": "database-uuid" }
```

Move a page to workspace top level:
```
move_page with page_id="page-uuid", parent={ "type": "workspace" }
```

## Common Patterns

### Task Management Workflow

1. Find the tasks database:
   ```
   post_search with query="Tasks", filter={ "property": "object", "value": "data_source" }
   ```
2. Check the schema:
   ```
   retrieve_a_database with database_id="database-uuid"
   ```
3. Query open tasks:
   ```
   query_data_source with data_source_id="database-uuid", filter={ "property": "Status", "select": { "does_not_equal": "Done" } }, sorts=[{ "property": "Priority", "direction": "ascending" }]
   ```
4. Update a task status:
   ```
   patch_page with page_id="task-page-uuid", properties={ "Status": { "select": { "name": "Done" } } }
   ```

### Documentation Sync Workflow

1. Search for the target page:
   ```
   post_search with query="API Documentation"
   ```
2. Read existing content:
   ```
   get_block_children with block_id="page-uuid"
   ```
3. Append updated content:
   ```
   patch_block_children with block_id="page-uuid", children=[
     { "type": "paragraph", "paragraph": { "rich_text": [{ "type": "text", "text": { "content": "Updated on 2025-03-18" } }] } }
   ]
   ```

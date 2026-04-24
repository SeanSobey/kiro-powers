---
inclusion: manual
---

# Blocks and Content

## Working with Blocks

Blocks are the building units of Notion content. Every piece of content — paragraphs, headings, lists, toggles, embeds — is a block. Pages themselves are also blocks.

### Retrieve a Block

```
retrieve_a_block with block_id="block-uuid"
```

### Get Block Children

```
get_block_children with block_id="block-uuid"
```

With pagination:
```
get_block_children with block_id="block-uuid", page_size=50, start_cursor="cursor-from-previous"
```

### Append Blocks to a Page or Block

**Paragraph:**
```
patch_block_children with block_id="page-uuid", children=[
  { "type": "paragraph", "paragraph": { "rich_text": [{ "type": "text", "text": { "content": "A new paragraph." } }] } }
]
```

**Bulleted list:**
```
patch_block_children with block_id="page-uuid", children=[
  { "type": "bulleted_list_item", "bulleted_list_item": { "rich_text": [{ "type": "text", "text": { "content": "Item one" } }] } },
  { "type": "bulleted_list_item", "bulleted_list_item": { "rich_text": [{ "type": "text", "text": { "content": "Item two" } }] } }
]
```

**Insert after a specific block:**
```
patch_block_children with block_id="page-uuid", after="existing-block-uuid", children=[
  { "type": "paragraph", "paragraph": { "rich_text": [{ "type": "text", "text": { "content": "Inserted after a specific block." } }] } }
]
```

### Update a Block

Update text content of an existing block:
```
update_a_block with block_id="block-uuid", type={ "paragraph": { "rich_text": [{ "type": "text", "text": { "content": "Updated text content." } }] } }
```

### Archive (Delete) a Block

```
update_a_block with block_id="block-uuid", archived=true
```

Or use the delete endpoint:
```
delete_a_block with block_id="block-uuid"
```

### Restore an Archived Block

```
update_a_block with block_id="block-uuid", archived=false
```

## Rich Text Formatting

Rich text objects support annotations for formatting:

**Plain text:**
```json
{ "type": "text", "text": { "content": "Hello world" } }
```

**With a link:**
```json
{ "type": "text", "text": { "content": "Click here", "link": { "url": "https://example.com" } } }
```

## Comments

### Add a Comment to a Page

```
create_a_comment with parent={ "page_id": "page-uuid" }, rich_text=[{ "text": { "content": "Great progress on this!" } }]
```

### Retrieve Comments on a Page

```
retrieve_a_comment with block_id="page-uuid"
```

With pagination:
```
retrieve_a_comment with block_id="page-uuid", page_size=50, start_cursor="cursor"
```

## Users

### List All Users in the Workspace

```
get_users
```

With pagination:
```
get_users with page_size=50, start_cursor="cursor"
```

### Get a Specific User

```
get_user with user_id="user-uuid"
```

### Get the Bot User (Self)

```
get_self
```

## Common Patterns

### Read and Replace Page Content

1. Get existing blocks:
   ```
   get_block_children with block_id="page-uuid"
   ```
2. Delete old blocks:
   ```
   delete_a_block with block_id="old-block-uuid"
   ```
3. Append new content:
   ```
   patch_block_children with block_id="page-uuid", children=[...]
   ```

### Build a Status Report Page

1. Create the page:
   ```
   post_page with parent={ "page_id": "reports-page-uuid" }, properties={ "title": [{ "text": { "content": "Weekly Status - March 18" } }] }
   ```
2. Add content blocks:
   ```
   patch_block_children with block_id="new-page-uuid", children=[
     { "type": "paragraph", "paragraph": { "rich_text": [{ "type": "text", "text": { "content": "Summary of this week's progress." } }] } },
     { "type": "bulleted_list_item", "bulleted_list_item": { "rich_text": [{ "type": "text", "text": { "content": "Completed feature X" } }] } },
     { "type": "bulleted_list_item", "bulleted_list_item": { "rich_text": [{ "type": "text", "text": { "content": "Started work on feature Y" } }] } }
   ]
   ```
3. Add a comment for reviewers:
   ```
   create_a_comment with parent={ "page_id": "new-page-uuid" }, rich_text=[{ "text": { "content": "Ready for review" } }]
   ```

### Audit Workspace Access

1. List all users:
   ```
   get_users
   ```
2. Check bot identity:
   ```
   get_self
   ```
3. Search for shared content:
   ```
   post_search with query=""
   ```
   An empty query returns all content the integration can access.

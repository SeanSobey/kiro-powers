---
name: "sqlite"
version: "1.0.0"
displayName: "🗃️ SQLite"
description: "SQLite database operations via MCP. Query, inspect, and manage SQLite databases with full CRUD support, schema introspection, and custom SQL execution from your AI assistant."
keywords: ["@sqlite"]
author: "Kiro Community"
---

# SQLite

## Overview

SQLite MCP provides direct access to SQLite databases through the Model Context Protocol. It supports full CRUD operations, schema introspection, custom SQL queries, and database exploration — all through a simple stdio-based server.

This power enables your AI assistant to read and write data, explore table structures, run ad-hoc queries, and manage records in any SQLite database file.

## Available Steering Files

- **query-workflows** — Common query patterns, data exploration strategies, and database management workflows

## Onboarding

### Prerequisites
- Node.js 18+ (for npx)

### Configuration

The server requires a path to your SQLite database file as an argument.

```json
{
  "mcpServers": {
    "SQLite Server": {
      "command": "npx",
      "args": ["-y", "mcp-sqlite", "/path/to/your/database.sqlite"]
    }
  }
}
```

The database file must exist. The server connects to it on startup and keeps the connection open for the session.

This power is disabled by default. Enable it in `mcp.json` and set your database path. A Docker config exists commented out in `docker-compose.yml`.

## Common Workflows

### Get Database Info

```
db_info
```

Returns the database path, file size, last modified time, and table count. Always a good starting point.

### List All Tables

```
list_tables
```

Returns all user tables in the database (excludes SQLite system tables).

### Inspect Table Schema

```
get_table_schema with tableName="users"
```

Returns column names, types, nullability, defaults, and primary key info for the specified table.

### Read Records

```
read_records with table="users"
```

With filtering:
```
read_records with table="users", conditions={"age": 30}
```

With pagination:
```
read_records with table="users", limit=10, offset=20
```

### Create a Record

```
create_record with table="users", data={"name": "Jane Doe", "email": "jane@example.com", "age": 28}
```

### Update Records

```
update_records with table="users", data={"email": "updated@example.com"}, conditions={"id": 1}
```

### Delete Records

```
delete_records with table="users", conditions={"id": 1}
```

### Run Custom SQL

```
query with sql="SELECT * FROM users WHERE age > ?", values=[25]
```

Supports parameterized queries with `?` placeholders and a values array.

### Explore Database Structure

A typical exploration flow:
1. `db_info` — get overview
2. `list_tables` — see all tables
3. `get_table_schema` for tables of interest
4. `read_records` or `query` to inspect data

## Tool Reference

| Tool | Description |
|------|-------------|
| `db_info` | Database path, size, last modified, table count |
| `list_tables` | List all user tables |
| `get_table_schema` | Column details for a specific table |
| `query` | Execute raw SQL with optional parameterized values |
| `create_record` | Insert a new row into a table |
| `read_records` | Read rows with optional conditions, limit, offset |
| `update_records` | Update rows matching conditions |
| `delete_records` | Delete rows matching conditions |

## Troubleshooting

### Database file not found
**Cause:** The path in `args` doesn't point to an existing `.sqlite` / `.db` file.
**Solution:**
1. Verify the file path is correct and absolute
2. Check the file exists on disk
3. On Windows, use forward slashes or escaped backslashes in the path

### "Table not found" errors
**Cause:** Table name is misspelled or doesn't exist.
**Solution:**
1. Run `list_tables` to see available tables
2. Table names are case-sensitive in queries

### Query returns no results
**Cause:** Conditions don't match any rows, or the table is empty.
**Solution:**
1. Run `read_records` without conditions to check if the table has data
2. Use `get_table_schema` to verify column names and types
3. Check that condition values match the column types

### Write operations fail
**Cause:** Schema constraints (NOT NULL, UNIQUE, FOREIGN KEY) are violated.
**Solution:**
1. Use `get_table_schema` to understand column constraints
2. Ensure required fields are provided in `data`
3. Check for unique constraint violations

## Best Practices

- Start with `db_info` and `list_tables` to orient yourself in an unfamiliar database
- Use `get_table_schema` before writing data to understand constraints
- Prefer parameterized queries (`?` placeholders with `values`) over string interpolation to avoid SQL injection
- Use `limit` and `offset` on `read_records` for large tables
- Use `conditions` on `update_records` and `delete_records` carefully — omitting conditions could affect all rows
- For complex joins or aggregations, use `query` with raw SQL rather than the CRUD tools

## MCP Config Placeholders

**`YOUR_SQLITE_DATABASE_PATH_HERE`**: The absolute path to your SQLite database file.
- **How to set it:** Replace with the full path to your `.sqlite` or `.db` file.
- **Examples:**
  - macOS/Linux: `/Users/yourname/data/myapp.sqlite`
  - Windows: `C:/Users/yourname/data/myapp.db`

---

**Package:** `mcp-sqlite`
**MCP Server:** SQLite Server

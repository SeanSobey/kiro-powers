---
inclusion: manual
---

# Query Workflows

## Data Exploration

When exploring an unfamiliar SQLite database, follow this sequence:

1. **Get the overview** — Use `db_info` to understand database size and table count
2. **List tables** — Use `list_tables` to see what's available
3. **Inspect schemas** — Use `get_table_schema` on key tables to understand structure
4. **Sample data** — Use `read_records` with `limit=5` to preview rows
5. **Run targeted queries** — Use `query` for joins, aggregations, or filtered searches

## Common Query Patterns

### Count rows in a table
```sql
SELECT COUNT(*) as total FROM tablename
```

### Find distinct values in a column
```sql
SELECT DISTINCT column_name FROM tablename ORDER BY column_name
```

### Join two tables
```sql
SELECT a.*, b.name FROM orders a JOIN customers b ON a.customer_id = b.id
```

### Aggregate with grouping
```sql
SELECT category, COUNT(*) as count, AVG(price) as avg_price FROM products GROUP BY category ORDER BY count DESC
```

### Search with LIKE
```sql
SELECT * FROM users WHERE name LIKE ? 
-- values: ["%john%"]
```

### Date filtering
```sql
SELECT * FROM events WHERE date(created_at) >= date('2024-01-01')
```

## Parameterized Queries

Always use `?` placeholders with the `values` array for user-provided data:

```
query with sql="SELECT * FROM users WHERE email = ? AND status = ?", values=["user@example.com", "active"]
```

This prevents SQL injection and handles type coercion correctly.

## Bulk Operations

### Insert multiple rows
Use multiple `create_record` calls, or use `query` with INSERT:
```sql
INSERT INTO logs (level, message, timestamp) VALUES (?, ?, datetime('now'))
```

### Conditional updates
```sql
UPDATE orders SET status = 'shipped' WHERE status = 'processing' AND created_at < datetime('now', '-7 days')
```

### Safe deletes
Always preview before deleting:
```sql
SELECT COUNT(*) FROM old_records WHERE created_at < '2023-01-01'
```
Then delete:
```sql
DELETE FROM old_records WHERE created_at < '2023-01-01'
```

## Schema Discovery

### List all columns across all tables
```sql
SELECT m.name as table_name, p.name as column_name, p.type 
FROM sqlite_master m 
JOIN pragma_table_info(m.name) p 
WHERE m.type = 'table' AND m.name NOT LIKE 'sqlite_%'
ORDER BY m.name, p.cid
```

### Find tables with a specific column
```sql
SELECT m.name as table_name 
FROM sqlite_master m 
JOIN pragma_table_info(m.name) p 
WHERE m.type = 'table' AND p.name = 'email'
```

### Check indexes
```sql
SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'index'
```

### Database size by table
```sql
SELECT name, SUM(pgsize) as size_bytes 
FROM dbstat 
GROUP BY name 
ORDER BY size_bytes DESC
```

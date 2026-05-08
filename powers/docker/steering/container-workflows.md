---
inclusion: manual
---

# Container Workflows

## Container Lifecycle

The typical container lifecycle follows: create/run → start → stop → remove.

### Quick Run Pattern

For most cases, use `run_container` which creates and starts in one step:

```
run_container with image="nginx:alpine", name="web", ports={"80/tcp": 8080}, detach=true
```

### Detached vs Foreground

- `detach=true` (default): Container runs in background, returns container info immediately
- `detach=false`: Waits for container to finish, returns output — useful for short-lived tasks

### Running One-Off Commands

For containers that run a command and exit:
```
run_container with image="node:20-alpine", command="node -e 'console.log(process.version)'", detach=false, auto_remove=true
```

### Container Recreation Pattern

When you need to update a container's configuration (new image, different ports, etc.):

```
recreate_container with image="my-app:v2", name="my-app", ports={"3000/tcp": 3000}
```

This atomically stops, removes, and re-runs the container. Fails if the container doesn't exist — use `run_container` for first-time creation.

## Log Inspection and Debugging

### Tailing Logs

Start with recent logs to get context:
```
fetch_container_logs with container_id="my-app", tail=50
```

If you need the full history:
```
fetch_container_logs with container_id="my-app", tail="all"
```

### Debugging a Crashed Container

1. Check if the container is still listed:
   ```
   list_containers with all=true
   ```

2. Fetch its logs to see what went wrong:
   ```
   fetch_container_logs with container_id="crashed-container", tail=100
   ```

3. Recreate with fixes or run interactively to debug.

### Filtering Containers by Label

Use labels to organize containers:
```
run_container with image="my-app:latest", name="my-app", labels={"project": "webapp", "env": "dev"}
```

Then filter:
```
list_containers with filters={"label": ["project=webapp"]}
```

## Multi-Container Patterns

### Application with Database

1. Create a network:
   ```
   create_network with name="app-net"
   ```

2. Run the database:
   ```
   run_container with image="postgres:16-alpine", name="app-db", network="app-net", environment={"POSTGRES_PASSWORD": "dev-secret", "POSTGRES_DB": "myapp"}, volumes=["app-data:/var/lib/postgresql/data"]
   ```

3. Run the application:
   ```
   run_container with image="my-app:latest", name="app-web", network="app-net", environment={"DATABASE_URL": "postgres://postgres:dev-secret@app-db:5432/myapp"}, ports={"3000/tcp": 3000}
   ```

### Cleanup Pattern

When tearing down a multi-container setup:

1. Stop and remove containers:
   ```
   remove_container with container_id="app-web", force=true
   remove_container with container_id="app-db", force=true
   ```

2. Remove the network:
   ```
   remove_network with network_id="app-net"
   ```

3. Optionally remove volumes (data loss!):
   ```
   remove_volume with volume_name="app-data", force=true
   ```

## Health Monitoring

### Quick Status Check

```
list_containers
```

Look at the status field — healthy containers show "running", unhealthy ones may show "exited" or "restarting".

### Investigating Restarts

If a container keeps restarting:
1. List with `all=true` to see exit codes
2. Fetch logs to identify the crash reason
3. Check if resource limits are being hit

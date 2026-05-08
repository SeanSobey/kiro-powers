---
inclusion: manual
---

# Infrastructure Management

## Image Management

### Building Images

Build from a directory containing a Dockerfile:
```
build_image with path="/path/to/project", tag="my-app:latest"
```

With a custom Dockerfile location:
```
build_image with path="/path/to/project", tag="my-app:prod", dockerfile="docker/Dockerfile.production"
```

### Image Tagging Strategy

- Use semantic versions for releases: `my-app:1.2.3`
- Use descriptive tags for environments: `my-app:staging`, `my-app:prod`
- Use commit SHAs for traceability: `my-app:abc1234`
- Avoid relying on `:latest` — it's mutable and can cause confusion

### Pulling Images

Pull before running to ensure you have the latest:
```
pull_image with repository="node", tag="20-alpine"
```

### Cleaning Up Images

List all images to find unused ones:
```
list_images
```

Find dangling images (untagged layers):
```
list_images with filters={"dangling": true}
```

Remove specific images:
```
remove_image with image="my-app:old-version"
```

Force remove (even if containers reference it):
```
remove_image with image="my-app:broken", force=true
```

## Network Configuration

### Network Types

- **bridge** (default): Isolated network for container-to-container communication
- **internal**: Like bridge but with no external internet access — good for databases

### Creating Networks

Standard bridge network:
```
create_network with name="frontend"
```

Internal-only network (no internet access):
```
create_network with name="db-net", internal=true
```

With labels for organization:
```
create_network with name="prod-net", labels={"environment": "production", "team": "platform"}
```

### Connecting Containers to Networks

Specify the network when running:
```
run_container with image="redis:alpine", name="cache", network="app-net"
```

Containers on the same network can reach each other by container name as hostname.

### Network Isolation Pattern

Separate frontend and backend networks so the web tier can't directly reach the database:

```
create_network with name="frontend-net"
create_network with name="backend-net", internal=true
```

- Web server: connects to `frontend-net`
- API server: connects to both `frontend-net` and `backend-net`
- Database: connects only to `backend-net`

## Volume Management

### Persistent Data

Create named volumes for data that should survive container restarts:
```
create_volume with name="postgres-data"
```

Mount when running:
```
run_container with image="postgres:16", name="db", volumes=["postgres-data:/var/lib/postgresql/data"]
```

### Bind Mounts vs Named Volumes

- **Named volumes** (`volume-name:/path`): Managed by Docker, portable, good for databases
- **Bind mounts** (`/host/path:/container/path`): Direct host filesystem access, good for development

### Volume Lifecycle

List all volumes:
```
list_volumes
```

Remove unused volumes:
```
remove_volume with volume_name="old-data"
```

Force remove (even if referenced):
```
remove_volume with volume_name="stuck-volume", force=true
```

## Resource Management

### Container Resource Limits

When creating containers, consider setting resource limits via labels or Docker Compose for production workloads. The MCP server focuses on runtime management — use Compose files for declarative resource constraints.

### Cleanup Workflow

Regular maintenance to reclaim disk space:

1. Remove stopped containers:
   ```
   list_containers with all=true
   ```
   Then remove any exited containers you no longer need.

2. Remove dangling images:
   ```
   list_images with filters={"dangling": true}
   ```
   Remove each dangling image.

3. Remove unused volumes:
   ```
   list_volumes
   ```
   Remove volumes not attached to any container.

4. Remove unused networks:
   ```
   list_networks
   ```
   Remove custom networks with no connected containers.

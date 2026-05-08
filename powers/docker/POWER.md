---
name: "docker"
version: "1.0.0"
displayName: "🐳 Docker"
description: "Manage Docker containers, images, volumes, and networks via MCP. List, create, start, stop, remove containers, build images, and inspect logs — all from your AI assistant."
keywords: ["@docker", "docker"]
author: "Sean Sobey"
---

# Docker MCP

## Overview

Docker MCP provides full Docker engine management through the Model Context Protocol. It enables your AI assistant to manage the complete container lifecycle — from building images and running containers to inspecting logs and managing networks and volumes.

This power covers everyday Docker operations: listing running containers, starting and stopping services, fetching logs for debugging, managing images, and orchestrating networks and volumes.

## Available Steering Files

- **container-workflows** — Container lifecycle management, log inspection, and debugging patterns
- **infrastructure** — Image builds, network configuration, volume management, and multi-container setups

## Onboarding

### Prerequisites
- Docker Engine installed and running (`docker --version` to verify)
- Docker socket accessible at `/var/run/docker.sock`
- The `mcp-server-docker:latest` image built locally

### Building the MCP Server Image

If you haven't built the Docker MCP server image yet:

```bash
docker build -t mcp-server-docker:latest https://github.com/ckreiling/mcp-server-docker.git
```

Or if you have the source locally:
```bash
docker build -t mcp-server-docker:latest .
```

### Configuration

The server runs as a Docker container itself, mounting the Docker socket to manage sibling containers:

```json
{
  "mcpServers": {
    "docker-mcp": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm", "--name", "kiro-mcp-docker",
        "-v", "//var/run/docker.sock:/var/run/docker.sock",
        "mcp-server-docker:latest"
      ],
      "autoApprove": ["list_containers", "fetch_container_logs"]
    }
  }
}
```

**Windows note:** The `//var/run/docker.sock` path uses double-slash for Git Bash / MSYS2 compatibility on Windows. On Linux/macOS, use `/var/run/docker.sock`.

## Common Workflows

### List Running Containers

```
list_containers
```

Show all containers (including stopped):
```
list_containers with all=true
```

### Run a Container

```
run_container with image="nginx:alpine", name="my-nginx", ports={"80/tcp": 8080}
```

With environment variables:
```
run_container with image="postgres:16", name="my-db", environment={"POSTGRES_PASSWORD": "secret"}, ports={"5432/tcp": 5432}
```

### Start / Stop / Remove Containers

**Stop a running container:**
```
stop_container with container_id="my-nginx"
```

**Start a stopped container:**
```
start_container with container_id="my-nginx"
```

**Remove a container:**
```
remove_container with container_id="my-nginx"
```

**Force remove (even if running):**
```
remove_container with container_id="my-nginx", force=true
```

### Recreate a Container

Stop, remove, and run a fresh container in one step:
```
recreate_container with image="nginx:alpine", name="my-nginx", ports={"80/tcp": 8080}
```

### Fetch Container Logs

```
fetch_container_logs with container_id="my-nginx"
```

Show last 50 lines:
```
fetch_container_logs with container_id="my-nginx", tail=50
```

Show all logs:
```
fetch_container_logs with container_id="my-nginx", tail="all"
```

### Image Management

**List images:**
```
list_images
```

**Pull an image:**
```
pull_image with repository="node", tag="20-alpine"
```

**Build an image:**
```
build_image with path="/path/to/context", tag="my-app:latest"
```

With a custom Dockerfile:
```
build_image with path="/path/to/context", tag="my-app:latest", dockerfile="docker/Dockerfile.prod"
```

**Remove an image:**
```
remove_image with image="my-app:old-tag"
```

### Network Management

**List networks:**
```
list_networks
```

**Create a network:**
```
create_network with name="my-app-network"
```

**Create an internal network (no external access):**
```
create_network with name="internal-net", internal=true
```

**Remove a network:**
```
remove_network with network_id="my-app-network"
```

### Volume Management

**List volumes:**
```
list_volumes
```

**Create a volume:**
```
create_volume with name="my-data"
```

**Remove a volume:**
```
remove_volume with volume_name="my-data"
```

**Force remove:**
```
remove_volume with volume_name="my-data", force=true
```

### Create a Container (without starting)

```
create_container with image="redis:alpine", name="my-redis", ports={"6379/tcp": 6379}
```

Then start it later:
```
start_container with container_id="my-redis"
```

## Troubleshooting

### "Cannot connect to the Docker daemon"
**Cause:** Docker socket is not accessible or Docker is not running.
**Solution:**
1. Verify Docker is running: `docker info`
2. Check socket path — on Windows with Git Bash, use `//var/run/docker.sock`
3. Ensure the Docker socket is mounted correctly in the MCP container

### "Conflict. The container name is already in use"
**Cause:** A container with the same name already exists (possibly stopped).
**Solution:**
1. List all containers: `list_containers with all=true`
2. Remove the old container: `remove_container with container_id="container-name", force=true`
3. Or use `recreate_container` which handles this automatically

### "No such image"
**Cause:** The image doesn't exist locally.
**Solution:** Pull it first: `pull_image with repository="image-name", tag="tag"`

### "Port is already allocated"
**Cause:** Another container or process is using the host port.
**Solution:**
1. Find what's using the port: `list_containers` to check other containers
2. Stop the conflicting container or choose a different host port

### MCP server container won't start
**Cause:** The `mcp-server-docker:latest` image hasn't been built.
**Solution:** Build it with: `docker build -t mcp-server-docker:latest https://github.com/ckreiling/mcp-server-docker.git`

## Best Practices

- Use meaningful container names for easy identification
- Always specify image tags explicitly (avoid `:latest` in production)
- Use `list_containers` to check state before starting/stopping
- Fetch logs with a reasonable `tail` value to avoid overwhelming output
- Clean up unused containers, images, and volumes regularly
- Use networks to isolate container groups
- Use volumes for persistent data that should survive container recreation
- Prefer `recreate_container` over manual stop/remove/run sequences

## Configuration

Default config connects to Docker via Streamable HTTP. Run `docker compose up -d` from the repo root.

A disabled `docker-mcp-nodejs` entry in `mcp.json` is available for local stdio fallback (runs the MCP server as a Docker container directly).

**Important:** The Docker MCP server needs access to the Docker socket to manage containers. The compose service mounts it automatically. For the stdio fallback, the socket is mounted via the `-v` flag in the `docker run` args.

---

**Image:** `mcp-server-docker:latest`
**Source:** [ckreiling/mcp-server-docker](https://github.com/ckreiling/mcp-server-docker)
**MCP Server:** docker-mcp


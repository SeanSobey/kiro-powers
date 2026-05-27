# Docker MCP — wraps mcp-server-docker with supergateway for HTTP transport
FROM python:3.12-slim

# Install Node.js for supergateway
RUN apt-get update && \
    apt-get install -y --no-install-recommends nodejs npm && \
    npm install -g supergateway@latest && \
    npm cache clean --force && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install mcp-server-docker Python package
RUN pip install --no-cache-dir mcp-server-docker

EXPOSE 8000

ENTRYPOINT ["supergateway", "--stdio", "mcp-server-docker", "--outputTransport", "streamableHttp", "--port", "8000", "--stateful", "--sessionTimeout", "300000", "--healthEndpoint", "/healthz"]

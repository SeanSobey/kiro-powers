# Docker MCP — wraps mcp-server-docker with supergateway for HTTP transport
FROM mcp-server-docker:latest

# Install Node.js and supergateway on top of the existing Python image
RUN apt-get update && \
    apt-get install -y --no-install-recommends nodejs npm && \
    npm install -g supergateway@latest && \
    npm cache clean --force && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

ENTRYPOINT ["supergateway", "--stdio", "mcp-server-docker", "--outputTransport", "streamableHttp", "--port", "8000", "--stateful", "--sessionTimeout", "300000", "--healthEndpoint", "/healthz"]

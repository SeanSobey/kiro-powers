FROM mcr.microsoft.com/playwright:v1.52.0-noble
WORKDIR /srv

# Install supergateway + playwright MCP
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save supergateway @playwright/mcp@latest

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

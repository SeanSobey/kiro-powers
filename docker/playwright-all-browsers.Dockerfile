FROM mcr.microsoft.com/playwright:v1.52.0-noble
WORKDIR /srv

# Install supergateway + playwright MCP
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save supergateway @playwright/mcp@0.0.73

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

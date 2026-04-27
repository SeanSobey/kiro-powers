FROM node:22-slim
WORKDIR /srv

# Install only Chromium and its system deps
RUN npx playwright install --with-deps chromium

# Install supergateway + playwright MCP
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save supergateway @playwright/mcp@latest

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

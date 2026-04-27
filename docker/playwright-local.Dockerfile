FROM node:22-slim
WORKDIR /srv

# No browser installed — connects to Chrome on the host via CDP
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save supergateway @playwright/mcp@latest

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

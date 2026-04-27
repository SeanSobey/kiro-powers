FROM node:22-slim
WORKDIR /srv
ARG MCP_PACKAGE
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save supergateway ${MCP_PACKAGE}

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

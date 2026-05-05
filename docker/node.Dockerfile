FROM node:22-slim
WORKDIR /srv
ARG MCP_PACKAGE
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save --omit=dev supergateway ${MCP_PACKAGE} && \
    npm cache clean --force && \
    rm -rf /tmp/*

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

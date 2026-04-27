FROM node:22-slim
WORKDIR /srv

# Install supergateway globally
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save supergateway

# Copy and install the local MCP server
ARG SERVER_DIR
COPY ${SERVER_DIR}/package.json ${SERVER_DIR}/package-lock.json* /app/
WORKDIR /app
RUN npm install
COPY ${SERVER_DIR}/ /app/

WORKDIR /srv

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

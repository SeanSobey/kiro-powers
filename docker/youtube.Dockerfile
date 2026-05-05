FROM node:22-slim
WORKDIR /srv

# Install youtube-mcp with a pinned compatible youtube-transcript version
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save --omit=dev supergateway @sfiorini/youtube-mcp@0.1.9 && \
    npm install --save youtube-transcript@1.2.1 && \
    npm cache clean --force && \
    rm -rf /tmp/*

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

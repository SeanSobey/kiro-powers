FROM node:22-slim
WORKDIR /srv

# Install youtube-mcp with a pinned compatible youtube-transcript version
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save supergateway @sfiorini/youtube-mcp@latest && \
    npm install --save youtube-transcript@1.2.1

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

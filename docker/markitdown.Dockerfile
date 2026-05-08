FROM node:22-slim
WORKDIR /srv

# Python + uv — single layer, clean caches
RUN apt-get update -qq && \
    apt-get install -y -qq --no-install-recommends \
      python3 python3-pip python3-venv > /dev/null 2>&1 && \
    pip3 install --break-system-packages --no-cache-dir uv && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

COPY powers/markitdown/server.py /srv/server.py

# supergateway
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save --omit=dev supergateway && \
    npm cache clean --force

RUN addgroup --system mcp && adduser --system --ingroup mcp --home /home/mcp mcp
USER mcp
ENV UV_CACHE_DIR=/home/mcp/.cache/uv

# Pre-warm uv cache as the mcp user
RUN uv run /srv/server.py --help 2>/dev/null || true

EXPOSE 8000

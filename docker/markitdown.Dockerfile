FROM node:22-slim
WORKDIR /srv

# Python + uv
RUN apt-get update -qq && \
    apt-get install -y -qq python3 python3-pip python3-venv > /dev/null 2>&1 && \
    pip3 install --break-system-packages uv && \
    rm -rf /var/lib/apt/lists/*

# Pre-install Python deps so uv doesn't fetch on every start
COPY powers/markitdown/server.py /srv/server.py
RUN uv run /srv/server.py --help 2>/dev/null || true

# supergateway
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save supergateway

EXPOSE 8000

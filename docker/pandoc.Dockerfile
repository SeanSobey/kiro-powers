FROM node:22-slim
WORKDIR /srv

# Python + uv + LaTeX (for PDF output)
RUN apt-get update -qq && \
    apt-get install -y -qq python3 python3-pip python3-venv \
    texlive-latex-base texlive-fonts-recommended > /dev/null 2>&1 && \
    pip3 install --break-system-packages uv && \
    rm -rf /var/lib/apt/lists/*

# Pre-install Python deps so uv doesn't fetch on every start
COPY powers/pandoc/server.py /srv/server.py
RUN uv run /srv/server.py --help 2>/dev/null || true

# supergateway
RUN npm init -y > /dev/null 2>&1 && \
    npm install --save supergateway

RUN addgroup --system mcp && adduser --system --ingroup mcp mcp
USER mcp
EXPOSE 8000

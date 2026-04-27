---
name: "fetch"
version: "1.0.1"
displayName: "🌐 Fetch"
description: "Fetch and extract content from URLs via MCP. Supports HTML pages, text files, and images."
keywords: ["@fetch"]
author: "Kiro Community"
---

# Fetch

## Overview

Fetch MCP provides the ability to retrieve and extract content from URLs. It supports HTML pages, text files, and images, returning content as markdown, text, or raw HTML.

## Tools

- **fetch_url** — Fetch a URL and return its content as markdown, text, or raw HTML.

## Usage

Use this power when you need to retrieve content from a web page or API endpoint.

## Configuration

Default config connects to Docker via Streamable HTTP. Run `docker compose up -d` from the repo root.

A disabled `fetch-nodejs` entry in `mcp.json` is available for local stdio fallback.

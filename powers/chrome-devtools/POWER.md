---
name: "chrome-devtools-mcp"
version: "1.0.2"
displayName: "🔧 Chrome DevTools MCP"
description: "Control Chrome from your AI assistant. Navigate pages, click elements, fill forms, take screenshots, inspect network requests, run Lighthouse audits, and trace performance."
keywords: ["@chrome-devtools"]
author: "Sean Sobey"
---

# Chrome DevTools MCP

## Overview

Chrome DevTools MCP gives your AI assistant full control over a Chrome browser instance. It can navigate pages, interact with elements (click, type, fill forms), take screenshots and accessibility snapshots, inspect network traffic and console logs, run Lighthouse audits, and record performance traces.

This is useful for testing web apps, debugging UI issues, scraping content, running accessibility audits, and automating browser-based workflows — all without leaving your editor.

## Available Steering Files

- **testing-and-debugging** — E2E testing patterns, debugging console errors, network inspection, and form testing
- **performance-and-audits** — Lighthouse audits, performance tracing, Core Web Vitals analysis, and emulation

## Onboarding

### Prerequisites
- Google Chrome or Chromium installed
- Node.js 18+ (for npx)

### How It Works

The MCP server connects to Chrome via the DevTools Protocol. Chrome needs to be running with remote debugging enabled, or the server will launch an instance for you.

### Configuration

No special configuration needed. The server handles Chrome connection automatically.

## Common Workflows

### Navigate to a Page

```
navigate_page with type="url", url="https://example.com"
```

**Navigation controls:**
```
navigate_page with type="back"
navigate_page with type="forward"
navigate_page with type="reload"
navigate_page with type="reload", ignoreCache=true
```

### Take a Snapshot (Preferred Over Screenshots)

A snapshot returns a text-based accessibility tree of the page with unique element IDs (uids). Always prefer snapshots over screenshots — they're more useful for understanding page structure.

```
take_snapshot
```

**Verbose mode (full a11y tree):**
```
take_snapshot with verbose=true
```

**Save to file:**
```
take_snapshot with filePath="snapshot.txt"
```

### Take a Screenshot

```
take_screenshot
```

**Full page:**
```
take_screenshot with fullPage=true
```

**Specific element:**
```
take_screenshot with uid="element-uid-from-snapshot"
```

**Save to file:**
```
take_screenshot with filePath="screenshot.png", format="png"
```

**JPEG with quality:**
```
take_screenshot with format="jpeg", quality=80
```

### Click an Element

First take a snapshot to get element uids, then click:

```
take_snapshot
```
Then:
```
click with uid="button-uid"
```

**Double click:**
```
click with uid="element-uid", dblClick=true
```

**Click and get updated snapshot:**
```
click with uid="button-uid", includeSnapshot=true
```

### Fill a Form Field

```
fill with uid="input-uid", value="hello@example.com"
```

**Select dropdown option:**
```
fill with uid="select-uid", value="option-value"
```

**Fill multiple fields at once:**
```
fill_form with elements=[{"uid": "name-input", "value": "John"}, {"uid": "email-input", "value": "john@example.com"}, {"uid": "role-select", "value": "admin"}]
```

### Type Text (Into Focused Input)

For inputs that need keyboard simulation rather than value setting:

```
type_text with text="search query", submitKey="Enter"
```

### Press Keys

```
press_key with key="Enter"
press_key with key="Control+A"
press_key with key="Control+Shift+R"
press_key with key="Escape"
```

### Hover

```
hover with uid="menu-item-uid"
```

### Drag and Drop

```
drag with from_uid="draggable-uid", to_uid="drop-target-uid"
```

### Upload a File

```
upload_file with uid="file-input-uid", filePath="C:/path/to/file.pdf"
```

### Handle Browser Dialogs

When an alert, confirm, or prompt dialog appears:

```
handle_dialog with action="accept"
handle_dialog with action="dismiss"
handle_dialog with action="accept", promptText="my input"
```

### Wait for Content

```
wait_for with text=["Loading complete", "Dashboard"]
```

**With timeout:**
```
wait_for with text=["Success"], timeout=10000
```

### Run JavaScript

```
evaluate_script with function="() => { return document.title; }"
```

**With element arguments:**
```
evaluate_script with function="(el) => { return el.innerText; }", args=["element-uid"]
```

**Async:**
```
evaluate_script with function="async () => { const resp = await fetch('/api/status'); return await resp.json(); }"
```

## Page Management

### List open pages
```
list_pages
```

### Open a new tab
```
new_page with url="https://example.com"
```

**Background tab:**
```
new_page with url="https://example.com", background=true
```

**Isolated context (separate cookies/storage):**
```
new_page with url="https://example.com", isolatedContext="test-session"
```

### Switch between pages
```
select_page with pageId=2, bringToFront=true
```

### Close a page
```
close_page with pageId=3
```

### Resize page
```
resize_page with width=1280, height=720
```

## Console and Network

### List console messages
```
list_console_messages
```

**Filter by type:**
```
list_console_messages with types=["error", "warn"]
```

**Get a specific message:**
```
get_console_message with msgid=5
```

### List network requests
```
list_network_requests
```

**Filter by type:**
```
list_network_requests with resourceTypes=["fetch", "xhr"]
```

**Get request details:**
```
get_network_request with reqid=12
```

**Save response to file:**
```
get_network_request with reqid=12, responseFilePath="response.json"
```

## Troubleshooting

### "Cannot connect to Chrome"
**Cause:** Chrome isn't running or remote debugging isn't enabled.
**Solution:** The MCP server should handle this automatically. If it doesn't, try restarting the MCP server from the Powers panel.

### Elements not found in snapshot
**Cause:** Page hasn't finished loading, or content is in an iframe.
**Solution:** Use `wait_for` to wait for expected content, then take a new snapshot.

### Click doesn't work
**Cause:** Element may be covered by an overlay, or the uid is stale.
**Solution:** Take a fresh snapshot, check for modals/overlays, and try clicking the correct element.

### Form fill doesn't work
**Cause:** Some inputs use custom components that don't respond to standard fill.
**Solution:** Try `type_text` instead, or use `evaluate_script` to set the value programmatically.

## Best Practices

- Always `take_snapshot` before interacting with elements — uids change between page loads
- Prefer snapshots over screenshots for understanding page structure
- Use `wait_for` after navigation or clicks that trigger page changes
- Use `fill_form` for multiple fields instead of individual `fill` calls
- Use `includeSnapshot=true` on clicks to get the updated state in one call
- Check `list_console_messages with types=["error"]` to catch JS errors
- Use `evaluate_script` as a last resort when standard tools don't work

## Configuration

No additional configuration required — works after the MCP server is installed.

The default config connects to Docker via Streamable HTTP. The container connects to Chrome on your host via CDP — launch Chrome with `--remote-debugging-port=9222`. Run `docker compose up -d` from the repo root. A disabled `chrome-devtools-nodejs` entry in `mcp.json` is available for local stdio fallback.

---

**Package:** `chrome-devtools-mcp`
**MCP Server:** chrome-devtools

---
name: "playwright"
displayName: "Playwright"
description: "Browser automation via Playwright MCP. Navigate pages, click elements, fill forms, take screenshots, capture accessibility snapshots, and run JavaScript in real browsers from your AI assistant."
keywords: ["playwright", "browser", "automation", "testing", "web", "screenshot", "e2e"]
author: "Microsoft"
---

# Playwright

## Overview

Playwright MCP provides browser automation through the Model Context Protocol. It uses Playwright's accessibility tree for fast, deterministic interactions — no vision models needed. Your AI assistant can navigate pages, click elements, fill forms, take screenshots, capture accessibility snapshots, and execute JavaScript in a real browser.

Useful for testing web apps, debugging UI issues, scraping content, and automating browser workflows without leaving your editor.

## Available Steering Files

- **browser-testing** — E2E testing patterns, form interactions, navigation workflows, and snapshot-based debugging

## Onboarding

### Prerequisites
- Node.js 18+

### How It Works

The server launches a browser instance (Chromium by default) and exposes tools for interacting with it. It operates on structured accessibility snapshots rather than screenshots, making interactions fast and LLM-friendly.

### Configuration

Default config works out of the box. Optional flags can be added to `args`:

- `--browser chromium|firefox|webkit` — choose browser engine
- `--headless` — run in headless mode
- `--port <number>` — run as SSE server instead of stdio
- `--config <path>` — path to config file


## Common Workflows

### Take an Accessibility Snapshot (Preferred)

Snapshots return a structured text representation of the page with element refs. Always prefer snapshots over screenshots — they're more useful for understanding page structure and interacting with elements.

```
browser_snapshot
```

### Navigate to a URL

```
browser_navigate with url="https://example.com"
```

Go back:
```
browser_navigate_back
```

### Click an Element

Take a snapshot first to get element refs, then click:

```
browser_snapshot
```
Then:
```
browser_click with ref="element-ref", element="Submit button"
```

### Type Text

```
browser_type with ref="input-ref", text="hello@example.com"
```

Submit after typing:
```
browser_type with ref="input-ref", text="search query", submit=true
```

### Fill a Form

```
browser_fill_form with fields=[
  {"ref": "name-ref", "name": "Name", "type": "textbox", "value": "John"},
  {"ref": "email-ref", "name": "Email", "type": "textbox", "value": "john@example.com"},
  {"ref": "role-ref", "name": "Role", "type": "combobox", "value": "Admin"}
]
```

### Select a Dropdown Option

```
browser_select_option with ref="select-ref", element="Country dropdown", values=["US"]
```

### Take a Screenshot

```
browser_take_screenshot
```

Full page:
```
browser_take_screenshot with fullPage=true
```

Specific element:
```
browser_take_screenshot with ref="element-ref", element="Hero section"
```

### Press a Key

```
browser_press_key with key="Enter"
browser_press_key with key="Control+A"
browser_press_key with key="Escape"
```

### Hover

```
browser_hover with ref="menu-ref", element="Navigation menu"
```

### Drag and Drop

```
browser_drag with startRef="drag-ref", startElement="Card", endRef="drop-ref", endElement="Target zone"
```

### Upload a File

```
browser_file_upload with paths=["/absolute/path/to/file.pdf"]
```

### Handle Dialogs

```
browser_handle_dialog with accept=true
browser_handle_dialog with accept=false
browser_handle_dialog with accept=true, promptText="my input"
```

### Wait for Content

```
browser_wait_for with text="Loading complete"
browser_wait_for with textGone="Loading..."
browser_wait_for with time=3
```

### Run JavaScript

```
browser_evaluate with function="() => document.title"
```

With element:
```
browser_evaluate with ref="element-ref", element="Target element", function="(el) => el.innerText"
```

### Console Messages

```
browser_console_messages with level="error"
```

### Network Requests

```
browser_network_requests with static=false, requestBody=false, requestHeaders=false
```

Filter by URL pattern:
```
browser_network_requests with filter="/api/.*", static=false, requestBody=true, requestHeaders=false
```

## Tab Management

### List tabs
```
browser_tabs with action="list"
```

### Open new tab
```
browser_tabs with action="new"
```

### Switch tab
```
browser_tabs with action="select", index=1
```

### Close tab
```
browser_tabs with action="close"
```

### Resize browser
```
browser_resize with width=1280, height=720
```

### Close browser
```
browser_close
```

## Troubleshooting

### Browser doesn't launch
**Cause:** Playwright browsers not installed.
**Solution:** Run `npx playwright install chromium` to install the browser binary.

### Elements not found in snapshot
**Cause:** Page hasn't finished loading or content is dynamically rendered.
**Solution:** Use `browser_wait_for` with expected text, then take a new snapshot.

### Click doesn't work
**Cause:** Element ref is stale (page changed since last snapshot).
**Solution:** Take a fresh snapshot and use the updated ref.

### Form fill doesn't work
**Cause:** Custom input components may not respond to standard fill.
**Solution:** Try `browser_type` instead, or use `browser_evaluate` to set values programmatically.

## Best Practices

- Always `browser_snapshot` before interacting with elements — refs change between page loads
- Prefer snapshots over screenshots for understanding page structure
- Use `browser_wait_for` after navigation or clicks that trigger page changes
- Use `browser_fill_form` for multiple fields instead of individual type calls
- Check `browser_console_messages with level="error"` to catch JS errors
- Use `browser_evaluate` as a last resort when standard tools don't cover your case

---

**Package:** `@playwright/mcp`
**MCP Server:** playwright

---
inclusion: manual
---

# Browser Testing with Playwright MCP

## E2E Testing Patterns

### Test a Login Flow

1. Navigate to the login page
2. Take a snapshot to find form fields
3. Fill in credentials using `browser_fill_form`
4. Click the submit button
5. Wait for the dashboard to load
6. Take a snapshot to verify the logged-in state

### Test Form Validation

1. Navigate to the form page
2. Submit the form empty to trigger validation
3. Take a snapshot to check for error messages
4. Fill in fields one by one, verifying errors clear
5. Submit the completed form and verify success

### Test Navigation

1. Navigate to the starting page
2. Click through navigation links
3. Use `browser_navigate_back` to verify history works
4. Check that URLs and page content match expectations

## Snapshot-Based Debugging

### Inspect Page State

Take a snapshot to get a structured view of the current page. This shows all interactive elements with their refs, roles, and text content — much more useful than a screenshot for understanding what's on the page.

### Check for Errors

Use `browser_console_messages with level="error"` after any interaction to catch JavaScript errors that might indicate broken functionality.

### Monitor Network

Use `browser_network_requests` to verify API calls are being made correctly. Filter with a URL pattern to focus on specific endpoints.

## Multi-Page Workflows

### Working with Tabs

Open new tabs for comparing pages side by side. Use `browser_tabs` to list, create, switch between, and close tabs.

### Handling Popups and Dialogs

If an action triggers a browser dialog (alert, confirm, prompt), use `browser_handle_dialog` to accept or dismiss it before continuing.

## Tips

- Take a snapshot after every significant action to keep refs current
- Use `browser_wait_for` liberally — async content needs time to render
- Prefer `browser_fill_form` over individual `browser_type` calls for efficiency
- Use headless mode (`--headless` flag) for CI/automated testing scenarios
- Check network requests to debug API-related issues without leaving the browser

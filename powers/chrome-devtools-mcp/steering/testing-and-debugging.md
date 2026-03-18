# Testing and Debugging

## E2E Testing Patterns

### Login flow test
1. Navigate to login page:
   ```
   navigate_page with type="url", url="http://localhost:4200/login"
   ```
2. Take snapshot to find form elements:
   ```
   take_snapshot
   ```
3. Fill credentials:
   ```
   fill_form with elements=[{"uid": "username-input", "value": "testuser"}, {"uid": "password-input", "value": "testpass"}]
   ```
4. Click login:
   ```
   click with uid="login-button", includeSnapshot=true
   ```
5. Verify redirect:
   ```
   wait_for with text=["Dashboard", "Welcome"]
   ```

### Form validation test
1. Navigate to form page
2. Take snapshot
3. Submit empty form:
   ```
   click with uid="submit-button", includeSnapshot=true
   ```
4. Check for validation messages in the snapshot
5. Fill required fields one by one, checking validation state after each

### Navigation test
1. Navigate to home page
2. Take snapshot
3. Click nav links and verify page content changes:
   ```
   click with uid="nav-link", includeSnapshot=true
   ```
4. Test back/forward:
   ```
   navigate_page with type="back"
   navigate_page with type="forward"
   ```

### Multi-page workflow test
1. Open page in isolated context for clean state:
   ```
   new_page with url="http://localhost:4200", isolatedContext="test-run-1"
   ```
2. Run through the workflow
3. Close when done:
   ```
   close_page with pageId=2
   ```

## Debugging Console Errors

### Find all JS errors on a page
1. Navigate to the page
2. Wait for it to load:
   ```
   wait_for with text=["expected content"]
   ```
3. Check for errors:
   ```
   list_console_messages with types=["error"]
   ```
4. Get details on a specific error:
   ```
   get_console_message with msgid=3
   ```

### Monitor errors during interaction
1. Take snapshot
2. Perform an action (click, fill, etc.)
3. Check console for new errors:
   ```
   list_console_messages with types=["error", "warn"]
   ```

### Check preserved messages across navigations
```
list_console_messages with includePreservedMessages=true
```

## Network Debugging

### Inspect API calls
1. Navigate to the page
2. Perform the action that triggers API calls
3. List fetch/XHR requests:
   ```
   list_network_requests with resourceTypes=["fetch", "xhr"]
   ```
4. Get request/response details:
   ```
   get_network_request with reqid=5
   ```

### Save API responses for analysis
```
get_network_request with reqid=5, responseFilePath="api-response.json"
```

### Check for failed requests
1. List all network requests:
   ```
   list_network_requests
   ```
2. Look for non-200 status codes in the results
3. Get details on failed requests:
   ```
   get_network_request with reqid=8
   ```

### Debug request payloads
```
get_network_request with reqid=5, requestFilePath="request-body.json"
```

## Responsive Testing

### Test at different viewport sizes
```
resize_page with width=375, height=812
take_snapshot
take_screenshot with filePath="mobile.png"
```

```
resize_page with width=768, height=1024
take_snapshot
take_screenshot with filePath="tablet.png"
```

```
resize_page with width=1920, height=1080
take_snapshot
take_screenshot with filePath="desktop.png"
```

### Emulate mobile device
```
emulate with viewport="375x812x3,mobile,touch"
```

### Test dark mode
```
emulate with colorScheme="dark"
take_screenshot with filePath="dark-mode.png"
```

Reset:
```
emulate with colorScheme="auto"
```

## Visual Regression Pattern

1. Navigate to the page
2. Wait for content to load
3. Take a full-page screenshot:
   ```
   take_screenshot with fullPage=true, filePath="baseline.png"
   ```
4. Make changes to the code
5. Reload:
   ```
   navigate_page with type="reload", ignoreCache=true
   ```
6. Take another screenshot:
   ```
   take_screenshot with fullPage=true, filePath="after-change.png"
   ```
7. Compare the two images

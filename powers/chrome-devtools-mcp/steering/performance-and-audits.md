# Performance and Audits

## Lighthouse Audits

Run accessibility, SEO, and best practices audits (excludes performance — use traces for that).

### Full navigation audit (desktop)
```
lighthouse_audit with mode="navigation", device="desktop"
```

### Mobile audit
```
lighthouse_audit with mode="navigation", device="mobile"
```

### Snapshot audit (current state, no reload)
```
lighthouse_audit with mode="snapshot"
```

### Save reports to a directory
```
lighthouse_audit with mode="navigation", outputDirPath="./lighthouse-reports"
```

### Audit workflow
1. Navigate to the page you want to audit:
   ```
   navigate_page with type="url", url="http://localhost:4200"
   ```
2. Run the audit:
   ```
   lighthouse_audit with mode="navigation", device="desktop", outputDirPath="./audits"
   ```
3. Review the results — focus on failing items
4. Fix issues and re-audit

## Performance Tracing

Performance traces capture detailed timing data for page loads, including Core Web Vitals (LCP, INP, CLS).

### Basic trace (auto-stop, with reload)
1. Navigate to the target page first:
   ```
   navigate_page with type="url", url="http://localhost:4200"
   ```
2. Start the trace:
   ```
   performance_start_trace
   ```
   This reloads the page and automatically stops when load is complete.

### Save trace data
```
performance_start_trace with filePath="trace.json.gz"
```

### Manual trace (for interaction recording)
1. Start trace without auto-stop:
   ```
   performance_start_trace with autoStop=false, reload=false
   ```
2. Perform interactions (click, navigate, etc.)
3. Stop the trace:
   ```
   performance_stop_trace with filePath="interaction-trace.json"
   ```

### Analyze performance insights
After a trace completes, you'll get insight sets. Drill into specific insights:

```
performance_analyze_insight with insightSetId="insight-set-id", insightName="LCPBreakdown"
```

Common insight names:
- `DocumentLatency` — Document request timing
- `LCPBreakdown` — Largest Contentful Paint breakdown
- `CLSBreakdown` — Cumulative Layout Shift analysis
- `RenderBlocking` — Render-blocking resources
- `ThirdParties` — Third-party script impact

## Emulation for Testing

### Throttle CPU (simulate slow device)
```
emulate with cpuThrottlingRate=4
```

Reset:
```
emulate with cpuThrottlingRate=1
```

### Throttle network
```
emulate with networkConditions="Slow 3G"
```

Options: `Offline`, `Slow 3G`, `Fast 3G`, `Slow 4G`, `Fast 4G`

### Emulate geolocation
```
emulate with geolocation="37.7749x-122.4194"
```

### Custom user agent
```
emulate with userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)"
```

Reset:
```
emulate with userAgent=""
```

### Mobile viewport
```
emulate with viewport="390x844x3,mobile,touch"
```

### Landscape mode
```
emulate with viewport="844x390x3,mobile,touch,landscape"
```

## Memory Debugging

### Take a heap snapshot
```
take_memory_snapshot with filePath="heap.heapsnapshot"
```

### Memory leak detection pattern
1. Navigate to the page
2. Take baseline snapshot:
   ```
   take_memory_snapshot with filePath="before.heapsnapshot"
   ```
3. Perform the suspected leaking action multiple times
4. Take another snapshot:
   ```
   take_memory_snapshot with filePath="after.heapsnapshot"
   ```
5. Compare the two snapshots (open in Chrome DevTools)

## Performance Audit Workflow

### Full performance check
1. Set up emulation for target conditions:
   ```
   emulate with cpuThrottlingRate=4, networkConditions="Fast 3G"
   ```
2. Navigate to the page:
   ```
   navigate_page with type="url", url="http://localhost:4200"
   ```
3. Run performance trace:
   ```
   performance_start_trace with filePath="perf-trace.json.gz"
   ```
4. Analyze insights from the trace results
5. Run Lighthouse for non-performance metrics:
   ```
   lighthouse_audit with mode="navigation", outputDirPath="./audits"
   ```
6. Reset emulation:
   ```
   emulate with cpuThrottlingRate=1
   ```

### Before/after comparison
1. Trace the current state:
   ```
   performance_start_trace with filePath="before.json.gz"
   ```
2. Make your optimizations
3. Trace again:
   ```
   navigate_page with type="url", url="http://localhost:4200"
   performance_start_trace with filePath="after.json.gz"
   ```
4. Compare the insight results

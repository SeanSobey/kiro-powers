---
name: "chart"
displayName: "Chart Generator"
description: "Generate charts using Chart.js via MCP. Create bar, line, pie, doughnut, radar, scatter, and bubble charts as PNG images, interactive HTML, or raw JSON config."
keywords: ["chart", "chartjs", "visualization", "graph", "diagram"]
author: "Kiro Community"
---

# Chart Generator

## Overview

Chart Generator MCP creates charts using Chart.js v4 through the Model Context Protocol. It supports all major chart types and can output static PNG images, interactive HTML divs, or raw JSON config for client-side rendering.

This power is useful for visualizing data from reports, creating dashboards, generating charts for documentation, and producing quick data visualizations without leaving your editor.

## Onboarding

### Prerequisites
- Node.js 18+ (for npx)

### Configuration
No API keys or credentials required. Works out of the box after installation.

## Common Workflows

### Bar Chart

```
generateChart with chartConfig={
  "type": "bar",
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
    "datasets": [{
      "label": "Revenue",
      "data": [12000, 19000, 15000, 22000, 18000],
      "backgroundColor": ["#4dc9f6", "#f67019", "#f53794", "#537bc4", "#acc236"]
    }]
  },
  "options": { "plugins": { "title": { "display": true, "text": "Monthly Revenue" } } }
}, outputFormat="png"
```

### Line Chart

```
generateChart with chartConfig={
  "type": "line",
  "data": {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "datasets": [{
      "label": "Requests",
      "data": [150, 230, 180, 290, 210],
      "borderColor": "#4dc9f6",
      "fill": false
    }]
  }
}, outputFormat="png"
```

### Multi-Line Chart

```
generateChart with chartConfig={
  "type": "line",
  "data": {
    "labels": ["Q1", "Q2", "Q3", "Q4"],
    "datasets": [
      { "label": "2024", "data": [30, 45, 60, 50], "borderColor": "#f67019" },
      { "label": "2025", "data": [40, 55, 70, 65], "borderColor": "#4dc9f6" }
    ]
  }
}, outputFormat="png"
```

### Pie Chart

```
generateChart with chartConfig={
  "type": "pie",
  "data": {
    "labels": ["Desktop", "Mobile", "Tablet"],
    "datasets": [{
      "data": [55, 35, 10],
      "backgroundColor": ["#4dc9f6", "#f67019", "#f53794"]
    }]
  }
}, outputFormat="png"
```

### Doughnut Chart

```
generateChart with chartConfig={
  "type": "doughnut",
  "data": {
    "labels": ["Completed", "In Progress", "Not Started"],
    "datasets": [{
      "data": [45, 30, 25],
      "backgroundColor": ["#acc236", "#f67019", "#f53794"]
    }]
  }
}, outputFormat="png"
```

### Radar Chart

```
generateChart with chartConfig={
  "type": "radar",
  "data": {
    "labels": ["Speed", "Reliability", "Comfort", "Safety", "Efficiency"],
    "datasets": [
      { "label": "Product A", "data": [80, 90, 70, 85, 75], "borderColor": "#4dc9f6" },
      { "label": "Product B", "data": [70, 80, 90, 75, 85], "borderColor": "#f67019" }
    ]
  }
}, outputFormat="png"
```

### Scatter Plot

```
generateChart with chartConfig={
  "type": "scatter",
  "data": {
    "datasets": [{
      "label": "Data Points",
      "data": [
        { "x": 10, "y": 20 }, { "x": 15, "y": 25 },
        { "x": 20, "y": 30 }, { "x": 25, "y": 22 },
        { "x": 30, "y": 35 }
      ],
      "backgroundColor": "#4dc9f6"
    }]
  }
}, outputFormat="png"
```

### Save Chart to File

```
generateChart with chartConfig={
  "type": "bar",
  "data": {
    "labels": ["A", "B", "C"],
    "datasets": [{ "label": "Values", "data": [10, 20, 30] }]
  }
}, outputFormat="png", saveToFile=true
```

### Interactive HTML Output

```
generateChart with chartConfig={
  "type": "line",
  "data": {
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [{ "label": "Sales", "data": [100, 200, 150] }]
  }
}, outputFormat="html"
```

### Raw JSON Config (for Client-Side Rendering)

```
generateChart with chartConfig={
  "type": "bar",
  "data": {
    "labels": ["X", "Y", "Z"],
    "datasets": [{ "label": "Count", "data": [5, 10, 15] }]
  }
}, outputFormat="json"
```

## Chart.js Configuration Reference

### Output Formats

| Format | Description | Use Case |
|--------|-------------|----------|
| `png` | Static PNG image | Documentation, reports, embedding |
| `html` | Interactive HTML div | Dashboards, web pages |
| `json` | Raw Chart.js config object | Client-side rendering |

### Supported Chart Types

| Type | Description |
|------|-------------|
| `bar` | Vertical or horizontal bar chart |
| `line` | Line chart with optional fill |
| `pie` | Pie chart |
| `doughnut` | Doughnut chart |
| `radar` | Radar/spider chart |
| `scatter` | Scatter plot (x/y data points) |
| `bubble` | Bubble chart (x/y/r data points) |
| `polarArea` | Polar area chart |

### Common Options

```json
{
  "options": {
    "responsive": true,
    "plugins": {
      "title": { "display": true, "text": "Chart Title" },
      "legend": { "position": "top" }
    },
    "scales": {
      "y": { "beginAtZero": true, "title": { "display": true, "text": "Y Axis" } },
      "x": { "title": { "display": true, "text": "X Axis" } }
    }
  }
}
```

## Troubleshooting

### Chart renders blank or empty
**Cause:** Data arrays are empty or labels don't match data length.
**Solution:**
1. Ensure `labels` array length matches `data` array length
2. Verify data values are numbers, not strings
3. Check that `datasets` is a non-empty array

### Colors not showing
**Cause:** Missing `backgroundColor` or `borderColor` properties.
**Solution:** Add color properties to your dataset. Use hex codes (`#4dc9f6`), RGB (`rgb(77, 201, 246)`), or named colors.

### Chart type not recognized
**Cause:** Typo in the `type` field.
**Solution:** Use one of: `bar`, `line`, `pie`, `doughnut`, `radar`, `scatter`, `bubble`, `polarArea`.

### PNG not saving
**Cause:** `saveToFile` not set to `true`.
**Solution:** Add `saveToFile=true` to the call. Only applies when `outputFormat="png"`.

## Best Practices

- Use `png` format for static documentation and reports
- Use `html` format when you need interactive hover/click behavior
- Use `json` format when embedding charts in your own web application
- Keep datasets to 5-7 items for readability in pie/doughnut charts
- Use consistent color schemes across related charts
- Always add a title and axis labels for clarity
- Use `beginAtZero: true` on the y-axis for bar charts to avoid misleading visuals

---

**Package:** `@ax-crew/chartjs-mcp-server`
**MCP Server:** chart

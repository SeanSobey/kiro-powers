---
inclusion: manual
---

# Context7 Workflows

## Common Documentation Lookups

### Framework Documentation
```
resolve-library-id with libraryName="next.js"
get-library-docs with context7CompatibleLibraryID="/vercel/next.js", topic="app router middleware"
```

### UI Library Documentation
```
resolve-library-id with libraryName="react"
get-library-docs with context7CompatibleLibraryID="/facebook/react", topic="useEffect cleanup function"
```

### Utility Library Documentation
```
resolve-library-id with libraryName="rxjs"
get-library-docs with context7CompatibleLibraryID="/reactivex/rxjs", topic="switchMap vs mergeMap operators"
```

## Advanced Patterns

### Chaining Multiple Queries

When researching a complex topic, chain queries to build understanding:

1. Start broad — get an overview of the feature area
2. Narrow down — query specific APIs or patterns
3. Get examples — ask for implementation examples

**Example: Setting up SSR with Next.js**
```
# Step 1: Overview
get-library-docs topic="server side rendering setup"

# Step 2: Specific API
get-library-docs topic="getServerSideProps and data fetching"

# Step 3: Examples
get-library-docs topic="SSR with dynamic routes example"
```

### Migration Guides

Context7 is great for finding migration patterns between versions:

```
get-library-docs topic="migrate from pages router to app router"
get-library-docs topic="migrate from CommonJS to ESM"
```

### Finding Alternatives

When evaluating packages, query each candidate:

```
# Option A
resolve-library-id with libraryName="date-fns"
get-library-docs topic="format and parse dates with timezone"

# Option B
resolve-library-id with libraryName="dayjs"
get-library-docs topic="format and parse dates with timezone"

# Option C
resolve-library-id with libraryName="luxon"
get-library-docs topic="format and parse dates with timezone"
```

## Workflow: Debug with Current Docs

When you hit an error with a library:

1. Identify the library and version from `package.json`
2. Resolve the library ID
3. Query with the error message or problematic API
4. Compare your usage against the current docs

```
resolve-library-id with libraryName="cypress"
get-library-docs topic="cy.intercept not matching requests troubleshooting"
```

## Workflow: Evaluate a New Dependency

Before adding a new package:

1. Search for it on Context7
2. Check the snippet count and reputation
3. Query for setup/installation docs
4. Query for your specific use case
5. Check bundle size (use npm power if available)

```
resolve-library-id with libraryName="zod"
get-library-docs topic="basic schema validation setup with TypeScript"
get-library-docs topic="form validation with zod"
```

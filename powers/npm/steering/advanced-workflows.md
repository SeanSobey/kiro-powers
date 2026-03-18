# Advanced npm Workflows

## Workspaces (Monorepo)

npm workspaces let you manage multiple packages in a single repository.

### Setup
In root `package.json`:
```json
{
  "name": "my-monorepo",
  "workspaces": ["packages/*"]
}
```

### Install all workspace dependencies
```bash
npm install
```

### Run a script in a specific workspace
```bash
npm run build --workspace=packages/shared
```

### Run a script across all workspaces
```bash
npm run test --workspaces
```

### Add a dependency to a specific workspace
```bash
npm install lodash --workspace=packages/api
```

### Add a workspace as a dependency of another
```bash
npm install packages/shared --workspace=packages/api
```

### List workspaces
```bash
npm ls --workspaces --depth=0
```

## Publishing Packages

### Prepare for publishing
1. Set up `package.json`:
   ```json
   {
     "name": "@scope/my-package",
     "version": "1.0.0",
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "files": ["dist"],
     "publishConfig": {
       "access": "public"
     }
   }
   ```
2. Add a `.npmignore` or use the `files` field to control what gets published.

### Login to npm
```bash
npm login
```

### Dry run (see what would be published)
```bash
npm publish --dry-run
```

### Publish
```bash
npm publish
```

### Publish a scoped package publicly
```bash
npm publish --access public
```

### Version bumping
```bash
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```

This updates `package.json`, creates a git commit, and tags it.

### Unpublish (within 72 hours)
```bash
npm unpublish @scope/my-package@1.0.0
```

### Deprecate a version
```bash
npm deprecate @scope/my-package@1.0.0 "Use v2 instead"
```

## Linking (Local Development)

### Link a local package globally
In the package directory:
```bash
npm link
```

### Use the linked package in another project
In the consuming project:
```bash
npm link my-package
```

### Unlink
```bash
npm unlink my-package
```

## Cache Management

### Verify cache integrity
```bash
npm cache verify
```

### Clean cache
```bash
npm cache clean --force
```

### View cache location
```bash
npm config get cache
```

## Configuration

### View all config
```bash
npm config list
```

### Set a config value
```bash
npm config set init-author-name "Sean Sobey"
npm config set init-license "MIT"
```

### Use a custom registry
```bash
npm config set registry https://registry.npmjs.org/
```

### Project-level config (.npmrc)
Create `.npmrc` in project root:
```
save-exact=true
engine-strict=true
```

## npx (Run Without Installing)

### Run a package without installing
```bash
npx create-react-app my-app
npx ts-node script.ts
npx eslint .
```

### Run a specific version
```bash
npx typescript@5.0 tsc --version
```

### Run from a GitHub repo
```bash
npx github:user/repo
```

## CI/CD Patterns

### Deterministic installs
```bash
npm ci
```

### Cache node_modules in CI
Most CI systems support caching `~/.npm` (the npm cache directory) between runs.

### Audit in CI (fail on vulnerabilities)
```bash
npm audit --audit-level=high
```

### Publish from CI
```bash
# Set token via environment variable
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
npm publish
```

## Dependency Management

### Check for outdated packages
```bash
npm outdated
```

### Update to latest (ignoring semver ranges)
```bash
npx npm-check-updates -u
npm install
```

### Find why a package is installed
```bash
npm explain lodash
```

### Find duplicate packages
```bash
npm dedupe
```

### Prune unused packages
```bash
npm prune
```

## Lock File Management

### Regenerate lock file
```bash
rm package-lock.json
npm install
```

### Resolve lock file conflicts after merge
```bash
npm install --package-lock-only
```

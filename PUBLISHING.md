# Publishing to npm

## Prerequisites

- npm account (`npm login`)
- All tests passing (`bun run test`)
- TypeScript compiles (`bun run typecheck`)

## Setup (one-time)

### 1. Create `tsconfig.build.json`

Extends your main tsconfig but enables emit:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "lib",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "lib", "example", "**/__tests__/**", "**/*.test.*"]
}
```

### 2. Update `package.json`

**Entry points** — point to compiled output, not raw source:

```json
{
  "main": "lib/index.js",
  "module": "lib/index.js",
  "types": "lib/index.d.ts",
  "source": "src/index.ts"
}
```

**Files whitelist** — only ship what consumers need:

```json
{
  "files": ["src", "lib", "!**/__tests__", "!**/__mocks__", "!**/*.test.*"]
}
```

**Metadata** — npm uses these for the package page:

```json
{
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/you/your-repo.git"
  },
  "homepage": "https://github.com/you/your-repo#readme",
  "bugs": {
    "url": "https://github.com/you/your-repo/issues"
  }
}
```

**Prepublish guard** — auto-builds before every publish:

```json
{
  "scripts": {
    "build": "tsc --project tsconfig.build.json",
    "prepublishOnly": "rm -rf lib && bun run build"
  }
}
```

### 3. Add `.npmignore`

Excludes dev files that `files` doesn't catch:

```
tsconfig*.json
biome.json
babel.config.js
jest.config.js
.gitignore
example/
**/__tests__/
**/*.test.*
coverage/
.github/
assets/
bun.lock
.DS_Store
```

### 4. Add `lib/` to `.gitignore`

Build output shouldn't be committed:

```
lib/
```

## Publish checklist

```bash
# 1. Make sure tests pass
bun run test

# 2. Make sure it compiles
bun run typecheck

# 3. Build and inspect the package contents
bun run build
npm pack --dry-run

# 4. Verify: no test files, no example app, no config files

# 5. Login (skip if already logged in)
npm login

# 6. Publish
npm publish

# 7. Verify it's live
npm info your-package-name
```

## Publishing updates

```bash
# 1. Bump version (pick one)
npm version patch   # 0.1.0 -> 0.1.1 (bug fixes)
npm version minor   # 0.1.0 -> 0.2.0 (new features, backwards compatible)
npm version major   # 0.1.0 -> 1.0.0 (breaking changes)
# This creates a git commit and tag automatically

# 2. Verify
bun run test && bun run typecheck

# 3. Preview the package
npm pack --dry-run

# 4. Publish
npm publish

# 5. Push the version commit and tag
git push && git push --tags
```

Or if you already bumped the version manually in `package.json`:

```bash
bun run test && bun run typecheck
npm pack --dry-run
npm publish
git tag v$(node -p "require('./package.json').version")
git push && git push --tags
```

## Common gotchas

- **Test files in package**: Use `!**/__tests__` in `files` array — `.npmignore` alone won't exclude files whitelisted by `files`
- **Forgot to build**: The `prepublishOnly` script handles this, but always verify with `npm pack --dry-run`
- **Path aliases (`@/*`)**: These won't resolve in compiled output. Use relative imports in source, or use a build tool that resolves them. TypeScript's `paths` only works at compile time for type checking
- **Unpublish window**: You have 72 hours to unpublish a version. After that, you can only deprecate it

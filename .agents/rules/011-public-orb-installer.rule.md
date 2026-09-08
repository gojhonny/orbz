---
description: Scopes the published Orb binary, npx project setup, package-manager detection, runtime payload, and consumer-install safety boundaries.
globs:
  - "package.json"
  - "cli/**"
  - "README.md"
---
# Rule 011: Public Orb installer

- Effective: 2026-09-04
- Priority: High
- Applies: `package.json`, `cli/**`, release documentation, and npm payload

1. The package exposes exactly one binary named `orb`, implemented with POSIX shell.
2. The canonical npx form is `npx --package=@neongate-ai/orbz@latest orb`; it performs consumer project setup, not repository engineering operations, and does not depend on binary-name inference.
3. Consumer setup requires an existing `package.json`, installs Orbz into `dependencies`, and never overwrites application source files.
4. Detect npm, pnpm, yarn, or bun from explicit input, `packageManager`, lockfiles, then npm as the fallback.
5. Install the same Orbz version that supplied the running CLI unless an explicit package specifier is provided.
6. Do not trigger consumer setup through `preinstall`, `install`, `postinstall`, or `prepare`.
7. Repository-only commands must reject execution when the CLI is running from the published package.
8. Package scripts must not duplicate Orb commands. Keep only the setup bridge and npm lifecycle gates.
9. `prepack` must delegate to `./cli/orb check`.
10. `dist/`, `cli/`, and npm's standard root metadata are the only intentional package payload.
11. Documentation must state that npx execution is transient; after installation,
    consumers use the project-local `orb` binary through their package manager
    rather than assuming a global launcher exists.

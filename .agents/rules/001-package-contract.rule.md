---
description: Defines the immutable package, publishing, framework-agnostic, SSR-safe, and public compatibility boundaries for Orbz.
alwaysApply: true
---
# Rule 001: Package contract

- Effective: 2026-08-21
- Priority: Critical
- Applies: Always

1. `@gojhonny/orbz` is a library, not an application or monorepo.
2. Keep the package framework-agnostic and SSR-safe.
3. Keep `<orb-z>` as the only runtime UI implementation.
4. `@gojhonny/orbz/browser` owns registration side effects.
5. `react-types` is type-only and must not add a React runtime dependency.
6. Provider secrets belong to consuming applications.
7. Intentional npm payload is limited to `dist/`, the shell-only `cli/`, and npm root metadata.
8. Do not publish source maps.
9. Treat every public export, attribute, property, method, event, and entry point as a compatibility commitment.
10. Documentation sites and framework examples live outside this repository.

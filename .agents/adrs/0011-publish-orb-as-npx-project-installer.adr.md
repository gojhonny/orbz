# ADR-0011: Publish Orb as an explicit npx project installer

- Status: Accepted
- Created: 2026-09-04
- Updated: 2026-09-08
- Mode: Current decision

## Context

Repository commands were duplicated between `package.json#scripts` and the Orb
CLI. That produced divergent command paths, including a broken `prepack` call to
a removed `check` script. Consumers also need a one-command way to add Orbz to
an existing project without turning package installation into an implicit setup
lifecycle.

## Decision

Orb is the canonical command surface for repository operations. Keep only the
human-facing `setup` bridge and required npm lifecycle gates in
`package.json#scripts`; `prepack` delegates directly to `./cli/orb check`.

Publish `cli/orb` as the package's single `orb` binary and include `cli/` in the
intentional npm payload. When that binary runs outside an Orbz source checkout
with no arguments, it performs explicit consumer project setup:

1. require an existing target `package.json`;
2. detect npm, pnpm, yarn, or bun from package metadata and lockfiles;
3. add the executing Orbz version to project dependencies;
4. print a framework-neutral registration example;
5. never generate or overwrite application source files.

Do not use `postinstall` or another dependency-install lifecycle to trigger this
behavior. Repository-only commands reject execution from the distributed npm
package. `npx` is transient and does not promise a global `orb` command; after
local installation, consumers invoke the package binary through their package
manager (`pnpm exec orb`, `npm exec -- orb`, or an equivalent local-bin runner).

## Consequences

`npx -y --package=@neongate-ai/orbz@latest orb` is the canonical consumer
invocation: it explicitly selects the published `orb` binary, fetches the
temporary installer, and adds Orbz to the current project. The published payload intentionally includes shell
CLI files in addition to runtime distribution files. POSIX shell is required for
the CLI, while the Web Component package remains framework-agnostic.

ADR-0018 restores the existing published identity `@neongate-ai/orbz` after
ADR-0017's proposed npm migration, without changing this explicit installer
architecture. GitHub ownership remains `gojhonny/orbz`.

## Evidence

- `package.json#bin`
- `package.json#files`
- `package.json#scripts`
- `cli/orb`
- `cli/src/commands/setup-project.sh`
- `.github/workflows/ci.yml`

## Related records

- ADR-0005, ADR-0007, ADR-0010, ADR-0017, and ADR-0018
- SPEC-014, SPEC-026, and SPEC-027
- Rules 001, 008, and 011

# SPEC-026: Repair cleanup and migrate Orbz ownership

- Status: Implemented
- Created: 2026-09-08
- Updated: 2026-09-08
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

`orb cleanup` leaves dependencies installed unless `--dependencies` is passed,
only cleans named output directories at the checkout root, and can delete
tracked files. The supplied reference CLI demonstrates default dependency
cleanup, recursive generated-state discovery and tracked-path protection.
Repository metadata, installer commands, the default palette name and release
automation still point at the previous owner instead of `gojhonny`.

## Scope

Start from remote `staging` at `c8ab15be7e423026f2af22abf4e1259a49206519`.
Use the uploaded archive only as reference. Change the existing Orb CLI, package
identity, relevant runtime names, README, release configuration and harness.
Do not copy the reference CLI into the repository. Open one PR against `staging`;
do not merge, change the version, create a release tag or publish to npm.

## Requirements

1. Plain `orb cleanup` and its `clean` alias remove untracked root and nested
   `node_modules`, generated output directories (`dist`, `coverage`, `.vitest`,
   `.cache`, `build`, `out`), build metadata and package archives. Keep
   `--dependencies` as a compatibility option, and provide `--keep-dependencies`
   for output-only cleanup and `--dry-run` for a non-mutating preview.
2. Protect Git metadata (including nested repositories), `.agents`, `.audits`,
   source and assets; dependency-owned source/assets inside `node_modules` are
   generated state. Never remove a target containing Git-tracked paths. Never
   follow directory symlinks or remove their external targets. Cleanup must
   work from arbitrary working directories and paths containing spaces, remain
   idempotent, validate options before mutation and report removal failures.
3. Keep cleanup dependency-free POSIX shell except Git for tracked-path safety;
   do not require Node, pnpm or installed dependencies. Retain published-package
   repository guards. Do not import application-specific commands.
4. Replace previous-owner references across tracked text and filenames with
   `gojhonny`, including `@gojhonny/orbz`, repository and issue URLs, author,
   license, install examples, release workflow and the default `gojhonny` preset.
   Preserve palette values and all unrelated visual, speech and SSR behavior.
5. Update README and active harness guidance to describe current configuration,
   cleanup semantics and ownership. Record migration compatibility explicitly;
   update deterministic audits to enforce the behavior and package identity.
6. Validate the default-cleanup failure against the old implementation before
   the fix, then run focused regression audits, `./cli/orb check`, explicit
   harness scoring and an npm payload inspection.

## Acceptance criteria

- [x] Default and nested cleanup remove dependencies and generated state.
- [x] Protected/tracked paths, symlink destinations, dry runs and invalid options
  remain safe; legacy and output-only options behave as documented.
- [x] The published binary rejects repository cleanup and installs the new scope.
- [x] Tracked source, metadata, docs and automation use the new owner consistently.
- [x] The renamed preset keeps the same colors and public types match runtime.
- [x] README, harness and package payload match the implementation; gates pass.
- [x] The reference ZIP is unchanged and the reference CLI is absent from the repository.

## Evidence

- Initial source comparison confirmed the dependency opt-in and missing tracked
  protection in `cli/src/commands/cleanup.sh`.
- Initial `./cli/orb harness .`: L4, 100/108 (93%). Dimensions: Context 17/20,
  Skills 15/17, Hooks 14/14, Sensors 20/20, CI 14/14, Hygiene 20/23.
- The new cleanup fixture audit failed against the previous implementation with
  nine failures, including retained root/nested dependencies, missed nested
  output, deleted protected/tracked state and unsupported preview/output-only
  options. Git-index failure and minimal-tool cleanup scenarios also failed.
- On 2026-09-08, `.audits/cleanup.audit.sh` passed all 18 fixture checks after
  the fix. It covers default and nested removal, spaces/globs/newlines, tracked
  and protected state, nested repositories/worktrees, symlinks, idempotency,
  dry runs, option conflicts in both orders, dependency preservation (including
  under output directories), aliases, removal exit status 23, corrupt Git index,
  minimal tools without Node/pnpm, and published-package rejection.
- `.audits/ownership.audit.sh` passed metadata, release identity, repository text
  and filename scans, preset consistency, offline installation of the executing
  package version, preserved consumer source, and invalid-installation guards.
- `./cli/orb check` passed with Node 24.19.0 and pnpm 10.32.1: lint, source/test
  type checks, 47 tests in 19 suites, both builds, SemVer and all ten audits.
  The existing optional-chain lint warning in the unchanged configuration clone
  module remains; it does not fail the gate.
- `npm pack --dry-run --json` passed its full prepack gate; all 41 payload entries
  are `dist/`, `cli/` or standard root metadata. No source maps, harness files,
  reference code or dependencies enter the package.
- Final explicit harness score remains L4, 100/108 (93%), with unchanged
  dimension scores. This change repairs guidance and executable invariants;
  it does not add artificial records or credentials configuration for points.
- Independent review verified runtime JSON is identical after the three preset
  name substitutions and the renamed sphere asset is byte-identical. README
  review also corrected stale merge authorization and configuration ownership.
- The reference ZIP SHA-256 remains
  `ea08cd77bd2f1fd4e0fbe87fb3394685eacf9ee13719d1fe306606d2fbdbfd09`;
  the archive and reference CLI are absent from the repository.

## Related records

- ADR-0007, ADR-0010, ADR-0011 and ADR-0017.
- Rules 001, 003, 006, 007, 008, 009, 011 and 012.
- SPEC-016 and SPEC-025.

## Compatibility and risks

The owner explicitly requested the complete identity migration. The npm package
scope and named default preset change consumer import and configuration strings;
no old-name alias is retained. Existing consumers must install the new package
and update those strings when it is published. This PR does not prove that the
new scope is published or that npm trusted publishing has been configured.
The package version remains 1.0.0; use a breaking-change commit signal and handle
registry ownership/publication in a separate authorized release. Default cleanup
now requires reinstalling dependencies with `orb bootstrap` before other gates.

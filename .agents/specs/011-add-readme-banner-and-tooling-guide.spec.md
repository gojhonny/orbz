# SPEC-011: Add the README banner and Git tooling guide

- Status: Implemented
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current implementation
- Owner: Orbz maintainers

## Problem

The new Orbz banner is not rendered in the package overview, and the root guide
does not explain the shell CLI, Git gates, colocated tests, or SemVer policy.

## Scope

Place the supplied banner immediately after the opening package summary and
update the development documentation without removing the existing speech,
language, state, preset, palette, accessibility, or getting-started guidance.

## Acceptance criteria

- [x] `assets/images/readme-banner.png` appears after the opening summary and before navigation links.
- [x] The title retains the gojhonny sphere beside `# Orbz`.
- [x] Development documents bootstrap, setup, doctor, cleanup, and audit.
- [x] Git documentation distinguishes pre-commit from commit-msg behavior.
- [x] Conventional Commits, SemVer signals, and version-check commands are documented.
- [x] Test colocation is documented.

## Evidence

- `README.md`
- `assets/images/readme-banner.png`
- `.audits/documentation.audit.sh`

## Related records

- ADR-0007, ADR-0008, and ADR-0009
- Rules 007 through 010

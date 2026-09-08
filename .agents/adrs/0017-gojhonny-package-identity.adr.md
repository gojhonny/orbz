# ADR-0017: Move Orbz package identity to gojhonny

- Status: Accepted
- Created: 2026-09-08
- Updated: 2026-09-08
- Mode: Prospective

## Context

The owner moved the repository to `gojhonny/orbz` and requested complete removal
of previous-owner references, including package metadata and named presets.

## Decision

Use `@gojhonny/orbz` for the library and its entry points, `gojhonny/orbz` for
repository/release automation and `gojhonny` for the default preset key. Keep
`orb` as the CLI binary and `<orb-z>` as the single runtime UI. Palette values,
voice activation, credential ownership and SSR boundaries are unchanged.

This amends package identity in ADR-0011 and Rules 001/011 without changing the
explicit installer architecture. Existing record links/examples are normalized
to the current identity; their original dates and evidence remain historical.

## Consequences

Consumer import paths and the named default preset require migration. This is
an intentional compatibility change with no old-name alias. npm ownership and
trusted publishing need configuration for the new scope before a future release;
editing the repository does not itself publish, transfer or deprecate a package.
SPEC-026 leaves the version unchanged and stops at a PR against `staging`.

## Evidence

- SPEC-026; package metadata, consumer installer, preset configuration and audits.

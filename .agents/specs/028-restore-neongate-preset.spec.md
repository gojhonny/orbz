# SPEC-028: Restore the NeonGate preset identity

- Status: Implemented
- Created: 2026-09-08
- Updated: 2026-09-08
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

SPEC-026 incorrectly renamed the NeonGate palette after the GitHub account.
The owner clarified that the preset is a brand, not a personal name. Published
1.0.1 already exposes the accidental identifier, so removing all compatibility
would introduce another consumer regression.

## Scope

Restore canonical `neongate` configuration, defaults, types, examples and
installer output. Preserve the existing colors, npm package and GitHub owner.
Base the correction on main `27f1a89703a8a85c538eae6455c285c6b8133de1`, retaining
its 1.0.1 release metadata when proposing the PR against staging. No new version
bump, tag, merge or publication is part of this change.

## Requirements

1. NeonGate is the default palette; its canonical identifier is `neongate`.
   The six canonical preset names and five NeonGate colors remain stable.
2. HTML attributes and properties accept `neongate` and reflect that identifier.
   The deprecated `gojhonny` input normalizes to `neongate` and stays type-safe.
3. Preserve direct `ORBZ_PRESETS.gojhonny` and runtime-configuration palette
   reads through one non-enumerable, immutable alias to the NeonGate palette.
   Canonical preset enumeration never presents the alias as another palette.
4. The pure configuration transformer accepts the previously published compact
   or complete input with the accidental name, normalizes a cloned input, and
   preserves validation, isolation and frozen runtime behavior. No browser APIs
   or I/O are introduced.
5. README and installer examples use NeonGate. Historical specifications and
   ADRs remain evidence, with ADR-0019 explicitly superseding their preset choice.
6. Ownership audits independently enforce npm identity, GitHub ownership and
   preset branding, without weakening obsolete-owner or package-name checks.
7. Reproduce the canonical-name regression before the fix, then pass the focused
   suites, full Orb gate and package payload inspection.

## Acceptance criteria

- [x] Canonical defaults, JSON and six-name enumeration use `neongate`.
- [x] Public element behavior and deprecated palette reads remain compatible.
- [x] Legacy configuration input preserves palette values without mutation.
- [x] Documentation, installer and precise audits agree on NeonGate branding.
- [x] Required quality gate passes and publication remains a separate step.

## Evidence

- Before the production fix, the focused preset/color/element suites reproduced
  five failures against main 1.0.1: default name, canonical names, palette lookup,
  accepted identifier and element default. The same three suites then passed
  all 12 tests with the implementation.
- `./cli/orb check` passed with Node 24.19.0 and pnpm 10.32.1: lint, source/test
  type checks, 52 tests in 19 suites, both builds, SemVer and all ten audits.
  The pre-existing optional-chain lint warning in the clone module is unchanged.
- Configuration regression tests exercise typed legacy source, compact/complete
  inputs, custom palette preservation, unchanged caller input, hidden/frozen
  alias identity and rejection of ambiguous duplicate palette declarations.
- `npm pack --dry-run --json` passed, including the required full prepack gate.
  The inspected payload is `@neongate-ai/orbz@1.0.1`, filename
  `neongate-ai-orbz-1.0.1.tgz`, with 41 entries limited to `dist/`, `cli/` and
  standard root metadata. No source maps or harness files are included.
- `git diff --check` passed. Main's inherited delta against staging is only
  `package.json#version` from 1.0.0 to the already released 1.0.1; this fix does
  not create a new version or mutate tags/registry state.

## Related records

- ADR-0019 supersedes ADR-0017 and ADR-0018's preset decisions.
- SPEC-026, SPEC-027; Rules 001, 002, 006, 007, 009 and 011.

## Compatibility and risks

The accidental name remains accepted only for compatibility with published
1.0.1. Canonical normalization changes its reflected value to `neongate`, while
rendered colors remain identical. Consumers enumerating presets see six choices.
The current npm release is immutable; registry users receive the correction only
after a separately authorized new release. Voice, accessibility and SSR behavior
are unchanged by the palette identity fix.

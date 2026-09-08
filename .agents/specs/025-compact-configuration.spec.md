# SPEC-025: Compact configuration with typed internal defaults

- Status: Implemented
- Created: 2026-09-07
- Updated: 2026-09-07
- Mode: Prospective
- Owner: Orbz maintainers

## Problem

The uploaded configuration removes implementation-heavy appearance, motion and
speech data. The current transformer requires those fields and fails on import.

## Scope

Use the uploaded checkout at d561693 as the base. Preserve owner edits and work
on a local branch. Deliver source and Git history in a ZIP; no remote writes.

## Requirements

- Keep the authored JSON limited to component, appearance palettes and realtime.
- Restore removed values from HEAD as typed uppercase constants in concern-owned
  `.data.ts` modules. Keep every existing animation and speech default unchanged.
- Compose, validate, clone and deep-freeze one complete runtime configuration.
- Accept the compact input and legacy complete transformer input. Missing internal
  groups use defaults; explicit invalid values still fail with safe schema paths.
- Preserve public exports, SSR-safe imports, silence, reduced motion and consumer
  credential ownership. No version bump, release or provider activation.
- Correct the uploaded TTS model under realtime back to `gpt-realtime-2`;
  `gpt-4o-mini-tts` and `marin` remain the speech defaults.
- Update the README, active context, ownership rule, ADR and configuration audit.
- Preserve the owner's removed framework navigation link; keep Documentation,
  npm package and License centered and update the presentation audit accordingly.

## Acceptance criteria

- [x] Compact JSON imports and transforms successfully with isolated frozen defaults.
- [x] Legacy full input remains valid; invalid/secret/accessor input is rejected.
- [x] Removed data matches the prior commit and motion/speech behavior is preserved.
- [x] README and harness describe split ownership without contradicting history.
- [x] `./cli/orb check` passes and build payload is inspected.

## Evidence

Validation on 2026-09-07, Node 24.19.0 and pnpm 10.32.1:

- `./cli/orb check` passed: lint, source/test type checks, 46 tests in 19 suites,
  all entry-point builds, SemVer validation and every deterministic audit.
- The built `orbzConfiguration` deep-equals `transformOrbzConfiguration()` of the
  full JSON from base d56169311c16e52d0986748f57d4377a9cfc15d8. This compares all
  migrated values, including every full/reduced animation and speech option.
- Compact and legacy input tests cover omission, explicit invalid overrides,
  secret fields, getters, source isolation and frozen runtime values.
- Payload inspection and final local commit are recorded in the ZIP handoff.
- Standards and spec-fidelity source reviews found no blocking issues.
- The existing optional-chain lint warning is unchanged. No provider calls or
  remote repository operations were performed.

## Related records

- ADR-0016; partially supersedes ADR-0013 and SPEC-017/019/020 data ownership.
- Rules 001, 002, 003, 004, 005, 006 and 007.

## Compatibility and risks

The owner authorized implementation in this request. Source input becomes smaller
without removing the supported complete-input shape or changing runtime output.
Known TTS model IDs must not be sent to the Realtime transport. Live provider
calls are outside this local refactor; deterministic adapter tests cover seams.

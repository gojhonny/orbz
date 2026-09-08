# SPEC-024: Publish the first major Orbz release

- Status: In progress
- Created: 2026-09-06
- Updated: 2026-09-06
- Mode: Prospective
- Owner: Orbz maintainers
- Approval: the owner explicitly requested merging to main, a new major tag and publication.

## Problem

The completed configuration, CLI and application-authorized Realtime delivery is
on staging while npm remains at 0.4.3. PR #12 originally proposed a minor release;
the latest owner instruction selects 1.0.0 instead.

## Scope

Promote SPEC-016 through SPEC-023 without changing their runtime contracts. Bump
package metadata, align README release guidance and add a repeatable GitHub
Actions release path. No credentials enter source or package configuration.

## Requirements

1. Keep 1.0.0 canonical in package.json and preserve all existing entry points.
2. Run the existing Orb gate through npm prepack, inspect the tarball and require
   successful PR validation before main promotion. Preserve all existing gates.
3. Release only the current main commit, on a package metadata push or an explicit
   manual workflow dispatch. Reject stale commits and conflicting existing tags.
4. Create annotated v1.0.0 with the owner's Git identity. Never move an existing
   tag or overwrite a published version. Publish the validated tarball, using
   npm trusted publishing or an existing repository NPM_TOKEN secret.
5. Verify the published tarball integrity and the package's orb --help command
   before creating the GitHub release. Retries may reuse matching tags/artifacts.
6. Preserve the distinction between prepared source, a Git tag and confirmed npm
   publication. An authentication failure remains an explicit release blocker.
7. History lint validates ordinary commits and the non-merge commits introduced
   by integration merges. Identify merge envelopes from Git parent metadata;
   keep the new-commit hook strict and do not rewrite published history merely
   to repair old integration-message wrapping.

## Acceptance criteria

- [x] Version and README describe the first major release and migration boundary.
- [x] Release workflow implements validation, tagging, publication and verification.
- [x] Local full gate and payload inspection pass.
- [ ] Validated promotion is merged to main under the owner's identity.
- [ ] v1.0.0 resolves to the intended main commit.
- [ ] npm 1.0.0 matches the validated tarball and its Orb binary runs.
- [ ] GitHub release records the successful delivery.

## Evidence

Initial staging: 4e74a125e14be469d4f78e2e6d2ec1339f8bba0f. Initial main:
25280faac6ba9932559f97e06ed72e8101a9806f. npm latest was 0.4.3 and v1.0.0 did not
exist on 2026-09-06. Final validation and remote outcomes are recorded in the PR
and release workflow; these initial observations do not claim publication.

Local doctor and npm prepack passed: lint, source/test types, 42 tests across
19 files, both builds, version validation and all audits. The dry-run payload
contains 41 files: dist, cli and standard npm metadata at version 1.0.0.
The initial CI blocker was overlong bodies in six historical merge envelopes;
ordinary implementation messages passed. The history-lint correction preserves
strict validation of ordinary commits and does not change public runtime code.
Git enumerates non-merge commits directly because the installed Commitlint
history reader does not support its advertised --no-merges filter; default
message-based ignores are disabled so merge-looking ordinary commits still fail.

## Related records

- [Release workflow](../workflows/release.md)
- [Release context](../context/release.md)
- [Rule 009](../rules/009-git-commits-and-semantic-versioning.rule.md)
- [Rule 011](../rules/011-public-orb-installer.rule.md)
- [Rule 012](../rules/012-agent-runtime-guardrails.rule.md)
- No new ADR: this release preserves the accepted architecture.

## Compatibility and risks

The first stable release commits to the documented public API. Live browser voice
latency and microphone/provider acceptance remain deferred evidence. npm account
authorization is external: configure trusted publisher gojhonny/orbz with
workflow filename release.yml and direct npm publish permission, or use an
existing scoped publishing token in the repository secret NPM_TOKEN. No
environment name is configured. This delivery does not change npm account access.

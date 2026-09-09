# Release workflow

Use when preparing a patch, minor, or major Orbz release. Publishing remains a human-controlled action.

1. Read `.agents/context/release.md`, Rule 009, Rule 011, and the release SPEC.
2. Confirm the working branch is intended for release and the working tree is clean.
3. Confirm `package.json#version` is the intended canonical SemVer.
4. Run `orb doctor`.
5. Run `orb lint`.
6. Run `orb typecheck`.
7. Run `orb test` and require zero unhandled errors.
8. Run `orb check`.
9. Run `npm pack --dry-run` and inspect the payload.
10. Confirm local `main` equals `origin/main` before tagging a merged release.
11. Confirm the target npm version is not already published.
12. Stop for human approval before `git tag`, `git push`, or any publish command.
13. After a human publishes, verify the registry version and `npx` binary.

The runtime shell guard denies autonomous package publication and asks for approval on release-boundary Git operations.

## Owner-authorized CI release

SPEC-024 records explicit owner authorization for the first major release.
`.github/workflows/release.yml` runs on main package metadata changes or manual
dispatch from main. It performs the full prepack gate, rejects stale main heads
and conflicting tags, and publishes the validated tarball. Matching published
artifacts can be verified on retry; existing tags and npm versions are immutable.

In the npm settings for `@neongate-ai/orbz`, configure trusted publishing for the
personal GitHub account `gojhonny`, repository
`orbz`, workflow filename `release.yml`, no environment name, and allow direct
`npm publish`. An existing repository secret `NPM_TOKEN` is also supported.
Credentials are never committed or printed. See the
[npm trusted publisher documentation](https://docs.npmjs.com/trusted-publishers/).

ADR-0018/SPEC-027 retain the existing npm package while keeping the GitHub move.
The correction authorizes a PR against `staging`, not publication. An npm token
must have publishing access to `@neongate-ai/orbz`; a GitHub account rename does
not change npm permissions. Confirm publisher access before a future release.

The workflow creates the GitHub release only after npm integrity and the public
Orb binary are verified. If npm authorization fails after tagging, the tag is
retained and publication remains incomplete. Fix the account authorization and
rerun the failed workflow; do not move the tag or bump a version to hide failure.
Future releases require an owner-authorized version change or manual dispatch.

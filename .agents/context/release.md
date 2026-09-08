# Release context

Intentional package payload consists of `dist/`, the POSIX shell `cli/`, and
npm's automatic root metadata files. Source maps are disabled. Provider secrets,
tests, Git hooks, `.agents/`, and `.audits/` must not enter the package. The CLI
is included only to provide the `orb` package binary and npx project setup.

Commit messages follow Conventional Commits. Release planning maps `fix` and
`perf` to patch changes, `feat` to minor changes, and `!` or `BREAKING CHANGE`
to major changes. `package.json#version` must be canonical SemVer. A staged
version change must move forward relative to `HEAD`.

A release-oriented change runs `./cli/orb check`; CI also lints commit history
through Orb and runs `npm pack --dry-run`. The `prepack` lifecycle delegates to
the same Orb gate. New exports, attributes, properties, methods, events, package
binaries, and entry points are compatibility commitments and require an
explicit SPEC plus an ADR when the commitment is architectural.

`package.json#scripts` does not mirror the Orb command surface. It retains only
the `setup` bridge and npm lifecycle gates. Consumer setup is explicit through
`npx -y --package=@neongate-ai/orbz@latest orb` and never runs from an install
lifecycle. Harness-score remains explicit engineering-only tooling and is never
part of the runtime API.

ADR-0018/SPEC-027 retain `@neongate-ai/orbz` for npm while `gojhonny/orbz` remains
the GitHub repository. Existing dependency/import strings stay valid. SPEC-026's
separate default-preset rename to `gojhonny` still requires migration for explicit
preset consumers. Neither change bumps version 1.0.0 or authorizes publication.
Configure the existing npm package's publisher for the current GitHub repository;
the npm and GitHub account names do not need to match. Never overwrite a published
version or move its release tag.


Agent runtime guardrails deny autonomous package publication and require human approval for tag, push, merge/rebase, and PR-merge boundaries. These hooks supplement, but do not replace, Orb checks, Git hooks, and CI.

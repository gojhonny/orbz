# SPEC-029: Keep the README consumer-facing and make Orb directly executable

- Status: In progress
- Created: 2026-09-09
- Updated: 2026-09-09
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

The npm-facing README drifted into repository-maintainer instructions even though
its primary purpose is to show application developers how to install and use the
`<orb-z>` Web Component, its properties, methods, voice integrations, model
selection, events, framework integration, security boundary, and accessibility
contract.

After the README was corrected toward consumer implementation documentation,
the deterministic documentation audit still required the removed contributor,
Git, release, and Orb engineering sections, causing PR CI to fail.

Separately, active CLI guidance told repository users to invoke Orb through
package-manager executable runners. The reference Amarelo CLI instead provisions
a managed user launcher during source setup so engineering commands are simply
`orb <command>`. Orbz already has a safe managed launcher but did not provision
it automatically from the source install lifecycle.

## Scope

Keep the root README as detailed package-consumer implementation documentation.
Update the documentation audit to validate that contract and reject repository
maintainer material there. Make a local root `pnpm install` provision the managed
Orb source-checkout launcher so direct `orb <command>` is canonical engineering
usage. Preserve explicit npx consumer project setup and npm package-install
safety. No runtime Web Component API, version, release tag, or publication is
changed.

## Requirements

1. The root README documents consumer installation and registration, HTML
   attributes, JavaScript properties and methods, voice/model options, bring-your-
   own voice integration, talk flow, states, presets, events, React/Next.js, SSR,
   security, accessibility, and package entry points.
2. The root README does not teach repository bootstrap, harness commands, Git
   hooks, Commitlint, release procedures, historical specs, or contributor setup.
3. The documentation audit enforces the consumer README contract rather than the
   superseded contributor-oriented headings.
4. Repository engineering documentation uses `orb <command>` directly. Active
   documentation must not require `pnpm exec orb` or `npm exec -- orb`.
5. A local root `pnpm install` provisions the existing managed launcher before
   dependencies are installed, using a root-only pnpm lifecycle that does not run
   as a dependency lifecycle for application consumers.
6. Standard dependency lifecycles `preinstall`, `install`, `postinstall`, and
   `prepare` remain unused for Orb setup. Installing `@neongate-ai/orbz` in an
   application must not provision a repository launcher or run repository setup.
7. Launcher provisioning reuses the existing POSIX shell implementation, skips
   bootstrap-mode launcher mutation in CI, never edits shell profiles, and never
   replaces unmanaged paths.
8. CLI and package audits verify the direct `orb` launcher path and the lifecycle
   separation. Existing explicit npx consumer project setup remains supported.

## Acceptance criteria

- [x] The failing documentation audit root cause is reproduced and identified as
  stale contributor-oriented README requirements.
- [x] The root README remains a detailed consumer API/integration guide.
- [x] Active CLI documentation uses direct `orb <command>` examples and rejects
  package-manager executable-runner forms.
- [x] `package.json` uses root-only `pnpm:devPreinstall` for managed launcher
  provisioning while keeping standard dependency setup lifecycles absent.
- [x] Deterministic package, CLI, and documentation audits encode the new contract.
- [ ] PR CI passes on the completed implementation.

## Evidence

- PR #23 CI run `34412392895` failed in `.audits/documentation.audit.sh` because
  it required removed headings such as `## Contributing` and tokens such as
  `pnpm exec orb --help`, `Commitlint`, and repository bootstrap commands.
- `gojhonny/amarelo` uses a managed user launcher as its canonical direct CLI
  surface; Orbz already had equivalent guarded launcher mechanics in
  `cli/src/commands/setup-launcher.sh` but did not provision them automatically
  during ordinary source installation.
- `package.json#scripts.pnpm:devPreinstall` now invokes
  `./cli/orb setup --launcher --bootstrap`; the package continues to omit
  `preinstall`, `install`, `postinstall`, and `prepare`.
- `.audits/cli.audit.sh` installs the managed launcher into an isolated fixture
  bin directory and verifies direct `orb --version` resolution through `PATH`.
- `.audits/documentation.audit.sh` validates consumer API sections and forbids
  repository-maintainer material in the root README.

## Related records

- ADRs: ADR-0010, ADR-0011
- Rules: 007, 008, 011
- Earlier specs: SPEC-012, SPEC-014, SPEC-016

## Compatibility and risks

The runtime package and Web Component API are unchanged. The new pnpm lifecycle
is intentionally root-project-only; the published package still contains the Orb
binary for explicit npx setup, but application dependency installation must not
mutate user launcher state. Users whose selected launcher directory is not on
`PATH` still need to add that directory themselves; Orb reports the condition
without editing shell configuration.

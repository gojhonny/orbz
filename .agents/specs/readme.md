# Specifications

SPECs describe bounded changes and their acceptance evidence. Records `001`
through `007` are retrospective reconstructions dated **2026-08-21** because the
package intent predated the recovered harness. Records `008` onward describe
current work and use their actual creation date. SPEC-012 consolidates repository
commands in Orb, SPEC-013 isolates WAAPI from Happy DOM tests, and SPEC-014 adds
the explicit npx project-setup flow. SPEC-015 strengthens skill/rule discoverability, workflows, runtime guardrails, and harness-score CI enforcement.

Statuses are `Proposed`, `In progress`, `Implemented`, `Superseded`, and
`Rejected`. Use [`template.md`](./template.md), follow
[`workflow.md`](./workflow.md), and link applicable ADRs and rules.

## Configuration and voice delivery

| Spec | Status | Scope |
| --- | --- | --- |
| [SPEC-016](016-orb-cli-parity.spec.md) | Implemented; automated validation passed | Engineering CLI ergonomics |
| [SPEC-017](017-canonical-json-configuration.spec.md) | Implemented; automated validation passed | Canonical JSON configuration |
| [SPEC-018](018-voice-model-property.spec.md) | Implemented; browser/provider validation deferred | Native voice model selection and direct Realtime audio |
| [SPEC-019](019-typed-configuration-transformer.spec.md) | Implemented; automated validation passed | Pure validated configuration transformer |
| [SPEC-020](020-complete-data-configuration-migration.spec.md) | Implemented; audit validation passed | Remaining configuration migration and source inventory |
| [SPEC-021](021-application-owned-credentials.spec.md) | Implemented; automated validation passed | Application credential ownership and strict session options |
| [SPEC-022](022-align-readme-with-configuration-and-voice.spec.md) | Implemented; documentation review passed | README alignment for configuration, voice and credential ownership |

The owner requested one specification and implementation per PR. The 2026-09-05
batch authorized validation, conflict repair and eligible staging merges for
SPEC-016 through SPEC-022. That authorization and its earlier validation deferral
are historical delivery context, not blanket permission for later work. Follow
the current task's delivery boundary; do not merge with unresolved validation.

Dependency order: SPEC-016 → SPEC-017 → SPEC-019 → SPEC-018 → SPEC-020 → SPEC-021
→ SPEC-022. Each PR starts from its predecessor. Integration may retarget a PR
once its dependency is merged. This order is a plan, not a claim that merges have
occurred. A staging merge does not authorize version changes, tags or npm publication.

The table describes recorded implementation evidence. Compilation/syntax checks,
behavioral tests and live-provider acceptance are distinct; update validation
status only when the corresponding evidence is available.

## README presentation delivery

- [SPEC-023](./023-refine-readme-presentation.spec.md): implemented formatting-only
  refinement with exact content preservation, documentation audits and review guidance.

## First major release

- [SPEC-024](./024-first-major-release.spec.md): in progress; the owner explicitly
  authorized main promotion, v1.0.0 tagging and npm publication on 2026-09-06.
  This supersedes PR #12's earlier minor-release plan. Publication is complete
  only after registry verification; release preparation alone is insufficient.

## Compact configuration

- [SPEC-025](025-compact-configuration.spec.md): implemented; initially delivered
  as an owner-requested ZIP. Subsequently integrated into remote `staging` through
  PR #14, as verified on 2026-09-08. The original SPEC records the initial delivery.

## CLI cleanup and ownership

- [SPEC-026](026-cli-cleanup-and-gojhonny-ownership.spec.md): implemented; repair
  default and nested dependency cleanup, protect tracked/generated boundaries,
  migrate package identity to `gojhonny`, and refresh docs and deterministic audits.
  Delivery is one PR against `staging`; no merge, version bump, tag or publication.
  SPEC-027 supersedes its npm identity migration only.

## Published npm identity

- [SPEC-027](027-preserve-published-npm-package.spec.md): implemented; keep the
  published `@neongate-ai/orbz` package while retaining GitHub owner `gojhonny`.
  Update installer, release automation, documentation and ownership audits.
  Delivery is one PR against `staging`; no version bump or publication.

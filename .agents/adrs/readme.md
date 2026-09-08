# Architecture decision records

ADRs preserve durable Orbz decisions. Records `0001` through `0006` were
reconstructed retrospectively on **2026-08-21** from the package's intended
contracts. Records `0007` onward document current decisions from their stated
creation date. ADR-0010 establishes Orb as the single repository command
surface; ADR-0011 adds the explicit public npx installer exception; ADR-0012 adds agent-native workflows, runtime guardrails, and harness maturity enforcement.

Use [`template.md`](./template.md) for new decisions. Never rewrite an accepted
ADR to hide a changed decision; record the update and supersede it explicitly.

[ADR-0013](0013-canonical-json-configuration.adr.md) establishes the single JSON source and derived typed configuration.

[ADR-0014](0014-voice-model-and-realtime-port.adr.md) separates voice selection, live audio lifecycle and application-owned session authorization.

[ADR-0015](0015-application-owned-credentials.adr.md) keeps permanent provider keys server-side and forbids secret-bearing element/JSON/session configuration.

[ADR-0016](0016-compact-configuration-and-internal-data.adr.md) partially supersedes
ADR-0013: compact JSON plus typed internal data defaults and compatible composition.

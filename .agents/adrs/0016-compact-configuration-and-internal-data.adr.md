# ADR-0016: Compact JSON and internal TypeScript defaults

- Status: Accepted
- Created: 2026-09-07
- Updated: 2026-09-07
- Mode: Prospective

## Context

The owner removed appearance-by-state, motion and speech blocks from the supplied
JSON because they obscured the settings they want to edit.

## Decision

Keep component settings, appearance palettes and realtime settings in
`src/orbz.config.json`. Author the removed data as uppercase, typed, frozen
constants in `core/appearance/appearance.data.ts`,
`core/motion/default-motion.data.ts` and `talk/default-speech.data.ts`.

The pure transformer fills omitted internal groups, validates the complete tree,
isolates input and freezes runtime output. Existing full configuration inputs
remain accepted for compatibility. Data modules cannot import runtime facades;
this keeps composition acyclic. Compatibility exports still derive from the
composed `orbzConfiguration` rather than duplicating defaults.

This partially supersedes ADR-0013's all-defaults-in-JSON decision. Its bundling,
validation, isolation, freezing and credential boundaries remain in force.

## Consequences

The JSON is small and discoverable. Internal profiles and speech defaults remain
typed and reviewable in their own concerns. Tests and the deterministic source
audit enforce the explicit authoring locations. Provider selection stays inert;
TTS and Realtime retain their separate model defaults and public ports.

## Evidence

SPEC-025 records implementation and verification.

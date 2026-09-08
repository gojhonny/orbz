# SPEC-006: Refresh package documentation and visual identity

- Status: Implemented
- Created: 2026-08-21
- Updated: 2026-08-21
- Mode: Retrospective reconstruction
- Owner: Orbz maintainers

## Problem

The root README did not fully explain setup, palettes, presets, states, speech
localization, silence semantics, accessibility, or engineering commands.

## Scope

Rewrite the root README, place the gojhonny sphere beside the title, and document
the public package contract without adding documentation-site code.

## Acceptance criteria

- [x] The first line contains the Orbz title and local sphere image.
- [x] Getting started produces a silent-by-default, explicit-speech example.
- [x] All states and preset palettes are documented.
- [x] Custom palette conflict behavior is documented.
- [x] `pt-BR` default and English override are demonstrated.
- [x] Accessibility, SSR, entry points, and development commands are described.

## Evidence

- `README.md`
- `assets/images/gojhonny-sphere.png`
- `.audits/documentation.audit.sh`

## Related records

- ADR-0001 and ADR-0003
- Rules 001, 004, 005, and 007

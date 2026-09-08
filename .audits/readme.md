# Orbz audits

These executable checks protect repository invariants broader than one unit
test. They are deterministic, network-free POSIX shell scripts.

Run all audits with:

```bash
./cli/orb audit
```

The complete quality gate also runs them through `./cli/orb check`.

- `architecture.audit.sh`: source boundaries, concern folders, and speech defaults.
- `configuration.audit.sh`: canonical JSON bindings, migrated data modules, and runtime exemptions recorded in [`configuration.inventory.md`](./configuration.inventory.md).
- `cli.audit.sh`: shell-only Orb command surface and removal of imported application assumptions.
- `cleanup.audit.sh`: isolated filesystem fixtures for default/nested dependency cleanup, protected and tracked paths, symlinks, dry runs, option validation and failure propagation.
- `documentation.audit.sh`: title assets, banner position, package usage, and Git guidance.
- `harness.audit.sh`: record structure, frontmatter, dates, navigation, and terminology.
- `guardrails.audit.sh`: Cursor hook configuration, shell gate decisions, edit-hook containment, workflows, and reviewer metadata.
- `package.audit.sh`: payload, scripts, dependencies, hooks, Commitlint, and SemVer policy.
- `ownership.audit.sh`: independent npm package, GitHub owner and NeonGate preset identities, canonical colors and enumeration, installer behavior and rejection of stale active references.
- `tests.audit.sh`: colocated suite layout, naming, Vitest configuration, and CI integration.

When an invariant changes intentionally, update its SPEC, linked ADR/rule,
implementation, documentation, and audit in the same change.

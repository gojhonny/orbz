#!/bin/sh
set -eu

ROOT=$(CDPATH= cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

failures=0

pass() {
  printf 'PASS  %s\n' "$1"
}

fail() {
  printf 'FAIL  %s\n' "$1" >&2
  failures=$((failures + 1))
}

# ---------------------------------------------------------------------------
# README assets
# ---------------------------------------------------------------------------

for image in \
  assets/images/orbz-tagline.svg \
  assets/images/readme-banner.png
do
  if [ -s "$image" ]; then
    pass "$image exists"
  else
    fail "missing or empty $image"
  fi
done

# ---------------------------------------------------------------------------
# README hero
#
# The current Orbz README intentionally uses:
#
#   tagline
#   -> banner
#   -> badges
#   -> TLDR
#
# Installation guidance is validated separately below and does not need to be
# artificially placed inside the hero.
# ---------------------------------------------------------------------------

tagline_line=$(
  grep -n -m1 'assets/images/orbz-tagline.svg' README.md |
    cut -d: -f1 ||
    true
)

banner_line=$(
  grep -n -m1 'assets/images/readme-banner.png' README.md |
    cut -d: -f1 ||
    true
)

badges_line=$(
  grep -n -m1 'badge-l4.svg' README.md |
    cut -d: -f1 ||
    true
)

tldr_line=$(
  grep -n -m1 '^## TLDR$' README.md |
    cut -d: -f1 ||
    true
)

if \
  [ -n "$tagline_line" ] &&
  [ -n "$banner_line" ] &&
  [ -n "$badges_line" ] &&
  [ -n "$tldr_line" ] &&
  [ "$tagline_line" -lt "$banner_line" ] &&
  [ "$banner_line" -lt "$badges_line" ] &&
  [ "$badges_line" -lt "$tldr_line" ]
then
  pass 'README hero follows tagline, banner, badges, then TLDR'
else
  fail 'README hero must be tagline -> banner -> badges -> TLDR'
fi

# ---------------------------------------------------------------------------
# Required documentation sections
# ---------------------------------------------------------------------------

for heading in \
  '## Getting started' \
  '## Speech and language' \
  '## States' \
  '## Presets' \
  '### Custom palette' \
  '### Size, motion, and presentation' \
  '## Accessibility' \
  '## Server rendering and frameworks' \
  '### Package entry points' \
  '## Contributing' \
  '### Git quality gates and semantic versioning'
do
  if grep -F -x "$heading" README.md >/dev/null 2>&1; then
    pass "README contains $heading"
  else
    fail "README is missing $heading"
  fi
done

# Keep the existing resource links together, centered, and in their authored
# order. Badges belong to a separate centered paragraph and are not navigation.
if awk '
  BEGIN {
    expected[1] = "<a href=\"https://orbz.site\"><strong>Documentation</strong></a>"
    expected[2] = "<a href=\"https://www.npmjs.com/package/@neongate-ai/orbz\"><strong>npm package</strong></a>"
    expected[3] = "<a href=\"./LICENSE\"><strong>License</strong></a>"
  }
  /^[[:space:]]*<p align="center">[[:space:]]*$/ {
    active = 1; count = 0; valid = 1; next
  }
  active && /<a / {
    count++
    if (count > 3 || index($0, expected[count]) == 0) valid = 0
  }
  active && /<\/p>/ {
    if (valid && count == 3) found = 1
    active = 0
  }
  END { exit(found ? 0 : 1) }
' README.md; then
  pass 'README resource links are centered with original labels and destinations'
else
  fail 'README must center Documentation, npm package, then License with their original destinations'
fi

# ---------------------------------------------------------------------------
# Presets
# ---------------------------------------------------------------------------

for value in \
  gojhonny \
  periwinkle \
  magenta \
  peach \
  mocha \
  ivory
do
  if grep -F "$value" README.md >/dev/null 2>&1; then
    pass "README documents preset $value"
  else
    fail "README does not document preset $value"
  fi
done

# ---------------------------------------------------------------------------
# Orb states
# ---------------------------------------------------------------------------

for value in \
  idle \
  listening \
  thinking \
  speaking \
  asleep
do
  if grep -F "$value" README.md >/dev/null 2>&1; then
    pass "README documents state $value"
  else
    fail "README does not document state $value"
  fi
done

# ---------------------------------------------------------------------------
# Core package and engineering documentation
# ---------------------------------------------------------------------------

for token in \
  speech \
  pt-BR \
  en-US \
  color-primary \
  reduced-motion \
  'startTalking()' \
  './cli/orb bootstrap' \
  'orb check' \
  'orb cleanup --dry-run' \
  'orb cleanup --keep-dependencies' \
  'npx -y --package=@neongate-ai/orbz@latest orb' \
  lint-staged \
  Commitlint \
  SemVer
do
  if grep -F "$token" README.md >/dev/null 2>&1; then
    pass "README documents $token"
  else
    fail "README does not document $token"
  fi
done

# ---------------------------------------------------------------------------
# README badges and published Orb CLI
# ---------------------------------------------------------------------------

for token in \
  'paladini.github.io/harness-score/maturity/badge-l4.svg' \
  'github/actions/workflow/status/gojhonny/orbz/ci.yml' \
  'img.shields.io/npm/v/%40neongate-ai%2Forbz' \
  '## Orb CLI' \
  'pnpm exec orb --help' \
  'npm exec -- orb --help'
do
  if grep -F "$token" README.md >/dev/null 2>&1; then
    pass "README documents $token"
  else
    fail "README does not document $token"
  fi
done

# ---------------------------------------------------------------------------
# Orb is the engineering command surface.
#
# Removed package-script aliases must not come back into active documentation.
# ---------------------------------------------------------------------------

if grep -E 'pnpm (orb|check|version:check)' README.md cli/readme.md >/dev/null 2>&1; then
  fail 'documentation retains removed package-script command aliases'
else
  pass 'documentation routes repository commands through Orb'
fi

# ---------------------------------------------------------------------------
# Distribution contract
# ---------------------------------------------------------------------------

if \
  grep -F 'package binary' README.md >/dev/null 2>&1 &&
  grep -F 'POSIX shell' README.md >/dev/null 2>&1
then
  pass 'README documents the published POSIX shell binary'
else
  fail 'README does not document the published POSIX shell binary'
fi

# ---------------------------------------------------------------------------
# Result
# ---------------------------------------------------------------------------

if [ "$failures" -ne 0 ]; then
  printf '\n%d documentation audit failure(s).\n' "$failures" >&2
  exit 1
fi

printf '\nDocumentation audit passed.\n'

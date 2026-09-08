#!/bin/sh
set -eu

ROOT=$(CDPATH= cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

orb_tmp=$(mktemp -d "${TMPDIR:-/tmp}/orb-ownership-audit.XXXXXX")
trap 'rm -rf "$orb_tmp"' 0 1 2 15

node - "$ROOT" "$orb_tmp" <<'NODE'
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync, spawnSync } = require('node:child_process')
const [root, temporary] = process.argv.slice(2)
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const pkg = JSON.parse(read('package.json'))
const pass = (message) => console.log(`PASS  ${message}`)

try {
  assert.equal(pkg.name, '@gojhonny/orbz', 'package must use the current npm scope')
  assert.equal(pkg.author, 'gojhonny', 'author must use the owner handle without an invented email')
  assert.equal(pkg.repository?.url, 'git+https://github.com/gojhonny/orbz.git')
  assert.equal(pkg.bugs?.url, 'https://github.com/gojhonny/orbz/issues')
  assert.match(read('LICENSE'), /Copyright \(c\) 2026 gojhonny/)
  pass('package metadata and license identify gojhonny')

  const release = read('.github/workflows/release.yml')
  for (const token of [
    "github.repository == 'gojhonny/orbz' && github.ref == 'refs/heads/main'",
    "name !== '@gojhonny/orbz'",
    'gojhonny-orbz-${version}.tgz',
    'https://registry.npmjs.org/@gojhonny%2forbz/',
    'npm view "@gojhonny/orbz@$RELEASE_VERSION" dist.integrity',
    'npm exec --yes --package="@gojhonny/orbz@$RELEASE_VERSION" -- orb --help'
  ]) {
    assert.ok(release.includes(token), `release identity is missing: ${token}`)
  }
  pass('release owner guard, tarball, registry and public binary use the same package')

  // Include new files before staging; ignore tracked deletions and binary assets.
  const previousOwner = ['neon', 'gate'].join('')
  const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: root, encoding: 'utf8'
  }).split('\0').filter(Boolean)
  for (const file of new Set(files)) {
    const absolute = path.join(root, file)
    if (!fs.existsSync(absolute)) continue
    assert.ok(!file.toLowerCase().includes(previousOwner), `previous owner remains in filename: ${file}`)
    if (!fs.lstatSync(absolute).isFile()) continue
    const contents = fs.readFileSync(absolute)
    if (contents.includes(0)) continue
    assert.ok(!contents.toString('utf8').toLowerCase().includes(previousOwner),
      `previous owner remains in tracked text: ${file}`)
  }
  pass('repository text and filenames contain no previous-owner references')

  const appearance = JSON.parse(read('src/orbz.config.json')).appearance
  assert.equal(appearance.defaultPreset, 'gojhonny')
  assert.deepEqual(appearance.presetNames,
    ['gojhonny', 'periwinkle', 'magenta', 'peach', 'mocha', 'ivory'])
  assert.deepEqual(Object.keys(appearance.presets), appearance.presetNames)
  pass('default preset and all supported palette keys agree')

  const packageDirectory = path.join(temporary, 'package')
  const consumer = path.join(temporary, 'consumer project')
  const fixtureBin = path.join(temporary, 'bin')
  fs.mkdirSync(packageDirectory)
  fs.mkdirSync(consumer)
  fs.mkdirSync(fixtureBin)
  fs.cpSync(path.join(root, 'cli'), path.join(packageDirectory, 'cli'), { recursive: true })
  fs.copyFileSync(path.join(root, 'package.json'), path.join(packageDirectory, 'package.json'))
  const cli = path.join(packageDirectory, 'cli/orb')
  const manifest = path.join(consumer, 'package.json')
  const source = path.join(consumer, 'app.js')
  fs.writeFileSync(source, 'export const existingApplication = true\n')
  const initial = { name: 'orb-ownership-consumer', private: true }
  const reset = () => fs.writeFileSync(manifest, JSON.stringify(initial))
  const env = { ...process.env, PATH: `${fixtureBin}${path.delimiter}${process.env.PATH}`,
    ORB_PACKAGE_SPEC: '', ORB_FIXTURE_SKIP_WRITE: '0', ORB_FIXTURE_VERSION: pkg.version }

  // Simulate only the dependency write; no registry or network is involved.
  const npm = path.join(fixtureBin, 'npm')
  fs.writeFileSync(npm, `#!/bin/sh
set -eu
[ "$#" -eq 3 ] && [ "$1" = install ] && [ "$2" = --save ]
[ "$3" = "@gojhonny/orbz@$ORB_FIXTURE_VERSION" ]
[ "\${ORB_FIXTURE_SKIP_WRITE:-0}" != 1 ] || exit 0
node <<'FIXTURE'
const fs = require('node:fs')
const data = JSON.parse(fs.readFileSync('package.json', 'utf8'))
data.dependencies = { ...data.dependencies, '@gojhonny/orbz': process.env.ORB_FIXTURE_VERSION }
fs.writeFileSync('package.json', JSON.stringify(data))
FIXTURE
`)
  fs.chmodSync(npm, 0o755)
  const run = (args, options = {}) => spawnSync(cli, args, {
    cwd: consumer, env, encoding: 'utf8', ...options
  })
  reset()
  const installed = run(['--package-manager', 'npm'])
  assert.equal(installed.status, 0, installed.stderr)
  assert.equal(JSON.parse(fs.readFileSync(manifest, 'utf8')).dependencies?.[pkg.name], pkg.version)
  assert.ok(installed.stdout.includes("import '@gojhonny/orbz/browser'"))
  assert.ok(installed.stdout.includes('preset="gojhonny"'))
  assert.equal(fs.readFileSync(source, 'utf8'), 'export const existingApplication = true\n')
  assert.deepEqual(fs.readdirSync(consumer).sort(), ['app.js', 'package.json'])
  pass('published setup installs its own package version and prints the migrated registration snippet')

  reset()
  const noWrite = run(['--package-manager', 'npm'], {
    env: { ...env, ORB_FIXTURE_SKIP_WRITE: '1' }
  })
  assert.equal(noWrite.status, 1, 'setup must reject a manager that did not add the new dependency')
  assert.ok(noWrite.stderr.includes('without adding @gojhonny/orbz to dependencies'))
  const wrongPackage = run(['--package-spec', '@unrelated/orbz@1.0.0', '--dry-run'])
  assert.equal(wrongPackage.status, 2, 'setup must reject a different package scope')
  fs.writeFileSync(manifest, JSON.stringify({ name: pkg.name }))
  assert.equal(run(['--dry-run']).status, 2, 'setup must reject installing into its own package')
  for (const command of ['cleanup', 'clean']) {
    assert.equal(run([command]).status, 2, `published ${command} must remain repository-only`)
  }
  pass('setup rejects missing dependency writes, other scopes and self-installation; cleanup stays repository-only')
} catch (error) {
  console.error(`FAIL  ${error.message}`)
  process.exit(1)
}
console.log('\nOwnership audit passed.')
NODE

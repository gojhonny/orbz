<p align="center">
  <img
    src="./assets/images/orbz-tagline.svg"
    alt="One native voice-presence component for every web stack."
  >
</p>

<p align="center">
  <img src="./assets/images/readme-banner.png" alt="Orbz voice presence component" width="100%">
</p>

<p align="center">
  <a href="https://paladini.io/harness-score/guide/maturity-model.html"><img alt="Harness Score L4" src="https://paladini.github.io/harness-score/maturity/badge-l4.svg" height="20"></a>
  <a href="https://github.com/gojhonny/orbz/actions/workflows/ci.yml"><img alt="Tests" src="https://img.shields.io/github/actions/workflow/status/gojhonny/orbz/ci.yml?branch=main&label=tests&logo=github" height="20"></a>
  <a href="https://www.npmjs.com/package/@gojhonny/orbz"><img alt="npm version" src="https://img.shields.io/npm/v/%40gojhonny%2Forbz?logo=npm" height="20"></a>
</p>

## TLDR

`@gojhonny/orbz` is a framework-agnostic, SSR-safe Web Component for giving
AI voice interfaces a visible state, motion system, configurable palette, and
provider-neutral speech boundary. The package renders the native `<orb-z>`
element. Applications own the persona, transcript UI, session authorization,
and backend integrations.

This source is version **1.0.0**, including compact configuration, `voiceModel`,
direct Realtime audio and the unified Orb CLI. The package identity is now
`@gojhonny/orbz`; this repository change does not publish the new npm scope.
Installation commands below require that package to be published first.

<p align="center">
  <a href="https://orbz.site"><strong>Documentation</strong></a>&nbsp;&nbsp;&nbsp;
  <a href="https://www.npmjs.com/package/@gojhonny/orbz"><strong>npm package</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="./LICENSE"><strong>License</strong></a>
</p>

<br>

## Getting started

### Ownership migration

When upgrading from the previous package scope, install `@gojhonny/orbz`, update
all imports and package-manager commands to that scope, and change any explicitly
named default preset to `gojhonny`. Remove the previous dependency once imports
are migrated. The five palette colors, `orb` binary and `<orb-z>` element remain
the same; the previous package and preset names are not compatibility aliases.
Publishing and npm trusted-publisher setup are separate release steps.

### Install with npx

Run Orb from an existing JavaScript project:

```bash
npx -y --package=@gojhonny/orbz@latest orb
```

This explicit `--package ... orb` form is the canonical npx invocation. It does
not rely on npm inferring the package binary. The temporary CLI detects the
project package manager from `package.json#packageManager` or its lockfile, adds
the executing Orbz version to `dependencies`, and prints the registration
snippet. It never generates or overwrites application source files. Omit `-y`
when you want npm to confirm the temporary download.

Manual installation remains available:

```bash
pnpm add @gojhonny/orbz
```

Register the element from browser-only code and render it in HTML:

```ts
import {
  type OrbzElement,
  WebSpeechAdapter
} from '@gojhonny/orbz'
import '@gojhonny/orbz/browser'

const orb = document.querySelector<OrbzElement>('orb-z')
const speakButton = document.querySelector<HTMLButtonElement>('#speak')

if (orb && speakButton) {
  orb.speech = 'Olá. Como posso ajudar?'
  orb.voiceEngine = new WebSpeechAdapter()

  speakButton.addEventListener('click', () => {
    void orb.startTalking()
  })
}
```

```html
<orb-z
  aria-label="Assistente de voz"
  role="img"
  preset="gojhonny"
  state="idle"
></orb-z>
<button id="speak" type="button">Ouvir mensagem</button>
```

Speech is deliberately explicit:

1. `<orb-z>` connects silently.
2. Assigning `speech` or `voiceEngine` does not start playback.
3. `startTalking()` speaks only consumer-supplied content.
4. Missing or blank `speech` is a no-op when no custom talk flow is configured.
5. `stopTalking()` cancels the active run.

This keeps initial rendering safe, avoids unexpected audio, and provides a clear
place to satisfy browser user-activation requirements.

## Orb CLI

Orbz publishes one executable, `orb`, implemented with POSIX shell. The npx
command above is a one-shot installer; **npx does not install a global `orb`
command on your PATH**. After Orbz is added to your project, invoke the local
binary through your package manager:

```bash
# pnpm
pnpm exec orb --help

# npm
npm exec -- orb --help
```

Consumer projects expose three public CLI operations:

```bash
pnpm exec orb --version
pnpm exec orb --help
pnpm exec orb setup --dry-run
```

`orb setup` installs `@gojhonny/orbz` into an existing project. Useful
options are:

| Option | Purpose |
| --- | --- |
| `--project <directory>` | Install into another existing project directory. |
| `--package-manager <npm\|pnpm\|yarn\|bun>` | Override package-manager detection. |
| `--package-spec <specifier>` | Install a specific Orbz package/version. |
| `--force` | Reinstall even when Orbz is already declared. |
| `--dry-run` | Print the install command without changing the project. |

For example:

```bash
npx -y --package=@gojhonny/orbz@latest orb --package-manager pnpm
npx -y --package=@gojhonny/orbz@latest orb --project ./apps/web
npx -y --package=@gojhonny/orbz@latest orb --dry-run
```

Repository engineering commands such as `orb test`, `orb check`, `orb audit`,
and `orb git ...` intentionally work only from an Orbz source checkout. From a
checkout, use `./cli/orb help` or install the optional user launcher with
`pnpm run setup`. Scoped help is available through `orb help build`,
`orb help git lint` or `orb git lint --help`. Use `--logs` before or after
a command (including nested Git commands) for diagnostics. Repository
`orb install` is an alias for dependency bootstrap; consumer installation
continues to use `orb setup`.

If you explicitly want `orb` available on your global `PATH`, install the package
globally instead of using npx:

```bash
npm install --global @gojhonny/orbz@latest
orb --help
```

Orb requires an environment with `/bin/sh` (Linux, macOS, WSL, or another
POSIX-compatible shell environment).

<br>

## Compact configuration

Fork maintainers edit [`src/orbz.config.json`](./src/orbz.config.json) and rebuild.
The JSON is bundled into the library; an orb never fetches a configuration file.

| JSON section | Settings |
| --- | --- |
| `component` | Element identity, states, attributes, size, speed and reduced-motion mode |
| `appearance` | Presets, palette colors and color attributes |
| `realtime` | Realtime model, voice, transport timeouts and event bounds |

Implementation defaults live in typed uppercase constants:

| Data module | Defaults |
| --- | --- |
| [`appearance.data.ts`](./src/core/appearance/appearance.data.ts) | `ORBZ_DEFAULT_APPEARANCE_BY_STATE`: contrast and saturation by state |
| [`default-motion.data.ts`](./src/core/motion/default-motion.data.ts) | `ORBZ_DEFAULT_MOTION`: full/reduced profiles, animated properties and easings |
| [`default-speech.data.ts`](./src/talk/default-speech.data.ts) | `ORBZ_DEFAULT_SPEECH`: browser/TTS options, token grammar and silent talk defaults |

`transformOrbzConfiguration(input)` accepts the compact source, fills omitted
internal groups, validates and clones the complete tree, then freezes the runtime
result. Legacy complete inputs may still provide `appearance.byState`, `motion`
and `speech`. Explicit invalid fields are rejected with safe schema paths.
The transformer performs no I/O, does not mutate input and does not replace the
readonly `orbzConfiguration` singleton. Existing exports remain compatibility
views of the composed runtime. Motion repeat `'infinite'` becomes runtime Infinity.

The TTS default is `gpt-4o-mini-tts` with `marin`; Realtime keeps `gpt-realtime-2`.
Use the corresponding adapter/port for each. The
[configuration inventory](./.audits/configuration.inventory.md) records ownership,
and `orb audit` checks the allowed data-authoring boundaries.

Provider/model identifiers are public configuration. Permanent provider API keys
stay exclusively on the consuming application's server. Application authentication
and authorization callbacks remain consumer-owned; no key or token belongs in
Orbz JSON, element properties or HTML attributes.
Changing bundled defaults requires a rebuild; changing an individual orb uses
its documented properties. An installed package does not load configuration
from the consumer's working directory.

## Select a voice model

Assign a typed JavaScript property on the native element; object configuration
is not serialized into an HTML attribute. Selecting a provider is silent.
`provider` chooses the adapter, `model` chooses the provider model, and `voice`
chooses its supported speaker voice. Model and voice availability are enforced
by the application server and provider.

```ts
import type { OrbzElement } from '@gojhonny/orbz'
import '@gojhonny/orbz/browser'

const orb = document.querySelector<OrbzElement>('orb-z')!
orb.voiceModel = {
  provider: 'openai-realtime',
  model: 'gpt-realtime-2'
}
orb.realtimeSession = {
  endpoint: '/api/voice/session',
  credentials: 'same-origin' // Fetch cookie policy, not a secret value.
}

document.querySelector('#start')!.addEventListener('click', () => {
  void orb.startConversation().catch(() => {
    // Show an accessible error; details arrive in orbz-talk-error.
  })
})
document.querySelector('#interrupt')!.addEventListener('click', () => {
  orb.interruptConversation()
})
document.querySelector('#stop')!.addEventListener('click', () => {
  orb.stopConversation()
})
```

Run this setup after the element and controls exist in the document. Provide
visible controls outside the orb, with application-localized labels:

```html
<orb-z role="img" aria-label="Voice assistant"></orb-z>
<button id="start" type="button">Start conversation</button>
<button id="interrupt" type="button">Interrupt response</button>
<button id="stop" type="button">End conversation</button>
```

The application must also display conversation status, startup errors and a text
alternative using the events below. The orb's animation alone does not supply
those accessible messages.

| Provider | Activation | Application supplies |
| --- | --- | --- |
| `web-speech` | `speech` + `startTalking()` | Optional language and browser voice preferences |
| `openai-speech` | `speech` + `startTalking()` | Audio endpoint; optional TTS model and voice |
| `openai-realtime` | `startConversation()` | Session authorizer or endpoint; optional Realtime model and voice |

For example, `orb.voiceModel = { provider: 'web-speech', language: 'pt-BR' }`
selects browser speech. OpenAI text-to-speech uses
`{ provider: 'openai-speech', endpoint: '/api/voice/speech' }`; that endpoint
returns audio. Realtime models use the Realtime provider, not the speech endpoint.
Omitted model and voice options read the corresponding composed defaults.

A fork can set `ORBZ_DEFAULT_SPEECH.defaultVoiceModel` in
`src/talk/default-speech.data.ts` to `web-speech` or `openai-realtime` and rebuild
to configure new elements silently. `null` leaves the selection unset. An
`openai-speech` default waits for an explicit `voiceModel` assignment containing
an application endpoint. Assigning `null` or `undefined` explicitly clears a
selection without restoring the package default.

An explicitly assigned `voiceEngine` takes precedence. Set
`orb.voiceEngine = undefined` to use `voiceModel` again. Starting a conversation
stops text-to-speech; starting text-to-speech stops the conversation. Replacing
the selection or authorization, stopping, or disconnecting the element releases
active browser media resources. No automatic reconnection or paid retry occurs.

### Realtime session endpoint

`realtimeSession.endpoint` belongs to the consuming application. Orbz POSTs JSON
`{ sdp, model, voice }` and expects an SDP answer as `application/sdp` text.
The endpoint must authenticate/authorize the request and enforce the application's
allowed models and voices. It exchanges the offer with OpenAI
`POST /v1/realtime/calls`, sending multipart `sdp` and `session` fields, and returns
the answer. The permanent OpenAI key stays on that server.

The server's session configuration owns instructions, tools, input transcription,
and turn detection. Enable server VAD response creation and interruption for
automatic voice turns and barge-in. Enable input audio transcription to receive
user text events. After this setup exchange, microphone and assistant audio flow
directly between the browser and OpenAI over WebRTC. See the official
[WebRTC connection guide](https://developers.openai.com/api/docs/guides/realtime-webrtc)
and [GPT-Realtime-2 model](https://developers.openai.com/api/docs/models/gpt-realtime-2).

Applications needing custom authorization can instead assign an async
`realtimeSession({ sdp, model, voice, signal })` callback returning the SDP answer.
Honor its `AbortSignal` during setup and for application-owned session cleanup.
The application owns any server sideband connection and remote call cleanup;
closing the component does not implement those backend responsibilities.

`startConversation()` resolves once the peer and data channel are ready, or
rejects on failed startup. Microphone permission and audio playback depend on the
browser's activation policy. The default startup timeout is 20 seconds; the
configuration does not impose a conversation duration or pricing plan.

### Credential ownership

`orb` is a JavaScript reference to the element, not a separate secure vault.
Properties do not automatically become HTML attributes, but a permanent key
delivered to browser memory is still exposed to compromised page scripts.
Keep it on the backend, including when using a custom adapter or callback.

The component accepts public model settings and an application authorization
boundary. A session endpoint object accepts only `endpoint`, Fetch `credentials`
policy and an optional `fetch` function. Undeclared fields such as `apiKey`,
`token`, `secret` or `headers` are rejected before retention; errors do not repeat
supplied values. Both the element and standalone Realtime adapter use this rule.
Use JavaScript properties for these settings; no `voice-model` attribute is supported.

For cookie-based authentication, the application server can issue a Secure,
HttpOnly session cookie. The browser sends it according to fetch policy; Orbz
does not read its value. The backend authorizes the user and uses its own provider
key to return an SDP answer. The cookie identifies the application session and
must not contain the provider key. Origin/CSRF controls, quotas and remote session
cleanup belong to the application.

Custom authorizers/fetch functions remain application-owned code. Do not attach
secrets to those functions or embed tokens in public URLs/options. The existing
standalone speech adapter's `headers` option is for application endpoint transport
and must never carry permanent provider keys. Orbz cannot inspect closures or
prevent arbitrary application code from adding its own element properties.
See [ADR-0015](./.agents/adrs/0015-application-owned-credentials.adr.md).

| Event | Detail |
| --- | --- |
| `orbz-conversation-state-change` | `{ state }`: idle, connecting, listening, thinking, speaking, or error |
| `orbz-transcript` | `{ role, text, final, itemId? }`: bounded user or assistant text |
| `orbz-speaking-change` | `{ speaking }`: audible response state |
| `orbz-talk-error` | `{ error }`: sanitized built-in provider error |

Render transcript strings as text. A consuming application can forward
only events with `role === 'user' && final` to its memory runtime. Orbz does not
store transcripts, record audio history, or implement memory, consent, tools,
and usage accounting. Those remain application responsibilities.

<br>

## Speech and language

The `speech` property has no default text. `WebSpeechAdapter` uses Brazilian
Portuguese (`pt-BR`) as its default language:

```ts
orb.speech = 'Bem-vindo ao atendimento.'
orb.voiceEngine = new WebSpeechAdapter()
await orb.startTalking()
```

Change to English by configuring the adapter:

```ts
orb.speech = 'Welcome. How can I help?'
orb.voiceEngine = new WebSpeechAdapter({
  language: 'en-US',
  preferredVoices: ['Google US English']
})
await orb.startTalking()
```

Any valid BCP 47 language tag can be supplied through `language`. Language
selection controls voice matching and pronunciation; Orbz does not translate
`speech`. The consuming application owns localized strings, language switching,
visible transcripts, and captions.

A custom provider can implement `OrbzVoiceEnginePort`. The included
`OpenAISpeechAdapter` accepts a consumer-owned endpoint, headers, and delivery
instructions. Permanent provider credentials must stay on the application server.

### Advanced talk flow

The default talk flow is empty and contains no greetings, mocked answers, or
persona. Applications that need a multi-step conversation can provide their own
`talkFlow`, `voiceEngine`, and optional `intelligence` implementation:

```ts
orb.talkFlow = [
  {
    id: 'welcome',
    kind: 'say',
    needsAuth: false,
    text: 'Olá. Diga seu nome para continuar.'
  },
  {
    id: 'name',
    kind: 'ask',
    needsAuth: false,
    capture: 'fullName',
    text: 'Estou ouvindo.'
  }
]

await orb.startTalking()
await orb.receive('Ana')
```

Every sentence in a custom flow is consumer-supplied. Orbz never invents missing
copy or silently translates it.

## States

Use the `state` attribute or property to select a visual motion profile.

| State | Intended visual signal |
| --- | --- |
| `idle` | Ambient default presence. |
| `listening` | More responsive pulse while input is being captured. |
| `thinking` | Denser, exploratory motion while work is in progress. |
| `speaking` | Faster vocal-style pulse; applied automatically during active speech. |
| `asleep` | Lower-saturation, subdued presence. |

```html
<orb-z state="thinking"></orb-z>
```

When Orbz starts speaking, it temporarily changes to `speaking` and restores the
prior state after completion or cancellation. State is a visual API, not an
accessible status announcement; applications should expose meaningful status in
visible text or an appropriate external live region.

## Presets

Set `preset` to use one of the last five-color of the year palettes.

| Preset | Primary | Secondary | Accent | Highlight | Background |
| --- | --- | --- | --- | --- | --- |
| `gojhonny` | `#6C5CFF` | `#00E9FF` | `#FF4DDE` | `#FFB07A` | `#14142B` |
| `periwinkle` | `#6667AB` | `#8FB8FF` | `#E66FA9` | `#F3ECFF` | `#111226` |
| `magenta` | `#BB2649` | `#F06A82` | `#29B8A6` | `#FFDCE4` | `#250A12` |
| `peach` | `#FFBE98` | `#FF8F70` | `#D987A3` | `#FFF0E7` | `#2A1516` |
| `mocha` | `#A47864` | `#D3A17E` | `#7FA18F` | `#F2E2D7` | `#211613` |
| `ivory` | `#F0EEE9` | `#AFC7D3` | `#C8B3D4` | `#FFFFFF` | `#171A20` |

```html
<orb-z preset="peach" state="listening"></orb-z>
```

The default palette is `gojhonny`. Omitting `preset` also allows individual
color overrides to merge with that default palette.

### Custom palette

Provide all or part of a palette with color attributes:

```html
<orb-z
  color-primary="#4F46E5"
  color-secondary="#22D3EE"
  color-accent="#F472B6"
  color-highlight="#FEF3C7"
  color-background="#0F172A"
></orb-z>
```

The corresponding keys in the exported `OrbzOptions` type are `colorPrimary`,
`colorSecondary`, `colorAccent`, `colorHighlight`, and `colorBackground`. On the
native element, use the documented kebab-case attributes.

Do not combine an explicit `preset` with custom color attributes. The preset
wins, custom attributes are ignored, and Orbz reports the conflict through
`console.error` so configuration mistakes are visible.

### Size, motion, and presentation

```html
<orb-z
  size="18rem"
  speed="1.2"
  reduced-motion="system"
  elevated
></orb-z>
```

| API | Values | Default |
| --- | --- | --- |
| `size` | Positive number or CSS size string | `16rem` |
| `speed` | Positive number | `1` |
| `paused` | Boolean attribute | absent |
| `elevated` | Boolean attribute | absent |
| `reduced-motion` | `system`, `always`, `never` | `system` |

Use `play()`, `pause()`, and `restart()` for imperative animation control.
`system` follows `prefers-reduced-motion`; `always` removes continuous motion;
`never` explicitly uses the full profile.

## Events

Orbz dispatches native `CustomEvent` instances from the host element:

```ts
orb.addEventListener('orbz-speaking-change', (event) => {
  const { speaking } = (event as CustomEvent<{ speaking: boolean }>).detail
  console.log({ speaking })
})

orb.addEventListener('orbz-talk-error', (event) => {
  const { error } = (event as CustomEvent<{ error: unknown }>).detail
  console.error(error)
})
```

`orbz-speaking-change` reports meaningful speech transitions.
`orbz-talk-error` reports adapter, activation, intelligence, and configuration
errors without embedding provider credentials in the package.

## Accessibility

The closed shadow tree is visual and marked `aria-hidden`. Decide what the host
means in the surrounding application:

- For a meaningful visual identity, supply an appropriate role and accessible
  name, such as `role="img" aria-label="Assistente de voz"`.
- For a purely decorative orb, hide the host from assistive technology.
- Keep spoken text available as visible text, captions, or a transcript.
- Use external status text or live regions for listening, thinking, speaking,
  and error announcements.
- Retain `reduced-motion="system"` unless the user has made a more specific
  application-level choice.

Palette and motion must not be the only way the application communicates
meaning.

## Server rendering and frameworks

The main package entry is safe to import when `HTMLElement` and
`customElements` are unavailable. Import the browser entry only in client code:

```ts
import type { OrbzElement } from '@gojhonny/orbz'

// Client boundary only:
await import('@gojhonny/orbz/browser')
```

React and Next.js can opt into native JSX typing without a wrapper component:

```ts
import '@gojhonny/orbz/react-types'
import '@gojhonny/orbz/browser'
```

The rendered UI remains `<orb-z>`. `className` is intentionally excluded from
the typed API because a host class cannot style the closed shadow tree; use
presets and documented properties for appearance, and an outer element for page
layout.

### Package entry points

| Import | Purpose |
| --- | --- |
| `@gojhonny/orbz` | Types, constants, factories, ports, adapters, and explicit registration API. |
| `@gojhonny/orbz/browser` | Main API plus browser registration side effect. |
| `@gojhonny/orbz/react-types` | Type-only React JSX augmentation. |
| `@gojhonny/orbz/standalone` | Direct-browser/CDN bundle. |
| `@gojhonny/orbz/index.css` | Explicit stylesheet export. |
| `orb` package binary | POSIX shell installer used by the explicit npx invocation above. |

<br>

## Contributing

The repository requires Node.js 24 and pnpm 10.32.1. Bootstrap a checkout with
the POSIX shell Orb CLI:

```bash
./cli/orb bootstrap
```

The equivalent manual flow is:

```bash
pnpm install --no-frozen-lockfile
pnpm run setup
./cli/orb git setup
./cli/orb doctor
```

Repository operations are owned by Orb rather than duplicated as package
scripts:

```bash
orb lint
orb typecheck
orb test
orb test --coverage
orb build
orb harness
orb audit
orb check
orb cleanup
```

`orb cleanup` (or `orb clean`) removes untracked generated state, including root
and nested `node_modules`, by default. Preview the targets or keep dependencies:

```bash
orb cleanup --dry-run
orb cleanup --keep-dependencies
```

The legacy `--dependencies` flag remains accepted. Cleanup preserves Git-tracked
paths, source, assets and harness directories, and never follows directory
symlinks. Run `orb bootstrap` after default cleanup to reinstall dependencies
before building or checking the repository.

Before the optional user-scoped launcher exists, use the repository entry point:

```bash
./cli/orb check
```

`package.json#scripts` intentionally keeps only the `setup` bridge and npm's
`prepack` lifecycle. `prepack` delegates to `./cli/orb check`, so `npm pack` and
`npm publish` still enforce the complete quality gate without reintroducing
public script aliases.

The same shell CLI is published as the `orb` package binary so that
`npx -y --package=@gojhonny/orbz@latest orb` can install Orbz into a
consuming project. Repository-only commands reject execution from the temporary npm package.

### Agent harness

`AGENTS.md` and `.agents/` are the cross-tool source of truth. Reusable procedures
live in `.agents/skills/`, explicit task sequences live in `.agents/workflows/`,
and deterministic checks live in `.audits/`.

Cursor adapters add a shell safety gate and post-edit Biome feedback through
`.cursor/hooks.json`. Package publication and destructive Git operations are
blocked for agents; release-boundary pushes, tags, merges, and version changes
require human approval.

Measure the pinned maturity model locally with:

```bash
./cli/orb harness .
```

CI independently enforces Harness Score `1.5.2` at maturity level L4.

### Git quality gates and semantic versioning

Run the Git setup after installing dependencies:

```bash
./cli/orb git setup
./cli/orb git doctor
```

Husky wires two thin shell adapters:

- `pre-commit` runs `orb git version-check --staged`, then lint-staged. Staged
  TypeScript, JavaScript, JSON, and CSS receive Biome checks; shell files receive
  `/bin/sh -n` syntax validation.
- `commit-msg` runs Commitlint with `@commitlint/config-conventional`.

Commit headers follow Conventional Commits, for example:

```text
feat(talk): add streaming speech delivery
fix(element): preserve state after cancellation
docs(readme): document custom palettes
```

Use `!` or a `BREAKING CHANGE` footer for incompatible public changes. Release
planning follows semantic versioning: `fix` and `perf` normally imply a patch,
`feat` implies a minor, and a breaking change implies a major. Orb verifies that
`package.json#version` is canonical SemVer and rejects a staged version change
that does not move forward:

```bash
orb git version-check
orb git version-check --staged
```

`orb check` runs Biome, source and colocated-test type checks, Vitest, both
builds, the SemVer check, and all versioned audits. CI also validates commit
messages through Orb and inspects the npm payload with `npm pack --dry-run`.
Tests live next to the source they verify; shared test setup and fixtures remain
under `test/`. The intentional package payload is `dist/`, the POSIX shell
`cli/`, and npm's standard root metadata.

<br>

## Release review

The [specification catalog](./.agents/specs/readme.md) records implementation
evidence and outstanding behavioral or live-provider acceptance. SPEC-016 through
SPEC-022 describe an earlier batch whose eligible PRs had owner authorization to
merge into `staging`; SPEC-024 records the separate first-major release plan.
Those historical authorizations do not apply to later work.

SPEC-026 covers the cleanup repair and ownership migration. Its scope ends at a
PR against `staging`, with version **1.0.0** unchanged and no merge, release tag
or npm publication. A future authorized release must configure npm ownership and
publishing for `@gojhonny/orbz`. The release workflow validates and packs source,
tags the exact commit, publishes that tarball, verifies npm integrity and creates
the GitHub release. A repository change or tag alone does not confirm publication.

When upgrading from 0.4.3, applications keep provider credentials on their backend
and supply an application session endpoint or authorizer through `realtimeSession`.
Never put credentials in attributes or `orbz.config.json`. `realtimeSession`
accepts only documented options and rejects unknown fields. Forks configure
component, palette and Realtime defaults in `src/orbz.config.json`; internal
appearance, motion and speech defaults live in the data modules listed above.
Rebuild to bundle these defaults into the package entry points. Real
microphone/provider acceptance remains separate from the automated tests.

<br>

## License

**MIT © gojhonny**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

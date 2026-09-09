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
  <a href="https://www.npmjs.com/package/@neongate-ai/orbz"><img alt="npm version" src="https://img.shields.io/npm/v/%40neongate-ai%2Forbz?logo=npm" height="20"></a>
</p>

<p align="center">
  <a href="https://orbz.site"><strong>Documentation</strong></a>&nbsp;&nbsp;&nbsp;
  <a href="https://www.npmjs.com/package/@neongate-ai/orbz"><strong>npm</strong></a>&nbsp;&nbsp;&nbsp;
  <a href="./LICENSE"><strong>MIT License</strong></a>
</p>

<br>

## Give your AI voice a presence

`@neongate-ai/orbz` is a framework-agnostic, SSR-safe Web Component for AI voice
interfaces. It gives conversations a visible identity through expressive motion,
conversation states, configurable palettes, and provider-neutral voice APIs —
without forcing your product into a specific frontend framework.

Orbz renders as the native `<orb-z>` custom element. Your application keeps
control of the persona, transcript experience, authentication, backend, memory,
and product logic.

### Why Orbz

| | |
| --- | --- |
| **Native Web Component** | Use the same `<orb-z>` element across modern web stacks. |
| **Voice ready** | Browser speech, application-hosted TTS, and OpenAI Realtime integration. |
| **Conversation states** | Built-in visual behavior for idle, listening, thinking, speaking, and asleep states. |
| **Brandable** | Presets, custom palettes, size, speed, elevation, and motion controls. |
| **SSR safe** | Import the core package without requiring browser globals. |
| **Accessible motion** | Built-in reduced-motion behavior with application-owned accessible status text. |
| **Provider neutral** | Keep your voice provider, session authorization, and backend architecture under your control. |
| **No runtime dependencies** | The package ships without third-party runtime dependencies. |

<br>

## Install

```bash
npm install @neongate-ai/orbz
```

Or with pnpm:

```bash
pnpm add @neongate-ai/orbz
```

Prefer a one-shot setup command?

```bash
npx -y --package=@neongate-ai/orbz@latest orb
```

<br>

## Quick start

Register the browser element from client-side code:

```ts
import '@neongate-ai/orbz/browser'
```

Then render Orbz anywhere you can render HTML:

```html
<orb-z
  role="img"
  aria-label="Voice assistant"
  preset="neongate"
  state="idle"
></orb-z>
```

Change the visual state as your conversation moves:

```ts
const orb = document.querySelector('orb-z')

orb?.setAttribute('state', 'listening')
orb?.setAttribute('state', 'thinking')
orb?.setAttribute('state', 'speaking')
```

<br>

## Add voice

### Browser speech

```ts
import {
  type OrbzElement,
  WebSpeechAdapter
} from '@neongate-ai/orbz'
import '@neongate-ai/orbz/browser'

const orb = document.querySelector<OrbzElement>('orb-z')!

orb.speech = 'Welcome. How can I help?'
orb.voiceEngine = new WebSpeechAdapter({ language: 'en-US' })

await orb.startTalking()
```

Orbz never invents speech content. Your product supplies the text and decides
when playback starts.

### OpenAI Realtime

```ts
import type { OrbzElement } from '@neongate-ai/orbz'
import '@neongate-ai/orbz/browser'

const orb = document.querySelector<OrbzElement>('orb-z')!

orb.voiceModel = {
  provider: 'openai-realtime',
  model: 'gpt-realtime-2'
}

orb.realtimeSession = {
  endpoint: '/api/voice/session',
  credentials: 'same-origin'
}

await orb.startConversation()
```

Your application owns `/api/voice/session`, authentication, allowed models,
provider credentials, tools, instructions, transcripts, usage controls, and
session policy. Permanent provider keys stay on your server — never in the
component, HTML, or public client configuration.

| Provider | Start with | Application supplies |
| --- | --- | --- |
| `web-speech` | `speech` + `startTalking()` | Text and optional browser voice preferences |
| `openai-speech` | `speech` + `startTalking()` | Application audio endpoint and optional model/voice |
| `openai-realtime` | `startConversation()` | Application session endpoint or authorizer |

<br>

## Conversation states

Orbz has five visual states designed around voice interaction:

| State | Use it for |
| --- | --- |
| `idle` | Ambient presence before or between turns |
| `listening` | Capturing user input |
| `thinking` | Processing or waiting for a response |
| `speaking` | Assistant audio playback |
| `asleep` | Inactive or subdued presence |

```html
<orb-z state="thinking"></orb-z>
```

When Orbz speaks through its talk API, it temporarily switches to `speaking` and
restores the previous state when speech completes or is cancelled.

<br>

## Make it yours

The default preset is **NeonGate** (`neongate`). Additional bundled presets are
`periwinkle`, `magenta`, `peach`, `mocha`, and `ivory`.

```html
<orb-z preset="peach" state="listening"></orb-z>
```

Need your own brand palette? Configure the native element directly:

```html
<orb-z
  color-primary="#4F46E5"
  color-secondary="#22D3EE"
  color-accent="#F472B6"
  color-highlight="#FEF3C7"
  color-background="#0F172A"
></orb-z>
```

Presentation controls stay intentionally small:

```html
<orb-z
  size="18rem"
  speed="1.2"
  reduced-motion="system"
  elevated
></orb-z>
```

Use `play()`, `pause()`, and `restart()` when your application needs imperative
motion control.

<br>

## Works with your stack

Orbz is a native custom element rather than a framework wrapper. That keeps the
UI primitive portable across React, Next.js, Vue, Svelte, Angular, vanilla
JavaScript, microfrontends, and mixed-stack applications.

The main package entry is safe to import during server rendering:

```ts
import type { OrbzElement } from '@neongate-ai/orbz'

// Run registration only inside the browser/client boundary.
await import('@neongate-ai/orbz/browser')
```

React and Next.js projects can opt into native JSX typing:

```ts
import '@neongate-ai/orbz/react-types'
import '@neongate-ai/orbz/browser'
```

The rendered component remains `<orb-z>` — no Orbz-specific React wrapper is
required.

<br>

## Events

Orbz communicates through native `CustomEvent` instances, so applications can
connect it to their own conversation, analytics, transcript, or memory layers.

| Event | Detail |
| --- | --- |
| `orbz-conversation-state-change` | Conversation state changes |
| `orbz-transcript` | User or assistant transcript updates |
| `orbz-speaking-change` | Audible speaking state changes |
| `orbz-talk-error` | Sanitized talk/provider errors |

```ts
orb.addEventListener('orbz-speaking-change', (event) => {
  const { speaking } = (event as CustomEvent<{ speaking: boolean }>).detail
  console.log({ speaking })
})
```

Orbz does not store transcript history or implement application memory. Forward
only the events your product actually needs.

<br>

## Security boundary

Orbz is a client-side interface primitive, not a credential vault.

Keep permanent provider keys on your backend. Realtime integrations should expose
an application-owned session endpoint or authorizer that authenticates the user,
enforces your allowed models and voices, and exchanges short-lived session data
with the provider.

The component owns the browser-side interaction surface. Your application owns
identity, authorization, quotas, billing, provider policy, server-side tools,
remote cleanup, and any long-term conversation data.

<br>

## Accessibility

The animated shadow content is visual and hidden from assistive technology. Your
application decides what the host means:

- give meaningful orbs an accessible role and name;
- hide purely decorative instances from assistive technology;
- keep spoken content available as visible text, captions, or transcript;
- announce listening, thinking, speaking, and errors through application-owned
  status text or live regions;
- keep `reduced-motion="system"` unless your product has an explicit user setting.

Motion or color should never be the only way your interface communicates state.

<br>

## Package entry points

| Import | Purpose |
| --- | --- |
| `@neongate-ai/orbz` | Types, constants, factories, ports, adapters, and explicit registration API |
| `@neongate-ai/orbz/browser` | Main API plus browser registration |
| `@neongate-ai/orbz/react-types` | React JSX type augmentation |
| `@neongate-ai/orbz/standalone` | Direct-browser/CDN bundle |
| `@neongate-ai/orbz/index.css` | Explicit stylesheet export |

For the full API, provider setup, configuration details, and implementation
guides, use the documentation site rather than the npm README.

<p align="center">
  <a href="https://orbz.site"><strong>Read the docs →</strong></a>
</p>

<br>

## License

[MIT](./LICENSE) © gojhonny

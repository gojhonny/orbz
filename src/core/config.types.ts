import type {
  OrbzAnimationValues,
  OrbzMotionProfile,
  OrbzTransition
} from '@core/motion/motion.types'

export type OrbzStates = readonly ['idle', 'listening', 'thinking', 'speaking', 'asleep']
export type OrbzReducedMotionModes = readonly ['system', 'always', 'never']
export type OrbzPresetNames = readonly [
  'neongate',
  'periwinkle',
  'magenta',
  'peach',
  'mocha',
  'ivory'
]
/** @deprecated Use the canonical NeonGate identifier in new configuration. */
type LegacyPresetNames = readonly ['gojhonny', ...OmitFirst<OrbzPresetNames>]
type OmitFirst<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest]
  ? Rest
  : never
export type OrbzColorKeys = readonly ['accent', 'background', 'highlight', 'primary', 'secondary']

type State = OrbzStates[number]
type Preset = OrbzPresetNames[number]
type Color = OrbzColorKeys[number]
type Layer = 'aura' | 'core' | 'field' | 'highlight' | 'ring' | 'root'

export type OrbzDeepReadonly<T> = T extends object
  ? { readonly [Key in keyof T]: OrbzDeepReadonly<T[Key]> }
  : T

export interface OrbzSerializedLayerMotion {
  animate: OrbzAnimationValues
  transition: Omit<OrbzTransition, 'repeat'> & { repeat?: number | 'infinite' }
}

export interface OrbzComponentConfiguration {
  tagName: 'orb-z'
  states: OrbzStates
  reducedMotionModes: OrbzReducedMotionModes
  defaultState: State
  defaultSize: string
  defaultSpeed: number
  defaultReducedMotion: OrbzReducedMotionModes[number]
  /** Base attributes in source JSON; includes derived color attributes at runtime. */
  observedAttributes: readonly string[]
}

export interface OrbzAppearanceConfiguration {
  defaultPreset: Preset
  presetNames: OrbzPresetNames
  colorKeys: OrbzColorKeys
  colorAttributes: { [Key in Color]: `color-${Key}` }
  presets: Record<Preset, Record<Color, string>>
  byState: Record<State, { contrast: number; saturation: number }>
}

/** Compatibility input for the preset identifier accidentally published in 1.0.1. */
interface LegacyAppearanceConfiguration
  extends Omit<OrbzAppearanceConfiguration, 'defaultPreset' | 'presetNames' | 'presets'> {
  defaultPreset: LegacyPresetNames[number]
  presetNames: LegacyPresetNames
  presets: Record<LegacyPresetNames[number], Record<Color, string>>
}

interface OrbzRuntimeAppearanceConfiguration extends OrbzAppearanceConfiguration {
  presets: OrbzAppearanceConfiguration['presets'] & {
    /** @deprecated Use neongate; retained as a non-enumerable palette alias. */
    gojhonny: Record<Color, string>
  }
}

export interface OrbzMotionConfigurationSource {
  animatedStyleProperties: readonly string[]
  easings: { easeInOut: string; easeOut: string; linear: string }
  full: Record<State, Record<Layer, OrbzSerializedLayerMotion>>
  reduced: Record<State, Record<Layer, OrbzSerializedLayerMotion>>
}

export interface OrbzSpeechConfiguration {
  defaultVoiceModel: null | 'web-speech' | 'openai-speech' | 'openai-realtime'
  models: readonly ['web-speech', 'openai-speech', 'openai-realtime']
  /** Package defaults intentionally contain no consumer conversation copy. */
  talk: Record<string, never>
  defaultTalkFlow: readonly never[]
  tokenPattern: { source: string; flags: string }
  webSpeech: {
    language: string
    pitch: number
    rate: number
    volume: number
    preferredVoices: readonly string[]
    voiceLoadTimeoutMs: number
    speechStartTimeoutMs: number
  }
  openaiSpeech: {
    model: string
    responseFormat: 'aac' | 'flac' | 'mp3' | 'opus' | 'wav'
    voice: string
    legacyVoice: string
    instructions: string
    credentials: RequestCredentials
    requestTimeoutMs: number
  }
}

export interface OrbzRealtimeConfiguration {
  maxEventBytes: number
  maxTranscriptLength: number
  openai: {
    model: string
    voice: string
    credentials: RequestCredentials
    sessionTimeoutMs: number
    dataChannelLabel: string
  }
}

/** Compact build input; legacy internal overrides remain supported. */
export interface OrbzConfigurationSource {
  component: OrbzComponentConfiguration
  appearance: (
    | Omit<OrbzAppearanceConfiguration, 'byState'>
    | Omit<LegacyAppearanceConfiguration, 'byState'>
  ) & {
    byState?: OrbzAppearanceConfiguration['byState']
  }
  motion?: OrbzMotionConfigurationSource
  speech?: OrbzSpeechConfiguration
  realtime: OrbzRealtimeConfiguration
}

/** Validated source after composing omitted internal defaults. */
export interface OrbzResolvedConfigurationSource
  extends Omit<OrbzConfigurationSource, 'appearance' | 'motion' | 'speech'> {
  appearance: OrbzAppearanceConfiguration
  motion: OrbzMotionConfigurationSource
  speech: OrbzSpeechConfiguration
}

export interface OrbzMotionConfiguration
  extends Omit<OrbzMotionConfigurationSource, 'full' | 'reduced'> {
  full: Record<State, OrbzMotionProfile>
  reduced: Record<State, OrbzMotionProfile>
}

export interface OrbzRuntimeConfiguration
  extends Omit<OrbzResolvedConfigurationSource, 'appearance' | 'motion'> {
  appearance: OrbzRuntimeAppearanceConfiguration
  motion: OrbzMotionConfiguration
}

export type OrbzConfiguration = OrbzDeepReadonly<OrbzRuntimeConfiguration>

/** The bundled defaults retain the same accurate configurable contracts. */
export type OrbzBundledConfiguration = OrbzConfiguration

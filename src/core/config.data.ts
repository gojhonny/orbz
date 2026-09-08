import { deepFreezeOrbzConfiguration } from '@core/lib/deep-freeze.compute'

import { orbzConfiguration } from './configuration.data'

export { orbzConfiguration } from './configuration.data'

export const ORBZ_STATES = orbzConfiguration.component.states
export const ORBZ_REDUCED_MOTION_MODES = orbzConfiguration.component.reducedMotionModes
export const ORBZ_PRESET_NAMES = orbzConfiguration.appearance.presetNames
export const ORBZ_PRESETS = orbzConfiguration.appearance.presets
export const DEFAULT_ORBZ_PRESET = orbzConfiguration.appearance.defaultPreset
export const DEFAULT_ORBZ_COLORS = ORBZ_PRESETS[DEFAULT_ORBZ_PRESET]
export const DEFAULT_ORBZ_SIZE = orbzConfiguration.component.defaultSize
export const DEFAULT_ORBZ_SPEED = orbzConfiguration.component.defaultSpeed
export const DEFAULT_ORBZ_STATE = orbzConfiguration.component.defaultState
export const DEFAULT_ORBZ_REDUCED_MOTION = orbzConfiguration.component.defaultReducedMotion
export const ORBZ_COLOR_ATTRIBUTES = orbzConfiguration.appearance.colorAttributes
export const ORBZ_COLOR_KEYS = orbzConfiguration.appearance.colorKeys

export const ORBZ_VOICE_DEFAULTS = deepFreezeOrbzConfiguration({
  webSpeech: orbzConfiguration.speech.webSpeech,
  openaiSpeech: orbzConfiguration.speech.openaiSpeech,
  openaiRealtime: orbzConfiguration.realtime.openai
})

/** Compatibility bindings derived from compact JSON and internal data defaults. */
export const config = deepFreezeOrbzConfiguration({
  DEFAULT_ORBZ_COLORS,
  DEFAULT_ORBZ_PRESET,
  DEFAULT_ORBZ_REDUCED_MOTION,
  DEFAULT_ORBZ_SIZE,
  DEFAULT_ORBZ_SPEED,
  DEFAULT_ORBZ_STATE,
  ORBZ_COLOR_ATTRIBUTES,
  ORBZ_COLOR_KEYS,
  ORBZ_PRESET_NAMES,
  ORBZ_PRESETS,
  ORBZ_REDUCED_MOTION_MODES,
  ORBZ_STATES
})

import type { ORBZ_PRESET_NAMES, ORBZ_REDUCED_MOTION_MODES, ORBZ_STATES } from '@core/config.data'

export type OrbzState = (typeof ORBZ_STATES)[number]
export type OrbzReducedMotion = (typeof ORBZ_REDUCED_MOTION_MODES)[number]
/** @deprecated Use neongate; the accidentally published name remains accepted. */
type LegacyPresetName = 'gojhonny'
export type OrbzPresetName = (typeof ORBZ_PRESET_NAMES)[number] | LegacyPresetName
export type OrbzSize = number | string

export interface OrbzColors {
  accent: string
  background: string
  highlight: string
  primary: string
  secondary: string
}

export type OrbzColorOverrides = Partial<OrbzColors>

export interface OrbzPresetOptions {
  colorAccent?: never
  colorBackground?: never
  colorHighlight?: never
  colorPrimary?: never
  colorSecondary?: never
  preset?: OrbzPresetName
}

export interface OrbzCustomColorOptions {
  colorAccent?: string
  colorBackground?: string
  colorHighlight?: string
  colorPrimary?: string
  colorSecondary?: string
  preset?: never
}

export type OrbzColorSelection = OrbzPresetOptions | OrbzCustomColorOptions

export interface OrbzBaseOptions {
  elevated?: boolean
  paused?: boolean
  reducedMotion?: OrbzReducedMotion
  size?: OrbzSize
  speech?: string
  speed?: number
  state?: OrbzState
}

export type OrbzOptions = OrbzBaseOptions & OrbzColorSelection

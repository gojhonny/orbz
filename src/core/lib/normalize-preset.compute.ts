import type { OrbzPresetName } from '@core/appearance/appearance.types'
import { DEFAULT_ORBZ_PRESET } from '@core/config.data'

import { isOrbzPresetName } from './is-preset-name.guard'

export function normalizeOrbzPreset(value: unknown): OrbzPresetName {
  if (value === 'gojhonny') return 'neongate'
  return isOrbzPresetName(value) ? value : DEFAULT_ORBZ_PRESET
}

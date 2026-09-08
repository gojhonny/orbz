import type { OrbzPresetName } from '@core/appearance/appearance.types'
import { ORBZ_PRESET_NAMES } from '@core/config.data'

export function isOrbzPresetName(value: unknown): value is OrbzPresetName {
  return (
    typeof value === 'string' &&
    (value === 'gojhonny' || (ORBZ_PRESET_NAMES as readonly string[]).includes(value))
  )
}

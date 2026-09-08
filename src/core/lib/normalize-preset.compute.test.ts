import { DEFAULT_ORBZ_PRESET } from '@core/config.data'
import { describe, expect, it } from 'vitest'
import { isOrbzPresetName } from './is-preset-name.guard'
import { normalizeOrbzPreset } from './normalize-preset.compute'

describe('core/normalize-preset', () => {
  it('normalizes invalid input to the stable default', () => {
    expect(normalizeOrbzPreset('unknown')).toBe(DEFAULT_ORBZ_PRESET)
  })

  it('accepts NeonGate and normalizes the deprecated published alias', () => {
    expect(isOrbzPresetName('neongate')).toBe(true)
    expect(isOrbzPresetName('gojhonny')).toBe(true)
    expect(normalizeOrbzPreset('neongate')).toBe('neongate')
    expect(normalizeOrbzPreset('gojhonny')).toBe('neongate')
    expect(normalizeOrbzPreset('peach')).toBe('peach')
    expect(isOrbzPresetName('unknown')).toBe(false)
  })
})

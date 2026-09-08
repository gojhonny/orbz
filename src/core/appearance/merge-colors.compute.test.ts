import {
  DEFAULT_ORBZ_COLORS,
  DEFAULT_ORBZ_PRESET,
  ORBZ_PRESET_NAMES,
  ORBZ_PRESETS,
  orbzConfiguration
} from '@core/config.data'
import { describe, expect, it } from 'vitest'
import { mergeOrbzColors } from './merge-colors.compute'

describe('core/merge-colors', () => {
  it('preserves the established NeonGate name and five-color palette', () => {
    expect(DEFAULT_ORBZ_PRESET).toBe('neongate')
    expect(mergeOrbzColors()).toEqual({
      accent: '#FF4DDE',
      background: '#14142B',
      highlight: '#FFB07A',
      primary: '#6C5CFF',
      secondary: '#00E9FF'
    })
  })

  it('enumerates six canonical presets while preserving the deprecated palette alias', () => {
    expect(ORBZ_PRESET_NAMES).toEqual([
      'neongate',
      'periwinkle',
      'magenta',
      'peach',
      'mocha',
      'ivory'
    ])
    expect(Object.keys(ORBZ_PRESETS)).toEqual(ORBZ_PRESET_NAMES)
    expect(ORBZ_PRESETS.gojhonny).toBe(ORBZ_PRESETS.neongate)
    expect(orbzConfiguration.appearance.presets).toBe(ORBZ_PRESETS)
    expect(Object.isFrozen(ORBZ_PRESETS.gojhonny)).toBe(true)
    expect(Reflect.set(ORBZ_PRESETS, 'gojhonny', {})).toBe(false)
    expect(Reflect.set(ORBZ_PRESETS.gojhonny, 'primary', '#000000')).toBe(false)
  })

  it('merges an override without mutating the default preset', () => {
    const colors = mergeOrbzColors({ primary: '#000000' })

    expect(colors).toEqual({ ...DEFAULT_ORBZ_COLORS, primary: '#000000' })
    expect(ORBZ_PRESETS.neongate.primary).not.toBe('#000000')
  })
})

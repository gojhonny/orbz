import { DEFAULT_ORBZ_COLORS, DEFAULT_ORBZ_PRESET, ORBZ_PRESETS } from '@core/config.data'
import { describe, expect, it } from 'vitest'
import { mergeOrbzColors } from './merge-colors.compute'

describe('core/merge-colors', () => {
  it('preserves the established five-color palette under the new default name', () => {
    expect(DEFAULT_ORBZ_PRESET).toBe('gojhonny')
    expect(mergeOrbzColors()).toEqual({
      accent: '#FF4DDE',
      background: '#14142B',
      highlight: '#FFB07A',
      primary: '#6C5CFF',
      secondary: '#00E9FF'
    })
  })

  it('merges an override without mutating the default preset', () => {
    const colors = mergeOrbzColors({ primary: '#000000' })

    expect(colors).toEqual({ ...DEFAULT_ORBZ_COLORS, primary: '#000000' })
    expect(ORBZ_PRESETS.gojhonny.primary).not.toBe('#000000')
  })
})

import configuration from '@configuration'
import { ORBZ_DEFAULT_APPEARANCE_BY_STATE } from '@core/appearance/appearance.data'
import { ORBZ_DEFAULT_MOTION } from '@core/motion/default-motion.data'
import { ORBZ_DEFAULT_SPEECH } from '@talk/default-speech.data'
import { describe, expect, it, vi } from 'vitest'

import { transformOrbzConfiguration } from './transform-configuration.compute'
import { readOrbzConfigurationSource } from './validate-configuration.compute'

describe('core/transform-configuration', () => {
  function legacySource() {
    return readOrbzConfigurationSource({
      ...configuration,
      appearance: { ...configuration.appearance, byState: ORBZ_DEFAULT_APPEARANCE_BY_STATE },
      motion: ORBZ_DEFAULT_MOTION,
      speech: ORBZ_DEFAULT_SPEECH
    })
  }

  it('composes compact JSON into the same isolated runtime as the legacy complete source', () => {
    const input = structuredClone(configuration)
    const before = structuredClone(input)
    const result = transformOrbzConfiguration(input)
    const next = transformOrbzConfiguration(input)

    expect(Object.keys(input)).toEqual(['component', 'appearance', 'realtime'])
    expect(input.appearance).not.toHaveProperty('byState')
    expect(result).toEqual(transformOrbzConfiguration(legacySource()))
    expect(result.speech).toEqual(ORBZ_DEFAULT_SPEECH)
    expect(result.appearance.byState).toEqual(ORBZ_DEFAULT_APPEARANCE_BY_STATE)
    expect(result.speech.defaultVoiceModel).toBeNull()
    expect(result.speech.defaultTalkFlow).toEqual([])
    expect(result.motion.full.idle.root.transition.repeat).toBe(Number.POSITIVE_INFINITY)
    expect(result.speech).not.toBe(ORBZ_DEFAULT_SPEECH)
    expect(result.speech).not.toBe(next.speech)
    expect(Object.isFrozen(result.speech.webSpeech.preferredVoices)).toBe(true)
    expect(Object.isFrozen(result.motion.reduced.idle.root.animate)).toBe(true)
    expect(input).toEqual(before)
  })

  it.each([
    'motion',
    'speech'
  ])('rejects an explicitly invalid %s instead of using defaults', (key) => {
    expect(() => transformOrbzConfiguration({ ...configuration, [key]: null })).toThrow(
      `Invalid Orbz configuration at $.${key}: expected an object.`
    )
  })

  it('rejects invalid explicit state appearance instead of using defaults', () => {
    expect(() =>
      transformOrbzConfiguration({
        ...configuration,
        appearance: { ...configuration.appearance, byState: null }
      })
    ).toThrow('Invalid Orbz configuration at $.appearance.byState: expected an object.')
  })

  it('derives editable defaults into an isolated immutable runtime configuration', () => {
    const input = legacySource()
    input.component.defaultSize = '32rem'
    input.appearance.defaultPreset = 'peach'
    input.appearance.byState.listening.contrast = 1.7
    input.motion.full.listening.root.transition.repeat = 'infinite'
    const before = structuredClone(input)

    const result = transformOrbzConfiguration(input)

    expect(result.component.defaultSize).toBe('32rem')
    expect(result.appearance.defaultPreset).toBe('peach')
    expect(result.motion.full.listening.contrast).toBe(1.7)
    expect(result.motion.full.listening.root.transition.repeat).toBe(Number.POSITIVE_INFINITY)
    expect(result.component.observedAttributes).toContain('color-primary')
    expect(input).toEqual(before)
    expect(Object.isFrozen(input.appearance.presets.peach)).toBe(false)
    expect(Object.isFrozen(result)).toBe(true)
    expect(Object.isFrozen(result.appearance.presets.peach)).toBe(true)
    expect(Object.isFrozen(result.motion.full.listening.root.animate)).toBe(true)
    expect(Object.isFrozen(result.component.observedAttributes)).toBe(true)
    expect(Reflect.set(result.appearance.presets.peach, 'primary', '#000')).toBe(false)

    input.appearance.presets.peach.primary = '#000'
    Object.assign(input.motion.full.listening.root.transition, {
      repeat: 'changed-after-transform'
    })
    expect(result.appearance.presets.peach.primary).toBe(before.appearance.presets.peach.primary)
    expect(result.motion.full.listening.root.transition.repeat).toBe(Number.POSITIVE_INFINITY)
  })

  it('rejects a default preset that does not resolve to a supported palette', () => {
    const input = structuredClone(configuration)
    input.appearance.defaultPreset = 'missing-palette'

    expect(() => transformOrbzConfiguration(input)).toThrow(
      'Invalid Orbz configuration at $.appearance.defaultPreset: unsupported value or reference.'
    )
  })

  it('rejects undeclared secret fields without including their values in diagnostics', () => {
    const input = structuredClone(configuration)
    Object.assign(input.realtime.openai, { apiKey: 'private-configuration-value' })

    expect(() => transformOrbzConfiguration(input)).toThrow(
      new TypeError('Invalid Orbz configuration at $.realtime.openai: unknown configuration field.')
    )
  })

  it('rejects accessor input without executing the getter', () => {
    const input = structuredClone(configuration)
    const getter = vi.fn(() => 2)
    Object.defineProperty(input.component, 'defaultSpeed', { enumerable: true, get: getter })

    expect(() => transformOrbzConfiguration(input)).toThrow(
      new TypeError('Invalid Orbz configuration at $: JSON accessors are not allowed.')
    )
    expect(getter).not.toHaveBeenCalled()
  })

  it('rejects infinite repetition in reduced motion profiles', () => {
    const input = legacySource()
    Object.assign(input.motion.reduced.listening.root.transition, { repeat: 'infinite' })

    expect(() => transformOrbzConfiguration(input)).toThrow(
      'Invalid Orbz configuration at $.motion.reduced.listening.root.transition.repeat'
    )
  })
})

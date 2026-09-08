import type {
  OrbzConfiguration,
  OrbzMotionConfigurationSource,
  OrbzResolvedConfigurationSource,
  OrbzSerializedLayerMotion
} from '@core/config.types'
import type { OrbzLayerMotion, OrbzMotionProfile } from '@core/motion/motion.types'

import { deepFreezeOrbzConfiguration } from './deep-freeze.compute'
import { readOrbzConfigurationSource } from './validate-configuration.compute'

/**
 * Validate serializable configuration and derive an isolated, deeply readonly
 * runtime tree. Invalid input throws TypeError with a schema path and no values.
 * This function does not read files, fetch resources or initialize browser APIs.
 */
export function transformOrbzConfiguration(input: unknown): OrbzConfiguration {
  const source = readOrbzConfigurationSource(input)
  // Keep the published palette lookup without exposing a seventh preset.
  const presets = Object.defineProperty(source.appearance.presets, 'gojhonny', {
    value: source.appearance.presets.neongate,
    enumerable: false
  }) as OrbzConfiguration['appearance']['presets']
  return deepFreezeOrbzConfiguration({
    ...source,
    appearance: { ...source.appearance, presets },
    component: {
      ...source.component,
      observedAttributes: [
        ...source.component.observedAttributes,
        ...Object.values(source.appearance.colorAttributes)
      ]
    },
    motion: {
      ...source.motion,
      full: motionProfiles(source.motion.full, source.appearance.byState),
      reduced: motionProfiles(source.motion.reduced, source.appearance.byState)
    }
  })
}

function motionProfiles(
  profiles: OrbzMotionConfigurationSource['full'],
  appearance: OrbzResolvedConfigurationSource['appearance']['byState']
): Record<OrbzResolvedConfigurationSource['component']['states'][number], OrbzMotionProfile> {
  return Object.fromEntries(
    Object.entries(profiles).map(([state, layers]) => [
      state,
      {
        ...appearance[state as keyof typeof appearance],
        aura: layerMotion(layers.aura),
        core: layerMotion(layers.core),
        field: layerMotion(layers.field),
        highlight: layerMotion(layers.highlight),
        ring: layerMotion(layers.ring),
        root: layerMotion(layers.root)
      }
    ])
  ) as Record<OrbzResolvedConfigurationSource['component']['states'][number], OrbzMotionProfile>
}

function layerMotion(layer: OrbzSerializedLayerMotion): OrbzLayerMotion {
  const { repeat, ...transition } = layer.transition
  return {
    animate: layer.animate,
    transition: {
      ...transition,
      ...(repeat === undefined
        ? {}
        : {
            repeat: repeat === 'infinite' ? Number.POSITIVE_INFINITY : repeat
          })
    }
  }
}

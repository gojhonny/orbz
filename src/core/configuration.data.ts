import bundledSource from '@configuration'
import { transformOrbzConfiguration } from '@core/lib/transform-configuration.compute'

import type { OrbzBundledConfiguration } from './config.types'

// The JSON is bundled into every entry point; importing never performs I/O.
export const orbzConfiguration = transformOrbzConfiguration(
  bundledSource
) as OrbzBundledConfiguration

import type {
  MagicFixComponentConfigSchema,
  MagicFixConfigSchema,
  MagicFixStitchLineConfigSchema,
} from '../../../../../schemas/magicFixConfig'
import { isDefined } from '../../../../../utils/isDefined'

export const getMagicFixComponentConfig = (
  config: MagicFixConfigSchema,
  componentId: string,
): MagicFixComponentConfigSchema => {
  const componentConfig = config.componentConfigs[componentId]
  if (!isDefined(componentConfig)) {
    throw new Error(`Missing Magic Fix component config: "${componentId}"!`)
  }
  return componentConfig
}

export const getMagicFixStitchLineConfig = (
  config: MagicFixConfigSchema,
  stitchLineId: string,
): MagicFixStitchLineConfigSchema => {
  const stitchLineConfig = config.stitchLineConfigs[stitchLineId]
  if (!isDefined(stitchLineConfig)) {
    throw new Error(`Missing Magic Fix stitch line config: "${stitchLineId}"!`)
  }
  return stitchLineConfig
}

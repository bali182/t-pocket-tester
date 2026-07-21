import type {
  ResolvedStitchLineSchema,
  StitchLineCommonConfigSchema,
  StitchLineSchema,
} from '../schemas/stitching'

export const getResolvedStitchLine = (
  stitchLine: StitchLineSchema,
  stitchingSettings: StitchLineCommonConfigSchema,
): ResolvedStitchLineSchema => {
  return {
    ...stitchingSettings,
    ...stitchLine,
  }
}

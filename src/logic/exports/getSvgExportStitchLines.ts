import type { ComputedStitchLineSchema } from '../../schemas/computed'
import type { PathSchema } from '../../schemas/geometry'
import type { ComputedProjectSchema, ProjectSchema } from '../../schemas/project'
import type { StitchLineCommonConfigSchema, StitchLineSchema } from '../../schemas/stitching'
import type { SvgExportStitchLineModeSchema, SvgExportStitchLineSchema } from '../../schemas/svgExport'
import { getResolvedStitchLine } from '../../utils/getResolvedStitchLine'
import { isDefined } from '../../utils/isDefined'
import { clipPathToClosedPath } from '../clipPathToClosedPath'
import { isPointInClosedPath } from '../isPointInClosedPath'

export const getSvgExportStitchLines = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  clippingPath: PathSchema,
  ownComponentId: string,
  stitchLineMode: SvgExportStitchLineModeSchema,
): SvgExportStitchLineSchema[] => {
  const candidateStitchLines = getCandidateStitchLines(
    project.stitchLines,
    computedProject.stitchLines,
    ownComponentId,
    stitchLineMode,
  )

  return candidateStitchLines.flatMap((stitchLine) => {
    const computedStitchLine = computedProject.stitchLines.find(
      (candidateComputedStitchLine) => candidateComputedStitchLine.stitchLineId === stitchLine.id,
    )

    if (!isDefined(computedStitchLine)) {
      return []
    }

    const svgExportStitchLine = getSvgExportStitchLine(
      stitchLine,
      computedStitchLine,
      project.stitchingSettings,
      clippingPath,
    )

    return isDefined(svgExportStitchLine) ? [svgExportStitchLine] : []
  })
}

const getCandidateStitchLines = (
  stitchLines: StitchLineSchema[],
  computedStitchLines: ComputedStitchLineSchema[],
  ownComponentId: string,
  stitchLineMode: SvgExportStitchLineModeSchema,
): StitchLineSchema[] => {
  switch (stitchLineMode) {
    case 'own-stitch-lines':
      return stitchLines.filter((stitchLine) => {
        const computedStitchLine = computedStitchLines.find(
          (candidateComputedStitchLine) => candidateComputedStitchLine.stitchLineId === stitchLine.id,
        )
        return isDefined(computedStitchLine) && computedStitchLine.componentId === ownComponentId
      })
    case 'all-stitch-lines':
      return stitchLines
  }
}

const getSvgExportStitchLine = (
  stitchLine: StitchLineSchema,
  computedStitchLine: ComputedStitchLineSchema,
  stitchingSettings: StitchLineCommonConfigSchema,
  clippingPath: PathSchema,
): SvgExportStitchLineSchema | undefined => {
  const paths = computedStitchLine.routes.flatMap((route) => clipPathToClosedPath(route.path, clippingPath))
  const holes = computedStitchLine.routes.flatMap((route) => {
    return route.holes.filter((hole) => isPointInClosedPath(hole.center, clippingPath))
  })

  if (paths.length === 0 && holes.length === 0) {
    return undefined
  }

  return {
    stitchLine: getResolvedStitchLine(stitchLine, stitchingSettings),
    paths,
    holes,
  }
}

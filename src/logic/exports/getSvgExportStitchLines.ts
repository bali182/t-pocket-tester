import type {
  ComputedPanelSchema,
  ComputedRootPanelSchema,
  ComputedStitchLineSchema,
  ComputedStitchRouteSchema,
  ComputedTopPocketSchema,
  ComputedTPocketSchema,
} from '../../schemas/computed'
import type { PathSchema } from '../../schemas/geometry'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import type { StitchLineCommonConfigSchema, StitchLineSchema } from '../../schemas/stitching'
import type { SvgExportStitchLineModeSchema, SvgExportStitchLineSchema } from '../../schemas/svgExport'
import { getResolvedStitchLine } from '../../utils/getResolvedStitchLine'
import { isDefined } from '../../utils/isDefined'
import { clipPathToClosedPath } from '../clipPathToClosedPath'
import { isPointInClosedPath } from '../isPointInClosedPath'

type ComputedSvgExportStitchLineTarget =
  | ComputedRootPanelSchema
  | ComputedPanelSchema
  | ComputedTopPocketSchema
  | ComputedTPocketSchema

export const getSvgExportStitchLines = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  target: ComputedSvgExportStitchLineTarget,
  stitchLineMode: SvgExportStitchLineModeSchema,
): SvgExportStitchLineSchema[] => {
  const candidateStitchLines = getCandidateStitchLines(
    subProject.stitchLines,
    computedSubProject.stitchLines,
    getTargetComponentId(target),
    stitchLineMode,
  )

  return candidateStitchLines.flatMap((stitchLine) => {
    const computedStitchLine = computedSubProject.stitchLines.find(
      (candidateComputedStitchLine) => candidateComputedStitchLine.stitchLineId === stitchLine.id,
    )

    if (!isDefined(computedStitchLine)) {
      return []
    }

    const svgExportStitchLine = getSvgExportStitchLine(
      stitchLine,
      computedStitchLine,
      subProject.stitchingSettings,
      target.path,
      getExportRoutes(computedSubProject, stitchLine, computedStitchLine, target, stitchLineMode),
    )

    return isDefined(svgExportStitchLine) ? [svgExportStitchLine] : []
  })
}

const getTargetComponentId = (target: ComputedSvgExportStitchLineTarget): string => {
  switch (target.type) {
    case 'computed-root-panel':
    case 'computed-panel':
      return target.componentId
    case 'computed-top-pocket':
    case 'computed-t-pocket':
      return target.ownerComponentId
  }
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
  routes: ComputedStitchRouteSchema[],
): SvgExportStitchLineSchema | undefined => {
  const paths = routes.flatMap((route) => clipPathToClosedPath(route.path, clippingPath))
  const holes = routes.flatMap((route) => {
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

const getExportRoutes = (
  computedProject: ComputedSubProjectSchema,
  stitchLine: StitchLineSchema,
  computedStitchLine: ComputedStitchLineSchema,
  target: ComputedSvgExportStitchLineTarget,
  stitchLineMode: SvgExportStitchLineModeSchema,
): ComputedStitchRouteSchema[] => {
  if (stitchLineMode === 'all-stitch-lines' || stitchLine.type !== 'pocket-cluster-stitch-line') {
    return computedStitchLine.routes
  }

  if (target.type === 'computed-top-pocket') {
    return []
  }

  if (target.type !== 'computed-t-pocket') {
    return computedStitchLine.routes
  }

  const ownerComponent = computedProject.components[target.ownerComponentId]

  if (!isDefined(ownerComponent) || ownerComponent.type !== 'computed-pocket-cluster') {
    return []
  }

  const pocketIndex = ownerComponent.tPockets.findIndex((pocket) => pocket.id === target.id)
  const route = computedStitchLine.routes[pocketIndex]

  return isDefined(route) ? [route] : []
}

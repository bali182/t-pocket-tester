import type { ComputedPocketClusterSchema } from '../../../../schemas/computed'
import type { PathSchema } from '../../../../schemas/geometry'
import type {
  MagicFixArcBoundaryFragmentSchema,
  MagicFixBoundaryFragmentSchema,
  MagicFixBoundaryOwnerSchema,
  MagicFixLineBoundaryFragmentSchema,
} from '../../../../schemas/magicFixIssues'
import type { ComputedSubProjectSchema } from '../../../../schemas/subProject'
import type { PathSegment } from '../../../pathSegmentTypes'
import { getPathSegments } from '../../../pathSegments'

export type PhysicalBoundaryFragment = {
  boundary: MagicFixBoundaryFragmentSchema
  segment: PathSegment
}

export type PhysicalBoundaryElement = {
  componentId: string
  path: PathSchema
  fragments: PhysicalBoundaryFragment[]
}

export const getPhysicalBoundaryElements = (computed: ComputedSubProjectSchema): PhysicalBoundaryElement[] => {
  return Object.values(computed.components).flatMap((component): PhysicalBoundaryElement[] => {
    switch (component.type) {
      case 'computed-root-panel':
      case 'computed-panel':
        return [
          createPhysicalBoundaryElement(component.componentId, component.uncutPath, {
            componentId: component.componentId,
            element: 'component',
          }),
        ]
      case 'computed-pocket-cluster':
        return getPocketClusterBoundaryElements(component)
    }
  })
}

const getPocketClusterBoundaryElements = (component: ComputedPocketClusterSchema): PhysicalBoundaryElement[] => {
  const frontPocketOwner: MagicFixBoundaryOwnerSchema = {
    componentId: component.componentId,
    element: 'front-pocket',
  }
  const frontPocket = createPhysicalBoundaryElement(
    component.componentId,
    component.frontPocket.uncutPath,
    frontPocketOwner,
  )
  const tPockets = component.tPockets.map((pocket, tPocketIndex) =>
    createPhysicalBoundaryElement(component.componentId, pocket.uncutPath, {
      componentId: component.componentId,
      element: 't-pocket',
      tPocketIndex,
    }),
  )

  return [frontPocket, ...tPockets]
}

const createPhysicalBoundaryElement = (
  componentId: string,
  path: PathSchema,
  owner: MagicFixBoundaryOwnerSchema,
): PhysicalBoundaryElement => ({
  componentId,
  path,
  fragments: getPathSegments(path, true).map((segment) => ({
    segment,
    boundary: createBoundaryFragment(owner, segment),
  })),
})

const createBoundaryFragment = (
  owner: MagicFixBoundaryOwnerSchema,
  segment: PathSegment,
): MagicFixBoundaryFragmentSchema => {
  if (segment.type === 'line') {
    const boundary: MagicFixLineBoundaryFragmentSchema = { type: 'line', owner, start: segment.start, end: segment.end }
    return boundary
  }

  const boundary: MagicFixArcBoundaryFragmentSchema = {
    type: 'arc',
    owner,
    start: segment.start,
    end: segment.end,
    center: segment.center,
    radius: segment.radius,
  }
  return boundary
}

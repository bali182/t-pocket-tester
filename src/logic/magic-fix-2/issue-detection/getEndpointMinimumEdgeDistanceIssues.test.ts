import { describe, expect, it } from 'vitest'

import type { PocketClusterSchema, RootPanelSchema } from '../../../schemas/components'
import type { MagicFixConfigSchema } from '../../../schemas/magicFixConfig'
import type { ProjectSchema } from '../../../schemas/project'
import type { ComponentBoundsStitchLineSchema, PocketClusterStitchLineSchema } from '../../../schemas/stitching'
import type { SubProjectSchema } from '../../../schemas/subProject'
import { createMagicFixConfig } from '../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../getComputedProject'
import { getEndpointMinimumEdgeDistanceIssues } from './getEndpointMinimumEdgeDistanceIssues'
import type { MagicFixIssueDetectorInput } from './types'

const rootId = 'root'
const clusterId = 'cluster'

describe('getEndpointMinimumEdgeDistanceIssues', () => {
  it('reports endpoint clearances below the configured minimum', () => {
    const issues = getIssues({ minimumDistance: 2 })

    expect(issues).toHaveLength(2)
    expect(issues.every((issue) => issue.boundary.owner.componentId === rootId)).toBe(true)
  })

  it('accepts endpoint clearances within the configured accuracy', () => {
    expect(getIssues({ minimumDistance: 1.05, accuracy: 0.1 })).toEqual([])
  })

  it('does not judge the lateral stitch margin', () => {
    const issues = getIssues({ minimumDistance: 3, rootRadius: 5, rootWidth: 100 })

    expect(issues).toEqual([])
  })

  it('ignores a closed computed route', () => {
    expect(getIssues({ minimumDistance: 10, closed: true })).toEqual([])
  })

  it('uses the computed T-pocket path and cluster configuration', () => {
    const issues = getIssues({ minimumDistance: 100, usePocketCluster: true })

    expect(issues.some((issue) => issue.boundary.owner.element === 't-pocket')).toBe(true)
  })
})

type Options = { accuracy?: number; closed?: boolean; minimumDistance: number; rootRadius?: number; rootWidth?: number; usePocketCluster?: boolean }

const getIssues = (options: Options) => getEndpointMinimumEdgeDistanceIssues(createInput(options))

const createInput = ({ accuracy = 0.01, closed = false, minimumDistance, rootRadius = 0, rootWidth = 12, usePocketCluster = false }: Options): MagicFixIssueDetectorInput => {
  const subProject = createSubProject({ closed, rootRadius, rootWidth, usePocketCluster })
  const project = createProject(subProject)
  const config = withMinimumDistance(createMagicFixConfig(project, subProject), usePocketCluster ? clusterId : rootId, minimumDistance, accuracy)

  return { project, subProject, computed: getComputedSubProject(subProject, project.stitchingSettings), config }
}

const withMinimumDistance = (config: MagicFixConfigSchema, componentId: string, minimumDistance: number, accuracy: number): MagicFixConfigSchema => ({
  ...config,
  accuracy,
  componentConfigs: Object.fromEntries(Object.entries(config.componentConfigs).map(([id, value]) => [id, { ...value, preferredMinimumDistanceFromEdge: id === componentId ? minimumDistance : 0 }])),
})

const createProject = (subProject: SubProjectSchema): ProjectSchema => ({ id: 'project', name: 'Project', subProjects: [subProject], editingSettings: { addComputedSizesToAutoSized: false, adjustCornerRadiiToParent: false, addBaseColorByDefault: false }, componentSettings: { baseColor: '#000' }, stitchingSettings: { stitchMargin: 1, stitchHoleLength: 1, stitchHoleDistance: 5, stitchHoleThickness: 1, stitchLineThickness: 1, stitchHoleColor: '#000', stitchLineColor: '#000' } })

const createSubProject = ({ closed, rootRadius, rootWidth, usePocketCluster }: Required<Omit<Options, 'accuracy' | 'minimumDistance'>>): SubProjectSchema => {
  const cluster: PocketClusterSchema = { type: 'pocket-cluster', id: clusterId, name: 'Cluster', width: 100, height: 100, autoWidth: false, autoHeight: false, borderRadius: 0, topLeftRadius: 0, topRightRadius: 0, bottomRightRadius: 0, bottomLeftRadius: 0, individualRadii: false, pocketCount: 2, pocketStep: 20, orientation: 'up', tPocketTabWidth: 10, tPocketTaper: 10 }
  const root: RootPanelSchema = { type: 'root-panel', id: rootId, name: 'Root', width: usePocketCluster ? 100 : rootWidth, height: 100, layoutOrientation: 'horizontal', layoutOrder: 'default', layoutGap: 0, children: usePocketCluster ? [clusterId] : [], borderRadius: rootRadius, topLeftRadius: rootRadius, topRightRadius: rootRadius, bottomRightRadius: rootRadius, bottomLeftRadius: rootRadius, individualRadii: false }
  const componentLine: ComponentBoundsStitchLineSchema = { type: 'component-bounds-stitch-line', id: 'component-line', name: 'Top', targetType: 'component', targetId: rootId, stitchHoleDistance: 5, top: true, right: closed, bottom: closed, left: closed, topLeftCorner: closed, topRightCorner: closed, bottomRightCorner: closed, bottomLeftCorner: closed, topStartOffset: 0, topEndOffset: 0, rightStartOffset: 0, rightEndOffset: 0, bottomStartOffset: 0, bottomEndOffset: 0, leftStartOffset: 0, leftEndOffset: 0, topStitchDirection: 'left-to-right', rightStitchDirection: 'top-to-bottom', bottomStitchDirection: 'right-to-left', leftStitchDirection: 'bottom-to-top' }
  const pocketLine: PocketClusterStitchLineSchema = { type: 'pocket-cluster-stitch-line', id: 'pocket-line', name: 'Pocket', targetType: 'component', targetId: clusterId, enabled: true, startOffset: 0, endOffset: 0, stitchDirection: 'start-to-end', stitchHoleDistance: 5 }
  return { id: 'sub', root: rootId, components: usePocketCluster ? { [rootId]: root, [clusterId]: cluster } : { [rootId]: root }, holes: [], stitchLines: usePocketCluster ? [pocketLine] : [componentLine] }
}

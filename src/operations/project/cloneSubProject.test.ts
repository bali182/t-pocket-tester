import { describe, expect, it } from 'vitest'

import { d } from '../../testData'
import { cloneSubProject } from './cloneSubProject'

describe('cloneSubProject', () => {
  it('builds a complete cloned subproject from the component tree result', () => {
    const root = d.rootPanel({ id: 'root', children: ['panel'], name: 'Wallet' })
    const panel = d.panel({ id: 'panel', name: 'Panel' })
    const hole = d.hole({ id: 'hole', componentId: panel.id, name: 'Hole' })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'stitch-line',
      name: 'Stitch line',
      targetId: hole.id,
      targetType: 'hole',
    })
    const sourceSubProject = d.subProject({
      components: [panel],
      holes: [hole],
      id: 'source-sub-project',
      root,
      stitchLines: [stitchLine],
    })
    const existingRoot = d.rootPanel({ id: 'existing-root', name: 'Wallet 1' })
    const existingSubProject = d.subProject({ id: 'existing-sub-project', root: existingRoot })
    const project = d.project({ id: 'project', subProjects: [sourceSubProject, existingSubProject] })
    let idCounter = 0

    const result = cloneSubProject(project, {
      getUnusedId: (): string => {
        idCounter += 1
        return `clone-${idCounter}`
      },
      subProject: sourceSubProject,
    })
    const clonedSubProject = result.subProjects[result.subProjects.length - 1]

    expect(clonedSubProject).toMatchObject({ id: 'clone-5', root: 'clone-1' })
    expect(clonedSubProject?.components['clone-1']).toMatchObject({ children: ['clone-2'], name: 'Wallet 2' })
    expect(clonedSubProject?.holes).toMatchObject([{ componentId: 'clone-2', id: 'clone-3' }])
    expect(clonedSubProject?.stitchLines).toMatchObject([{ id: 'clone-4', targetId: 'clone-3', targetType: 'hole' }])
  })
})

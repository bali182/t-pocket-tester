import { describe, expect, it } from 'vitest'

import type { PanelSchema, PocketClusterSchema, RootPanelSchema } from '../../schemas/components'
import type { MagicFixChangeRequest } from '../../schemas/magicFixChangeRequest'
import type {
  ComponentBoundsStitchLineHorizontalDirectionsSchema,
  ComponentBoundsStitchLineOffsetsSchema,
  ComponentBoundsStitchLineSchema,
  ComponentBoundsStitchLineVerticalDirectionsSchema,
  HorizontalStitchDirectionSchema,
  PocketClusterStitchLineOffsetsSchema,
  PocketClusterStitchLineSchema,
  VerticalStitchDirectionSchema,
} from '../../schemas/stitching'
import type { SubProjectSchema } from '../../schemas/subProject'
import { cloneDeep } from '../../utils/cloneDeep'
import { applyMagicFixRequests } from './applyMagicFixChangeRequests'

const componentIds = {
  root: 'root',
  panel: 'panel',
  pocketCluster: 'pocket-cluster',
}

const stitchLineIds = {
  componentBounds: 'component-bounds-stitch-line',
  pocketCluster: 'pocket-cluster-stitch-line',
}

const holeId = 'hole'
const unknownId = 'unknown'

describe('applyMagicFixRequests', () => {
  it('should set component dimensions and disable automatic dimensions where applicable', () => {
    const result = applyRequests([
      { type: 'set-component-dimension', componentId: componentIds.root, dimensionField: 'width', value: 101 },
      { type: 'set-component-dimension', componentId: componentIds.panel, dimensionField: 'height', value: 41 },
      { type: 'set-component-dimension', componentId: componentIds.pocketCluster, dimensionField: 'width', value: 51 },
    ])

    expect(getRootPanel(result).width).toBe(101)
    expect(getPanel(result)).toMatchObject({ height: 41, autoHeight: false, autoWidth: true })
    expect(getPocketCluster(result)).toMatchObject({ width: 51, autoWidth: false, autoHeight: true })
  })

  it('should set layout gaps on root panels and panels', () => {
    const result = applyRequests([
      { type: 'set-layout-gap', componentId: componentIds.root, value: 11 },
      { type: 'set-layout-gap', componentId: componentIds.panel, value: 7 },
    ])

    expect(getRootPanel(result).layoutGap).toBe(11)
    expect(getPanel(result).layoutGap).toBe(7)
  })

  it('should set common and individual component corner radii', () => {
    const result = applyRequests([
      { type: 'set-component-corner-radius', componentId: componentIds.root, radiusField: 'borderRadius', value: 10 },
      { type: 'set-component-corner-radius', componentId: componentIds.panel, radiusField: 'topLeftRadius', value: 20 },
      {
        type: 'set-component-corner-radius',
        componentId: componentIds.pocketCluster,
        radiusField: 'bottomRightRadius',
        value: 30,
      },
    ])

    expect(getRootPanel(result)).toMatchObject({ borderRadius: 10, individualRadii: false })
    expect(getPanel(result)).toMatchObject({ topLeftRadius: 20, individualRadii: true })
    expect(getPocketCluster(result)).toMatchObject({ bottomRightRadius: 30, individualRadii: true })
  })

  it('should not convert individual radii back to common radii mode', () => {
    const result = applyRequests([
      { type: 'set-component-corner-radius', componentId: componentIds.panel, radiusField: 'topLeftRadius', value: 20 },
      { type: 'set-component-corner-radius', componentId: componentIds.panel, radiusField: 'borderRadius', value: 10 },
    ])

    expect(getPanel(result)).toMatchObject({ borderRadius: 10, topLeftRadius: 20, individualRadii: true })
  })

  it('should set the pocket step', () => {
    const result = applyRequests([{ type: 'set-pocket-step', componentId: componentIds.pocketCluster, value: 13 }])

    expect(getPocketCluster(result).pocketStep).toBe(13)
  })

  const componentBoundsStitchLineOffsetFields: readonly (keyof ComponentBoundsStitchLineOffsetsSchema)[] = [
    'topStartOffset',
    'topEndOffset',
    'rightStartOffset',
    'rightEndOffset',
    'bottomStartOffset',
    'bottomEndOffset',
    'leftStartOffset',
    'leftEndOffset',
  ]

  it.each(componentBoundsStitchLineOffsetFields)('should set the component bounds stitch line %s', (offsetField) => {
    const result = applyRequests([
      {
        type: 'set-component-bounds-stitch-line-offset',
        stitchLineId: stitchLineIds.componentBounds,
        offsetField,
        value: 15,
      },
    ])

    expect(getComponentBoundsStitchLine(result)[offsetField]).toBe(15)
  })

  const componentBoundsStitchLineHorizontalDirectionChanges: readonly [
    keyof ComponentBoundsStitchLineHorizontalDirectionsSchema,
    HorizontalStitchDirectionSchema,
  ][] = [
    ['topStitchDirection', 'right-to-left'],
    ['bottomStitchDirection', 'left-to-right'],
  ]

  it.each(componentBoundsStitchLineHorizontalDirectionChanges)(
    'should set the component bounds stitch line %s',
    (directionField, value) => {
      const result = applyRequests([
        {
          type: 'set-component-bounds-stitch-line-horizontal-direction',
          stitchLineId: stitchLineIds.componentBounds,
          directionField,
          value,
        },
      ])

      expect(getComponentBoundsStitchLine(result)[directionField]).toBe(value)
    },
  )

  const componentBoundsStitchLineVerticalDirectionChanges: readonly [
    keyof ComponentBoundsStitchLineVerticalDirectionsSchema,
    VerticalStitchDirectionSchema,
  ][] = [
    ['rightStitchDirection', 'bottom-to-top'],
    ['leftStitchDirection', 'top-to-bottom'],
  ]

  it.each(componentBoundsStitchLineVerticalDirectionChanges)(
    'should set the component bounds stitch line %s',
    (directionField, value) => {
      const result = applyRequests([
        {
          type: 'set-component-bounds-stitch-line-vertical-direction',
          stitchLineId: stitchLineIds.componentBounds,
          directionField,
          value,
        },
      ])

      expect(getComponentBoundsStitchLine(result)[directionField]).toBe(value)
    },
  )

  const pocketClusterStitchLineOffsetFields: readonly (keyof PocketClusterStitchLineOffsetsSchema)[] = [
    'startOffset',
    'endOffset',
  ]

  it.each(pocketClusterStitchLineOffsetFields)('should set the pocket cluster stitch line %s', (offsetField) => {
    const result = applyRequests([
      {
        type: 'set-pocket-cluster-stitch-line-offset',
        stitchLineId: stitchLineIds.pocketCluster,
        offsetField,
        value: 15,
      },
    ])

    expect(getPocketClusterStitchLine(result)[offsetField]).toBe(15)
  })

  it('should set the pocket cluster stitch line direction', () => {
    const result = applyRequests([
      {
        type: 'set-pocket-cluster-stitch-line-direction',
        stitchLineId: stitchLineIds.pocketCluster,
        value: 'end-to-start',
      },
    ])

    expect(getPocketClusterStitchLine(result).stitchDirection).toBe('end-to-start')
  })

  const missingComponentRequests: readonly MagicFixChangeRequest[] = [
    { type: 'set-component-dimension', componentId: unknownId, dimensionField: 'width', value: 1 },
    { type: 'set-layout-gap', componentId: unknownId, value: 1 },
    { type: 'set-component-corner-radius', componentId: unknownId, radiusField: 'borderRadius', value: 1 },
    { type: 'set-pocket-step', componentId: unknownId, value: 1 },
  ]

  it.each(missingComponentRequests)('should throw for a missing component', (request) => {
    const subProject = createSubProject()

    expect(() => applyMagicFixRequests(subProject, [request])).toThrow(`Missing component with "${unknownId}"`)
  })

  const missingStitchLineRequests: readonly MagicFixChangeRequest[] = [
    {
      type: 'set-component-bounds-stitch-line-offset',
      stitchLineId: unknownId,
      offsetField: 'topStartOffset',
      value: 1,
    },
    {
      type: 'set-component-bounds-stitch-line-horizontal-direction',
      stitchLineId: unknownId,
      directionField: 'topStitchDirection',
      value: 'right-to-left',
    },
    {
      type: 'set-component-bounds-stitch-line-vertical-direction',
      stitchLineId: unknownId,
      directionField: 'rightStitchDirection',
      value: 'bottom-to-top',
    },
    { type: 'set-pocket-cluster-stitch-line-offset', stitchLineId: unknownId, offsetField: 'startOffset', value: 1 },
    { type: 'set-pocket-cluster-stitch-line-direction', stitchLineId: unknownId, value: 'end-to-start' },
  ]

  it.each(missingStitchLineRequests)('should throw for a missing stitch line', (request) => {
    const subProject = createSubProject()

    expect(() => applyMagicFixRequests(subProject, [request])).toThrow(`Missing stitch line with "${unknownId}"`)
  })

  const incompatibleTargetRequests: readonly MagicFixChangeRequest[] = [
    { type: 'set-layout-gap', componentId: componentIds.pocketCluster, value: 1 },
    { type: 'set-pocket-step', componentId: componentIds.panel, value: 1 },
    {
      type: 'set-component-bounds-stitch-line-offset',
      stitchLineId: stitchLineIds.pocketCluster,
      offsetField: 'topStartOffset',
      value: 1,
    },
    {
      type: 'set-component-bounds-stitch-line-horizontal-direction',
      stitchLineId: stitchLineIds.pocketCluster,
      directionField: 'topStitchDirection',
      value: 'right-to-left',
    },
    {
      type: 'set-component-bounds-stitch-line-vertical-direction',
      stitchLineId: stitchLineIds.pocketCluster,
      directionField: 'rightStitchDirection',
      value: 'bottom-to-top',
    },
    {
      type: 'set-pocket-cluster-stitch-line-offset',
      stitchLineId: stitchLineIds.componentBounds,
      offsetField: 'startOffset',
      value: 1,
    },
    {
      type: 'set-pocket-cluster-stitch-line-direction',
      stitchLineId: stitchLineIds.componentBounds,
      value: 'end-to-start',
    },
  ]

  it.each(incompatibleTargetRequests)(
    'should throw when a request references an incompatible target type',
    (request) => {
      const subProject = createSubProject()

      expect(() => applyMagicFixRequests(subProject, [request])).toThrow()
    },
  )

  it('should leave the input unchanged when a later request throws', () => {
    const subProject = createSubProject()
    const original = cloneDeep(subProject)

    expect(() =>
      applyMagicFixRequests(subProject, [
        { type: 'set-component-dimension', componentId: componentIds.root, dimensionField: 'width', value: 101 },
        { type: 'set-layout-gap', componentId: unknownId, value: 11 },
      ]),
    ).toThrow(`Missing component with "${unknownId}"`)

    expect(subProject).toEqual(original)
  })
})

const createSubProject = (): SubProjectSchema => {
  return {
    id: 'sub-project',
    root: componentIds.root,
    components: {
      [componentIds.root]: {
        type: 'root-panel',
        id: componentIds.root,
        name: 'Root',
        width: 100,
        height: 80,
        layoutOrientation: 'horizontal',
        layoutOrder: 'default',
        layoutGap: 10,
        children: [componentIds.panel],
        borderRadius: 1,
        topLeftRadius: 2,
        topRightRadius: 3,
        bottomRightRadius: 4,
        bottomLeftRadius: 5,
        individualRadii: false,
      },
      [componentIds.panel]: {
        type: 'panel',
        id: componentIds.panel,
        name: 'Panel',
        width: 60,
        height: 40,
        autoWidth: true,
        autoHeight: true,
        layoutOrientation: 'vertical',
        layoutOrder: 'default',
        layoutGap: 6,
        children: [componentIds.pocketCluster],
        borderRadius: 1,
        topLeftRadius: 2,
        topRightRadius: 3,
        bottomRightRadius: 4,
        bottomLeftRadius: 5,
        individualRadii: false,
      },
      [componentIds.pocketCluster]: {
        type: 'pocket-cluster',
        id: componentIds.pocketCluster,
        name: 'Pocket cluster',
        width: 50,
        height: 30,
        autoWidth: true,
        autoHeight: true,
        borderRadius: 1,
        topLeftRadius: 2,
        topRightRadius: 3,
        bottomRightRadius: 4,
        bottomLeftRadius: 5,
        individualRadii: false,
        pocketCount: 3,
        pocketStep: 12,
        orientation: 'up',
        tPocketTabWidth: 8,
        tPocketTaper: 20,
      },
    },
    holes: [
      {
        id: holeId,
        name: 'Hole',
        componentId: componentIds.root,
        width: 10,
        height: 10,
        xAnchor: 'middle',
        xOffset: 0,
        yAnchor: 'middle',
        yOffset: 0,
        borderRadius: 0,
        topLeftRadius: 0,
        topRightRadius: 0,
        bottomRightRadius: 0,
        bottomLeftRadius: 0,
        individualRadii: false,
      },
    ],
    stitchLines: [
      {
        type: 'component-bounds-stitch-line',
        id: stitchLineIds.componentBounds,
        name: 'Component bounds stitch line',
        targetType: 'component',
        targetId: componentIds.root,
        top: true,
        right: true,
        bottom: true,
        left: true,
        topLeftCorner: true,
        topRightCorner: true,
        bottomRightCorner: true,
        bottomLeftCorner: true,
        topStartOffset: 1,
        topEndOffset: 2,
        rightStartOffset: 3,
        rightEndOffset: 4,
        bottomStartOffset: 5,
        bottomEndOffset: 6,
        leftStartOffset: 7,
        leftEndOffset: 8,
        topStitchDirection: 'left-to-right',
        rightStitchDirection: 'top-to-bottom',
        bottomStitchDirection: 'right-to-left',
        leftStitchDirection: 'bottom-to-top',
      },
      {
        type: 'pocket-cluster-stitch-line',
        id: stitchLineIds.pocketCluster,
        name: 'Pocket cluster stitch line',
        targetType: 'component',
        targetId: componentIds.pocketCluster,
        enabled: true,
        startOffset: 1,
        endOffset: 2,
        stitchDirection: 'start-to-end',
      },
    ],
  }
}

const applyRequests = (requests: MagicFixChangeRequest[]): SubProjectSchema => {
  const subProject = createSubProject()
  const original = cloneDeep(subProject)
  const result = applyMagicFixRequests(subProject, requests)

  expect(subProject).toEqual(original)
  return result
}

const getComponentBoundsStitchLine = (subProject: SubProjectSchema): ComponentBoundsStitchLineSchema => {
  const stitchLine = subProject.stitchLines.find(({ id }) => id === stitchLineIds.componentBounds)

  if (stitchLine?.type !== 'component-bounds-stitch-line') {
    throw new Error('Missing component bounds stitch line in test fixture')
  }

  return stitchLine
}

const getPocketClusterStitchLine = (subProject: SubProjectSchema): PocketClusterStitchLineSchema => {
  const stitchLine = subProject.stitchLines.find(({ id }) => id === stitchLineIds.pocketCluster)

  if (stitchLine?.type !== 'pocket-cluster-stitch-line') {
    throw new Error('Missing pocket cluster stitch line in test fixture')
  }

  return stitchLine
}

const getRootPanel = (subProject: SubProjectSchema): RootPanelSchema => {
  const component = subProject.components[componentIds.root]

  if (component?.type !== 'root-panel') {
    throw new Error('Missing root panel in test fixture')
  }

  return component
}

const getPanel = (subProject: SubProjectSchema): PanelSchema => {
  const component = subProject.components[componentIds.panel]

  if (component?.type !== 'panel') {
    throw new Error('Missing panel in test fixture')
  }

  return component
}

const getPocketCluster = (subProject: SubProjectSchema): PocketClusterSchema => {
  const component = subProject.components[componentIds.pocketCluster]

  if (component?.type !== 'pocket-cluster') {
    throw new Error('Missing pocket cluster in test fixture')
  }

  return component
}

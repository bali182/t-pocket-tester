import { ComponentSchema } from '../../schemas/components'
import { MagicFixChangeRequest } from '../../schemas/magicFixChangeRequest'
import { StitchLineSchema } from '../../schemas/stitching'
import { SubProjectSchema } from '../../schemas/subProject'
import { cloneDeep } from '../../utils/cloneDeep'
import { isDefined } from '../../utils/isDefined'

export const applyMagicFixRequests = (s: SubProjectSchema, requests: MagicFixChangeRequest[]): SubProjectSchema => {
  const subProject = cloneDeep(s)

  const componentMap = new Map(Object.entries(subProject.components))
  const stitchLineMap = new Map(subProject.stitchLines.map((s): [string, StitchLineSchema] => [s.id, s]))

  for (const request of requests) {
    switch (request.type) {
      case 'set-component-dimension': {
        const component = getComponent(componentMap, request.componentId)
        component[request.dimensionField] = request.value
        if (component.type === 'panel' || component.type === 'pocket-cluster') {
          if (request.dimensionField === 'height') {
            component.autoHeight = false
          }
          if (request.dimensionField === 'width') {
            component.autoWidth = false
          }
        }
        break
      }
      case 'set-layout-gap': {
        const component = getComponent(componentMap, request.componentId)
        if (component.type !== 'root-panel' && component.type !== 'panel') {
          throw new Error(`Can't set layout gap on non-panel component: "${request.componentId}"!`)
        }
        component.layoutGap = request.value
        break
      }
      case 'set-component-corner-radius': {
        const component = getComponent(componentMap, request.componentId)
        if (request.radiusField === 'borderRadius') {
          component.borderRadius = request.value
        } else {
          component[request.radiusField] = request.value
          component.individualRadii = false
        }
        break
      }
      case 'set-pocket-step': {
        const component = getComponent(componentMap, request.componentId)
        if (component.type !== 'pocket-cluster') {
          throw new Error(`Can't set pocket step on non pocket-cluster typed component: "${request.componentId}"!`)
        }
        component.pocketStep = request.value
        break
      }
      case 'set-component-bounds-stitch-line-offset': {
        const stitchLine = getStitchLine(stitchLineMap, request.stitchLineId)
        if (stitchLine.type !== 'component-bounds-stitch-line') {
          throw new Error(`Can't set directional offset on non-component bounds stitchline: "${request.stitchLineId}"!`)
        }
        stitchLine[request.offsetField] = request.value
        break
      }
      case 'set-component-bounds-stitch-line-horizontal-direction': {
        const stitchLine = getStitchLine(stitchLineMap, request.stitchLineId)
        if (stitchLine.type !== 'component-bounds-stitch-line') {
          throw new Error(`Can't set direction on non-component bounds stitchline: "${request.stitchLineId}"!`)
        }
        stitchLine[request.directionField] = request.value
        break
      }
      case 'set-component-bounds-stitch-line-vertical-direction': {
        const stitchLine = getStitchLine(stitchLineMap, request.stitchLineId)
        if (stitchLine.type !== 'component-bounds-stitch-line') {
          throw new Error(`Can't set direction on non-component bounds stitchline: "${request.stitchLineId}"!`)
        }
        stitchLine[request.directionField] = request.value
        break
      }
      case 'set-pocket-cluster-stitch-line-offset': {
        const stitchLine = getStitchLine(stitchLineMap, request.stitchLineId)
        if (stitchLine.type !== 'pocket-cluster-stitch-line') {
          throw new Error(`Can't set offset on non-pocket cluster stitchline: "${request.stitchLineId}"!`)
        }
        stitchLine[request.offsetField] = request.value
        break
      }
      case 'set-pocket-cluster-stitch-line-direction': {
        const stitchLine = getStitchLine(stitchLineMap, request.stitchLineId)
        if (stitchLine.type !== 'pocket-cluster-stitch-line') {
          throw new Error(`Can't set direction on non-pocket cluster stitchline: "${request.stitchLineId}"!`)
        }
        stitchLine.stitchDirection = request.value
        break
      }
    }
  }

  return subProject
}

const getComponent = (map: Map<string, ComponentSchema>, id: string): ComponentSchema => {
  const component = map.get(id)
  if (!isDefined(component)) {
    throw new Error(`Missing component with "${id}"!`)
  }
  return component
}

const getStitchLine = (map: Map<string, StitchLineSchema>, id: string): StitchLineSchema => {
  const stitchLine = map.get(id)
  if (!isDefined(stitchLine)) {
    throw new Error(`Missing stitch line with "${id}"!`)
  }
  return stitchLine
}

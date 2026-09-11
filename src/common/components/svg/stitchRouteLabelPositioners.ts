import BigNumber from 'bignumber.js'
import { SVGProps } from 'react'
import { ComputedStitchRouteSchema } from '../../schemas/computed'

export const STITCH_ROUTE_LABEL_OFFSET = new BigNumber(3)

type StitchRouteLabelTextPosition = {
  x: number
  y: number
  textAnchor: SVGProps<SVGTextElement>['textAnchor']
  alignmentBaseline: SVGProps<SVGTextElement>['alignmentBaseline']
}

export const positionOutside = (route: ComputedStitchRouteSchema): StitchRouteLabelTextPosition => {
  const { boundingRect } = route
  const right = boundingRect.x.plus(boundingRect.width)
  const bottom = boundingRect.y.plus(boundingRect.height)
  const centerX = boundingRect.x.plus(right).dividedBy(2)
  const centerY = boundingRect.y.plus(bottom).dividedBy(2)

  switch (route.labelPosition) {
    case 'top':
      return {
        x: centerX.toNumber(),
        y: boundingRect.y.minus(STITCH_ROUTE_LABEL_OFFSET).toNumber(),
        textAnchor: 'middle',
        alignmentBaseline: 'text-after-edge',
      }
    case 'right':
      return {
        x: right.plus(STITCH_ROUTE_LABEL_OFFSET).toNumber(),
        y: centerY.toNumber(),
        textAnchor: 'start',
        alignmentBaseline: 'middle',
      }
    case 'bottom':
      return {
        x: centerX.toNumber(),
        y: bottom.plus(STITCH_ROUTE_LABEL_OFFSET).toNumber(),
        textAnchor: 'middle',
        alignmentBaseline: 'text-before-edge',
      }
    case 'left':
      return {
        x: boundingRect.x.minus(STITCH_ROUTE_LABEL_OFFSET).toNumber(),
        y: centerY.toNumber(),
        textAnchor: 'end',
        alignmentBaseline: 'middle',
      }
  }
}

export const positionInside = (route: ComputedStitchRouteSchema): StitchRouteLabelTextPosition => {
  const { boundingRect } = route
  const right = boundingRect.x.plus(boundingRect.width)
  const bottom = boundingRect.y.plus(boundingRect.height)
  const centerX = boundingRect.x.plus(right).dividedBy(2)
  const centerY = boundingRect.y.plus(bottom).dividedBy(2)

  switch (route.labelPosition) {
    case 'top':
      return {
        x: centerX.toNumber(),
        y: boundingRect.y.plus(STITCH_ROUTE_LABEL_OFFSET).toNumber(),
        textAnchor: 'middle',
        alignmentBaseline: 'text-before-edge',
      }
    case 'right':
      return {
        x: right.minus(STITCH_ROUTE_LABEL_OFFSET).toNumber(),
        y: centerY.toNumber(),
        textAnchor: 'end',
        alignmentBaseline: 'middle',
      }
    case 'bottom':
      return {
        x: centerX.toNumber(),
        y: bottom.minus(STITCH_ROUTE_LABEL_OFFSET).toNumber(),
        textAnchor: 'middle',
        alignmentBaseline: 'text-after-edge',
      }
    case 'left':
      return {
        x: boundingRect.x.plus(STITCH_ROUTE_LABEL_OFFSET).toNumber(),
        y: centerY.toNumber(),
        textAnchor: 'start',
        alignmentBaseline: 'middle',
      }
  }
}

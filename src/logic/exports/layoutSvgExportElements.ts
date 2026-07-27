import BigNumber from 'bignumber.js'

import type { PointSchema } from '../../schemas/geometry'
import type {
  SvgExportElementSchema,
  SvgExportFrontPocketSchema,
  SvgExportPanelSchema,
  SvgExportStitchLineSchema,
  SvgExportTPocketSchema,
} from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'
import { translatePath } from '../translatePath'
import { translateRect } from '../translateRect'
import { getSvgExportElementLayoutBoundingRect } from './getSvgExportElementLayoutBoundingRect'

const ZERO = new BigNumber(0)

export type SvgExportElementsLayout = {
  contentWidth: BigNumber
  contentHeight: BigNumber
  elements: SvgExportElementSchema[]
}

export const layoutSvgExportElements = (
  elements: SvgExportElementSchema[],
  gap: number,
): SvgExportElementsLayout => {
  let contentWidth = ZERO
  let nextTop = ZERO

  const positionedElements = elements.map((element, index) => {
    const boundingRect = getSvgExportElementLayoutBoundingRect(element)
    const translation: PointSchema = {
      x: boundingRect.x.negated(),
      y: nextTop.minus(boundingRect.y),
    }
    const positionedElement = translateSvgExportElement(element, translation)

    contentWidth = BigNumber.maximum(contentWidth, boundingRect.width)
    nextTop = nextTop.plus(boundingRect.height)

    if (index < elements.length - 1) {
      nextTop = nextTop.plus(gap)
    }

    return positionedElement
  })

  return {
    contentWidth,
    contentHeight: nextTop,
    elements: positionedElements,
  }
}

const translateSvgExportElement = (
  element: SvgExportElementSchema,
  translation: PointSchema,
): SvgExportElementSchema => {
  switch (element.type) {
    case 'svg-export-panel':
      return translateSvgExportPanel(element, translation)
    case 'svg-export-front-pocket':
      return translateSvgExportFrontPocket(element, translation)
    case 'svg-export-t-pocket':
      return translateSvgExportTPocket(element, translation)
  }
}

const translateSvgExportPanel = (element: SvgExportPanelSchema, translation: PointSchema): SvgExportPanelSchema => {
  return {
    ...element,
    boundingRect: translateRect(element.boundingRect, translation),
    ...(isDefined(element.cutHelper)
      ? { cutHelper: translatePath(element.cutHelper, translation) }
      : {}),
    ...(isDefined(element.cutHelperBoundingRect)
      ? { cutHelperBoundingRect: translateRect(element.cutHelperBoundingRect, translation) }
      : {}),
    path: translatePath(element.path, translation),
    childMarkerPaths: element.childMarkerPaths.map((path) => translatePath(path, translation)),
    stitchLines: element.stitchLines.map((stitchLine) => translateSvgExportStitchLine(stitchLine, translation)),
  }
}

const translateSvgExportFrontPocket = (
  element: SvgExportFrontPocketSchema,
  translation: PointSchema,
): SvgExportFrontPocketSchema => {
  return {
    ...element,
    pocket: {
      ...element.pocket,
      boundingRect: translateRect(element.pocket.boundingRect, translation),
      path: translatePath(element.pocket.path, translation),
    },
    ...(isDefined(element.cutHelper)
      ? { cutHelper: translatePath(element.cutHelper, translation) }
      : {}),
    ...(isDefined(element.cutHelperBoundingRect)
      ? { cutHelperBoundingRect: translateRect(element.cutHelperBoundingRect, translation) }
      : {}),
    stitchLines: element.stitchLines.map((stitchLine) => translateSvgExportStitchLine(stitchLine, translation)),
  }
}

const translateSvgExportTPocket = (
  element: SvgExportTPocketSchema,
  translation: PointSchema,
): SvgExportTPocketSchema => {
  return {
    ...element,
    pocket: {
      ...element.pocket,
      boundingRect: translateRect(element.pocket.boundingRect, translation),
      path: translatePath(element.pocket.path, translation),
    },
    ...(isDefined(element.cutHelper)
      ? { cutHelper: translatePath(element.cutHelper, translation) }
      : {}),
    ...(isDefined(element.cutHelperBoundingRect)
      ? { cutHelperBoundingRect: translateRect(element.cutHelperBoundingRect, translation) }
      : {}),
    stitchLines: element.stitchLines.map((stitchLine) => translateSvgExportStitchLine(stitchLine, translation)),
  }
}

const translateSvgExportStitchLine = (
  stitchLine: SvgExportStitchLineSchema,
  translation: PointSchema,
): SvgExportStitchLineSchema => {
  return {
    ...stitchLine,
    paths: stitchLine.paths.map((path) => translatePath(path, translation)),
    holes: stitchLine.holes.map((hole) => ({
      ...hole,
      center: {
        x: hole.center.x.plus(translation.x),
        y: hole.center.y.plus(translation.y),
      },
    })),
  }
}

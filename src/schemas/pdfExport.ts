import BigNumber from 'bignumber.js'
import { RectSchema } from './geometry'
import { PageSchemaId } from './page'
import { BaseExportSettingsSchema } from './settings'
import type { SvgExportElementSchema } from './svgExport'
import { SvgExportPanelSchema } from './svgExport'

export type PageOrientationSchema = 'portrait' | 'landscape'
export type PageLayoutSchema = 'vertical' | 'horizontal' | 'compact'
export type PdfExportPlacementRotation = 0 | 90

export type PdfExportSettingsSchema = BaseExportSettingsSchema & {
  page: PageSchemaId
  orientation: PageOrientationSchema
  layout: PageLayoutSchema
}

export type PdfExportPlacementSchema = {
  boundingRect: RectSchema
  rotation: PdfExportPlacementRotation
  x: BigNumber
  y: BigNumber
}

export type PdfExportElement = {
  element: SvgExportElementSchema
  placement: PdfExportPlacementSchema
}

export type PdfExportPageSchema = {
  elements: PdfExportElement[]
}

export type PdfExportSuccessfulLayoutSchema = {
  type: 'successful-pdf-export'
  pages: PdfExportPageSchema[]
}

export type PdfExportUnsuccessfulLayoutSchema = {
  type: 'unsuccessful-pdf-export'
  unplaceables: SvgExportPanelSchema[]
}

export type PdfExportLayoutSchema = PdfExportSuccessfulLayoutSchema | PdfExportUnsuccessfulLayoutSchema

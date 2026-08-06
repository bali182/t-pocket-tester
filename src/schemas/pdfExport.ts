import BigNumber from 'bignumber.js'
import { RectSchema } from './geometry'
import { PageSchemaId } from './page'
import { BaseExportSettingsSchema } from './settings'
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

export type PdfExportPageSchema = {
  placements: Map<string, PdfExportPlacementSchema>
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

import type BigNumber from 'bignumber.js'

import type { ComponentSchema, PocketClusterSchema } from './components'
import type { ComputedTPocketSchema, ComputedTopPocketSchema } from './computed'
import type { PathSchema, RectSchema } from './geometry'
import type { PageSchemaId } from './page'
import type { ResolvedStitchLineSchema, StitchHoleSchema } from './stitching'

export type SvgExportStitchLineModeSchema = 'own-stitch-lines' | 'all-stitch-lines'

export type SvgExportParamsSchema = {
  gap: number
  padding: number
  stitchLineMode: SvgExportStitchLineModeSchema
  showNames: boolean
  showDimensions: boolean
  childMarkers: boolean
  cutHelperDistance: number
}

export type PageOrientationSchema = 'portrait' | 'landscape'
export type PageLayoutSchema = 'vertical' | 'horizontal' | 'compact'

export type PdfExportParamsSchema = SvgExportParamsSchema & {
  page: PageSchemaId
  orientation: PageOrientationSchema
  layout: PageLayoutSchema
}

export type PdfExportPlacementSchema = {
  boundingRect: RectSchema
  rotation: 0 | 90
}

export type PdfExportPageSchema = {
  placements: Map<string, PdfExportPlacementSchema>
}

export type SvgExportStitchLineSchema = {
  stitchLine: ResolvedStitchLineSchema
  paths: PathSchema[]
  holes: StitchHoleSchema[]
}

export type SvgExportPanelSchema = {
  type: 'svg-export-panel'
  id: string
  component: ComponentSchema
  boundingRect: RectSchema
  cutHelper?: PathSchema
  cutHelperBoundingRect?: RectSchema
  path: PathSchema
  childMarkerPaths: PathSchema[]
  stitchLines: SvgExportStitchLineSchema[]
}

export type SvgExportFrontPocketSchema = {
  type: 'svg-export-front-pocket'
  id: string
  ownerComponent: PocketClusterSchema
  pocket: ComputedTopPocketSchema
  cutHelper?: PathSchema
  cutHelperBoundingRect?: RectSchema
  stitchLines: SvgExportStitchLineSchema[]
}

export type SvgExportTPocketSchema = {
  type: 'svg-export-t-pocket'
  id: string
  ownerComponent: PocketClusterSchema
  pocketIndex: number
  pocket: ComputedTPocketSchema
  cutHelper?: PathSchema
  cutHelperBoundingRect?: RectSchema
  stitchLines: SvgExportStitchLineSchema[]
}

export type SvgExportElementSchema = SvgExportPanelSchema | SvgExportFrontPocketSchema | SvgExportTPocketSchema

export type SuccessfulPdfExportLayoutSchema = {
  type: 'successful-pdf-export'
  pages: PdfExportPageSchema[]
}

export type UnsuccessfulPdfExportLayoutSchema = {
  type: 'unsuccessful-pdf-export'
  unplaceables: SvgExportPanelSchema[]
}

export type PdfExportLayoutSchema = SuccessfulPdfExportLayoutSchema | UnsuccessfulPdfExportLayoutSchema

export type SvgExportSchema = {
  params: SvgExportParamsSchema
  contentWidth: BigNumber
  contentHeight: BigNumber
  elements: SvgExportElementSchema[]
}

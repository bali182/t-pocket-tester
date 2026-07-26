import type BigNumber from 'bignumber.js'

import type { ComponentSchema, PocketClusterSchema } from './components'
import type { ComputedTPocketSchema, ComputedTopPocketSchema } from './computed'
import type { PathSchema, RectSchema } from './geometry'
import type { ResolvedStitchLineSchema, StitchHoleSchema } from './stitching'

export type SvgExportStitchLineModeSchema = 'own-stitch-lines' | 'all-stitch-lines'

export type SvgExportParamsSchema = {
  gap: number
  padding: number
  stitchLineMode: SvgExportStitchLineModeSchema
}

export type SvgExportStitchLineSchema = {
  stitchLine: ResolvedStitchLineSchema
  paths: PathSchema[]
  holes: StitchHoleSchema[]
}

export type SvgExportPanelSchema = {
  type: 'svg-export-panel'
  component: ComponentSchema
  boundingRect: RectSchema
  path: PathSchema
  stitchLines: SvgExportStitchLineSchema[]
}

export type SvgExportFrontPocketSchema = {
  type: 'svg-export-front-pocket'
  ownerComponent: PocketClusterSchema
  pocket: ComputedTopPocketSchema
  stitchLines: SvgExportStitchLineSchema[]
}

export type SvgExportTPocketSchema = {
  type: 'svg-export-t-pocket'
  ownerComponent: PocketClusterSchema
  pocketIndex: number
  pocket: ComputedTPocketSchema
  stitchLines: SvgExportStitchLineSchema[]
}

export type SvgExportElementSchema =
  | SvgExportPanelSchema
  | SvgExportFrontPocketSchema
  | SvgExportTPocketSchema

export type SvgExportSchema = {
  params: SvgExportParamsSchema
  contentWidth: BigNumber
  contentHeight: BigNumber
  elements: SvgExportElementSchema[]
}

import type BigNumber from 'bignumber.js'

import type { ComponentSchema, PocketClusterSchema } from './components'
import type { ComputedTPocketSchema, ComputedTopPocketSchema } from './computed'
import type { PathSchema, RectSchema } from './geometry'
import { BaseExportSettingsSchema } from './settings'
import type { ResolvedStitchLineSchema, StitchHoleSchema } from './stitching'

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

export type SvgExportSchema = {
  params: BaseExportSettingsSchema
  contentWidth: BigNumber
  contentHeight: BigNumber
  elements: SvgExportElementSchema[]
}

import { STROKE_THICKNESS } from '../v1/constants'
import { LEATHER_BASE_COLOR, STITCH_HOLE_COLOR, STITCH_LINE_STORKE_COLOR } from './constants/drawing'
import { HasCornerRadiusSchema, HasLayoutSchema, RootPanelSchema } from './schemas/components'
import { ProjectSchema } from './schemas/project'
import { StitchLineCommonConfigSchema } from './schemas/stitching'
import { translation } from './translations/translation'

const defaultHasCornerRadius: HasCornerRadiusSchema = {
  borderRadius: 0,
  topLeftRadius: 0,
  bottomLeftRadius: 0,
  bottomRightRadius: 0,
  topRightRadius: 0,
  individualRadii: false,
}

const defaultHasLayout: HasLayoutSchema = {
  layoutOrientation: 'horizontal',
  layoutOrder: 'default',
  layoutGap: 0,
}

export const defaultComponent: RootPanelSchema = {
  ...defaultHasCornerRadius,
  ...defaultHasLayout,
  type: 'root-panel',
  id: 'root',
  name: translation.defaults.rootComponentName.toString(),
  color: LEATHER_BASE_COLOR,
  children: [],
  width: 170,
  height: 100,
}

export const defaultStitchingSettings: StitchLineCommonConfigSchema = {
  stitchMargin: 4,
  stitchHoleLength: 1.7,
  stitchHoleDistance: 3.35,
  stitchHoleThickness: 0.3,
  stitchHoleColor: STITCH_HOLE_COLOR,
  stitchLineColor: STITCH_LINE_STORKE_COLOR,
  stitchLineThickness: STROKE_THICKNESS,
}

export const defaultProject: ProjectSchema = {
  id: 'project 1',
  name: translation.defaults.projectName.toString(),
  root: defaultComponent.id,
  components: {
    [defaultComponent.id]: defaultComponent,
  },
  stitchLines: [],
  editingSettings: {
    addComputedSizesToAutoSized: true,
    adjustCornerRadiiToParent: true,
  },
  stitchingSettings: defaultStitchingSettings,
}

import { STROKE_THICKNESS } from '../v1/constants'
import { LEATHER_BASE_COLOR, STITCH_HOLE_COLOR, STITCH_LINE_STORKE_COLOR } from './constants/drawing'
import { HasCornerRadiusSchema, HasLayoutSchema, RootPanelSchema } from './schemas/components'
import { ProjectSchema } from './schemas/project'
import { ComponentBoundsStitchLineSchema } from './schemas/stitching'

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
  name: 'Alap',
  color: LEATHER_BASE_COLOR,
  children: [],
  width: 170,
  height: 100,
}

const _testStitchLine: ComponentBoundsStitchLineSchema = {
  id: 'test',
  name: 'Teszt line',
  type: 'component-bounds-stitch-line',
  componentId: defaultComponent.id,
  top: false,
  right: true,
  bottom: true,
  left: true,
  topStitchDirection: 'left-to-right',
  rightStitchDirection: 'top-to-bottom',
  bottomStitchDirection: 'right-to-left',
  leftStitchDirection: 'bottom-to-top',
  topLeftCorner: false,
  topRightCorner: false,
  bottomRightCorner: true,
  bottomLeftCorner: true,
  topStartOffset: 0,
  topEndOffset: 0,
  rightStartOffset: 0,
  rightEndOffset: 0,
  bottomStartOffset: 0,
  bottomEndOffset: 0,
  leftStartOffset: 0,
  leftEndOffset: 0,
  stitchMargin: 5,
  stitchHoleLength: 2,
  stitchHoleDistance: 3,
  stitchHoleThickness: 0.3,
  stitchHoleColor: STITCH_HOLE_COLOR,
  stitchLineColor: STITCH_LINE_STORKE_COLOR,
  stitchLineThickness: STROKE_THICKNESS,
}

export const defaultProject: ProjectSchema = {
  id: 'project 1',
  name: 'Új projekt',
  root: defaultComponent.id,
  components: {
    [defaultComponent.id]: defaultComponent,
  },
  stitchLines: [
    //  _testStitchLine
  ],
  editingSettings: {
    addComputedSizesToAutoSized: true,
    adjustCornerRadiiToParent: true,
  },
  stitchingSettings: {
    stitchMargin: 4,
    stitchHoleLength: 1.7,
    stitchHoleDistance: 3.35,
    stitchHoleThickness: 0.3,
    stitchHoleColor: STITCH_HOLE_COLOR,
    stitchLineColor: STITCH_LINE_STORKE_COLOR,
    stitchLineThickness: STROKE_THICKNESS,
  },
}

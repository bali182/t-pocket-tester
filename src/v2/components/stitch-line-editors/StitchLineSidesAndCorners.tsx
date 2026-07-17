import { Box, Grid } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { StitchLineSchema } from '../../schemas/stitching'
import { StitchLineCornerToggle } from './StitchLineCornerToggle'
import { StitchLineEdgeToggle } from './StitchLineEdgeToggle'

type StitchLineSidesAndCornersProps = {
  editable: EditableSchema<StitchLineSchema>
  onChange: (updated: EditableSchema<StitchLineSchema>) => void
}

type StitchLineSideFields = 'top' | 'right' | 'bottom' | 'left'
type StitchLineCornerFields = 'topLeftCorner' | 'topRightCorner' | 'bottomRightCorner' | 'bottomLeftCorner'
type StitchLineSideOrCornerFields = StitchLineCornerFields | StitchLineSideFields

type CornerSidesSchema = {
  first: StitchLineSideFields
  second: StitchLineSideFields
}

const cornerSides: Record<StitchLineCornerFields, CornerSidesSchema> = {
  bottomLeftCorner: { first: 'bottom', second: 'left' },
  bottomRightCorner: { first: 'bottom', second: 'right' },
  topLeftCorner: { first: 'top', second: 'left' },
  topRightCorner: { first: 'top', second: 'right' },
}

export const StitchLineSidesAndCorners: FC<StitchLineSidesAndCornersProps> = ({ editable, onChange }) => {
  const toggle = useCallback(
    (field: StitchLineSideOrCornerFields): void => {
      onChange({ ...editable, [field]: !editable[field] })
    },
    [editable, onChange],
  )

  const isCornerDisabled = useCallback(
    (corner: StitchLineCornerFields): boolean => {
      const sides = cornerSides[corner]

      return !editable[sides.first] || !editable[sides.second]
    },
    [editable],
  )

  return (
    <Grid
      gap="2"
      gridTemplateAreas={`
        "left-start-offset top-direction right-start-offset"
        "top-start-offset canvas top-end-offset"
        "left-direction canvas right-direction"
        "bottom-start-offset canvas bottom-end-offset"
        "left-end-offset bottom-direction right-end-offset"
      `}
      gridTemplateColumns="auto minmax(0, 1fr) auto"
      gridTemplateRows="auto auto auto auto auto"
    >
      <Grid
        aspectRatio="4 / 3"
        gap="0"
        gridArea="canvas"
        gridTemplateAreas={`
          "top-left top top-right"
          "left center right"
          "bottom-left bottom bottom-right"
        `}
        gridTemplateColumns="auto minmax(0, 1fr) auto"
        gridTemplateRows="auto minmax(0, 1fr) auto"
      >
        <StitchLineCornerToggle
          label="Bal felső sarok"
          corner="top-left"
          disabled={isCornerDisabled('topLeftCorner')}
          selected={editable.topLeftCorner}
          onClick={() => toggle('topLeftCorner')}
        />
        <StitchLineEdgeToggle
          label="Felső oldal"
          selected={editable.top}
          side="top"
          onClick={() => toggle('top')}
        />
        <StitchLineCornerToggle
          label="Jobb felső sarok"
          corner="top-right"
          disabled={isCornerDisabled('topRightCorner')}
          selected={editable.topRightCorner}
          onClick={() => toggle('topRightCorner')}
        />
        <StitchLineEdgeToggle
          label="Bal oldal"
          selected={editable.left}
          side="left"
          onClick={() => toggle('left')}
        />
        <Box gridArea="center" />
        <StitchLineEdgeToggle
          label="Jobb oldal"
          selected={editable.right}
          side="right"
          onClick={() => toggle('right')}
        />
        <StitchLineCornerToggle
          label="Bal alsó sarok"
          corner="bottom-left"
          disabled={isCornerDisabled('bottomLeftCorner')}
          selected={editable.bottomLeftCorner}
          onClick={() => toggle('bottomLeftCorner')}
        />
        <StitchLineEdgeToggle
          label="Alsó oldal"
          selected={editable.bottom}
          side="bottom"
          onClick={() => toggle('bottom')}
        />
        <StitchLineCornerToggle
          label="Jobb alsó sarok"
          corner="bottom-right"
          disabled={isCornerDisabled('bottomRightCorner')}
          selected={editable.bottomRightCorner}
          onClick={() => toggle('bottomRightCorner')}
        />
      </Grid>
    </Grid>
  )
}

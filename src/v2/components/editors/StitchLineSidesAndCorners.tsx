import { Box } from '@chakra-ui/react'
import { ComponentProps, FC, useMemo } from 'react'
import { EditableSchema } from '../../schemas/editable'
import { StitchCornerSchema, StitchLineSchema } from '../../schemas/stitching'

type StitchLineSidesAndCornersProps = {
  stitchLine?: StitchLineSchema
  editable?: EditableSchema<StitchLineSchema>
}

export const StitchLineSidesAndCorners: FC<StitchLineSidesAndCornersProps> = () => {
  return (
    <Box>
      <Corner corner="top-left" isSelected={true} />
      <Corner corner="top-right" isSelected={true} />
      <Corner corner="bottom-left" isSelected={true} />
      <Corner corner="bottom-right" isSelected={true} />
    </Box>
  )
}

type CornerProps = {
  corner: StitchCornerSchema
  isSelected: boolean
}

const Corner: FC<CornerProps> = ({ corner, isSelected }) => {
  const borderRadiusProps = useMemo<ComponentProps<typeof Box>>(() => {
    return {
      borderTopLeftRadius: corner === 'top-left' ? 'md' : 0,
      borderTopRightRadius: corner === 'top-right' ? 'md' : 0,
      borderBottomLeftRadius: corner === 'bottom-left' ? 'md' : 0,
      borderBottomRightRadius: corner === 'bottom-right' ? 'md' : 0,
    }
  }, [corner])

  const marginProps = useMemo<ComponentProps<typeof Box>>(() => {
    return {
      marginTop: corner === 'top-left' || corner === 'top-right' ? 'md' : 0,
      marginLeft: corner === 'top-left' || corner === 'bottom-left' ? 'md' : 0,
      marginBottom: corner === 'bottom-left' || corner === 'bottom-right' ? 'md' : 0,
      marginRight: corner === 'bottom-right' || corner === 'top-right' ? 'md' : 0,
    }
  }, [corner])

  const borderWidthProps = useMemo<ComponentProps<typeof Box>>(() => {
    return {
      borderTopWidth: corner === 'top-left' || corner === 'top-right' ? 'medium' : 0,
      borderLeftWidth: corner === 'top-left' || corner === 'bottom-left' ? 'medium' : 0,
      borderBottomWidth: corner === 'bottom-left' || corner === 'bottom-right' ? 'medium' : 0,
      borderRightWidth: corner === 'bottom-right' || corner === 'top-right' ? 'medium' : 0,
    }
  }, [corner])

  return (
    <Box
      {...borderRadiusProps}
      {...marginProps}
      {...borderWidthProps}
      borderColor={isSelected ? 'border.info' : 'border.emphasized'}
      width={10}
      height={10}
    />
  )
}

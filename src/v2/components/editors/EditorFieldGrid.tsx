import { Grid } from '@chakra-ui/react'
import type { ComponentProps, FC } from 'react'

type EditorFieldGridProps = ComponentProps<'div'>

export const EditorFieldGrid: FC<EditorFieldGridProps> = ({ className, ...props }) => {
  return (
    <Grid
      alignItems="center"
      className={className}
      columnGap="4"
      gridTemplateColumns="max-content minmax(0, 1fr)"
      rowGap="2"
      {...props}
    />
  )
}

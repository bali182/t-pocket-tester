import { Grid, type GridProps } from '@chakra-ui/react'
import type { FC } from 'react'

export const EditorFieldGrid: FC<GridProps> = (props) => {
  return (
    <Grid
      alignItems="center"
      columnGap="3"
      gridTemplateColumns="max-content minmax(0, 1fr)"
      rowGap="2"
      {...props}
    />
  )
}

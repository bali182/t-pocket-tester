import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import type { ComponentProps, FC } from 'react'

type EditorFieldGridProps = ComponentProps<'div'>

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
    display: 'grid',
    gridTemplateColumns: 'max-content minmax(0, 1fr)',
    rowGap: tokens.spacingVerticalS,
  },
})

export const EditorFieldGrid: FC<EditorFieldGridProps> = ({ className, ...props }) => {
  const styles = useStyles()

  return <div className={mergeClasses(styles.root, className)} {...props} />
}

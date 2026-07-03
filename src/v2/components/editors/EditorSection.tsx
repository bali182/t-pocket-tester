import { makeStyles, tokens } from '@fluentui/react-components'
import type { FC, ReactNode } from 'react'

type EditorSectionProps = {
  children: ReactNode
}

const useStyles = makeStyles({
  root: {
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    paddingBlock: tokens.spacingVerticalM,
    paddingInline: tokens.spacingHorizontalM,
  },
})

export const EditorSection: FC<EditorSectionProps> = ({ children }) => {
  const styles = useStyles()

  return <section className={styles.root}>{children}</section>
}

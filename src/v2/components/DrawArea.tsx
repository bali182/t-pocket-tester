import { makeStyles, tokens } from '@fluentui/react-components'
import { type FC } from 'react'
import { SvgRoot } from './svg/SvgRoot'

const useStyles = makeStyles({
  viewport: {
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    boxSizing: 'border-box',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    overflow: 'auto',
    width: '100%',
  },
})

export const DrawArea: FC = () => {
  const styles = useStyles()
  return (
    <div className={styles.viewport}>
      <SvgRoot />
    </div>
  )
}

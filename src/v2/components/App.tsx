import { makeStyles } from '@fluentui/react-components'
import type { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { baseRoute, routes } from '../routes'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
})

export const App: FC = () => {
  const styles = useStyles()

  return (
    <main className={styles.root}>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Navigate to={baseRoute} replace />} />
          {routes.map((route) => (
            <Route key={route.path} path={route.path} Component={route.Component} />
          ))}
          <Route path="*" element={<Navigate to={baseRoute} replace />} />
        </Routes>
      </div>
    </main>
  )
}

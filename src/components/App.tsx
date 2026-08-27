import { Box, Theme } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { portalRef } from '../portalRef'
import { themeAtom } from '../state/themeAtom'
import { ProjectIndexRoute } from './routes/ProjectIndexRoute'
import { ProjectRoute } from './routes/ProjectRoute'
import { ProjectsRoute } from './routes/ProjectsRoute'
import { SubProjectRoute } from './routes/SubProjectRoute'

export const App: FC = () => {
  const theme = useAtomValue(themeAtom)

  return (
    <Theme appearance={theme}>
      <Box as="main" display="flex" flexDirection="column" height="100dvh" overflow="hidden">
        <Box flex="1" minHeight="0" overflow="hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/projects" Component={ProjectsRoute} />
            <Route path="/projects/:projectId" Component={ProjectRoute}>
              <Route index Component={ProjectIndexRoute} />
              <Route path=":subProjectId" Component={SubProjectRoute} />
            </Route>
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Routes>
        </Box>
      </Box>
      <div ref={portalRef} />
    </Theme>
  )
}

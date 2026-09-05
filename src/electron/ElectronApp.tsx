import { Box, Theme } from '@chakra-ui/react'
import type { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { ProjectIndexRoute } from '../common/components/routes/ProjectIndexRoute'
import { ProjectRoute } from '../common/components/routes/ProjectRoute'
import { ProjectsRoute } from '../common/components/routes/ProjectsRoute'
import { SubProjectRoute } from '../common/components/routes/SubProjectRoute'
import { Toaster } from '../common/components/Toaster'
import { useTheme } from '../common/hooks/useTheme'
import { portalRef } from '../common/portalRef'

export const ElectronApp: FC = () => {
  const { theme } = useTheme()

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
      <Toaster />
      <div ref={portalRef} />
    </Theme>
  )
}

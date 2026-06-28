import { Box } from '@chakra-ui/react'
import type { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { baseRoute, routes } from '../routes'
import { Header } from './Header'

export const App: FC = () => {
  return (
    <Box display="flex" flexDirection="column" height="100dvh" overflow="hidden">
      <Header />

      <Box flex="1" minHeight="0" overflow="hidden">
        <Routes>
          <Route path="/" element={<Navigate to={baseRoute} replace />} />
          {routes.map((route) => (
            <Route key={route.path} path={route.path} Component={route.Component} />
          ))}
          <Route path="*" element={<Navigate to={baseRoute} replace />} />
        </Routes>
      </Box>
    </Box>
  )
}

import { Box } from '@chakra-ui/react'
import type { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { CardHolderInputDrawer } from './editor/CardHolderInputDrawer'
import { Header } from './Header'
import { routes } from './routes'

export const App: FC = () => {
  return (
    <Box display="flex" flexDirection="column" height="100dvh" overflow="hidden">
      <Header />

      <Box flex="1" minHeight="0" overflow="hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/card-holder" replace />} />
          {routes.map((route) => (
            <Route key={route.path} path={route.path} Component={route.Component} />
          ))}
          <Route path="*" element={<Navigate to="/card-holder" replace />} />
        </Routes>
      </Box>
      <CardHolderInputDrawer />
    </Box>
  )
}

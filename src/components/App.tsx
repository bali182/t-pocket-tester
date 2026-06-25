import { Box, Heading, Text } from '@chakra-ui/react'
import type { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { CardHolderInputDrawer } from './CardHolderInputDrawer'
import { DrawArea } from './DrawArea'
import { Header } from './Header'

const renderPlaceholder = (title: string) => {
  return (
    <Box p="8">
      <Heading size="lg">{title}</Heading>
      <Text color="fg.muted" mt="2">
        Placeholder
      </Text>
    </Box>
  )
}

export const App: FC = () => {
  return (
    <Box display="flex" flexDirection="column" height="100dvh" overflow="hidden">
      <Header />

      <Box flex="1" minHeight="0" overflow="hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/card-holder" replace />} />
          <Route path="/card-holder" element={<DrawArea />} />
          <Route path="/t-pocket" element={renderPlaceholder('T-pocket')} />
          <Route path="/front-pocket" element={renderPlaceholder('Front pocket')} />
          <Route path="/back-panel" element={renderPlaceholder('Back panel')} />
          <Route path="*" element={<Navigate to="/card-holder" replace />} />
        </Routes>
      </Box>
      <CardHolderInputDrawer />
    </Box>
  )
}

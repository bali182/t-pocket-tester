import type { FC } from 'react'

import { Box, Heading, Text } from '@chakra-ui/react'
import { CenteredLayout } from './CenteredLayout'
import { ScaledSvgPreview } from './ScaledSvgPreview'
import { CardHolderSvg } from './svg/CardHolderSvg'
import { TPocketSvg } from './svg/TPocketSvg'
import { TopPocketSvg } from './svg/TopPocketSvg'

export const CardHolderRoute: FC = () => (
  <CenteredLayout>
    <ScaledSvgPreview>
      <CardHolderSvg />
    </ScaledSvgPreview>
  </CenteredLayout>
)

export const TPocketRoute: FC = () => (
  <CenteredLayout>
    <ScaledSvgPreview>
      <TPocketSvg />
    </ScaledSvgPreview>
  </CenteredLayout>
)

export const TopPocketRoute: FC = () => (
  <CenteredLayout>
    <ScaledSvgPreview>
      <TopPocketSvg />
    </ScaledSvgPreview>
  </CenteredLayout>
)

export const DummyRoute: FC = () => (
  <Box p="8">
    <Heading size="lg">TODO</Heading>
    <Text color="fg.muted" mt="2">
      Placeholder
    </Text>
  </Box>
)

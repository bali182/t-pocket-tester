import { Box } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import type { FC } from 'react'

import { componentsAtom, rootComponentIdAtom } from '../state'
import { RootPanel } from './svg/RootPanel'

export const DrawArea: FC = () => {
  const components = useAtomValue(componentsAtom)
  const rootComponentId = useAtomValue(rootComponentIdAtom)
  const rootComponent = components[rootComponentId]

  if (!rootComponent || rootComponent.type !== 'root-panel') {
    return null
  }

  return (
    <Box height="100%" overflow="auto" width="100%">
      <svg
        width={`${rootComponent.size.width}mm`}
        height={`${rootComponent.size.height}mm`}
        viewBox={`0 0 ${rootComponent.size.width} ${rootComponent.size.height}`}
      >
        <RootPanel rootPanel={rootComponent} />
      </svg>
    </Box>
  )
}

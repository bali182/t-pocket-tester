import { arrow, autoUpdate, flip, FloatingArrow, offset, shift, useFloating } from '@floating-ui/react'
import { Button, Card, Text } from '@chakra-ui/react'
import { useEffect, useRef, type FC } from 'react'

import type { ComponentSchema } from '../schemas/components'

type FloatingEditorProps = {
  component: ComponentSchema
  anchorElement: SVGGraphicsElement
  onClose: () => void
}

export const FloatingEditor: FC<FloatingEditorProps> = ({ component, anchorElement, onClose }) => {
  const arrowRef = useRef<SVGSVGElement | null>(null)
  const { context, refs, floatingStyles, update } = useFloating({
    placement: 'top',
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    strategy: 'fixed',
  })

  useEffect(() => {
    refs.setReference(anchorElement)
    void update()
  }, [anchorElement, refs, update])

  useEffect(() => {
    const floatingElement = refs.floating.current

    if (!floatingElement) {
      return undefined
    }

    return autoUpdate(anchorElement, floatingElement, update)
  }, [anchorElement, refs.floating, update])

  return (
    <Card.Root ref={refs.setFloating} size="sm" style={floatingStyles} width="180px" zIndex="tooltip">
      <FloatingArrow ref={arrowRef} context={context} fill="white" stroke="#E4E4E7" strokeWidth={1} tipRadius={2} />
      <Card.Body gap="2">
        <Text fontWeight="semibold">{component.name}</Text>
        <Text color="fg.muted" fontSize="sm">
          {component.type}
        </Text>
        <Button alignSelf="flex-start" onClick={onClose} size="xs" variant="outline">
          Close
        </Button>
      </Card.Body>
    </Card.Root>
  )
}

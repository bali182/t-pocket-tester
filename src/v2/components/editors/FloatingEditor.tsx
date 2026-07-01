import { Button, Card, CloseButton, Flex, Text, useToken } from '@chakra-ui/react'
import { arrow, autoUpdate, flip, FloatingArrow, offset, shift, useFloating } from '@floating-ui/react'
import { useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState, type FC } from 'react'

import type { ComponentSchema } from '../../schemas/components'
import { componentsAtom } from '../../state'
import { ComponentEditor } from './ComponentEditor'

type FloatingEditorProps = {
  component: ComponentSchema
  anchorElement: SVGGraphicsElement
  onClose: () => void
}

const floatingEditorColorTokens = ['bg.panel', 'border'] as const

export const FloatingEditor: FC<FloatingEditorProps> = ({ component, anchorElement, onClose }) => {
  const arrowRef = useRef<SVGSVGElement | null>(null)
  const setComponents = useSetAtom(componentsAtom)
  const [draftComponent, setDraftComponent] = useState<ComponentSchema>(component)
  const isDirty = draftComponent !== component
  const [cardBackgroundColor, cardBorderColor] = useToken('colors', [...floatingEditorColorTokens])
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

  useEffect(() => {
    setDraftComponent(component)
  }, [component])

  const handleComponentChange = useCallback((updated: ComponentSchema) => {
    setDraftComponent(updated)
  }, [])

  const handleSave = useCallback(() => {
    setComponents((components) => ({
      ...components,
      [draftComponent.id]: draftComponent,
    }))
    onClose()
  }, [draftComponent, onClose, setComponents])

  return (
    <Card.Root ref={refs.setFloating} size="sm" style={floatingStyles} width="260px" zIndex="tooltip">
      <FloatingArrow
        ref={arrowRef}
        context={context}
        fill={cardBackgroundColor}
        stroke={cardBorderColor}
        strokeWidth={1}
        tipRadius={2}
      />
      <Card.Header paddingBlock="2" paddingInline="3">
        <Flex align="center" justify="space-between">
          <Text color="fg.muted" fontSize="sm" fontWeight="bold">
            #{draftComponent.id}
          </Text>
          <CloseButton onClick={onClose} size="xs" variant="ghost" />
        </Flex>
      </Card.Header>
      <Card.Body padding="0">
        <ComponentEditor component={draftComponent} onChange={handleComponentChange} />
      </Card.Body>
      <Card.Footer borderTopWidth="1px" justifyContent="flex-end" paddingBlock="2" paddingInline="3">
        <Button disabled={!isDirty} onClick={handleSave} size="xs">
          Mentés
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}

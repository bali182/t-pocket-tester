import { Accordion, Drawer, Stack } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import type { ComponentType, FC } from 'react'
import { useMemo } from 'react'

import type { SectionId } from '../../schemas/SectionIdSchema'
import { inputSectionOpenStateAtom, isInputDrawerOpenAtom } from '../../state'
import { CardInputSection } from './CardInputSection'
import { PocketsInputSection } from './PocketsInputSection'
import { StitchingInputSection } from './StitchingInputSection'

type InputSection = {
  id: SectionId
  title: string
  isOpen: boolean
  Component: ComponentType
}

export const CardHolderInputDrawer: FC = () => {
  const [isInputDrawerOpen, setIsInputDrawerOpen] = useAtom(isInputDrawerOpenAtom)
  const [inputSectionOpenState, setInputSectionOpenState] = useAtom(inputSectionOpenStateAtom)

  const inputSections = useMemo<InputSection[]>(
    () => [
      {
        id: 'card',
        title: 'Kártya',
        isOpen: inputSectionOpenState.card,
        Component: CardInputSection,
      },
      {
        id: 'pockets',
        title: 'Zsebek',
        isOpen: inputSectionOpenState.pockets,
        Component: PocketsInputSection,
      },
      {
        id: 'stitching',
        title: 'Varrás',
        isOpen: inputSectionOpenState.stitching,
        Component: StitchingInputSection,
      },
    ],
    [inputSectionOpenState],
  )

  const accordionValue = inputSections.filter((section) => section.isOpen).map((section) => section.id)

  return (
    <Drawer.Root
      open={isInputDrawerOpen}
      onOpenChange={(details) => setIsInputDrawerOpen(details.open)}
      placement="end"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Paraméterek</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Accordion.Root
              multiple
              value={accordionValue}
              onValueChange={(details) => {
                setInputSectionOpenState({
                  card: details.value.includes('card'),
                  pockets: details.value.includes('pockets'),
                  stitching: details.value.includes('stitching'),
                })
              }}
            >
              <Stack gap="3">
                {inputSections.map(({ id, title, Component }) => (
                  <Accordion.Item key={id} value={id}>
                    <Accordion.ItemTrigger>
                      {title}
                      <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Accordion.ItemBody>
                        <Component />
                      </Accordion.ItemBody>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                ))}
              </Stack>
            </Accordion.Root>
          </Drawer.Body>
          <Drawer.CloseTrigger />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}

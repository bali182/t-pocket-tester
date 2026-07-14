import { EmptyState, IconButton, Listbox, Splitter, createListCollection } from '@chakra-ui/react'
import { useEffect, useMemo, useState, type FC } from 'react'
import { LuTrash } from 'react-icons/lu'
import { TbNeedleThread } from 'react-icons/tb'

import { useStitchLines } from '../../hooks/useStitchLines'
import type { ComponentSchema } from '../../schemas/components'
import { isDefined } from '../../utils/isDefined'
import { StitchLineEditor } from './StitchLineEditor'

type StitchingEditorProps = {
  component: ComponentSchema
}

export const StitchingEditor: FC<StitchingEditorProps> = ({ component }) => {
  const stitchLines = useStitchLines(component.id)
  const [selectedStitchLineIds, setSelectedStitchLineIds] = useState<string[]>([])
  const collection = useMemo(
    () =>
      createListCollection({
        itemToString: (stitchLine) => stitchLine.name,
        itemToValue: (stitchLine) => stitchLine.id,
        items: stitchLines,
      }),
    [stitchLines],
  )
  const selectedStitchLine = useMemo(() => {
    const selectedStitchLineId = selectedStitchLineIds[0]

    if (!isDefined(selectedStitchLineId)) {
      return undefined
    }

    return stitchLines.find((stitchLine) => stitchLine.id === selectedStitchLineId)
  }, [selectedStitchLineIds, stitchLines])

  useEffect(() => {
    setSelectedStitchLineIds([])
  }, [component.id])

  return (
    <Splitter.Root defaultSize={['30%', '70%']} panels={[{ id: 'stitch-list' }, { id: 'stitch-editor' }]}>
      <Splitter.Panel id="stitch-list">
        <Listbox.Root
          collection={collection}
          onValueChange={(details) => setSelectedStitchLineIds(details.value)}
          selectionMode="single"
          value={selectedStitchLineIds}
        >
          <Listbox.Content borderWidth="0">
            {stitchLines.map((stitchLine) => (
              <Listbox.Item item={stitchLine} key={stitchLine.id}>
                <Listbox.ItemText>{stitchLine.name}</Listbox.ItemText>
                <IconButton aria-label={`${stitchLine.name} törlése`} disabled size="2xs" variant="ghost">
                  <LuTrash />
                </IconButton>
              </Listbox.Item>
            ))}
          </Listbox.Content>
        </Listbox.Root>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="stitch-list:stitch-editor">
        <Splitter.ResizeTriggerSeparator />
        <Splitter.ResizeTriggerIndicator />
      </Splitter.ResizeTrigger>
      <Splitter.Panel id="stitch-editor">
        {isDefined(selectedStitchLine) ? (
          <StitchLineEditor stitchLine={selectedStitchLine} />
        ) : (
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <TbNeedleThread />
              </EmptyState.Indicator>
              <EmptyState.Title>Nincs kiválasztott varrás</EmptyState.Title>
              <EmptyState.Description>Válassz egy varrást a listából a szerkesztéséhez.</EmptyState.Description>
            </EmptyState.Content>
          </EmptyState.Root>
        )}
      </Splitter.Panel>
    </Splitter.Root>
  )
}

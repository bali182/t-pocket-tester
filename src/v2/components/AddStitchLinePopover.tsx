import {
  Button,
  Field,
  HStack,
  Popover,
  Select,
  Stack,
  createListCollection,
  type SelectValueChangeDetails,
} from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo, useState, type FC, type ReactElement } from 'react'
import { PiPlus } from 'react-icons/pi'

import { useProject } from '../hooks/useProject'
import type { StitchLineSchema } from '../schemas/stitching'
import { lastTouchedComponentAtom } from '../state/lastTouchedComponentAtom'
import { useTranslation } from '../translations/translation'
import { getStitchLineTypeOptions, type StitchLineTypeOption } from '../utils/getStitchLineTypeOptions'
import { isDefined } from '../utils/isDefined'
import { ComponentSelect } from './common/ComponentSelect'

type AddStitchLinePopoverProps = {
  trigger: ReactElement
}

export const AddStitchLinePopover: FC<AddStitchLinePopoverProps> = ({ trigger }) => {
  const t = useTranslation()
  const { project, addStitchLine } = useProject()
  const lastTouchedComponent = useAtomValue(lastTouchedComponentAtom)
  const defaultComponentId = useMemo((): string => {
    if (
      isDefined(lastTouchedComponent) &&
      lastTouchedComponent.projectId === project.id &&
      isDefined(project.components[lastTouchedComponent.componentId])
    ) {
      return lastTouchedComponent.componentId
    }

    return project.root
  }, [lastTouchedComponent, project.components, project.id, project.root])
  const [isOpen, setIsOpen] = useState(false)
  const [componentId, setComponentId] = useState<string>(defaultComponentId)
  const [stitchLineType, setStitchLineType] = useState<StitchLineSchema['type']>('component-bounds-stitch-line')
  const component = isDefined(componentId) ? project.components[componentId] : undefined
  const stitchLineTypeOptions = useMemo<StitchLineTypeOption[]>(
    () => getStitchLineTypeOptions(component, t),
    [component, t],
  )
  const stitchLineTypeCollection = useMemo(
    () =>
      createListCollection<StitchLineTypeOption>({
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        items: stitchLineTypeOptions,
      }),
    [stitchLineTypeOptions],
  )
  const canAdd = isDefined(component) && isDefined(stitchLineType)

  const reset = useCallback((): void => {
    setComponentId(defaultComponentId)
    setStitchLineType('component-bounds-stitch-line')
  }, [defaultComponentId])

  const handleOpenChange = useCallback(
    (details: Popover.OpenChangeDetails): void => {
      setIsOpen(details.open)

      reset()
    },
    [reset],
  )

  const handleComponentChange = useCallback(
    (nextComponentId: string): void => {
      const nextComponent = project.components[nextComponentId]
      if (!isDefined(nextComponent)) {
        return
      }
      setComponentId(nextComponentId)
    },
    [project.components],
  )

  const handleStitchLineTypeChange = useCallback((details: SelectValueChangeDetails<StitchLineTypeOption>): void => {
    const nextStitchLineType = details.value[0]
    if (!isDefined(nextStitchLineType)) {
      return
    }
    setStitchLineType(nextStitchLineType as StitchLineSchema['type'])
  }, [])

  const handleAdd = useCallback((): void => {
    if (!canAdd || !isDefined(componentId) || !isDefined(stitchLineType)) {
      return
    }

    addStitchLine(componentId, stitchLineType)
    reset()
    setIsOpen(false)
  }, [addStitchLine, canAdd, componentId, reset, stitchLineType])

  return (
    <Popover.Root onOpenChange={handleOpenChange} open={isOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content width="400px">
          <Popover.Header>
            <Popover.Title>{t.stitchLine.add.title()}</Popover.Title>
          </Popover.Header>
          <Popover.Body>
            <Stack gap="3">
              <Field.Root>
                <Field.Label>{t.common.labels.component()}</Field.Label>
                <ComponentSelect componentId={componentId} onChange={handleComponentChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>{t.stitchLine.add.type()}</Field.Label>
                <Select.Root
                  collection={stitchLineTypeCollection}
                  onValueChange={handleStitchLineTypeChange}
                  size="xs"
                  value={isDefined(stitchLineType) ? [stitchLineType] : []}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder={t.stitchLine.add.typePlaceholder()} />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {stitchLineTypeCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Field.Root>
            </Stack>
          </Popover.Body>
          <Popover.Footer>
            <HStack justify="flex-end" width="100%">
              <Button disabled={!canAdd} onClick={handleAdd} size="xs">
                <PiPlus />
                {t.common.actions.add()}
              </Button>
            </HStack>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}

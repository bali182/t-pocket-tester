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
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, useState, type FC, type ReactElement } from 'react'
import { PiPlus } from 'react-icons/pi'

import type { ComponentSchema } from '../schemas/components'
import type { StitchLineSchema } from '../schemas/stitching'
import { projectAtom } from '../state/state'
import { createStitchLine } from '../utils/createStitchLine'
import { isDefined } from '../utils/isDefined'
import { ComponentSelect } from './common/ComponentSelect'

type StitchLineTypeOption = {
  label: string
  value: StitchLineSchema['type']
}

type AddStitchLinePopoverProps = {
  trigger: ReactElement
}

const componentBoundsStitchLineOption: StitchLineTypeOption = {
  label: 'Komponens határvonala',
  value: 'component-bounds-stitch-line',
}

const pocketClusterStitchLineOption: StitchLineTypeOption = {
  label: 'T-zsebek aljának varrása',
  value: 'pocket-cluster-stitch-line',
}

export const AddStitchLinePopover: FC<AddStitchLinePopoverProps> = ({ trigger }) => {
  const project = useAtomValue(projectAtom)
  const setProject = useSetAtom(projectAtom)
  const [isOpen, setIsOpen] = useState(false)
  const [componentId, setComponentId] = useState<string | undefined>(undefined)
  const [stitchLineType, setStitchLineType] = useState<StitchLineSchema['type'] | undefined>(
    'component-bounds-stitch-line',
  )
  const component = isDefined(componentId) ? project.components[componentId] : undefined
  const stitchLineTypeOptions = useMemo<StitchLineTypeOption[]>(() => getStitchLineTypeOptions(component), [component])
  const isStitchLineTypeDisabled = !isDefined(component) || component.type !== 'pocket-cluster'
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
    setComponentId(undefined)
    setStitchLineType(undefined)
  }, [])

  const handleOpenChange = useCallback(
    (details: Popover.OpenChangeDetails): void => {
      setIsOpen(details.open)

      if (!details.open) {
        reset()
      }
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

    setProject((currentProject) => {
      const stitchLine = createStitchLine(stitchLineType, currentProject, componentId)
      return {
        ...currentProject,
        stitchLines: [...currentProject.stitchLines, stitchLine],
      }
    })
    reset()
    setIsOpen(false)
  }, [canAdd, componentId, reset, setProject, stitchLineType])

  return (
    <Popover.Root onOpenChange={handleOpenChange} open={isOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content width="400px">
          <Popover.Header>
            <Popover.Title>Varrás hozzáadása</Popover.Title>
          </Popover.Header>
          <Popover.Body>
            <Stack gap="3">
              <Field.Root>
                <Field.Label>Komponens</Field.Label>
                <ComponentSelect componentId={componentId} onChange={handleComponentChange} />
              </Field.Root>
              <Field.Root disabled={isStitchLineTypeDisabled}>
                <Field.Label>Varrás típusa</Field.Label>
                <Select.Root
                  collection={stitchLineTypeCollection}
                  disabled={isStitchLineTypeDisabled}
                  onValueChange={handleStitchLineTypeChange}
                  size="xs"
                  value={isDefined(stitchLineType) ? [stitchLineType] : []}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Varrás típusának kiválasztása" />
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
                Hozzáadás
              </Button>
            </HStack>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}

const getStitchLineTypeOptions = (component: ComponentSchema | undefined): StitchLineTypeOption[] => {
  if (!isDefined(component)) {
    return []
  }

  if (component.type === 'pocket-cluster') {
    return [componentBoundsStitchLineOption, pocketClusterStitchLineOption]
  }

  return [componentBoundsStitchLineOption]
}

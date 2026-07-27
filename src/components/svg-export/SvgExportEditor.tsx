import {
  Select,
  Switch,
  createListCollection,
  type ListCollection,
  type SelectValueChangeDetails,
} from '@chakra-ui/react'
import { useCallback, useMemo, type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import type { SvgExportParamsSchema, SvgExportStitchLineModeSchema } from '../../schemas/svgExport'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { NumberInput } from '../common/NumberInput'
import { SectionGroup } from '../common/SectionGroup'

type SvgExportStitchLineModeOption = {
  label: string
  value: SvgExportStitchLineModeSchema
}

type SvgExportEditorProps = {
  editable: EditableSchema<SvgExportParamsSchema>
  issues: ValidationIssuesSchema<SvgExportParamsSchema>
  onChange: (updated: EditableSchema<SvgExportParamsSchema>) => void
}

export const SvgExportEditor: FC<SvgExportEditorProps> = ({ editable, issues, onChange }) => {
  const t = useTranslation()
  const stitchLineModeOptions = useMemo<SvgExportStitchLineModeOption[]>(
    () => [
      { label: t.svgExport.dialog.stitchLineModes.ownStitchLines, value: 'own-stitch-lines' },
      { label: t.svgExport.dialog.stitchLineModes.allStitchLines, value: 'all-stitch-lines' },
    ],
    [t],
  )
  const stitchLineModeCollection = useMemo<ListCollection<SvgExportStitchLineModeOption>>(
    () =>
      createListCollection<SvgExportStitchLineModeOption>({
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        items: stitchLineModeOptions,
      }),
    [stitchLineModeOptions],
  )

  const handleGapChange = useCallback(
    (gap: string): void => {
      onChange({ ...editable, gap })
    },
    [editable, onChange],
  )

  const handlePaddingChange = useCallback(
    (padding: string): void => {
      onChange({ ...editable, padding })
    },
    [editable, onChange],
  )

  const handleCutHelperDistanceChange = useCallback(
    (cutHelperDistance: string): void => {
      onChange({ ...editable, cutHelperDistance })
    },
    [editable, onChange],
  )

  const handleStitchLineModeChange = useCallback(
    (details: SelectValueChangeDetails<SvgExportStitchLineModeOption>): void => {
      const stitchLineMode = details.value[0]

      if (!isDefined(stitchLineMode)) {
        return
      }

      onChange({ ...editable, stitchLineMode: stitchLineMode as SvgExportStitchLineModeSchema })
    },
    [editable, onChange],
  )

  const handleShowNamesChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => {
      onChange({ ...editable, showNames: details.checked })
    },
    [editable, onChange],
  )

  const handleShowDimensionsChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => {
      onChange({ ...editable, showDimensions: details.checked })
    },
    [editable, onChange],
  )

  const handleChildMarkersChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => {
      onChange({ ...editable, childMarkers: details.checked })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Root>
      <SectionGroup.Section>
        <SectionGroup.SectionHeader>{t.svgExport.dialog.sections.layout}</SectionGroup.SectionHeader>
        <SectionGroup.SectionRowTitle>{t.svgExport.dialog.labels.gap}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <NumberInput issue={issues.gap} onChange={handleGapChange} step={1} unit="mm" value={editable.gap} />
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>{t.svgExport.dialog.labels.padding}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <NumberInput issue={issues.padding} onChange={handlePaddingChange} step={1} unit="mm" value={editable.padding} />
        </SectionGroup.SectionRowEditor>
      </SectionGroup.Section>

      <SectionGroup.Section>
        <SectionGroup.SectionHeader>{t.svgExport.dialog.sections.content}</SectionGroup.SectionHeader>
        <SectionGroup.SectionRowTitle>{t.svgExport.dialog.labels.stitchLineMode}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <Select.Root
            collection={stitchLineModeCollection}
            onValueChange={handleStitchLineModeChange}
            size="xs"
            value={[editable.stitchLineMode]}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {stitchLineModeCollection.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </SectionGroup.SectionRowEditor>

        <SectionGroup.SectionRowTitle>{t.svgExport.dialog.labels.showNames}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <Switch.Root checked={editable.showNames} onCheckedChange={handleShowNamesChange} size="sm">
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </SectionGroup.SectionRowEditor>

        <SectionGroup.SectionRowTitle>{t.svgExport.dialog.labels.showDimensions}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <Switch.Root checked={editable.showDimensions} onCheckedChange={handleShowDimensionsChange} size="sm">
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </SectionGroup.SectionRowEditor>

        <SectionGroup.SectionRowTitle>{t.svgExport.dialog.labels.childMarkers}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <Switch.Root checked={editable.childMarkers} onCheckedChange={handleChildMarkersChange} size="sm">
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>{t.svgExport.dialog.labels.cutHelperDistance}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <NumberInput
            issue={issues.cutHelperDistance}
            onChange={handleCutHelperDistanceChange}
            step={1}
            unit="mm"
            value={editable.cutHelperDistance}
          />
        </SectionGroup.SectionRowEditor>
      </SectionGroup.Section>
    </SectionGroup.Root>
  )
}

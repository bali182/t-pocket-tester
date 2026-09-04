import { Box, HStack, Icon, Text } from '@chakra-ui/react'
import { useCallback, useMemo, type FC, type KeyboardEvent, type ReactNode } from 'react'
import { PiNeedle } from 'react-icons/pi'

import { LANGUAGE } from '../../constants/language'
import { useEditableModel } from '../../hooks/useEditableModel'
import type { StitchLineCommonConfigSchema } from '../../schemas/stitching'
import type { BaseValidationContextSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { optionalComparators } from '../../utils/comparators'
import { validateStitchLineCommonConfigSchema } from '../../validators/validateStitchLineCommonConfigSchema'
import { NumberInput } from '../common/NumberInput'
import { StitchHoleDistanceEditor } from '../stitch-line-editors/StitchHoleDistanceEditor'

type StitchingSettingsMenuItemsProps = {
  value: StitchLineCommonConfigSchema
  onChange: (update: Partial<StitchLineCommonConfigSchema>) => void
}

const stopPropagation = (event: KeyboardEvent<HTMLDivElement>): void => event.stopPropagation()

export const StitchingSettingsMenuItems: FC<StitchingSettingsMenuItemsProps> = ({ onChange, value }) => {
  const t = useTranslation()
  const context = useMemo<BaseValidationContextSchema>(() => ({ language: LANGUAGE, t }), [t])
  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit: onChange,
    context,
    isEqual: optionalComparators.stitchingSettings,
    validate: validateStitchLineCommonConfigSchema,
    value,
  })

  const handleStitchMarginChange = useCallback(
    (stitchMargin: string): void => setValue({ ...editableValue, stitchMargin }),
    [editableValue, setValue],
  )
  const handleStitchHoleLengthChange = useCallback(
    (stitchHoleLength: string): void => setValue({ ...editableValue, stitchHoleLength }),
    [editableValue, setValue],
  )
  const handleStitchHoleDistanceChange = useCallback(
    (stitchHoleDistance: string): void => setValue({ ...editableValue, stitchHoleDistance }),
    [editableValue, setValue],
  )
  const handleStitchHoleThicknessChange = useCallback(
    (stitchHoleThickness: string): void => setValue({ ...editableValue, stitchHoleThickness }),
    [editableValue, setValue],
  )
  const handleStitchLineThicknessChange = useCallback(
    (stitchLineThickness: string): void => setValue({ ...editableValue, stitchLineThickness }),
    [editableValue, setValue],
  )

  return (
    <Box onKeyDown={stopPropagation}>
      <StitchingSettingsMenuItem label={t.editor.menus.edit.stitching.margin}>
        <NumberInput
          issue={validationIssues.stitchMargin}
          onChange={handleStitchMarginChange}
          size="2xs"
          unit="mm"
          value={editableValue.stitchMargin}
        />
      </StitchingSettingsMenuItem>
      <StitchingSettingsMenuItem label={t.editor.menus.edit.stitching.holeLength}>
        <NumberInput
          issue={validationIssues.stitchHoleLength}
          onChange={handleStitchHoleLengthChange}
          size="2xs"
          unit="mm"
          value={editableValue.stitchHoleLength}
        />
      </StitchingSettingsMenuItem>
      <StitchingSettingsMenuItem label={t.editor.menus.edit.stitching.holeDistance}>
        <StitchHoleDistanceEditor
          isResetEnabled={false}
          issue={validationIssues.stitchHoleDistance}
          onChange={handleStitchHoleDistanceChange}
          value={editableValue.stitchHoleDistance}
          size="2xs"
        />
      </StitchingSettingsMenuItem>
      <StitchingSettingsMenuItem label={t.editor.menus.edit.stitching.holeThickness}>
        <NumberInput
          issue={validationIssues.stitchHoleThickness}
          onChange={handleStitchHoleThicknessChange}
          size="2xs"
          unit="mm"
          value={editableValue.stitchHoleThickness}
        />
      </StitchingSettingsMenuItem>
      <StitchingSettingsMenuItem label={t.editor.menus.edit.stitching.lineThickness}>
        <NumberInput
          issue={validationIssues.stitchLineThickness}
          onChange={handleStitchLineThicknessChange}
          size="2xs"
          unit="mm"
          value={editableValue.stitchLineThickness}
        />
      </StitchingSettingsMenuItem>
    </Box>
  )
}

type StitchingSettingsMenuItemProps = {
  label: string
  children: ReactNode
}

const StitchingSettingsMenuItem: FC<StitchingSettingsMenuItemProps> = ({ children, label }) => {
  return (
    <HStack gap="3" height="8" px="1">
      <Icon as={PiNeedle} />
      <Text flex="1" textStyle="sm">
        {label}
      </Text>
      <Box width="28">{children}</Box>
    </HStack>
  )
}

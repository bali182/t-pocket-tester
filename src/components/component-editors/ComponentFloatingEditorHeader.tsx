import { useCallback, type ReactElement } from 'react'
import type { IconType } from 'react-icons'

import type { BaseComponentSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { ColorInput } from '../common/ColorInput'
import { IdentityFloatingEditorHeader } from '../common/IdentityFloatingEditorHeader'

type ComponentFloatingEditorHeaderProps<T extends BaseComponentSchema> = {
  baseColor: string
  editable: EditableSchema<T>
  icon: IconType
  issues: ValidationIssuesSchema<T>
  menu: ReactElement
  onChange: (updated: EditableSchema<T>) => void
  onResetColor: () => void
}

export const ComponentFloatingEditorHeader = <T extends BaseComponentSchema>({
  baseColor,
  editable,
  icon,
  issues,
  menu,
  onChange,
  onResetColor,
}: ComponentFloatingEditorHeaderProps<T>) => {
  const effectiveColor = editable.color ?? baseColor

  const handleColorChange = useCallback(
    (color: string) => {
      onChange({ ...editable, color })
    },
    [editable, onChange],
  )

  return (
    <IdentityFloatingEditorHeader
      editable={editable}
      icon={icon}
      issues={issues}
      menu={menu}
      onChange={onChange}
      rightAddon={
        <ColorInput
          fieldSizing="content"
          isResetEnabled={isDefined(editable.color)}
          issue={issues.color}
          onChange={handleColorChange}
          onReset={onResetColor}
          value={effectiveColor}
        />
      }
    />
  )
}

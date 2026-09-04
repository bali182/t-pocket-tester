import { Icon, Menu } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { PiEye, PiEyeSlash, PiNeedle } from 'react-icons/pi'
import type { StitchingVisibilityConfigSchema, StitchLineCommonConfigSchema } from '../../schemas/stitching'

type StitchVisibilityMenuItemProps = {
  value: boolean
  label: string
  field: keyof StitchingVisibilityConfigSchema
  onChange: (update: Partial<StitchLineCommonConfigSchema>) => void
}

export const StitchVisibilityMenuItem: FC<StitchVisibilityMenuItemProps> = ({ onChange, field, value, label }) => {
  const toggle = useCallback(() => onChange({ [field]: !value }), [field, onChange, value])

  return (
    <Menu.Item onSelect={toggle} value={field} closeOnSelect={false}>
      <PiNeedle />
      <Menu.ItemText mr="2">{label}</Menu.ItemText>
      {value ? <PiEye /> : <Icon as={PiEyeSlash} color="fg.muted" />}
    </Menu.Item>
  )
}

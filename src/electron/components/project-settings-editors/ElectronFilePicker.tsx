import { Button, Input, InputGroup } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type FC } from 'react'
import { PiFolder } from 'react-icons/pi'

import { useTranslation } from '../../../common/translations/translation'

type ElectronFilePickerProps = {
  value: string
  disabled?: boolean
  onChange: (value: string) => void
  onFilePickerButtonPressed: () => void
}

export const ElectronFilePicker: FC<ElectronFilePickerProps> = ({
  disabled,
  onChange,
  onFilePickerButtonPressed,
  value,
}) => {
  const t = useTranslation()
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange(event.currentTarget.value)
    },
    [onChange],
  )

  return (
    <InputGroup
      endAddon={
        <Button
          alignSelf="stretch"
          borderRadius="0"
          disabled={disabled}
          height="auto"
          onClick={onFilePickerButtonPressed}
          size="xs"
          variant="plain"
        >
          <PiFolder />
          {t.projects.createDialog.actions.browse}
        </Button>
      }
      endAddonProps={{ px: 0, size: 'xs' }}
    >
      <Input disabled={disabled} onChange={handleChange} size="xs" value={value} />
    </InputGroup>
  )
}

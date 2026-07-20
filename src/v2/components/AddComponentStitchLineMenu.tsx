import { Menu, Portal } from '@chakra-ui/react'
import { useCallback, useMemo, type FC } from 'react'
import { PiCaretRight, PiNeedle } from 'react-icons/pi'

import type { ComponentSchema } from '../schemas/components'
import type { StitchLineSchema } from '../schemas/stitching'
import { useTranslation } from '../translations/translation'
import { getStitchLineTypeOptions } from '../utils/getStitchLineTypeOptions'
import { isDefined } from '../utils/isDefined'

type AddComponentStitchLineMenuProps = {
  component: ComponentSchema
  onAddStitchLine: (type: StitchLineSchema['type']) => void
}

type AddComponentStitchLineMenuItemProps = {
  label: string
  onAddStitchLine: (type: StitchLineSchema['type']) => void
  type: StitchLineSchema['type']
}

const AddComponentStitchLineMenuItem: FC<AddComponentStitchLineMenuItemProps> = ({
  label,
  onAddStitchLine,
  type,
}) => {
  const handleClick = useCallback((): void => {
    onAddStitchLine(type)
  }, [onAddStitchLine, type])

  return (
    <Menu.Item onClick={handleClick} value={type}>
      <PiNeedle />
      <Menu.ItemText>{label}</Menu.ItemText>
    </Menu.Item>
  )
}

export const AddComponentStitchLineMenu: FC<AddComponentStitchLineMenuProps> = ({ component, onAddStitchLine }) => {
  const t = useTranslation()
  const stitchLineTypeOptions = useMemo(() => getStitchLineTypeOptions(component, t), [component, t])

  const stitchLineTypeOption = stitchLineTypeOptions[0]
  if (stitchLineTypeOptions.length === 1 && isDefined(stitchLineTypeOption)) {
    return (
      <AddComponentStitchLineMenuItem
        label={t.common.actions.addStitchLine()}
        onAddStitchLine={onAddStitchLine}
        type={stitchLineTypeOption.value}
      />
    )
  }

  return (
    <Menu.Root positioning={{ placement: 'right-start' }}>
      <Menu.TriggerItem>
        <PiNeedle />
        <Menu.ItemText>{t.common.actions.addStitchLine()}</Menu.ItemText>
        <Menu.ItemCommand>
          <PiCaretRight />
        </Menu.ItemCommand>
      </Menu.TriggerItem>
      <Portal>
        <Menu.Positioner>
          <Menu.Content _closed={{ animation: 'none' }} _open={{ animation: 'none' }}>
            {stitchLineTypeOptions.map((stitchLineTypeOption) => (
              <AddComponentStitchLineMenuItem
                key={stitchLineTypeOption.value}
                label={stitchLineTypeOption.label}
                onAddStitchLine={onAddStitchLine}
                type={stitchLineTypeOption.value}
              />
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

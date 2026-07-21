import { Button, HStack } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { PiTrash } from 'react-icons/pi'

import { useProject } from '../../hooks/useProject'
import type { StitchLineSchema } from '../../schemas/stitching'
import { useTranslation } from '../../translations/translation'

type StitchLineEditorHeaderMenuProps = {
  onClose: () => void
  stitchLine: StitchLineSchema
}

export const StitchLineEditorHeaderMenu: FC<StitchLineEditorHeaderMenuProps> = ({ onClose, stitchLine }) => {
  const t = useTranslation()
  const { deleteStitchLine } = useProject()

  const handleDelete = useCallback((): void => {
    onClose()
    deleteStitchLine(stitchLine.id)
  }, [deleteStitchLine, onClose, stitchLine.id])

  return (
    <HStack gap="1">
      <Button colorPalette="red" onClick={handleDelete} size="2xs" variant="subtle">
        <PiTrash />
        {t.common.actions.remove}
      </Button>
    </HStack>
  )
}

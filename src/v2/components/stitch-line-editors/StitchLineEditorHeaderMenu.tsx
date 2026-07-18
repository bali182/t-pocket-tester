import { Button, HStack } from '@chakra-ui/react'
import { useSetAtom } from 'jotai'
import { useCallback, type FC } from 'react'
import { PiTrash } from 'react-icons/pi'

import type { StitchLineSchema } from '../../schemas/stitching'
import { projectAtom } from '../../state'
import { removeStitchLine } from '../../utils/removeStitchLine'

type StitchLineEditorHeaderMenuProps = {
  onClose: () => void
  stitchLine: StitchLineSchema
}

export const StitchLineEditorHeaderMenu: FC<StitchLineEditorHeaderMenuProps> = ({ onClose, stitchLine }) => {
  const setProject = useSetAtom(projectAtom)

  const handleDelete = useCallback((): void => {
    onClose()
    setProject((project) => removeStitchLine(stitchLine.id, project))
  }, [onClose, setProject, stitchLine.id])

  return (
    <HStack gap="1">
      <Button colorPalette="red" onClick={handleDelete} size="2xs" variant="subtle">
        <PiTrash />
        Törlés
      </Button>
    </HStack>
  )
}

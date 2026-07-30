import { Box, IconButton, type IconButtonProps } from '@chakra-ui/react'
import { useCallback, type FC, type MouseEvent } from 'react'
import { PiDotsThreeVertical } from 'react-icons/pi'

type HoleActionsMenuProps = {
  size: IconButtonProps['size']
}

export const HoleActionsMenu: FC<HoleActionsMenuProps> = ({ size }) => {
  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
  }, [])

  return (
    <Box onClick={handleClick}>
      <IconButton size={size} variant="ghost">
        <PiDotsThreeVertical />
      </IconButton>
    </Box>
  )
}

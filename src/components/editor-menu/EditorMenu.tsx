import { Button, Card, HStack, IconButton, Separator, Switch, Text } from '@chakra-ui/react'
import { useCallback, useRef } from 'react'
import { PiCaretLeft, PiMoon, PiSun, PiWalletDuotone } from 'react-icons/pi'
import { Link } from 'react-router'
import { appRoutes } from '../../appRoutes'
import { useProject } from '../../hooks/useProject'
import { useTheme } from '../../hooks/useTheme'
import { ProjectSettingsPopover } from '../ProjectSettingsPopover'
import { EditMenu } from './EditMenu'
import { FileMenu } from './FileMenu'
import { ViewMenu } from './ViewMenu'

export const EditorMenu = () => {
  const { project } = useProject()
  const { theme, setTheme } = useTheme()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleThemeChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => setTheme(details.checked ? 'dark' : 'light'),
    [setTheme],
  )

  return (
    <>
      <Card.Root ref={menuRef}>
        <Card.Body padding="2" flexDirection="row" alignItems="center">
          <Link to={appRoutes.projects}>
            <IconButton size="sm" variant="ghost" mr="1" borderRadius="full">
              <PiCaretLeft />
            </IconButton>
          </Link>
          <ProjectSettingsPopover
            anchorRef={menuRef}
            trigger={
              <Button flexShrink="1" minWidth="0" size="sm" variant="ghost">
                <PiWalletDuotone />
                <Text maxWidth="sm" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                  {project.name}
                </Text>
              </Button>
            }
          />
          <Separator orientation="vertical" height="5" ml="3" mr="3" />
          <HStack gap="1">
            <FileMenu />
            <EditMenu />
            <ViewMenu />
          </HStack>
          <Separator orientation="vertical" height="5" ml="3" mr="7" />
          <Switch.Root checked={theme === 'dark'} onCheckedChange={handleThemeChange} size="lg">
            <Switch.HiddenInput />
            <Switch.Control bg="bg.emphasized" _checked={{ bg: 'bg.emphasized' }}>
              <Switch.Thumb bg="bg.panel" _checked={{ bg: 'bg.panel' }} />
              <Switch.Indicator fallback={<PiSun />}>
                <PiMoon />
              </Switch.Indicator>
            </Switch.Control>
          </Switch.Root>
        </Card.Body>
      </Card.Root>
    </>
  )
}

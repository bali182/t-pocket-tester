import { Card, HStack, IconButton, Input, Separator, Switch } from '@chakra-ui/react'
import { useCallback, type ChangeEvent } from 'react'
import { PiCaretLeft, PiMoon, PiSun, PiWalletDuotone } from 'react-icons/pi'
import { Link } from 'react-router'
import { appRoutes } from '../../appRoutes'
import { useEditableProject } from '../../hooks/useEditableProject'
import { useTheme } from '../../hooks/useTheme'
import { isDefined } from '../../utils/isDefined'
import { EditMenu } from './EditMenu'
import { FileMenu } from './FileMenu'
import { ViewMenu } from './ViewMenu'

export const EditorMenu = () => {
  const { editableProject, setProject, validationIssues } = useEditableProject()
  const { theme, setTheme } = useTheme()
  const hasNameError = isDefined(validationIssues.name) && validationIssues.name.severity === 'error'

  const handleThemeChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => setTheme(details.checked ? 'dark' : 'light'),
    [setTheme],
  )
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setProject({ ...editableProject, name: event.currentTarget.value })
    },
    [editableProject, setProject],
  )

  return (
    <>
      <Card.Root>
        <Card.Body padding="2" flexDirection="row" alignItems="center">
          <Link to={appRoutes.projects}>
            <IconButton size="sm" variant="ghost" mr="1" borderRadius="full">
              <PiCaretLeft />
            </IconButton>
          </Link>
          <HStack gap="1">
            <PiWalletDuotone />
            <Input
              aria-invalid={hasNameError}
              _invalid={{ borderColor: 'border.error', focusRingColor: 'border.error' }}
              borderColor="transparent"
              fieldSizing="content"
              focusRing="inside"
              focusRingColor="colorPalette.focusRing"
              fontWeight="bold"
              onChange={handleNameChange}
              px="1"
              size="sm"
              value={editableProject.name}
              w="auto"
            />
          </HStack>
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

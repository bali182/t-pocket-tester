import {
  Box,
  Button,
  EmptyState,
  HStack,
  Input,
  Listbox,
  Stack,
  Text,
  useFilter,
  useListCollection,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState, type FC } from 'react'
import { LiaFrogSolid } from 'react-icons/lia'
import { PiFolderDuotone, PiMagnifyingGlass, PiPlus, PiWalletDuotone } from 'react-icons/pi'
import { Link } from 'react-router'

import { useRecentProjects } from '../../hooks/useRecentProjects'
import { useTranslation } from '../../translations/translation'
import { CreateProjectDialog } from '../CreateProjectDialog'
import { ProjectActionsMenu } from '../ProjectActionsMenu'

export const ProjectsRoute: FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const recentProjects = useRecentProjects()
  const t = useTranslation()
  const { contains } = useFilter({ sensitivity: 'base' })
  const { collection, filter, set } = useListCollection({
    filter: contains,
    initialItems: recentProjects,
    itemToString: (project) => project.projectName,
    itemToValue: (project) => project.projectId,
  })

  useEffect(() => {
    set(recentProjects)
  }, [recentProjects, set])

  const openCreateDialog = useCallback((): void => {
    setIsCreateDialogOpen(true)
  }, [])

  return (
    <Box bg="bg.emphasized" height="100%" padding="8">
      <Stack align="center" height="100%" justify="center">
        <Stack gap="4" maxWidth="lg" width="100%">
          <HStack gap="1">
            <LiaFrogSolid size={30} />
            <Text fontWeight="semibold">T Pocket Tester</Text>
          </HStack>
          <Listbox.Root
            collection={collection}
            display="flex"
            flexDirection="column"
            height={recentProjects.length > 0 ? '50dvh' : 'auto'}
            highlightedValue={null}
          >
            <Listbox.Input
              as={Input}
              onChange={(event) => filter(event.target.value)}
              placeholder="Keresés..."
              mb="2"
            />
            <Listbox.Content maxHeight="calc(50dvh - 6rem)" overflowY="auto">
              {collection.items.map((project) => {
                return (
                  <Listbox.Item flex="none" item={project} key={project.projectId}>
                    <HStack gap="3" width="100%">
                      <Link style={{ flex: 1 }} to={project.link}>
                        <HStack gap="3">
                          <PiWalletDuotone size={18} />
                          <Listbox.ItemText>
                            {project.projectName}
                            <Text color="fg.muted" fontSize="xs" mt="1">
                              {project.formattedLastOpenedAt}
                            </Text>
                          </Listbox.ItemText>
                        </HStack>
                      </Link>
                      <ProjectActionsMenu projectId={project.projectId} size="xs" />
                    </HStack>
                  </Listbox.Item>
                )
              })}
              <Listbox.Empty>
                {recentProjects.length === 0 && (
                  <EmptyState.Root size="sm">
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <PiFolderDuotone />
                      </EmptyState.Indicator>
                      <EmptyState.Title>{t.projects.empty.noProjects.title}</EmptyState.Title>
                      <EmptyState.Description>{t.projects.empty.noProjects.description}</EmptyState.Description>
                    </EmptyState.Content>
                  </EmptyState.Root>
                )}
                {recentProjects.length !== 0 && collection.items.length === 0 && (
                  <EmptyState.Root size="sm">
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <PiMagnifyingGlass />
                      </EmptyState.Indicator>
                      <EmptyState.Title>{t.projects.empty.noSearchResults.title}</EmptyState.Title>
                      <EmptyState.Description>{t.projects.empty.noSearchResults.description}</EmptyState.Description>
                    </EmptyState.Content>
                  </EmptyState.Root>
                )}
              </Listbox.Empty>
            </Listbox.Content>
            <Button onClick={openCreateDialog} width="100%" mt="2">
              <PiPlus />
              {t.projects.actions.create}
            </Button>
          </Listbox.Root>
        </Stack>
      </Stack>
      <CreateProjectDialog isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </Box>
  )
}

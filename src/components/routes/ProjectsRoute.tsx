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
import { format } from 'timeago.js'

import { appRoutes } from '../../appRoutes'
import { useProjects } from '../../hooks/useProjects'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { CreateProjectDialog } from '../CreateProjectDialog'

export const ProjectsRoute: FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { projects } = useProjects()
  const t = useTranslation()
  const { contains } = useFilter({ sensitivity: 'base' })
  const { collection, filter, set } = useListCollection({
    filter: contains,
    initialItems: projects,
    itemToString: (project) => project.name,
    itemToValue: (project) => project.id,
  })

  useEffect(() => {
    set(projects)
  }, [projects, set])

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
            height={projects.length > 0 ? '50dvh' : 'auto'}
          >
            <Listbox.Input
              as={Input}
              onChange={(event) => filter(event.target.value)}
              placeholder="Keresés..."
              mb="2"
            />
            <Listbox.Content maxHeight="calc(50dvh - 6rem)" overflowY="auto">
              {collection.items.map((project) => {
                const firstSubProject = project.subProjects[0]
                const target = isDefined(firstSubProject)
                  ? appRoutes.subProject(project.id, firstSubProject.id)
                  : appRoutes.project(project.id)
                return (
                  <Listbox.Item asChild flex="none" item={project} key={project.id}>
                    <Link to={target}>
                      <HStack gap="3">
                        <PiWalletDuotone />
                        <Listbox.ItemText>
                          {project.name}
                          <Text color="fg.muted" fontSize="xs" mt="1">
                            {format(new Date())}
                          </Text>
                        </Listbox.ItemText>
                      </HStack>
                    </Link>
                  </Listbox.Item>
                )
              })}
              <Listbox.Empty>
                {projects.length === 0 && (
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
                {projects.length !== 0 && collection.items.length === 0 && (
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

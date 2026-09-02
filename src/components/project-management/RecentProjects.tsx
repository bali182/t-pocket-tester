import {
  EmptyState,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Listbox,
  Text,
  useFilter,
  useListCollection,
} from '@chakra-ui/react'
import { ChangeEvent, FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { PiFolderDuotone, PiMagnifyingGlass, PiWalletDuotone, PiX } from 'react-icons/pi'
import { Link } from 'react-router'
import { RecentProjectVisualisationSchema } from '../../schemas/recentProject'
import { useTranslation } from '../../translations/translation'
import { ProjectActionsMenu } from '../ProjectActionsMenu'

type ProjectItemMode = 'action' | 'link'

type RecentProjectsProps = PropsWithChildren & {
  projects: RecentProjectVisualisationSchema[]
  mode: ProjectItemMode
  onOpen?: (project: RecentProjectVisualisationSchema) => void
}

export const RecentProjects: FC<RecentProjectsProps> = ({ projects, onOpen, mode, children }) => {
  const [search, setSearch] = useState('')

  const t = useTranslation()

  const { contains } = useFilter({ sensitivity: 'base' })
  const { collection, filter, set } = useListCollection({
    filter: contains,
    initialItems: projects,
    itemToString: (project) => project.projectName,
    itemToValue: (project) => project.projectId,
  })

  useEffect(() => {
    set(projects)
  }, [projects, set])

  const clearSearch = useCallback((): void => {
    setSearch('')
    filter('')
  }, [filter])

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const search = event.target.value
      setSearch(search)
      filter(search)
    },
    [filter],
  )

  return (
    <Listbox.Root collection={collection} display="flex" flexDirection="column" height="50dvh" highlightedValue={null}>
      <InputGroup
        startElement={<PiMagnifyingGlass />}
        endElement={
          search.length > 0 ? (
            <IconButton aria-label={t.common.actions.reset} onClick={clearSearch} size="2xs" variant="ghost">
              <PiX />
            </IconButton>
          ) : undefined
        }
        mb="2"
      >
        <Input bg="bg.panel" onChange={handleSearchChange} placeholder="Keresés..." value={search} />
      </InputGroup>
      <Listbox.Content overflowY="auto">
        {collection.items.map((project) => (
          <ProjectItem key={project.projectId} project={project} mode={mode} onOpen={onOpen} />
        ))}
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
      {children}
    </Listbox.Root>
  )
}

type ProjectItemProps = {
  project: RecentProjectVisualisationSchema
  onOpen?: (project: RecentProjectVisualisationSchema) => void
  mode: ProjectItemMode
}

const ProjectItem: FC<ProjectItemProps> = ({ project, onOpen, mode }) => {
  const handleClick = useCallback(async (): Promise<void> => {
    onOpen?.(project)
  }, [onOpen, project])

  const itemContent = (
    <HStack gap="3">
      <PiWalletDuotone size={18} />
      <Listbox.ItemText>
        {project.projectName}
        <Text color="fg.muted" fontSize="xs" mt="1">
          {project.formattedLastOpenedAt}
        </Text>
      </Listbox.ItemText>
    </HStack>
  )

  return (
    <Listbox.Item flex="none" item={project} onClick={mode === 'action' ? handleClick : undefined}>
      <HStack gap="3" width="100%">
        {mode === 'link' ? (
          <Link style={{ flex: 1 }} to={project.link}>
            {itemContent}
          </Link>
        ) : (
          itemContent
        )}
        {mode === 'link' && <ProjectActionsMenu projectId={project.projectId} size="xs" />}
      </HStack>
    </Listbox.Item>
  )
}

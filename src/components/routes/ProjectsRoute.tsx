import { Box, Button, Card, Grid, Heading } from '@chakra-ui/react'
import { useCallback, useState, type FC } from 'react'
import { PiPlus } from 'react-icons/pi'
import { Link } from 'react-router'

import { useProjects } from '../../hooks/useProjects'
import { appRoutes } from '../../appRoutes'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { CreateProjectDialog } from '../CreateProjectDialog'

// TODO Should list real projects, not subProjects.
export const ProjectsRoute: FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { projects } = useProjects()
  const t = useTranslation()

  const openCreateDialog = useCallback((): void => {
    setIsCreateDialogOpen(true)
  }, [])

  return (
    <Box height="100%" overflow="auto" padding="8">
      <Heading mb="6" size="lg">
        {t.projects.title}
      </Heading>
      <Grid gap="4" gridTemplateColumns="repeat(auto-fill, minmax(220px, 280px))" justifyContent="start">
        <Card.Root borderStyle="dashed" cursor="pointer" variant="outline">
          <Button height="100%" minHeight="160px" onClick={openCreateDialog} variant="ghost">
            <PiPlus />
            {t.projects.actions.create}
          </Button>
        </Card.Root>
        {projects.map((project) => {
          const firstSubProject = project.subProjects[0]
          const target = isDefined(firstSubProject)
            ? appRoutes.subProject(project.id, firstSubProject.id)
            : appRoutes.project(project.id)
          return (
            <Link key={project.id} to={target}>
              <Card.Root height="160px" transition="box-shadow 0.2s" _hover={{ shadow: 'md' }}>
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                </Card.Body>
              </Card.Root>
            </Link>
          )
        })}
      </Grid>
      <CreateProjectDialog isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </Box>
  )
}

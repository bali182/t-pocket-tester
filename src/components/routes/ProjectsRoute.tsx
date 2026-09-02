import type { FC } from 'react'

import { isElectron } from '../../platform/isElectron'
import { ElectronProjects } from '../project-management/ElectronProjects'
import { WebProjects } from '../project-management/WebProjects'

export const ProjectsRoute: FC = () => {
  return isElectron() ? <ElectronProjects /> : <WebProjects />
}

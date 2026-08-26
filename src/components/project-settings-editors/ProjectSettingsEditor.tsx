import { Spacer, Tabs } from '@chakra-ui/react'
import type { FC, ReactNode } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { ProjectSchema } from '../../schemas/project'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { SectionGroup } from '../common/SectionGroup'
import { ProjectBasicSection } from './ProjectBasicSection'
import { ColorSettingsSection } from './ColorSettingsSection'
import { ProjectStitchingSection } from './ProjectStitchingSection'

type ProjectSettingsEditorProps = {
  editable: EditableSchema<ProjectSchema>
  issues: ValidationIssuesSchema<ProjectSchema>
  menu?: ReactNode
  onChange: (updated: EditableSchema<ProjectSchema>) => void
}

export const ProjectSettingsEditor: FC<ProjectSettingsEditorProps> = ({ editable, issues, menu, onChange }) => {
  const t = useTranslation()

  return (
    <Tabs.Root defaultValue="basic">
      <Tabs.List alignItems="center" pr="2">
        <Tabs.Trigger value="basic">{t.projects.settingsDialog.tabs.colors}</Tabs.Trigger>
        <Tabs.Trigger value="stitching">{t.projects.settingsDialog.tabs.stitching}</Tabs.Trigger>
        <Spacer />
        {menu}
      </Tabs.List>
      <Tabs.Content value="basic" pt={0}>
        <SectionGroup.Root>
          <ProjectBasicSection editable={editable} issues={issues} onChange={onChange} />
          <ColorSettingsSection editable={editable} issues={issues} onChange={onChange} />
        </SectionGroup.Root>
      </Tabs.Content>
      <Tabs.Content value="stitching" pt={0}>
        <ProjectStitchingSection editable={editable} issues={issues} onChange={onChange} />
      </Tabs.Content>
    </Tabs.Root>
  )
}

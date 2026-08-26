import { Tabs } from '@chakra-ui/react'
import type { FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { ProjectSchema } from '../../schemas/project'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { SectionGroup } from '../common/SectionGroup'
import { ColorSettingsSections } from './ColorSettingsSections'
import { ProjectBasicSection } from './ProjectBasicSection'
import { ProjectStitchingSection } from './ProjectStitchingSection'

type ProjectSettingsEditorProps = {
  mode: 'create' | 'edit'
  editable: EditableSchema<ProjectSchema>
  issues: ValidationIssuesSchema<ProjectSchema>
  onChange: (updated: EditableSchema<ProjectSchema>) => void
}

export const ProjectSettingsEditor: FC<ProjectSettingsEditorProps> = ({ mode, editable, issues, onChange }) => {
  const t = useTranslation()

  return (
    <Tabs.Root defaultValue="basic">
      <Tabs.List alignItems="center" pr="2">
        <Tabs.Trigger value="basic">
          {mode === 'edit' ? t.projects.settingsDialog.tabs.colors : t.projects.settingsDialog.tabs.basics}
        </Tabs.Trigger>
        <Tabs.Trigger value="stitching">{t.projects.settingsDialog.tabs.stitching}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="basic" pt={0}>
        <SectionGroup.Root>
          {mode === 'create' && <ProjectBasicSection editable={editable} issues={issues} onChange={onChange} />}
          <ColorSettingsSections editable={editable} issues={issues} onChange={onChange} />
        </SectionGroup.Root>
      </Tabs.Content>
      <Tabs.Content value="stitching" pt={0}>
        <ProjectStitchingSection editable={editable} issues={issues} onChange={onChange} />
      </Tabs.Content>
    </Tabs.Root>
  )
}

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
    <Tabs.Root defaultValue={mode === 'create' ? 'basic' : 'stitching'}>
      <Tabs.List alignItems="center" pr="2">
        {mode === 'create' && <Tabs.Trigger value="basic">{t.projects.settingsDialog.tabs.basics}</Tabs.Trigger>}
        <Tabs.Trigger value="stitching">{t.projects.settingsDialog.tabs.stitching}</Tabs.Trigger>
      </Tabs.List>
      {mode === 'create' && (
        <Tabs.Content value="basic" pt={0}>
          <SectionGroup.Root>
            <ProjectBasicSection editable={editable} issues={issues} onChange={onChange} />
            <ColorSettingsSections editable={editable} issues={issues} onChange={onChange} />
          </SectionGroup.Root>
        </Tabs.Content>
      )}
      <Tabs.Content value="stitching" pt={0}>
        <ProjectStitchingSection editable={editable} issues={issues} onChange={onChange} />
      </Tabs.Content>
    </Tabs.Root>
  )
}

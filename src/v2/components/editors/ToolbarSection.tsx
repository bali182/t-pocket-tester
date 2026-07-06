import { Button, makeStyles, Menu, MenuTrigger, tokens } from '@fluentui/react-components'
import { AddRegular, DeleteRegular } from '@fluentui/react-icons'
import { type FC } from 'react'

import { isDefined } from '../../utils/isDefined'
import { AddChildComponentMenu, type ChildComponentType } from '../AddChildComponentMenu'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type ToolbarSectionProps = {
  onAddChild?: (type: ChildComponentType) => void
  onRemoveComponent?: () => void
}

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    justifyContent: 'end',
  },
})

export const ToolbarSection: FC<ToolbarSectionProps> = ({ onAddChild, onRemoveComponent }) => {
  const styles = useStyles()

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Akciók">
          <div className={styles.toolbar}>
            {isDefined(onAddChild) && (
              <Menu>
                <MenuTrigger disableButtonEnhancement>
                  <Button icon={<AddRegular />} size="small">
                    Elem hozzáadása
                  </Button>
                </MenuTrigger>
                <AddChildComponentMenu onAddChild={onAddChild} />
              </Menu>
            )}
            {isDefined(onRemoveComponent) && (
              <Button icon={<DeleteRegular />} onClick={onRemoveComponent} size="small">
                Törlés
              </Button>
            )}
          </div>
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}

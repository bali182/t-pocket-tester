import {
  Button,
  CardFooter,
  CardHeader,
  Caption1Strong,
  makeStyles,
  Popover,
  PopoverSurface,
  tokens,
} from '@fluentui/react-components'
import type { PositioningVirtualElement } from '@fluentui/react-components'
import { DismissRegular } from '@fluentui/react-icons'
import { useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'

import type { ComponentSchema } from '../../schemas/components'
import { componentsAtom } from '../../state'
import { ComponentEditor } from './ComponentEditor'

type FloatingEditorProps = {
  component: ComponentSchema
  anchorElement: SVGGraphicsElement
  onClose: () => void
}

const useStyles = makeStyles({
  surface: {
    width: '320px',
    zIndex: 1000,
  },
  body: {
    padding: 0,
  },
  footer: {
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    paddingTop: `${tokens.spacingVerticalM}`,
    justifyContent: 'end',
  },
})

export const FloatingEditor: FC<FloatingEditorProps> = ({ component, anchorElement, onClose }) => {
  const styles = useStyles()
  const setComponents = useSetAtom(componentsAtom)
  const [draftComponent, setDraftComponent] = useState<ComponentSchema>(component)
  const isDirty = draftComponent !== component
  const positioningTarget = useMemo<PositioningVirtualElement>(
    () => ({
      getBoundingClientRect: () => anchorElement.getBoundingClientRect(),
      contextElement: anchorElement,
    }),
    [anchorElement],
  )

  useEffect(() => {
    setDraftComponent(component)
  }, [component])

  const handleComponentChange = useCallback((updated: ComponentSchema) => {
    setDraftComponent(updated)
  }, [])

  const handleSave = useCallback(() => {
    setComponents((components) => ({
      ...components,
      [draftComponent.id]: draftComponent,
    }))
    onClose()
  }, [draftComponent, onClose, setComponents])

  return (
    <Popover
      open
      positioning={{
        align: 'top',
        fallbackPositions: ['before-top', 'below', 'above', 'after-top'],
        offset: 10,
        overflowBoundaryPadding: 8,
        position: 'after',
        strategy: 'fixed',
        target: positioningTarget,
      }}
      withArrow
    >
      <PopoverSurface className={styles.surface}>
        <CardHeader
          action={
            <Button
              appearance="subtle"
              aria-label="Bezárás"
              icon={<DismissRegular />}
              onClick={onClose}
              size="small"
            />
          }
          header={<Caption1Strong>#{draftComponent.id}</Caption1Strong>}
        />
        <div className={styles.body}>
          <ComponentEditor component={draftComponent} onChange={handleComponentChange} />
        </div>
        <CardFooter className={styles.footer}>
          <Button disabled={!isDirty} onClick={handleSave} size="small">
            Mentés
          </Button>
        </CardFooter>
      </PopoverSurface>
    </Popover>
  )
}

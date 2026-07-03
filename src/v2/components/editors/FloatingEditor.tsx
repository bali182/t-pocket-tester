import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Caption1Strong,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { DismissRegular } from '@fluentui/react-icons'
import { FloatingArrow } from '@floating-ui/react'
import { useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState, type FC } from 'react'

import { useFloatingEditorPositioning } from '../../hooks/useFloatingEditorPositioning'
import type { ComponentSchema } from '../../schemas/components'
import { componentsAtom } from '../../state'
import { ComponentEditor } from './ComponentEditor'

type FloatingEditorProps = {
  component: ComponentSchema
  anchorElement: SVGGraphicsElement
  onClose: () => void
}

const useStyles = makeStyles({
  root: {
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
  const arrowRef = useRef<SVGSVGElement | null>(null)
  const setComponents = useSetAtom(componentsAtom)
  const [draftComponent, setDraftComponent] = useState<ComponentSchema>(component)
  const isDirty = draftComponent !== component
  const cardBackgroundColor = tokens.colorNeutralBackground1
  const cardBorderColor = tokens.colorNeutralStroke1
  const { context, refs, floatingStyles } = useFloatingEditorPositioning(anchorElement, arrowRef)

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
    <Card ref={refs.setFloating} className={styles.root} size="small" style={floatingStyles}>
      <FloatingArrow
        ref={arrowRef}
        context={context}
        fill={cardBackgroundColor}
        stroke={cardBorderColor}
        strokeWidth={1}
        tipRadius={2}
      />
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
    </Card>
  )
}

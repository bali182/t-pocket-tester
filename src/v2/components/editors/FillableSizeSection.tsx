import { useCallback } from 'react'

import type { PanelSchema, PocketClusterSchema } from '../../schemas/components'
import type { FillableSizeSchema } from '../../schemas/geometry'
import { isDefined } from '../../utils/isDefined'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { FillableSizeInput } from './FillableSizeInput'

type SizeableComponent = PanelSchema | PocketClusterSchema

type FillableSizeSectionProps<T> = {
  component: T
  onChange: (updated: T) => void
}

type FillableSizeValue = FillableSizeSchema['width']

const getNormalizedFillableSize = (size: FillableSizeSchema | undefined): FillableSizeSchema => {
  return {
    width: isDefined(size?.width) ? size.width : 'fill',
    height: isDefined(size?.height) ? size.height : 'fill',
  }
}

export function FillableSizeSection<T extends SizeableComponent>({
  component,
  onChange,
}: FillableSizeSectionProps<T>) {
  const size = getNormalizedFillableSize(component.size)

  const handleWidthChange = useCallback(
    (width: FillableSizeValue) => {
      onChange({
        ...component,
        size: {
          ...getNormalizedFillableSize(component.size),
          width,
        },
      })
    },
    [component, onChange],
  )

  const handleHeightChange = useCallback(
    (height: FillableSizeValue) => {
      onChange({
        ...component,
        size: {
          ...getNormalizedFillableSize(component.size),
          height,
        },
      })
    },
    [component, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Szélesség">
          <FillableSizeInput onChange={handleWidthChange} value={size.width} />
        </EditorFieldRow>

        <EditorFieldRow label="Magasság">
          <FillableSizeInput onChange={handleHeightChange} value={size.height} />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}

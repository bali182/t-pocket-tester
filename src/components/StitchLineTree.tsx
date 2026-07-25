import {
  EmptyState,
  TreeView,
  createTreeCollection,
  type TreeCollection,
  type TreeViewSelectionChangeDetails,
} from '@chakra-ui/react'
import { useCallback, useMemo, type FC } from 'react'

import { PiNeedle } from 'react-icons/pi'
import { TbNeedleThread } from 'react-icons/tb'
import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { useProject } from '../hooks/useProject'
import type { StitchLineSchema } from '../schemas/stitching'
import { useTranslation } from '../translations/translation'
import { isDefined } from '../utils/isDefined'
import { StitchLineActionsMenu } from './StitchLineActionsMenu'

type StitchLineTreeNode = {
  children?: StitchLineTreeNode[]
  id: string
  name: string
  stitchLine?: StitchLineSchema
}

type StitchLineTreeProps = {
  selectedStitchLineId: string | undefined
}

export const StitchLineTree: FC<StitchLineTreeProps> = ({ selectedStitchLineId }) => {
  const t = useTranslation()
  const { project } = useProject()
  const { selection } = useDrawAreaContext()

  const handleDelete = useCallback(
    (stitchLineId: string): void => {
      if (selectedStitchLineId === stitchLineId) {
        selection.clearSelection()
      }
    },
    [selectedStitchLineId, selection],
  )

  const selectedValue = useMemo((): string[] => {
    if (!isDefined(selectedStitchLineId)) {
      return []
    }

    return [selectedStitchLineId]
  }, [selectedStitchLineId])

  const collection = useMemo<TreeCollection<StitchLineTreeNode>>(
    () =>
      createTreeCollection<StitchLineTreeNode>({
        nodeToChildren: (node) => node.children ?? [],
        nodeToString: (node) => node.name,
        nodeToValue: (node) => node.id,
        rootNode: {
          children: project.stitchLines.map((stitchLine) => ({
            id: stitchLine.id,
            name: stitchLine.name,
            stitchLine,
          })),
          id: 'stitch-lines-root',
          name: '',
        },
      }),
    [project.stitchLines],
  )

  const handleSelectionChange = useCallback(
    (details: TreeViewSelectionChangeDetails<StitchLineTreeNode>): void => {
      const stitchLineId = details.selectedValue[0]

      if (!isDefined(stitchLineId)) {
        return
      }

      selection.selectStitchLine(stitchLineId)
    },
    [selection],
  )

  if (project.stitchLines.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <TbNeedleThread />
          </EmptyState.Indicator>
          <EmptyState.Title>{t.stitchLine.tree.empty.title}</EmptyState.Title>
          <EmptyState.Description textAlign="center">{t.stitchLine.tree.empty.description}</EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <TreeView.Root
      collection={collection}
      onSelectionChange={handleSelectionChange}
      selectedValue={selectedValue}
      selectionMode="single"
    >
      <TreeView.Tree>
        <TreeView.Node
          render={({ node }) => {
            if (!isDefined(node.stitchLine)) {
              return null
            }

            return (
              <TreeView.Item>
                <PiNeedle />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
                <StitchLineActionsMenu size="2xs" stitchLine={node.stitchLine} onDelete={handleDelete} />
              </TreeView.Item>
            )
          }}
        />
      </TreeView.Tree>
    </TreeView.Root>
  )
}

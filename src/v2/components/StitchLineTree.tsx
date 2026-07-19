import {
  Box,
  Button,
  EmptyState,
  IconButton,
  TreeView,
  createTreeCollection,
  type TreeCollection,
  type TreeViewSelectionChangeDetails,
} from '@chakra-ui/react'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'

import { PiNeedle, PiPlus, PiTrash } from 'react-icons/pi'
import { TbNeedleThread } from 'react-icons/tb'
import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { useProject } from '../hooks/useProject'
import type { StitchLineSchema } from '../schemas/stitching'
import { isDefined } from '../utils/isDefined'
import { useTranslation } from '../translations/translation'
import { AddStitchLinePopover } from './AddStitchLinePopover'

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
  const { project, deleteStitchLine } = useProject()
  const { clearSelection, selectStitchLine } = useDrawAreaContext()

  const handleDelete = useCallback(
    (event: MouseEvent<HTMLButtonElement>, stitchLineId: string): void => {
      event.stopPropagation()
      deleteStitchLine(stitchLineId)

      if (selectedStitchLineId === stitchLineId) {
        clearSelection()
      }
    },
    [clearSelection, deleteStitchLine, selectedStitchLineId],
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

      selectStitchLine(stitchLineId)
    },
    [selectStitchLine],
  )

  if (project.stitchLines.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <TbNeedleThread />
          </EmptyState.Indicator>
          <EmptyState.Title>{t.stitchLine.tree.empty.title()}</EmptyState.Title>
          <EmptyState.Description textAlign="center">
            {t.stitchLine.tree.empty.description()}
          </EmptyState.Description>
          <Box textAlign="center">
            <AddStitchLinePopover
              trigger={
                <Button variant="subtle">
                  <PiPlus />
                  {t.common.actions.addStitchLine()}
                </Button>
              }
            />
          </Box>
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
                <IconButton
                  aria-label={t.stitchLine.tree.accessibility.deleteNamed({ name: node.name })}
                  onClick={(event) => handleDelete(event, node.stitchLine.id)}
                  size="2xs"
                  variant="ghost"
                >
                  <PiTrash />
                </IconButton>
              </TreeView.Item>
            )
          }}
        />
      </TreeView.Tree>
    </TreeView.Root>
  )
}

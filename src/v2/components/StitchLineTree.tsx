import { IconButton, TreeView, createTreeCollection, type TreeCollection } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'
import { LuTrash } from 'react-icons/lu'
import { TbNeedleThread } from 'react-icons/tb'

import type { StitchLineSchema } from '../schemas/stitching'
import { projectAtom } from '../state'
import { isDefined } from '../utils/isDefined'

type StitchLineTreeNode = {
  children?: StitchLineTreeNode[]
  id: string
  name: string
  stitchLine?: StitchLineSchema
}

export const StitchLineTree: FC = () => {
  const project = useAtomValue(projectAtom)

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

  return (
    <TreeView.Root collection={collection} selectedValue={[]}>
      <TreeView.Tree>
        <TreeView.Node
          render={({ node }) => {
            if (!isDefined(node.stitchLine)) {
              return null
            }

            return (
              <TreeView.Item>
                <TbNeedleThread />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
                <IconButton aria-label={`${node.name} törlése`} disabled size="2xs" variant="ghost">
                  <LuTrash />
                </IconButton>
              </TreeView.Item>
            )
          }}
        />
      </TreeView.Tree>
    </TreeView.Root>
  )
}

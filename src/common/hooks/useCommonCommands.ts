import { useMemo } from 'react'

import type { CommandSchema, CommonCommandIdSchema } from '../../common/schemas/command'

export type UseCommonCommandsParams = {
  canRedo: boolean
  canUndo: boolean
  hasOpenProject: boolean
}

type CommonCommandsMap = Record<CommonCommandIdSchema, CommandSchema<CommonCommandIdSchema>>

export const useCommonCommands = ({ canRedo, canUndo, hasOpenProject }: UseCommonCommandsParams): CommonCommandsMap => {
  const commands = useMemo<CommonCommandsMap>(() => {
    return {
      // File - Exports
      'export-pdf': {
        id: 'export-pdf',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', 'Shift', 'P'],
      },
      'export-svg': {
        id: 'export-svg',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', 'Shift', 'E'],
      },
      // Edit - Undo/Redo
      undo: {
        id: 'undo',
        disabled: !canUndo,
        combination: ['CommandOrControl', 'Z'],
      },
      redo: {
        id: 'redo',
        disabled: !canRedo,
        combination: ['CommandOrControl', 'Y'],
      },
      // Edit - Change increments
      'increment-small': {
        id: 'increment-small',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', '1'],
      },
      'increment-medium': {
        id: 'increment-medium',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', '2'],
      },
      'increment-stitch-hole-distance': {
        id: 'increment-stitch-hole-distance',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', '3'],
      },
      // View - stitch part visibility
      'stitch-line-visibility': {
        id: 'stitch-line-visibility',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', 'Shift', 'L'],
      },
      'stitch-hole-visibility': {
        id: 'stitch-hole-visibility',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', 'Shift', 'H'],
      },
      'stitches-visibility': {
        id: 'stitches-visibility',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', 'Shift', 'T'],
      },
      'stitch-count-visibility': {
        id: 'stitch-count-visibility',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', 'Shift', 'B'],
      },
      // View scaling
      scaling: {
        id: 'scaling',
        disabled: false,
        combination: ['CommandOrControl', 'Shift', 'V'],
      },
    } satisfies CommonCommandsMap
  }, [canRedo, canUndo, hasOpenProject])

  return commands
}

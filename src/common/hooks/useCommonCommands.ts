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
        shortcut: { default: ['CommandOrControl', 'Shift', 'KeyP'] },
      },
      'export-svg': {
        id: 'export-svg',
        disabled: !hasOpenProject,
        shortcut: { default: ['CommandOrControl', 'Shift', 'KeyE'] },
      },
      // Edit - Undo/Redo
      undo: {
        id: 'undo',
        disabled: !canUndo,
        shortcut: { default: ['CommandOrControl', 'KeyZ'] },
      },
      redo: {
        id: 'redo',
        disabled: !canRedo,
        shortcut: {
          default: ['Control', 'KeyY'],
          mac: ['Command', 'Shift', 'KeyZ'],
        },
      },
      // Edit - Change increments
      'increment-small': {
        id: 'increment-small',
        disabled: !hasOpenProject,
        shortcut: {
          default: ['CommandOrControl', 'Shift', 'Digit1'],
          mac: ['Command', 'Alt', 'Digit1'],
        },
      },
      'increment-medium': {
        id: 'increment-medium',
        disabled: !hasOpenProject,
        shortcut: {
          default: ['CommandOrControl', 'Shift', 'Digit2'],
          mac: ['Command', 'Alt', 'Digit2'],
        },
      },
      'increment-stitch-hole-distance': {
        id: 'increment-stitch-hole-distance',
        disabled: !hasOpenProject,
        shortcut: {
          default: ['CommandOrControl', 'Shift', 'Digit3'],
          mac: ['Command', 'Alt', 'Digit3'],
        },
      },
      // View - stitch part visibility
      'stitch-line-visibility': {
        id: 'stitch-line-visibility',
        disabled: !hasOpenProject,
        shortcut: { default: ['CommandOrControl', 'Shift', 'KeyL'] },
      },
      'stitch-hole-visibility': {
        id: 'stitch-hole-visibility',
        disabled: !hasOpenProject,
        shortcut: { default: ['CommandOrControl', 'Shift', 'KeyF'] },
      },
      'stitches-visibility': {
        id: 'stitches-visibility',
        disabled: !hasOpenProject,
        shortcut: { default: ['CommandOrControl', 'Shift', 'KeyU'] },
      },
      'stitch-count-visibility': {
        id: 'stitch-count-visibility',
        disabled: !hasOpenProject,
        shortcut: { default: ['CommandOrControl', 'Shift', 'KeyX'] },
      },
      // View scaling
      scaling: {
        id: 'scaling',
        disabled: false,
        shortcut: { default: ['CommandOrControl', 'Shift', 'KeyV'] },
      },
    } satisfies CommonCommandsMap
  }, [canRedo, canUndo, hasOpenProject])

  return commands
}

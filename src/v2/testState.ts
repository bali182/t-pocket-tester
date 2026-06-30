import { PanelSchema, RootPanelSchema } from './schemas/components'

export const testState: Record<string, PanelSchema | RootPanelSchema> = {
  root: {
    type: 'root-panel',
    id: 'root',
    name: 'Root panel',
    color: 'brown',
    children: ['panel-2', 'panel-3'],
    layout: {
      gap: 20,
      orientation: 'horizontal',
    },
    size: {
      width: 180,
      height: 100,
    },
  },
  'panel-2': {
    type: 'panel',
    id: 'panel-2',
    name: 'Fill panel 1',
    color: 'blue',
    children: [],
    layout: { orientation: 'vertical', gap: 0 },
  },
  'panel-3': {
    type: 'panel',
    id: 'panel-3',
    name: 'Fill panel 2',
    color: 'green',
    children: ['panel-4', 'panel-5'],
    layout: { orientation: 'vertical', gap: 5 },
  },
  'panel-4': {
    type: 'panel',
    id: 'panel-4',
    name: 'Nested child 1',
    color: 'yellow',
    children: [],
    layout: { orientation: 'vertical', gap: 0 },
  },
  'panel-5': {
    type: 'panel',
    id: 'panel-5',
    name: 'Nested child 2',
    color: 'yellow',
    children: [],
    layout: { orientation: 'vertical', gap: 0 },
  },
}

import { PanelSchema, RootPanelSchema } from './schemas/components'

export const testState: Record<string, PanelSchema | RootPanelSchema> = {
  root: {
    type: 'root-panel',
    id: 'root',
    name: 'Root panel',
    color: '#A52A2A',
    children: ['panel-2', 'panel-3'],
    layout: { gap: 20, order: 'default', orientation: 'horizontal' },
    size: {
      width: 180,
      height: 100,
    },
  },
  'panel-2': {
    type: 'panel',
    id: 'panel-2',
    name: 'Fill panel 1',
    color: '#0000FF',
    children: [],
    layout: { orientation: 'vertical', gap: 0, order: 'default' },
  },
  'panel-3': {
    type: 'panel',
    id: 'panel-3',
    name: 'Fill panel 2',
    color: '#008000',
    children: ['panel-4', 'panel-5'],
    layout: { orientation: 'vertical', gap: 5, order: 'default' },
  },
  'panel-4': {
    type: 'panel',
    id: 'panel-4',
    name: 'Nested child 1',
    color: '#FFFF00',
    children: [],
    layout: { orientation: 'vertical', gap: 0, order: 'default' },
  },
  'panel-5': {
    type: 'panel',
    id: 'panel-5',
    name: 'Nested child 2',
    color: '#FFFF00',
    children: [],
    layout: { orientation: 'vertical', gap: 0, order: 'default' },
  },
}

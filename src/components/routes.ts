import { ComponentType } from 'react'
import { CardHolderRoute, DummyRoute, TopPocketRoute, TPocketRoute } from './RouteComponents'
import { ScaleRoute } from './ScaleRoute'
import { TestRoute } from './TestRoute'

type RouteConfig = {
  label: string
  path: string
  Component: ComponentType
}

export const routes: RouteConfig[] = [
  { label: 'Kártyatartó', path: '/card-holder', Component: CardHolderRoute },
  { label: 'T-zseb', path: '/t-pocket', Component: TPocketRoute },
  { label: 'Elülső zseb', path: '/top-pocket', Component: TopPocketRoute },
  { label: 'Hátlap', path: '/back-panel', Component: DummyRoute },
  { label: 'Skálázás', path: '/scale', Component: ScaleRoute },
  { label: 'Test', path: '/test', Component: TestRoute },
]

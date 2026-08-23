import { describe, expect, it } from 'vitest'

import { defaultStitchingSettings } from '../defaultStates'
import type { ComputedComponentSchema } from '../schemas/computed'
import { d } from '../testData'
import { accessors } from '../utils/accessors'
import { getComputedSubProject } from './getComputedSubProject'

const expectBoundingRect = (
  component: ComputedComponentSchema,
  expected: readonly [number, number, number, number],
) => {
  expect([
    component.boundingRect.x.toNumber(),
    component.boundingRect.y.toNumber(),
    component.boundingRect.width.toNumber(),
    component.boundingRect.height.toNumber(),
  ]).toEqual(expected)
}

describe('getComputedSubProject layout', () => {
  it.each([
    {
      orientation: 'horizontal' as const,
      root: { width: 100, height: 60 },
      first: { width: 20, autoWidth: false },
      second: { width: 20, autoWidth: false },
      firstRect: [0, 0, 20, 60] as const,
      secondRect: [30, 0, 20, 60] as const,
    },
    {
      orientation: 'vertical' as const,
      root: { width: 60, height: 100 },
      first: { height: 20, autoHeight: false },
      second: { height: 20, autoHeight: false },
      firstRect: [0, 0, 60, 20] as const,
      secondRect: [0, 30, 60, 20] as const,
    },
  ])('positions fixed $orientation children with a manual gap', (testCase) => {
    const root = d.rootPanel({
      id: 'root',
      ...testCase.root,
      layoutOrientation: testCase.orientation,
      layoutGap: 10,
      children: ['first', 'second'],
    })
    const first = d.panel({ id: 'first', ...testCase.first })
    const second = d.panel({ id: 'second', ...testCase.second })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [first, second] }),
        defaultStitchingSettings,
      ),
    )

    expect(computed.rootPanel().computedLayoutGap.toNumber()).toBe(10)
    expectBoundingRect(computed.panel(first.id), testCase.firstRect)
    expectBoundingRect(computed.panel(second.id), testCase.secondRect)
  })

  it.each([
    {
      orientation: 'horizontal' as const,
      root: { width: 100, height: 40 },
      first: { width: 20, autoWidth: false },
      second: { width: 20, autoWidth: false },
      firstRect: [0, 0, 20, 40] as const,
      secondRect: [80, 0, 20, 40] as const,
    },
    {
      orientation: 'vertical' as const,
      root: { width: 40, height: 100 },
      first: { height: 20, autoHeight: false },
      second: { height: 20, autoHeight: false },
      firstRect: [0, 0, 40, 20] as const,
      secondRect: [0, 80, 40, 20] as const,
    },
  ])('positions fixed $orientation children with an automatic gap', (testCase) => {
    const root = d.rootPanel({
      id: 'root',
      ...testCase.root,
      layoutOrientation: testCase.orientation,
      autoLayoutGap: true,
      children: ['first', 'second'],
    })
    const first = d.panel({ id: 'first', ...testCase.first })
    const second = d.panel({ id: 'second', ...testCase.second })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [first, second] }),
        defaultStitchingSettings,
      ),
    )

    expect(computed.rootPanel().computedLayoutGap.toNumber()).toBe(60)
    expectBoundingRect(computed.panel(first.id), testCase.firstRect)
    expectBoundingRect(computed.panel(second.id), testCase.secondRect)
  })

  it('shares automatic space between a gap and an auto-sized child', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 100,
      height: 40,
      autoLayoutGap: true,
      children: ['fixed', 'auto'],
    })
    const fixed = d.panel({ id: 'fixed', width: 20, autoWidth: false })
    const auto = d.panel({ id: 'auto' })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [fixed, auto] }),
        defaultStitchingSettings,
      ),
    )

    expect(computed.rootPanel().computedLayoutGap.toNumber()).toBe(40)
    expectBoundingRect(computed.panel(fixed.id), [0, 0, 20, 40])
    expectBoundingRect(computed.panel(auto.id), [60, 0, 40, 40])
  })

  it('shares automatic space between auto-sized children and their gap', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 90,
      height: 40,
      autoLayoutGap: true,
      children: ['first', 'second'],
    })
    const first = d.panel({ id: 'first' })
    const second = d.panel({ id: 'second' })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [first, second] }),
        defaultStitchingSettings,
      ),
    )

    expect(computed.rootPanel().computedLayoutGap.toNumber()).toBe(30)
    expectBoundingRect(computed.panel(first.id), [0, 0, 30, 40])
    expectBoundingRect(computed.panel(second.id), [60, 0, 30, 40])
  })

  it('uses the manual gap when sizing an auto-sized child', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 100,
      height: 40,
      layoutGap: 10,
      children: ['fixed', 'auto'],
    })
    const fixed = d.panel({ id: 'fixed', width: 20, autoWidth: false })
    const auto = d.panel({ id: 'auto' })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [fixed, auto] }),
        defaultStitchingSettings,
      ),
    )

    expectBoundingRect(computed.panel(fixed.id), [0, 0, 20, 40])
    expectBoundingRect(computed.panel(auto.id), [30, 0, 70, 40])
  })

  it('does not allocate negative size when a manual gap uses all remaining space', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 100,
      height: 40,
      layoutGap: 80,
      children: ['fixed', 'auto'],
    })
    const fixed = d.panel({ id: 'fixed', width: 20, autoWidth: false })
    const auto = d.panel({ id: 'auto' })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [fixed, auto] }),
        defaultStitchingSettings,
      ),
    )

    expectBoundingRect(computed.panel(auto.id), [100, 0, 0, 40])
  })

  it('clamps fixed main-axis and cross-axis sizes to the parent bounds', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 100,
      height: 60,
      children: ['wide', 'tall'],
    })
    const wide = d.panel({ id: 'wide', width: 200, autoWidth: false, height: 20, autoHeight: false })
    const tall = d.panel({ id: 'tall', width: 20, autoWidth: false, height: 100, autoHeight: false })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [wide, tall] }),
        defaultStitchingSettings,
      ),
    )

    expectBoundingRect(computed.panel(wide.id), [0, 0, 100, 20])
    expectBoundingRect(computed.panel(tall.id), [100, 0, 20, 60])
  })

  it.each([
    { autoLayoutGap: false, layoutGap: 10, expectedGap: 10 },
    { autoLayoutGap: true, layoutGap: 10, expectedGap: 0 },
  ])('handles an empty layout with autoLayoutGap=$autoLayoutGap', (testCase) => {
    const root = d.rootPanel({ id: 'root', ...testCase, children: [] })
    const computed = accessors.computedSubProject(
      getComputedSubProject(d.subProject({ id: 'sub-project', root }), defaultStitchingSettings),
    )

    expect(computed.rootPanel().children).toEqual([])
    expect(computed.rootPanel().computedLayoutGap.toNumber()).toBe(testCase.expectedGap)
  })

  it.each([
    { autoLayoutGap: false, layoutGap: 10, expectedGap: 10 },
    { autoLayoutGap: true, layoutGap: 10, expectedGap: 100 },
  ])('handles a single auto-sized child with autoLayoutGap=$autoLayoutGap', (testCase) => {
    const root = d.rootPanel({ id: 'root', width: 100, height: 40, ...testCase, children: ['child'] })
    const child = d.panel({ id: 'child' })
    const computed = accessors.computedSubProject(
      getComputedSubProject(d.subProject({ id: 'sub-project', root, components: [child] }), defaultStitchingSettings),
    )

    expect(computed.rootPanel().computedLayoutGap.toNumber()).toBe(testCase.expectedGap)
    expectBoundingRect(computed.panel(child.id), [0, 0, 100, 40])
  })

  it('retains source order and associates bounding boxes with component IDs', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 100,
      height: 40,
      layoutGap: 10,
      children: ['zeta', 'alpha'],
    })
    const zeta = d.panel({ id: 'zeta', width: 30, autoWidth: false })
    const alpha = d.pocketCluster({ id: 'alpha', width: 20, autoWidth: false })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [zeta, alpha] }),
        defaultStitchingSettings,
      ),
    )

    expect(computed.rootPanel().children.map((child) => child.componentId)).toEqual(['zeta', 'alpha'])
    expectBoundingRect(computed.panel(zeta.id), [0, 0, 30, 40])
    expectBoundingRect(computed.pocketCluster(alpha.id), [40, 0, 20, 40])
  })

  it('uses a nested panel layout instead of its parent layout', () => {
    const root = d.rootPanel({ id: 'root', width: 100, height: 100, children: ['container'] })
    const container = d.panel({
      id: 'container',
      width: 100,
      autoWidth: false,
      layoutOrientation: 'vertical',
      layoutGap: 5,
      children: ['top', 'bottom'],
    })
    const top = d.panel({ id: 'top', height: 20, autoHeight: false })
    const bottom = d.panel({ id: 'bottom', height: 30, autoHeight: false })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [container, top, bottom] }),
        defaultStitchingSettings,
      ),
    )

    expect(computed.panel(container.id).computedLayoutGap.toNumber()).toBe(5)
    expectBoundingRect(computed.panel(container.id), [0, 0, 100, 100])
    expectBoundingRect(computed.panel(top.id), [0, 0, 100, 20])
    expectBoundingRect(computed.panel(bottom.id), [0, 25, 100, 30])
  })

  it('uses each panel layout when layouts are nested multiple levels deep', () => {
    const root = d.rootPanel({ id: 'root', width: 100, height: 100, children: ['outer'] })
    const outer = d.panel({
      id: 'outer',
      width: 100,
      autoWidth: false,
      layoutOrientation: 'vertical',
      layoutGap: 10,
      children: ['inner'],
    })
    const inner = d.panel({
      id: 'inner',
      height: 50,
      autoHeight: false,
      layoutOrientation: 'horizontal',
      layoutGap: 5,
      children: ['left', 'right'],
    })
    const left = d.panel({ id: 'left', width: 20, autoWidth: false })
    const right = d.panel({ id: 'right', width: 30, autoWidth: false })
    const computed = accessors.computedSubProject(
      getComputedSubProject(
        d.subProject({ id: 'sub-project', root, components: [outer, inner, left, right] }),
        defaultStitchingSettings,
      ),
    )

    expectBoundingRect(computed.panel(inner.id), [0, 0, 100, 50])
    expectBoundingRect(computed.panel(left.id), [0, 0, 20, 50])
    expectBoundingRect(computed.panel(right.id), [25, 0, 30, 50])
  })

  it('rejects a root panel as a layout child', () => {
    const root = d.rootPanel({ id: 'root', children: ['root'] })
    const subProject = d.subProject({ id: 'sub-project', root })
    expect(() => getComputedSubProject(subProject, defaultStitchingSettings)).toThrow(
      'Unsupported child component type: root-panel',
    )
  })
})

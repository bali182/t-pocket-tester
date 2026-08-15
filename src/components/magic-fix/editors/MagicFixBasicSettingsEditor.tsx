import { useCallback, useMemo, type FC } from 'react'

import { useEditableMagicFixConfigEntry } from '../../../hooks/useEditableMagicFixConfigEntry'
import type {
  MagicFixBaseConfigSchema,
  MagicFixBasicUIConfigSchema,
  MagicFixComponentBoundsStitchLineConfigSchema,
  MagicFixComponentConfigSchema,
  MagicFixConfigSchema,
  MagicFixNumericRangeSchema,
  MagicFixPocketClusterStitchLineConfigSchema,
  MagicFixStitchLineConfigSchema,
} from '../../../schemas/magicFixConfig'
import { isDefined } from '../../../utils/isDefined'
import {
  validateMagicFixBaseConfig,
  validateMagicFixBasicUIConfig,
} from '../../../validators/validateMagicFixBasicUIConfig'
import { SectionGroup } from '../../common/SectionGroup'
import { MagicFixBasicAccuracyAndEffortSection } from '../sections/MagicFixBasicAccuracyAndEffortSection'
import { MagicFixBasicSharedLimitsSection } from '../sections/MagicFixBasicSharedLimitsSection'

export type MagicFixBasicSettingsEditorProps = {
  config: MagicFixConfigSchema
  onChange: (config: MagicFixConfigSchema) => void
}

export const MagicFixBasicSettingsEditor: FC<MagicFixBasicSettingsEditorProps> = ({ config, onChange }) => {
  const baseConfig = useMemo<MagicFixBaseConfigSchema>(
    () => ({ accuracy: config.accuracy, effort: config.effort }),
    [config.accuracy, config.effort],
  )
  const commonBasicUIConfig = useMemo(() => getCommonBasicUIConfig(config), [config])

  const handleBaseConfigChange = useCallback(
    (updatedBaseConfig: MagicFixBaseConfigSchema): void => onChange({ ...config, ...updatedBaseConfig }),
    [config, onChange],
  )

  const handleCommonBasicUIConfigChange = useCallback(
    (updatedCommonBasicUIConfig: MagicFixBasicUIConfigSchema): void =>
      onChange(delegateCommonBasicUIConfig(config, updatedCommonBasicUIConfig)),
    [config, onChange],
  )

  const {
    editableConfig: editableBaseConfig,
    setConfig: setBaseConfig,
    validationIssues: baseValidationIssues,
  } = useEditableMagicFixConfigEntry({
    config: baseConfig,
    isEqual: areMagicFixBaseConfigsEqual,
    onChange: handleBaseConfigChange,
    validate: validateMagicFixBaseConfig,
  })

  const {
    editableConfig: editableCommonBasicUIConfig,
    setConfig: setCommonBasicUIConfig,
    validationIssues: commonBasicUIValidationIssues,
  } = useEditableMagicFixConfigEntry({
    config: commonBasicUIConfig,
    isEqual: areMagicFixBasicUIConfigsEqual,
    onChange: handleCommonBasicUIConfigChange,
    validate: validateMagicFixBasicUIConfig,
  })

  return (
    <SectionGroup.Root>
      <MagicFixBasicAccuracyAndEffortSection
        config={baseConfig}
        editable={editableBaseConfig}
        issues={baseValidationIssues}
        onChange={setBaseConfig}
      />
      <MagicFixBasicSharedLimitsSection
        config={commonBasicUIConfig}
        editable={editableCommonBasicUIConfig}
        issues={commonBasicUIValidationIssues}
        onChange={setCommonBasicUIConfig}
      />
    </SectionGroup.Root>
  )
}

const areMagicFixBaseConfigsEqual = (
  first: MagicFixBaseConfigSchema | undefined,
  second: MagicFixBaseConfigSchema | undefined,
): boolean => {
  if (first === second) {
    return true
  }
  if (!isDefined(first) || !isDefined(second)) {
    return false
  }
  return first.accuracy === second.accuracy && first.effort === second.effort
}

const areMagicFixBasicUIConfigsEqual = (
  first: MagicFixBasicUIConfigSchema | undefined,
  second: MagicFixBasicUIConfigSchema | undefined,
): boolean => {
  if (first === second) {
    return true
  }
  if (!isDefined(first) || !isDefined(second)) {
    return false
  }
  const result =
    first.preferredMinimumDistanceFromEdge === second.preferredMinimumDistanceFromEdge &&
    first.modifyRange.maxDecrease === second.modifyRange.maxDecrease &&
    first.modifyRange.maxIncrease === second.modifyRange.maxIncrease

  return result
}

const getCommonBasicUIConfig = (config: MagicFixConfigSchema): MagicFixBasicUIConfigSchema => {
  const componentConfigs = Object.values(config.componentConfigs)
  const stitchLineConfigs = Object.values(config.stitchLineConfigs)
  const ranges = [
    ...componentConfigs.flatMap(getComponentConfigRanges),
    ...stitchLineConfigs.flatMap(getStitchLineConfigRanges),
  ]

  return {
    modifyRange: {
      maxDecrease: getCommonNumber(ranges.map((range) => range.maxDecrease)),
      maxIncrease: getCommonNumber(ranges.map((range) => range.maxIncrease)),
    },
    preferredMinimumDistanceFromEdge: getCommonNumber(
      componentConfigs.map((componentConfig) => componentConfig.preferredMinimumDistanceFromEdge),
    ),
  }
}

const delegateCommonBasicUIConfig = (
  config: MagicFixConfigSchema,
  commonBasicUIConfig: MagicFixBasicUIConfigSchema,
): MagicFixConfigSchema => {
  return {
    ...config,
    componentConfigs: Object.fromEntries(
      Object.entries(config.componentConfigs).map(([id, componentConfig]) => [
        id,
        delegateComponentConfigCommonBasicUIConfig(componentConfig, commonBasicUIConfig),
      ]),
    ),
    stitchLineConfigs: Object.fromEntries(
      Object.entries(config.stitchLineConfigs).map(([id, stitchLineConfig]) => [
        id,
        delegateStitchLineConfigCommonBasicUIConfig(stitchLineConfig, commonBasicUIConfig),
      ]),
    ),
  }
}

const getCommonNumber = (values: readonly number[]): number | undefined => {
  const firstValue = values[0]
  if (!isDefined(firstValue) || values.some((value) => value !== firstValue)) {
    return undefined
  }
  return firstValue
}

const getComponentConfigRanges = (config: MagicFixComponentConfigSchema): MagicFixNumericRangeSchema[] => {
  switch (config.type) {
    case 'magic-fix-root-panel-config':
      return [config.fixedWidthRange, config.fixedHeightRange, config.layoutGapRange]
    case 'magic-fix-panel-config':
      return [config.fixedWidthRange, config.fixedHeightRange, config.layoutGapRange]
    case 'magic-fix-pocket-cluster-config':
      return [config.fixedWidthRange, config.fixedHeightRange, config.pocketStepRange]
  }
}

const getStitchLineConfigRanges = (config: MagicFixStitchLineConfigSchema): MagicFixNumericRangeSchema[] => {
  switch (config.type) {
    case 'magic-fix-component-bounds-stitch-line-config':
      return [
        config.topStartOffsetRange,
        config.topEndOffsetRange,
        config.rightStartOffsetRange,
        config.rightEndOffsetRange,
        config.bottomStartOffsetRange,
        config.bottomEndOffsetRange,
        config.leftStartOffsetRange,
        config.leftEndOffsetRange,
      ]
    case 'magic-fix-pocket-cluster-stitch-line-config':
      return [config.startOffsetRange, config.endOffsetRange]
  }
}

const delegateComponentConfigCommonBasicUIConfig = (
  config: MagicFixComponentConfigSchema,
  commonBasicUIConfig: MagicFixBasicUIConfigSchema,
): MagicFixComponentConfigSchema => {
  const preferredMinimumDistanceFromEdge = isDefined(commonBasicUIConfig.preferredMinimumDistanceFromEdge)
    ? commonBasicUIConfig.preferredMinimumDistanceFromEdge
    : config.preferredMinimumDistanceFromEdge

  switch (config.type) {
    case 'magic-fix-root-panel-config':
      return {
        ...config,
        fixedHeightRange: delegateNumericRange(config.fixedHeightRange, commonBasicUIConfig.modifyRange),
        fixedWidthRange: delegateNumericRange(config.fixedWidthRange, commonBasicUIConfig.modifyRange),
        layoutGapRange: delegateNumericRange(config.layoutGapRange, commonBasicUIConfig.modifyRange),
        preferredMinimumDistanceFromEdge,
      }
    case 'magic-fix-panel-config':
      return {
        ...config,
        fixedHeightRange: delegateNumericRange(config.fixedHeightRange, commonBasicUIConfig.modifyRange),
        fixedWidthRange: delegateNumericRange(config.fixedWidthRange, commonBasicUIConfig.modifyRange),
        layoutGapRange: delegateNumericRange(config.layoutGapRange, commonBasicUIConfig.modifyRange),
        preferredMinimumDistanceFromEdge,
      }
    case 'magic-fix-pocket-cluster-config':
      return {
        ...config,
        fixedHeightRange: delegateNumericRange(config.fixedHeightRange, commonBasicUIConfig.modifyRange),
        fixedWidthRange: delegateNumericRange(config.fixedWidthRange, commonBasicUIConfig.modifyRange),
        pocketStepRange: delegateNumericRange(config.pocketStepRange, commonBasicUIConfig.modifyRange),
        preferredMinimumDistanceFromEdge,
      }
  }
}

const delegateStitchLineConfigCommonBasicUIConfig = (
  config: MagicFixStitchLineConfigSchema,
  commonBasicUIConfig: MagicFixBasicUIConfigSchema,
): MagicFixStitchLineConfigSchema => {
  switch (config.type) {
    case 'magic-fix-component-bounds-stitch-line-config':
      return delegateComponentBoundsStitchLineConfigCommonBasicUIConfig(config, commonBasicUIConfig)
    case 'magic-fix-pocket-cluster-stitch-line-config':
      return delegatePocketClusterStitchLineConfigCommonBasicUIConfig(config, commonBasicUIConfig)
  }
}

const delegateComponentBoundsStitchLineConfigCommonBasicUIConfig = (
  config: MagicFixComponentBoundsStitchLineConfigSchema,
  commonBasicUIConfig: MagicFixBasicUIConfigSchema,
): MagicFixComponentBoundsStitchLineConfigSchema => {
  return {
    ...config,
    bottomEndOffsetRange: delegateNumericRange(config.bottomEndOffsetRange, commonBasicUIConfig.modifyRange),
    bottomStartOffsetRange: delegateNumericRange(config.bottomStartOffsetRange, commonBasicUIConfig.modifyRange),
    leftEndOffsetRange: delegateNumericRange(config.leftEndOffsetRange, commonBasicUIConfig.modifyRange),
    leftStartOffsetRange: delegateNumericRange(config.leftStartOffsetRange, commonBasicUIConfig.modifyRange),
    rightEndOffsetRange: delegateNumericRange(config.rightEndOffsetRange, commonBasicUIConfig.modifyRange),
    rightStartOffsetRange: delegateNumericRange(config.rightStartOffsetRange, commonBasicUIConfig.modifyRange),
    topEndOffsetRange: delegateNumericRange(config.topEndOffsetRange, commonBasicUIConfig.modifyRange),
    topStartOffsetRange: delegateNumericRange(config.topStartOffsetRange, commonBasicUIConfig.modifyRange),
  }
}

const delegatePocketClusterStitchLineConfigCommonBasicUIConfig = (
  config: MagicFixPocketClusterStitchLineConfigSchema,
  commonBasicUIConfig: MagicFixBasicUIConfigSchema,
): MagicFixPocketClusterStitchLineConfigSchema => {
  return {
    ...config,
    endOffsetRange: delegateNumericRange(config.endOffsetRange, commonBasicUIConfig.modifyRange),
    startOffsetRange: delegateNumericRange(config.startOffsetRange, commonBasicUIConfig.modifyRange),
  }
}

const delegateNumericRange = (
  range: MagicFixNumericRangeSchema,
  modifyRange: MagicFixBasicUIConfigSchema['modifyRange'],
): MagicFixNumericRangeSchema => {
  return {
    ...range,
    ...(isDefined(modifyRange.maxDecrease) ? { maxDecrease: modifyRange.maxDecrease } : {}),
    ...(isDefined(modifyRange.maxIncrease) ? { maxIncrease: modifyRange.maxIncrease } : {}),
  }
}

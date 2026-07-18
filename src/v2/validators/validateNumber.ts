import { NumberFormatter, NumberParser } from '@internationalized/number'
import BigNumber from 'bignumber.js'
import isDecimal from 'validator/es/lib/isDecimal'

import type { ValidationContextSchema } from '../schemas/validation'
import { isDefined } from '../utils/isDefined'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'

export type NumberValidationConfigSchema = {
  min?: number
  max?: number
  minInclusive?: boolean
  maxInclusive?: boolean
  allowFraction?: boolean
  multipleOf?: number
}

export const validateNumber = (
  input: string,
  currentValue: number,
  context: ValidationContextSchema,
  config: NumberValidationConfigSchema = {},
) => {
  if (!isDecimal(input, { locale: context.language })) {
    return createInvalidValidationResult<number>(
      {
        message: 'Érvénytelen számformátum.',
        severity: 'error',
      },
      currentValue,
    )
  }

  const value = new NumberParser(context.language, { style: 'decimal' }).parse(input)
  const formatter = new NumberFormatter(context.language, {
    maximumSignificantDigits: 21,
    style: 'decimal',
    useGrouping: false,
  })

  if (!Number.isFinite(value)) {
    return createInvalidValidationResult<number>(
      {
        message: 'Érvénytelen számformátum.',
        severity: 'error',
      },
      currentValue,
    )
  }

  if (config.allowFraction === false && !Number.isInteger(value)) {
    return createInvalidValidationResult<number>(
      {
        message: 'Csak egész érték adható meg.',
        severity: 'error',
      },
      currentValue,
    )
  }

  if (isDefined(config.min)) {
    const isBelowMinimum = config.minInclusive === false ? value <= config.min : value < config.min

    if (isBelowMinimum) {
      return createInvalidValidationResult<number>(
        {
          message:
            config.minInclusive === false
              ? `Az értéknek a minimum felett kell lennie (${formatter.format(config.min)}).`
              : `Minimum érték: ${formatter.format(config.min)}.`,
          severity: 'error',
        },
        currentValue,
      )
    }
  }

  if (isDefined(config.max)) {
    const isAboveMaximum = config.maxInclusive === false ? value >= config.max : value > config.max

    if (isAboveMaximum) {
      return createInvalidValidationResult<number>(
        {
          message:
            config.maxInclusive === false
              ? `Az értéknek a maximum alatt kell lennie (${formatter.format(config.max)}).`
              : `Maximum érték: ${formatter.format(config.max)}.`,
          severity: 'error',
        },
        currentValue,
      )
    }
  }

  if (isDefined(config.multipleOf) && !new BigNumber(value).mod(config.multipleOf).isZero()) {
    return createInvalidValidationResult<number>(
      {
        message: `Lépték: ${formatter.format(config.multipleOf)}.`,
        severity: 'error',
      },
      currentValue,
    )
  }

  return createValidValidationResult<number>(undefined, value)
}

import BigNumber from 'bignumber.js'

import { cards } from '../data/cards'
import type { PocketClusterSchema } from '../schemas/components'
import type { ComputedCardSchema } from '../schemas/computed'
import type { RectSchema } from '../schemas/geometry'
import type { CardSchema } from '../schemas/valuables'
import { isDefined } from '../utils/isDefined'
import { calculateRectPath } from './calculateRectPath'

export const calculatePocketCard = (
  pocketCluster: PocketClusterSchema,
  pocketBoundingRect: RectSchema,
): ComputedCardSchema | undefined => {
  if (!isDefined(pocketCluster.cardId)) {
    return undefined
  }

  const card = cards.find((candidateCard) => candidateCard.id === pocketCluster.cardId)

  if (!isDefined(card)) {
    throw new Error(`Card not found: ${pocketCluster.cardId}`)
  }

  const boundingRect = getCardBoundingRect(card, pocketCluster, pocketBoundingRect)

  return {
    type: 'computed-card',
    card,
    boundingRect,
    path: calculateRectPath(boundingRect, {
      topLeft: new BigNumber(card.radius),
      topRight: new BigNumber(card.radius),
      bottomRight: new BigNumber(card.radius),
      bottomLeft: new BigNumber(card.radius),
    }),
  }
}

const getCardBoundingRect = (
  card: CardSchema,
  pocketCluster: PocketClusterSchema,
  pocketBoundingRect: RectSchema,
): RectSchema => {
  const isLandscape = shouldUseLandscapeCard(card, pocketCluster, pocketBoundingRect)
  const cardWidth = new BigNumber(isLandscape ? card.width : card.height)
  const cardHeight = new BigNumber(isLandscape ? card.height : card.width)
  const cardThickness = new BigNumber(card.thickness)
  const horizontallyCenteredX = pocketBoundingRect.x.plus(pocketBoundingRect.width.minus(cardWidth).dividedBy(2))
  const verticallyCenteredY = pocketBoundingRect.y.plus(pocketBoundingRect.height.minus(cardHeight).dividedBy(2))

  switch (pocketCluster.orientation) {
    case 'up':
      return {
        x: horizontallyCenteredX,
        y: pocketBoundingRect.y.plus(pocketBoundingRect.height).minus(cardHeight).minus(cardThickness),
        width: cardWidth,
        height: cardHeight,
      }
    case 'down':
      return {
        x: horizontallyCenteredX,
        y: pocketBoundingRect.y.plus(cardThickness),
        width: cardWidth,
        height: cardHeight,
      }
    case 'left':
      return {
        x: pocketBoundingRect.x.plus(pocketBoundingRect.width).minus(cardWidth).minus(cardThickness),
        y: verticallyCenteredY,
        width: cardWidth,
        height: cardHeight,
      }
    case 'right':
      return {
        x: pocketBoundingRect.x.plus(cardThickness),
        y: verticallyCenteredY,
        width: cardWidth,
        height: cardHeight,
      }
  }
}

const shouldUseLandscapeCard = (
  card: CardSchema,
  pocketCluster: PocketClusterSchema,
  pocketBoundingRect: RectSchema,
): boolean => {
  const isOpeningVertical = pocketCluster.orientation === 'up' || pocketCluster.orientation === 'down'
  const landscapeCrossAxisSize = isOpeningVertical ? card.width : card.height
  const portraitCrossAxisSize = isOpeningVertical ? card.height : card.width
  const availableCrossAxisSize = isOpeningVertical ? pocketBoundingRect.width : pocketBoundingRect.height
  const landscapeCrossAxisSizeValue = new BigNumber(landscapeCrossAxisSize)
  const portraitCrossAxisSizeValue = new BigNumber(portraitCrossAxisSize)
  const isLandscapeFitting = landscapeCrossAxisSizeValue.isLessThanOrEqualTo(availableCrossAxisSize)
  const isPortraitFitting = portraitCrossAxisSizeValue.isLessThanOrEqualTo(availableCrossAxisSize)

  if (isLandscapeFitting !== isPortraitFitting) {
    return isLandscapeFitting
  }

  const landscapeEdgeDistance = landscapeCrossAxisSizeValue.minus(availableCrossAxisSize).absoluteValue()
  const portraitEdgeDistance = portraitCrossAxisSizeValue.minus(availableCrossAxisSize).absoluteValue()

  return landscapeEdgeDistance.isLessThanOrEqualTo(portraitEdgeDistance)
}

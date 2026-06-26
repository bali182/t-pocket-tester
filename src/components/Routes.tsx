import type { FC } from 'react'

import { CenteredLayout } from './CenteredLayout'
import { ScaledSvgPreview } from './ScaledSvgPreview'
import { CardHolderSvg } from './svg/CardHolderSvg'
import { TPocketSvg } from './svg/TPocketSvg'

export const CardHolderRoute: FC = () => (
  <CenteredLayout>
    <ScaledSvgPreview>
      <CardHolderSvg />
    </ScaledSvgPreview>
  </CenteredLayout>
)

export const TPocketRoute: FC = () => (
  <CenteredLayout>
    <ScaledSvgPreview>
      <TPocketSvg />
    </ScaledSvgPreview>
  </CenteredLayout>
)

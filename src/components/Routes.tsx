import { CenteredLayout } from './CenteredLayout'
import { CardHolderSvg } from './svg/CardHolderSvg'
import { TPocketSvg } from './svg/TPocketSvg'

export const CardHolderRoute = () => (
  <CenteredLayout>
    <CardHolderSvg />
  </CenteredLayout>
)

export const TPocketRoute = () => (
  <CenteredLayout>
    <TPocketSvg />
  </CenteredLayout>
)

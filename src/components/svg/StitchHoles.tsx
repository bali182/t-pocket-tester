import type { FC } from 'react'

import type { StitchHoleModel } from '../../schemas/StitchHoleModelSchema'
import { StitchHole } from './StitchHole'

type StitchHolesProps = {
  holes: StitchHoleModel[]
}

export const StitchHoles: FC<StitchHolesProps> = ({ holes }) => {
  return (
    <>
      {holes.map((hole, i) => (
        <StitchHole hole={hole} key={i} />
      ))}
    </>
  )
}

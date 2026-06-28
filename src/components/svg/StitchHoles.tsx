import type { FC } from 'react'

import type { StitchHoleSchema } from '../../schemas/StitchHoleSchema'
import { StitchHole } from './StitchHole'

type StitchHolesProps = {
  holes: StitchHoleSchema[]
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

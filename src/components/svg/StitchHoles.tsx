import { FC } from 'react'
import { StitchHoleModel } from '../../types'
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

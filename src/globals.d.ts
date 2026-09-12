/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_ELECTRON: string
}

declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react'

  export const ReactComponent: FC<SVGProps<SVGSVGElement>>
}

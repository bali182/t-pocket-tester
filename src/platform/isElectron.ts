export const isElectron = (): boolean => {
  return import.meta.env.VITE_IS_ELECTRON === 'true'
}

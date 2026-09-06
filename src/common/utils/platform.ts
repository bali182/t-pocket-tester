import Bowser from 'bowser'
import type { PlatformSchema } from '../schemas/platform'

const parsePlatform = (): PlatformSchema => {
  try {
    const data = Bowser.getParser(window.navigator.userAgent)
    switch (data.getPlatform().type) {
      case 'mobile':
      case 'tablet':
      case 'tv':
        return 'mobile'

      case 'desktop':
        return data.getOS().name === 'macOS' ? 'mac' : 'desktop'

      default:
        return 'desktop'
    }
  } catch (e) {
    console.error('error', "Couldn't parse plaform information", e)
    return 'desktop'
  }
}

export const platform: PlatformSchema = parsePlatform()

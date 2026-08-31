import type { Configuration } from 'electron-builder'

const config: Configuration = {
  appId: 'com.tpockettester.app',
  productName: 'T Pocket Tester',
  directories: {
    output: 'release',
  },
  files: ['out/**/*'],
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['arm64'],
      },
    ],
    identity: null,
    hardenedRuntime: false,
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
  },
}

export default config

import type { PathSchema, PointSchema } from '../schemas/geometry'

export const translatePath = (path: PathSchema, translation: PointSchema): PathSchema => {
  return {
    commands: path.commands.map((command) => {
      switch (command.type) {
        case 'moveTo':
        case 'lineTo':
          return {
            ...command,
            point: {
              x: command.point.x.plus(translation.x),
              y: command.point.y.plus(translation.y),
            },
          }
        case 'arcTo':
          return {
            ...command,
            point: {
              x: command.point.x.plus(translation.x),
              y: command.point.y.plus(translation.y),
            },
          }
        case 'close':
          return command
      }
    }),
  }
}

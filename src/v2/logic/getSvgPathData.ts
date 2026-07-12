import type { PathSchema, PathCommand } from '../schemas/geometry'

const getSvgPathCommandData = (command: PathCommand): string => {
  switch (command.type) {
    case 'moveTo':
      return `M ${command.point.x.toString()} ${command.point.y.toString()}`
    case 'lineTo':
      return `L ${command.point.x.toString()} ${command.point.y.toString()}`
    case 'arcTo':
      return `A ${command.radius.toString()} ${command.radius.toString()} 0 0 1 ${command.point.x.toString()} ${command.point.y.toString()}`
    case 'close':
      return 'Z'
  }
}

export const getSvgPathData = (path: PathSchema): string => {
  return path.commands.map(getSvgPathCommandData).join(' ')
}

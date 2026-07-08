import type { Path, PathCommand } from '../../schemas/geometry'

const getSvgPathCommandData = (command: PathCommand): string => {
  switch (command.type) {
    case 'moveTo':
      return `M ${command.point.x} ${command.point.y}`
    case 'lineTo':
      return `L ${command.point.x} ${command.point.y}`
    case 'arcTo':
      return `A ${command.radius} ${command.radius} 0 0 1 ${command.point.x} ${command.point.y}`
    case 'close':
      return 'Z'
  }
}

export const getSvgPathData = (path: Path): string => {
  return path.commands.map(getSvgPathCommandData).join(' ')
}

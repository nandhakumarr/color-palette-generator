import color from 'color'

export const maxVariant = {
  TINT: (current, prev) => {
    return prev && color(prev).hsl().color[1] === 0
  },
  TONE: (current, prev) => {
    return prev && color(prev).hsl().color[1] === 0
  },
  SHADE: (current, prev) => {
    return prev && color(prev).hsl().color[1] === 0
  },
  SATURATION: (current, prev) => {
    return prev && color(prev).hsl().color[1] >= 100
  },
  DESATURATION: (current, prev) => {
    return prev && color(prev).hsl().color[1] === 0
  },
  LIGHTNESS: (current, prev) => {
    return prev && color(prev).hsl().color[1] === 0
  },
  LIGHTNESS_NEGATIVE: (current, prev) => {
    return prev && color(prev).hsl().color[1] === 0
  },
}


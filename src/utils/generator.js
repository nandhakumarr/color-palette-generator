import color from 'color'

export const generate = {
  TINT: (baseColor, ratio, step) => {
    const _ratio = ratio * step
    return color(baseColor).mix(color('white'), _ratio).hex()
  },
  TONE: (baseColor, ratio, step) => {
    const _ratio = ratio * step
    return color(baseColor).mix(color('gray'), _ratio).hex()
  },
  SHADE: (baseColor, ratio, step) => {
    const _ratio = ratio * step
    return color(baseColor).mix(color('black'), _ratio).hex()
  },
  SATURATION: (baseColor, ratio, step) => {
    const _ratio = ratio * step
    return color(baseColor).saturate(_ratio).hex()
  },
  DESATURATION: (baseColor, ratio, step) => {
    const _ratio = ratio * step
    return color(baseColor).desaturate(_ratio).hex()
  },
  LIGHTNESS: (baseColor, ratio, step) => {
    const _ratio = ratio * step
    return color(baseColor).lightness(color(baseColor).lightness() + (_ratio * 100)).hex()
  },
  LIGHTNESS_NEGATIVE: (baseColor, ratio, step) => {
    const _ratio = ratio * step
    return color(baseColor).lightness(color(baseColor).lightness() - (_ratio * 100)).hex()
  },
}


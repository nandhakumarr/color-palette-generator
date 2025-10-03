<script>
  export default {
    name: 'ColorPalette',
  }
</script>

<script setup>
  import { ref } from 'vue'
  import { lightness, harmony } from 'simpler-color'
  import { generate } from '@/utils/generator.js'
  import { maxVariant } from '@/utils/max-variant.js'

  import BezierCurve from './BezierCurve.vue'
  import ColorVariant from './Variant.vue'

  const color = ref('#ff0000')

  const variants = ref([
    { code: 'TINT', label: 'Tints' },
    { code: 'LIGHTNESS', label: 'Lighter' },
    { code: 'TONE', label: 'Tones' },
    { code: 'DESATURATION', label: 'Desaturations' },
    { code: 'SHADE', label: 'Shades' },
    { code: 'LIGHTNESS_NEGATIVE', label: 'Darker' },
    { code: 'SATURATION', label: 'Saturations' },
  ])

  const selectedVariant = ref('TINT')

  const tints = ref([])
  const tones = ref([])
  const shades = ref([])
  const saturations = ref([])
  const desaturations = ref([])
  const lightnesses = ref([])
  const lightnessesNegative = ref([])

  const palette = reactive({
    TINT: tints,
    TONE: tones,
    SHADE: shades,
    SATURATION: saturations,
    DESATURATION: desaturations,
    LIGHTNESS: lightnesses,
    LIGHTNESS_NEGATIVE: lightnessesNegative,
  })

  const ratios = reactive({
    TINT: 0.1,
    TONE: 0.1,
    SHADE: 0.1,
    SATURATION: 0.1,
    DESATURATION: 0.1,
    LIGHTNESS: 0.1,
    LIGHTNESS_NEGATIVE: 0.1,
  })

  const count = reactive({
    TINT: 0,
    TONE: 0,
    SHADE: 0,
    SATURATION: 0,
    DESATURATION: 0,
    LIGHTNESS: 0,
    LIGHTNESS_NEGATIVE: 0,
  })

  const max = computed(() => {
    const max = {}
    Object.keys(palette).forEach(variant => {
      const colors = generate[variant](color.value, ratios[variant], palette[variant].length)
      max[variant] = maxVariant[variant](colors, palette[variant][palette[variant].length - 1]) || false
    })
    return { ...max }
  })

  // function addVariant(variant) {
  //   genVariants(variant, count[variant] + 1)
  // }

  // function genVariants(variant, variantCount) {
  //   const ratio = ratios[variant]
  //   if (!max.value[variant]) return
  //   count[variant]++
  //   for (let i = 0; i < variantCount; i++) {
  //     //
  //   }
  // }

  async function addVariant(variant) {
    let _maxVariant = false
    palette[variant] = []
    count[variant] = 0
    while(!_maxVariant) {
      await nextTick()
      const _color = generate[variant](color.value, ratios[variant], palette[variant].length)
      palette[variant].push(_color)
      count[variant]++
      _maxVariant = maxVariant[variant](_color, palette[variant][palette[variant].length - 1])
    }
  }

  watch(() => color.value, () => {
    Object.keys(palette).forEach(key => {
      palette[key] = []
    })
  })

  const controlPoint1 = ref({ x: 0, y: 0 })
  const controlPoint2 = ref({ x: 80, y: 80 })
</script>

<template lang="pug">
.color-palette
  header.base
    .base-color
      label.color
        .box(:style="{ backgroundColor: color || '#ffffff' }")
          input(type="color" v-model="color")
      h1 {{ color || 'No color selected' }}

  .palette
    //- p {{ controlPoint1 }}
    //- p {{ controlPoint2 }}
    //- bezier-curve(
      :startPoint="{ x: 0, y: 100 }"
      v-model:controlPoint1="controlPoint1"
      v-model:controlPoint2="controlPoint2"
      :endPoint="{ x: 100, y: 0 }"
      strokeColor="blue"
      :strokeWidth="2")


    .variants
      .variant(v-for="variant in variants" :key="variant.code" @click="selectedVariant = variant.code" :class="{ active: selectedVariant === variant.code }")
        header
          h4 {{ variant.label }} [{{ count[variant.code] }}]
          input(type="range" min="0.025" max="1.0" v-model="ratios[variant.code]" step="0.025")
          span {{ ratios[variant.code] * 100 }}%
        color-variant(:variants="palette[variant.code]" @add="addVariant(variant.code)")

</template>

<style lang="sass" scoped>
.color-palette
  height: 100%
  overflow: hidden
  display: flex
  align-items: stretch
  flex-direction: column
  padding: 0

  > header
    padding-bottom: 1rem
    margin-bottom: 1rem
    border-bottom: 1px solid #ccc

.palette
  flex: 1
  overflow: auto
  header
    display: flex
    gap: 1rem
    background: #f2f2f2
    padding: 0.5rem
    h4
      margin: 0

.inputs
  margin-top: 1rem
  display: flex
  gap: 1rem

.base-color
  display: flex
  gap: 2rem

.color
  text-align: center
  input[type="color"]
    display: none
  .box
    width: 80px
    height: 80px
    border-radius: 0.5rem
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
  .label
    margin-top: 0.5rem
    font-family: monospace
    font-size: 0.875rem
</style>

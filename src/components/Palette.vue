<script>
  export default {
    name: 'ColorPalette',
  }
</script>

<script setup>
  import { ref } from 'vue'
  import { lightness, harmony } from 'simpler-color'
  import ColorVariant from './Variant.vue'
  import { generate } from '@/utils/generator.js'
  import { maxVariant } from '@/utils/max-variant.js'

  const color = ref('#ff0000')

  const variants = ref([
    { code: 'TINT', label: 'Tints' },
    { code: 'TONE', label: 'Tones' },
    { code: 'SHADE', label: 'Shades' },
    { code: 'SATURATION', label: 'Saturations' },
    { code: 'DESATURATION', label: 'Desaturations' },
    { code: 'LIGHTNESS', label: 'Lighter' },
    { code: 'LIGHTNESS_NEGATIVE', label: 'Darker' },
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

  function addVariant(variant) {
    const colors = generate[variant](color.value, ratios[variant], palette[variant].length)
    if (!maxVariant[variant](colors, palette[variant][palette[variant].length - 1]))
      palette[variant].push(colors)
  }
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
    .variants
      .variant(v-for="variant in variants" :key="variant.code" @click="selectedVariant = variant.code" :class="{ active: selectedVariant === variant.code }")
        h4 {{ variant.label }}
        color-variant(:variants="palette[variant.code]" @add="addVariant(variant.code)")

</template>

<style lang="sass" scoped>
.color-palette
  display: block
  padding: 0

header
  padding-bottom: 1rem
  margin-bottom: 1rem
  border-bottom: 1px solid #ccc

.inputs
  margin-top: 1rem
  display: flex
  gap: 1rem

.base-color
  display: flex
  gap: 2rem

.variant h4
  background: #f2f2f2
  margin: 0
  padding: 0.5rem

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

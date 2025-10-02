<script>
  export default {
    name: 'ColorPalette',
  }
</script>

<script setup>
  import { ref } from 'vue'
  import { lightness, harmony } from 'simpler-color'

  // const props = defineProps({})
  // const emit = defineEmits({})

  const color = ref('')
  const paletteType = ref('TINT')

  const lightnesses = ref([])
  const lightnessesNegative = ref([])

  const shades = ref([])
  const tints = ref([])
  const tones = ref([])
  const saturations = ref([])
  const desaturations = ref([])
</script>

<template lang="pug">
.color-palette
  h1 {{ color || 'No color selected' }}
  .inputs
    input(type="color" v-model="color")
    select(v-model="paletteType")
      option(value="TINT") Tint
      option(value="SHADE") Shade
      option(value="TONE") Tone
      option(value="SATURATION") Saturation
      option(value="LIGHTNESS") Lightness

  .palette
    .color
      .box(:style="{ backgroundColor: color || '#ffffff' }")
      .label {{ color || 'No color selected' }}
    .color(v-for="value, key in palette" :key="key")
      .box(:style="{ backgroundColor: value }")
      .label {{ value }}

</template>

<style lang="sass" scoped>
.color-palette
  display: block
  padding: 2rem

.inputs
  margin-top: 1rem
  display: flex
  gap: 1rem

.palette
  display: flex
  gap: 1rem
  .color
    text-align: center
    .box
      width: 100px
      height: 100px
      border-radius: 0.5rem
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
    .label
      margin-top: 0.5rem
      font-family: monospace
      font-size: 0.875rem
</style>

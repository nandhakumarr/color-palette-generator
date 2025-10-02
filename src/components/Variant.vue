<script>
export default {
  name: 'ColorVariant',
}
</script>

<script setup>
const props = defineProps({
  variants: {
    type: Array,
    default: () => ([])
  }
})
const emit = defineEmits(['add'])
// onMounted(() => {})
</script>

<template lang="pug">
.variant
  .color
    a.box.add(@click="emit('add')")
      h1 +
    .label &nbsp;
  .colors
    .color(v-for="value, key in variants" :key="key")
      .box(:style="{ backgroundColor: value }")
      .label {{ value }}
</template>

<style lang="sass" scoped>
.variant
  display: flex
  gap: 0.25rem
  padding: 0.5rem 0
  border: 1px solid #eee
  border-width: 1px 0
  .box.add
    border: 1px solid #ccc
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer
    h1
      font-weight: normal
      font-size: 3rem
      line-height: 60px
      margin: 0
      opacity: 0.3
    + .label
      opacity: 0.6
    &:hover
      h1, + .label
        opacity: 1

.colors
  display: flex
  gap: 0.25rem
  flex-wrap: wrap

.color
  text-align: center
  input[type="color"]
    display: none
  .box
    width: 60px
    height: 60px
    border-radius: 0.5rem
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
  .label
    margin-top: 0.5rem
    font-family: monospace
    font-size: 0.725rem
    letter-spacing: 0.05em

</style>

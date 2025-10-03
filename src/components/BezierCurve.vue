<script setup>
  const controlPoint1 = defineModel('controlPoint1', {
    type: Object,
    required: true,
    validator: (val) => 'x' in val && 'y' in val,
  })

  const controlPoint2 = defineModel('controlPoint2', {
    type: Object,
    required: true,
    validator: (val) => 'x' in val && 'y' in val,
  })

  const props = defineProps({
    startPoint: {
      type: Object,
      required: true,
      validator: (val) => 'x' in val && 'y' in val,
    },
    endPoint: {
      type: Object,
      required: true,
      validator: (val) => 'x' in val && 'y' in val,
    },
    strokeColor: {
      type: String,
      default: 'black',
    },
    strokeWidth: {
      type: Number,
      default: 2,
    },
    fillColor: {
      type: String,
      default: 'none', // Set to 'none' for a line, or a color for a filled shape
    },
  })

  const pathData = computed(() => {
    const { startPoint, controlPoint1, controlPoint2, endPoint } = props;
    return `M ${startPoint.x} ${startPoint.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${endPoint.x} ${endPoint.y}`;
  })

  const svg = ref(null)
  const cp1 = ref(null)
  const cp2 = ref(null)

  let isDraggingCP1 = ref(false)
  let isDraggingCP2 = ref(false)
  let offsetXCP1 = 0
  let offsetYCP1 = 0
  let offsetXCP2 = 0
  let offsetYCP2 = 0

  onMounted(() => {
    init()
  })

  const init = () => {
    cp1.value?.addEventListener('mousedown', async (e) => {
      await nextTick()
      isDraggingCP1.value = true
      offsetXCP1 = controlPoint1.value.x
      offsetYCP1 = controlPoint1.value.y
    })

    cp2.value?.addEventListener('mousedown', async (e) => {
      await nextTick()
      isDraggingCP2.value = true
      offsetXCP2 = controlPoint2.value.x
      offsetYCP2 = controlPoint2.value.y
    })

    svg.value?.addEventListener('mousemove', async (e) => {
      await nextTick()
      const svgRect = svg.value.getBoundingClientRect()
      const x = (e.clientX - svgRect.left) / 2
      const y = (e.clientY - svgRect.top) / 2
      if (isDraggingCP1.value) {
        controlPoint1.value.x = x > 0 && x < 100 ? x : controlPoint1.value.x
        controlPoint1.value.y = y > 0 && y < 100 ? y : controlPoint1.value.y
      } else if (isDraggingCP2.value) {
        controlPoint2.value.x = x > 0 && x < 100 ? x : controlPoint2.value.x
        controlPoint2.value.y = y > 0 && y < 100 ? y : controlPoint2.value.y
      }
    })

    svg.value?.addEventListener('mouseup', async () => {
      await nextTick()
      isDraggingCP1.value = false
      isDraggingCP2.value = false
    })

    // svg.value?.addEventListener('mouseleave', async () => {
    //   await nextTick()
    //   isDraggingCP1.value = false
    //   isDraggingCP2.value = false
    // })
  }

</script>

<template lang="pug">
.bezier-curve
  p offsetCP1: {{ offsetXCP1 }}, {{ offsetYCP1 }}
  p offsetCP2: {{ offsetXCP2 }}, {{ offsetYCP2 }}
  p isDraggingCP1: {{ isDraggingCP1 }}
  p isDraggingCP2: {{ isDraggingCP2 }}
  .curve(style="width: 200px; height: 200px;")
    svg(ref="svg" viewBox="0 0 100 100" width="100%" height="100%")
      line(
        :x1="startPoint.x" :y1="startPoint.y"
        :x2="controlPoint1.x" :y2="controlPoint1.y"
        stroke="gray"
        stroke-width="0.5"
      )
      line(
        :x1="endPoint.x" :y1="endPoint.y"
        :x2="controlPoint2.x" :y2="controlPoint2.y"
        stroke="gray"
        stroke-width="0.5"
      )
      path(
        :d="pathData"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        :fill="fillColor"
      )
      circle#cp1(ref="cp1" :cx="controlPoint1.x" :cy="controlPoint1.y" r="3"
        :fill="isDraggingCP1 ? 'yellow' : 'white'" stroke="black" stroke-width="1")
      circle#cp2(ref="cp2" :cx="controlPoint2.x" :cy="controlPoint2.y" r="3"
        :fill="isDraggingCP2 ? 'yellow' : 'white'" stroke="black" stroke-width="1")
</template>

<style lang="sass" scoped>
.bezier-curve
  padding: 1rem
  .curve
    background: #f9f9f9
    border: 1px solid #eee

svg
  circle
    cursor: pointer
</style>

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

  const SIZE = ref(100)
  const VIEW_SIZE = ref(200)
  const PADDING = ref(10)
  const STEP = ref(100 / 10)
  const RATIO = computed(() => VIEW_SIZE.value / (SIZE.value + (PADDING.value * 2)))

  const pathData = computed(() => {
    const { startPoint, controlPoint1, controlPoint2, endPoint } = props
    const _SIZE = SIZE.value
    const _PADDING = PADDING.value
    return `M ${(startPoint.x * _SIZE) + _PADDING} ${(startPoint.y * _SIZE) + _PADDING}
            C ${(controlPoint1.x * _SIZE) + _PADDING} ${((controlPoint1.y) * _SIZE) + _PADDING},
              ${(controlPoint2.x * _SIZE) + _PADDING} ${((controlPoint2.y) * _SIZE) + _PADDING},
              ${(endPoint.x * _SIZE) + _PADDING} ${(endPoint.y * _SIZE) + _PADDING}`;
  })

  const svg = ref(null)
  const container = ref(null)
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
      const svgRect = container.value.getBoundingClientRect()
      const offsetX = e.clientX - svgRect.left
      const offsetY = e.clientY - svgRect.top
      const _x = offsetX / (SIZE.value * RATIO.value)
      const _y = ((SIZE.value * RATIO.value) - offsetY) / (SIZE.value * RATIO.value)
      const x = parseFloat(_x.toFixed(2))
      const y = parseFloat(_y.toFixed(2))
      if (isDraggingCP1.value) {
        controlPoint1.value.x = x >= 0 && x <= 1 ? x : controlPoint1.value.x
        controlPoint1.value.y = y >= 0 && y <= 1 ? y : controlPoint1.value.y
      } else if (isDraggingCP2.value) {
        controlPoint2.value.x = x >= 0 && x <= 1 ? x : controlPoint2.value.x
        controlPoint2.value.y = y >= 0 && y <= 1 ? y : controlPoint2.value.y
      }
    })

    svg.value?.addEventListener('mouseup', async () => {
      await nextTick()
      isDraggingCP1.value = false
      isDraggingCP2.value = false
    })

    svg.value?.addEventListener('mouseleave', async () => {
      await nextTick()
      isDraggingCP1.value = false
      isDraggingCP2.value = false
    })
  }

</script>

<template lang="pug">
.bezier-curve
  p offsetCP1: {{ offsetXCP1 }}, {{ offsetYCP1 }}
  p offsetCP2: {{ offsetXCP2 }}, {{ offsetYCP2 }}
  p isDraggingCP1: {{ isDraggingCP1 }}
  p isDraggingCP2: {{ isDraggingCP2 }}
  .curve(:style="`width: ${VIEW_SIZE}px; height: ${VIEW_SIZE}px`")
    svg(ref="svg" :viewBox="`0 0 ${SIZE + (PADDING * 2)} ${SIZE + (PADDING * 2)}`" :width="`${VIEW_SIZE}px`" :height="`${VIEW_SIZE}px`")
      g.grid
        line(v-for="i in STEP" :key="i"
          :x1="PADDING" :y1="(i * (SIZE / STEP)) + PADDING"
          :x2="SIZE + PADDING" :y2="(i * (SIZE / STEP)) + PADDING"
          stroke="#eee"
          stroke-width="0.5"
        )
        line(v-for="i in STEP" :key="i"
          :x1="(i * (SIZE / STEP)) + PADDING" :y1="PADDING"
          :x2="(i * (SIZE / STEP)) + PADDING" :y2="SIZE + PADDING"
          stroke="#eee"
          stroke-width="0.5"
        )
        rect(
          ref="container"
          :x="PADDING" :y="PADDING" :width="SIZE" :height="SIZE"
          fill="#ffffff00" stroke="#ccc" stroke-width="0.25"
        )
      line.handle(
        :x1="(startPoint.x * SIZE) + PADDING" :y1="((1 - startPoint.y) * SIZE ) + PADDING"
        :x2="(controlPoint1.x * SIZE) + PADDING" :y2="((1 - controlPoint1.y) * SIZE) + PADDING"
        stroke="#666"
        stroke-width="0.5"
        stroke-linecap="round"
      )
      line.handle(
        :x1="(endPoint.x * SIZE) + PADDING" :y1="((1 - endPoint.y) * SIZE) + PADDING"
        :x2="(controlPoint2.x * SIZE) + PADDING" :y2="((1 - controlPoint2.y) * SIZE) + PADDING"
        stroke="#666"
        stroke-width="0.5"
        stroke-linecap="round"
      )
      path(
        :d="pathData"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        :fill="fillColor"
        stroke-linecap="round"
      )
      circle#cp1(ref="cp1" :cx="(controlPoint1.x * SIZE) + PADDING" :cy="((1 - controlPoint1.y) * SIZE) + PADDING" r="2"
        :fill="isDraggingCP1 ? strokeColor : 'white'" stroke="black" stroke-width="0.5")
      circle#cp2(ref="cp2" :cx="(controlPoint2.x * SIZE) + PADDING" :cy="((1 - controlPoint2.y) * SIZE) + PADDING" r="2"
        :fill="isDraggingCP2 ? strokeColor : 'white'" stroke="black" stroke-width="0.5")
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
  path
    transform: scale(1, -1) translate(0, -100%)
</style>

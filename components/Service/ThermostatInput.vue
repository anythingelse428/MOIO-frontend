<template>
  <div ref="thermostat" class="thermostat-input">
    <input id="range" ref="range" v-model="p" type="range" :min="0" :max="100" :step="props.step||1" hidden>
    <div class="thermostat-input__range-border --min">
      {{ props.min }}C
    </div>
    <label id="output" for="range" class="thermostat-input__value">
      {{ value }}C
    </label>
    <div class="thermostat-input__range-border --max">
      {{ props.max }}C
    </div>
    <svg ref="svg" class="thermostat-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260" fill="none">
      <path id="track" ref="track" d="M 240 240 A 1 1 0 0 0 0 240" fill="none" stroke="#212433" stroke-width="12" stroke-linecap="round" />
      <path id="progress" ref="progress" class="thermostat-svg__progress" d="M 240 240 A 1 1 0 0 0 0 240" fill="none" stroke-width="12" stroke-linecap="round" />
      <circle id="thumb" ref="thumb" r="14" cx="120.379" cy="120.379" fill="#B2D0F3" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue"
import useThrottle from "~/composables/useThrottle"

export interface IThermostatProps {
  value: number
  min:number
  max:number
  step:number
}
const props = defineProps<IThermostatProps>()

const emit = defineEmits(['t-input'])
const getSliderValue = (value) => {
  const max = props.max - props.min
  const flex = value - props.min
  return (flex / max) * 100
}
const p = ref(getSliderValue(props.value))
const range = ref<SVGElement>(null)
const svg = ref<SVGElement>(null)
const progress = ref<SVGElement>(null)
const track = ref<SVGElement>(null)
const thumb = ref<SVGElement>(null)
const thermostat = ref<HTMLDivElement>(null)
const stepped = (val:number, divider:number) => {
  return (Math.floor((val + divider - 1) / divider)) * divider
}

watch(p, (newP) => {
  const unStepped = (props.max - props.min) * (newP / 100) + props.min

  emit('t-input', (stepped(unStepped, (props.step || 1)) + 1 - props.step).toFixed(2))
})

onMounted(() => {
  if (thermostat.value) {
    const max = parseFloat(range.value.getAttribute('max')) || 100
    const min = parseFloat(range.value.getAttribute('min')) || 1
    const stepAttr = props.step || 1

    const steps = ((max - min) / stepAttr)
    let isMoving = false

    const getPoints = () => {
      // TODO облегчить функцию
      const points = []
      const trackLength = track.value.getTotalLength()
      const step = trackLength / steps
      let progressLength = 0
      while (progressLength <= trackLength + 1) {
        const DOMPoint = track.value.getPointAtLength(progressLength)
        points.push({ x: Number(DOMPoint.x.toFixed(3)), y: Number(DOMPoint.y.toFixed(3)), d: Number(progressLength) })
        progressLength += step
      }
      return points
    }

    const setPath = (value) => {
      const percentage = (value / max)
      progress.value.style.strokeDasharray = `${track.value.getTotalLength() * percentage} 1000`
    }
    const setThumb = () => {
      const points = getPoints()
      const newVal = Number(p.value)
      const index = Math.max(1, newVal) / stepAttr
      const point = points[Number(index.toFixed() - 1)]
      thumb.value.setAttribute('cx', point.x)
      thumb.value.setAttribute('cy', point.y)
    }
    const getClosestPoint = (x, y) => {
      // TODO облегчить функцию
      const distances = []
      const points = getPoints()
      points.forEach((point, index) => {
        const diffX = x - point.x
        const diffY = y - point.y
        const distance = Number(Math.sqrt((diffX * diffX) + (diffY * diffY)).toFixed(3))
        distances.push([index, parseFloat(distance)])
      })
      distances.sort((a, b) => a[1] - b[1])
      return points[distances[0][0]]
    }
    const render = (e) => {
      if (isMoving === true) {
        const rect = svg.value.getBoundingClientRect()
        const trackLength = track.value.getTotalLength()
        if (e.touches) { e = e.touches[0] }
        const pos = {
          x: Number((e.clientX - rect.left).toFixed(3)),
          y: Number((e.clientY - rect.top).toFixed(3)),
        }
        const target = getClosestPoint(pos.x, pos.y)
        const covered = Math.round(target.d * max / trackLength)

        thumb.value.setAttribute('cx', target.x)
        thumb.value.setAttribute('cy', target.y)
        setPath(covered)
        p.value = covered
      }
    }
    const setSVG = (w = 216, h = 216) => {
      svg.value.setAttribute('width', `${w * 1.12}`)
      svg.value.setAttribute('height', `${h * 1.12}`)
      svg.value.setAttribute('viewBox', `0 ${w * 0.4} ${w} ${h * 1.12}`)
      track.value.setAttribute('d', `M 0 ${w} A ${w / 2} ${w / 2} 0 0 1 ${w} ${w}`)
      track.value.setAttribute('stroke-width', '12')
      progress.value.setAttribute('d', `M 0 ${w} A ${w / 2} ${w / 2} 0 0 1 ${w} ${w}`)
      progress.value.setAttribute('stroke-width', '12')
      thumb.value.setAttribute('stroke-width', '8')
      thumb.value.setAttribute('r', '14')
      setPath(p.value)
    }

    const dragEnd = () => {
      isMoving = false
      if (document.querySelector('.service-capabilities-modal')?.style) {
        document.querySelector('.service-capabilities-modal').style.overflow = 'auto'
      }
      if (svg.value?.classList) {
        svg.value.classList.remove('moving')
      }
    }

    const dragStart = () => {
      isMoving = true

      if (document.querySelector('.service-capabilities-modal')?.style) {
        document.querySelector('.service-capabilities-modal').style.overflow = 'hidden'
      }

      if (svg.value?.classList) {
        svg.value.classList.add('moving')
      }
    }


    range.value.addEventListener('input', () => {
      range.value.classList.remove('has-focus')
      setPath(p.value)
      setThumb()
    })

    svg.value.addEventListener('mousedown', (e) => {
      dragStart()
      render(e)
    })
    thumb.value.addEventListener('mousedown', () => {
      dragStart()
      svg.value.addEventListener('mousemove', e => render(e))
    })

    thumb.value.addEventListener('touchstart', () => {
      dragStart()
      thumb.value.addEventListener('touchmove', e => render(e))
    })
    window.addEventListener('mouseup', dragEnd)
    window.addEventListener('touchend', dragEnd)
    setSVG()
    getPoints()
    setThumb()
    setPath(p.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('mouseup', () => {})
  window.removeEventListener('touchend', () => {})
})
</script>

<style lang="scss">
@import "assets/styles/components/thermostat-input";
</style>

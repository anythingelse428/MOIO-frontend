<template>
  <div ref="thermostat" class="thermostat-input">
    <input id="range" ref="range" v-model="p" type="range" :min="0" :max="100" :step="props.step||1" class="form-range sr-only">
    <div id="output" for="range" class="position-absolute">
      p: {{ p }}
      val: {{ value }}
    </div>
    <svg ref="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 216" fill="none">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#00bc9b" />
          <stop offset="100%" stop-color="#5eaefd" />
        </linearGradient>
      </defs>
      <g transform="translate(-100,-120) scale(1.45)">
        <path id="track" ref="track" d="M 324,216 A 108,108 0 0 0 108,216" fill="none" stroke="#212433" stroke-width="12" stroke-linecap="round" />
        <path id="progress" ref="element" d="M 324,216 A 108,108 0 0 0 108,216" fill="none" stroke="url(#gradient)" stroke-width="12" stroke-linecap="round" />
        <circle id="thumb" ref="thumb" r="14" cx="108" cy="216" fill="#B2D0F3" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue"

export interface IThermostatProps {
  value: number
  min:number|null
  max:number|null
  step:number|null
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
const element = ref<SVGElement>(null)
const track = ref<SVGElement>(null)
const thumb = ref<SVGElement>(null)
const thermostat = ref<HTMLDivElement>(null)
const stepped = (val:number, devider:number) => {
  return (Math.floor((val + devider - 1) / devider)) * devider
}

watch(p, (newP) => {
  const unStepped = (props.max - props.min) * (newP / 100) + props.min

  emit('t-input', stepped(unStepped, (props.step || 1)) + 1 - props.step)
})

onMounted(() => {
  if (thermostat.value) {
    const max = parseFloat(range.value.getAttribute('max'))
    const min = parseFloat(range.value.getAttribute('min'))
    const stepAttr = props.step || 1
    const breakpoint = window.matchMedia('(max-width: 960px)')

    const scale = (360 - 90) / max
    const steps = ((max - min) / stepAttr)
    const r = 200
    const circumference = Math.PI * r
    let isMoving = false

    const getRadius = (mq) => {
      let radius = 200

      if (mq.matches) {
        radius = 100
      }

      return radius
    }
    const getPoints = () => {
      const points = []
      let progressLength = 0
      const trackLength = track.value.getTotalLength()
      const step = trackLength / steps
      while (progressLength < trackLength + 1) {
        const DOMPoint = track.value.getPointAtLength(progressLength)
        points.push({ x: DOMPoint.x.toFixed(3), y: DOMPoint.y.toFixed(3), d: progressLength })
        progressLength += step
      }
      return points
    }
    const setPath = (value) => {
      const percentage = (value / max)
      const offset = circumference * percentage
      element.value.style.strokeDasharray = `${track.value.getTotalLength() * percentage} 1000`
    }
    setPath(p.value)
    const setThumb = () => {
      const points = getPoints()
      const newVal = Number(p.value)
      const index = newVal / stepAttr
      const point = points[index.toFixed()]
      thumb.value.setAttribute('cx', point.x)
      thumb.value.setAttribute('cy', point.y)
    }
    const getClosestPoint = (x, y) => {
      const distances = []
      const points = getPoints()
      points.forEach((point, index) => {
        const diffX = x - point.x
        const diffY = y - point.y
        const distance = Math.sqrt((diffX * diffX) + (diffY * diffY)).toFixed(3)
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
          x: (e.clientX - rect.left).toFixed(3),
          y: (e.clientY - rect.top).toFixed(3),
        }
        const target = getClosestPoint(pos.x, pos.y)
        const covered = Math.round(target.d * max / trackLength)

        thumb.value.setAttribute('cx', target.x)
        thumb.value.setAttribute('cy', target.y)
        setPath(covered)
        p.value = covered
      }
    }
    const setSVG = () => {
      svg.value.setAttribute('width', '432')
      svg.value.setAttribute('height', '216')
      svg.value.setAttribute('viewBox', '0 0 432 216')
      track.value.setAttribute('d', 'M 108,216 A 108,108 0 0 1 324,216')
      track.value.setAttribute('stroke-width', '12')
      element.value.setAttribute('d', 'M 108,216 A 108,108 0 0 1 324,216')
      element.value.setAttribute('stroke-width', '12')
      thumb.value.setAttribute('stroke-width', '8')
      thumb.value.setAttribute('r', '14')
      setPath(p.value)
    }

    const dragEnd = () => {
      isMoving = false
      svg.value.classList.remove('moving')
    }

    const dragStart = () => {
      isMoving = true
      svg.value.classList.add('moving')
    }

    setSVG()
    setPath(p.value)
    setThumb()

    breakpoint.addEventListener('change', setSVG)

    range.value.addEventListener('input', () => {
      range.value.classList.remove('has-focus')
      setPath(p.value)
      setThumb()
    })

    svg.value.addEventListener('mousedown', () => {
      dragStart()
      svg.value.addEventListener('mousemove', e => render(e))
    })
    svg.value.addEventListener('touchstart', () => {
      dragStart()
      svg.value.addEventListener('touchmove', e => render(e))
    })

    window.addEventListener('mouseup', dragEnd)
    window.addEventListener('touchend', dragEnd)
  }
})

onUnmounted(() => {
  window.removeEventListener('mouseup', () => {})
  window.removeEventListener('touchend', () => {})
})
</script>

<style lang="scss">

</style>

<template>
  <div v-if="isMounted && capability" class="service-capability">
    <div v-if="type === 'devices.capabilities.color_setting'" class="service-capability__control --color">
      <label for="color">
        {{ type }}
      </label>
      <div class="" :style="`display: block;height: 20px;width: 20px; background: rgb(${Math.round(255 * rgb.red )}, ${Math.round(255 * rgb.green)}, ${Math.round(255 * rgb.blue)});`" />
      <input id="" v-model="h" step="1" type="range" :min="0" :max="360" name="" class="color" @input="updateDevice({type,value:{s:capability.hsv.s,v:capability.hsv.v,h:Number(h)}})">
    </div>
    <teleport v-if="isMounted" :to="`.on-of-teleported.--${deviceId}_ch${chanel}`">
      <div v-if="type === 'devices.capabilities.on_off'||instance==='open'" :class="`service-capability__control --toggle ${capability.value&&'--checked'}`" @click.stop="()=>false">
        <input
          v-model="capability.value"
          type="checkbox"
          @input="updateDevice({type:instance==='open'?'open':'devices.capabilities.on_off',value:!capability.value})"
        >
      </div>
    </teleport>

    <div v-if="type === 'devices.capabilities.on_off'" :class="`service-capability__control ${capability?.value?'--checked':''}`" @click.stop="()=>false">
      <toggle-switch
        :checked="capability.value"
        :ico="`'${toggleSwitchIco?.code}'`"
        vertical-large
        @check="(e)=>{capability.value=e;updateDevice({type,value:capability.value})}"
      />
    </div>
    <div
      v-if="type === 'devices.capabilities.range' &&
        (instance?.includes('bright'))"
      :class="`service-capability__control --range `"
    >
      <label for="range">
        {{ type }}
      </label>
      <input
        id="range"
        v-model="capability.value"
        type="range"
        :min="range.min"
        :max="range.max"
        :step="range.precision"
        :class="`${instance?.includes('temperature') && '--temperature'}`"
        @input="updateDevice({type,value:capability.value})"
      >
    </div>
    <div v-if="instance?.includes('temperature')" class="service-capability__control --thermostat">
      <!--       @t-input="(e)=>{capability.value=e;updateDevice({type:'devices.capabilities.range',value:e})}"-->
      <thermostat-input :value="capability.value" :step="0.5" :min="20" :max="40" @t-input="(e)=>{capability.value=e;}" />
    </div>
    <div v-if="instance === 'open' && type === 'devices.capabilities.range'" :class="`service-capability__control`">
      <toggle-switch :checked="capability.value" vertical-large :ico="`'${toggleSwitchIco?.code}'`" @check="(e)=>{capability.value=e;updateDevice({type:instance,value:capability.value})}" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useThrottle from "~/composables/useThrottle"
import { useDevicesStore } from "~/store/devices"
import ToggleSwitch from "~/components/shared/ToggleSwitch.vue"
import useChangeDeviceCapability from "~/composables/useChangeDeviceCapability"
import ThermostatInput from "~/components/Service/ThermostatInput.vue"
export type ServiceCapability = {
    deviceType:string
    deviceId:string
    chanel:string
    type: string
    retrievable: boolean
    reportable: boolean
    instance: string|null
    range: {
      min: number
      max: number
      precision: number
    },
    hsv:{
      h:number,
      s:number,
      v:number
    },
  value:any
}
const props = defineProps<ServiceCapability>()
const toggleSwitchIco = useIcoByDeviceType(props.deviceType)
const devicesStore = useDevicesStore()
const temp = ref({ ...props })
const capability = ref(temp)
const brightness = ref(capability.value?.hsv?.v)
const isMounted = ref(false)
const h = ref(Number(capability.value.hsv.h))
const rgb = computed(() => hsvToRgb(Number(h.value), capability.value.hsv.s / 100, capability.value.hsv.v / 100))
onMounted(() => {
  isMounted.value = true
})
if (capability.value && String(capability.value?.value)?.indexOf('close') > -1) {
  capability.value.value = false
}
if (capability.value && String(capability.value?.value)?.indexOf('open') > -1) {
  capability.value.value = true
}

async function actionFabric (fnName:'changeOnOf'|'changeTemperature'|'changeBrightness'|'changeRGB', args:any) {
  // обращаемся к action из сторы, передаем аргументы
  // вынесено для вызова в useThrottle, чтобы работали замыкания
  // TODO аргументы привести к типам
  return await devicesStore[fnName](args)
}
const throttledAction = useThrottle(actionFabric, 1000)
function updateDevice (val:{type:string, value:any}) {
  const mainActionProps = {
    clientId: 'relay',
    deviceId: props.deviceId,
    chanel: props.chanel,
  }
  switch (val.type) {
    case 'open':
      useChangeDeviceCapability(props.deviceId + '_ch' + props.chanel, 'range', val.value)
      return throttledAction('changeOpenClose', { ...mainActionProps, open: val.value })
    case 'devices.capabilities.on_off':
      throttledAction('changeOnOf', { ...mainActionProps, onOfStatus: val.value })
      useChangeDeviceCapability(props.deviceId + '_ch' + props.chanel, val.type, val.value)
      break
    case 'devices.capabilities.range':
      useChangeDeviceCapability(props.deviceId + '_ch' + props.chanel, 'range', val.value)
      if (props.instance && props.instance === 'threshold_temperature') {
        throttledAction('changeTemperature', { ...mainActionProps, temperature: val.value })
      }
      if ((props.instance && props.instance === 'brightness') || capability.value?.hsv?.v || props.instance === 'hsv') {
        useChangeDeviceCapability(props.deviceId + '_ch' + props.chanel, 'range', val.value)
        throttledAction('changeBrightness', { ...mainActionProps, brightness: val.value })
      }
      break
    case 'devices.capabilities.color_setting':
      useChangeDeviceCapability(props.deviceId + '_ch' + props.chanel, 'color', val.value)
      throttledAction('changeRGB', { ...mainActionProps, ...val.value })
      break
  }
}
const hsvToRgb = (hue, saturation, value) => {
  const d = 0.0166666666666666 * hue
  let c = value * saturation
  let x = c - c * Math.abs(d % 2.0 - 1.0)
  const m = value - c
  c += m
  x += m
  switch (d >>> 0) {
    case 0: return { red: c, green: x, blue: m }
    case 1: return { red: x, green: c, blue: m }
    case 2: return { red: m, green: c, blue: x }
    case 3: return { red: m, green: x, blue: c }
    case 4: return { red: x, green: m, blue: c }
  }
  return { red: c, green: m, blue: x }
}
// if (capability.value?.type === 'devices.capabilities.color_setting') {
//   watch(capability, (value) => {
//     if (value) {
//       updateDevice({
//         type: 'devices.capabilities.color_setting',
//         value: {
//           h: value.hsv.h,
//           s: value.hsv.s,
//           v: value.hsv.v ?? 0.7,
//         },
//       })
//     }
//   }, { deep: true })
// }
</script>


<style lang="scss">

.service-capability{
  display: block;
  position: relative;
  z-index: 100;
  opacity: 1;
  transition: all 1s;
  &__control {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    &.--toggle{
      display: block;
      width: 32px;
      height: 32px;
      position: absolute;
      input{
        cursor: pointer;
        position: absolute;
        inset: 0;
        opacity: 0;
      }
      &::before{
        transition: all .3s;
        will-change: color, box-shadow;
        display: flex;
        align-items: center;
        justify-content: center;
        content: "\F0425";
        color: #1A424B;
        font: normal normal normal 24px/1 "Material Design Icons";
        font-size: inherit;
        text-rendering: auto;
        line-height: inherit;
        -webkit-font-smoothing: antialiased;
        width: 32px;
        height: 32px;
        border-radius: 100%;
        background: $color-inactive;
        font-size: 24px;
        }
      &.--checked{
        &::before{
          filter:drop-shadow(0px 0px 12px $service-shadow-color);
          background: $bg-primary;
          color: $color-active;
          box-shadow: none;
        }
      }
    }
    &.--color{
      input[type="range"].color{
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 40px;
        background: linear-gradient(to right, red 0%, #ff0 17%, lime 33%, cyan 50%, blue 66%, #f0f 83%, red 100%);; /* Grey background */
        outline: none;
        -webkit-transition: .2s;
        transition: opacity .2s;
        border-radius: 1em;
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 25px;
          height: 25px;
          background: transparent;
          cursor: pointer;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 25px;
          height: 25px;
          background: transparent;
          cursor: pointer;
        }
      }
    }
    &.--range{
      input[type="range"] {
        -webkit-appearance: none;
        background-color: $thumb-color;
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 2.5rem;
        border-radius: 96px;
        overflow: hidden;
        cursor: col-resize;
        &::before{
          display: block;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 0;
          box-shadow: -20rem 0 0 20rem $color-active;
        }
        &::-moz-range-thumb {
          border: none;
          width: 0;
          box-shadow: -20rem 0 0 20rem $color-active;
        }
      }
    }
    &.--range.--temperature{
      input{
        opacity: 0;
        &::before{
          display: block;
          width: 100%;
          height: 216px;
          aspect-ratio: 1 / 1;
          content: "";
        }
      }
    }
  }


}
</style>

<template>
  <div v-if="isMounted && capability" class="service-capability">
    <div v-if="type === 'devices.capabilities.color_setting'" class="service-capability__control --color">
      <label for="color">
        {{ type }}
      </label>
      <div class="" :style="`display: block;height: 20px;width: 20px; background: rgb(${Math.round(255 * rgb.red )}, ${Math.round(255 * rgb.green)}, ${Math.round(255 * rgb.blue)});`" />
      <input id="" v-model="h" step="1" type="range" :min="0" :max="360" name="" class="color" @input="updateDevice({type,value:{s:capability.hsv.s,v:capability.hsv.v,h:Number(h)}})">
      <input id="" v-model="s" step="1" type="range" :min="0" :max="100" name="" class="saturation" @input="updateDevice({type,value:{s:Number(s),v:capability.hsv.v,h:Number(h)}})">
    </div>
    <!--    <teleport v-if="isMounted" :to="`.on-of-teleported.&#45;&#45;${deviceId}_ch${chanel}`">-->
    <!--      <div v-if="type === 'devices.capabilities.on_off'||instance==='open'" :class="`service-capability__control &#45;&#45;toggle ${capability.value&&'&#45;&#45;checked'}`" @click.stop="()=>false">-->
    <!--        <input-->
    <!--          v-model="capability.value"-->
    <!--          type="checkbox"-->
    <!--          @input="updateDevice({type:instance==='open'?'open':'devices.capabilities.on_off',value:!capability.value})"-->
    <!--        >-->
    <!--      </div>-->
    <!--    </teleport>-->

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
      <thermostat-input :value="capability.value" :step="capability.range?.precision || 1" :min="capability.range?.min || 20" :max="capability.range?.max || 40" @t-input="(e)=>{capability.value=e;updateDevice({type:'devices.capabilities.range',value:Number(e)})}" />
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
const h = ref(Number(capability.value.hsv?.h))
const s = ref(Number(capability.value.hsv?.s))
const rgb = computed(() => hsvToRgb(Number(h.value), s.value / 100, capability.value.hsv.v / 100))
onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
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
@import "assets/styles/components/service-capability";
</style>

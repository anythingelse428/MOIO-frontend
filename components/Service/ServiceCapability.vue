<template>
  <div v-if="isMounted && capability" class="service-capability">
    <div v-if="type === 'devices.capabilities.color_setting'" class="service-capability__control --color">
      <label for="color">
        {{ $t(type) }}
      </label>
      <div
        class="service-capability__color-preview"
        :style="`
           background: rgb(${Math.round(255 * rgb.red )}, ${Math.round(255 * rgb.green)}, ${Math.round(255 * rgb.blue)});`"
      />
      <div class="service-capability__color">
        <input id="color" v-model="hue" step="1" type="range" :min="0" :max="360" name="" class="service-capability__hue" @input="updateDevice({type,value:{s:Number(saturation),v:capability.hsv.v,h:Number(hue)}})">
      </div>
      <input id="" v-model="saturation" step="1" type="range" :min="0" :max="100" name="" class="service-capability__saturation" @input="updateDevice({type,value:{s:Number(saturation),v:capability.hsv.v,h:Number(hue)}})">
    </div>
    <div v-if="type === 'devices.capabilities.on_off'" :class="`service-capability__control ${capability?.value?'--checked':''}`" @click.stop="()=>false">
      <toggle-switch
        role="button"
        :checked="capability.value"
        :ico="`'${toggleSwitchIco?.code}'`"
        vertical-large
        @check="(e)=>{capability.value=e;updateDevice({type,value:capability.value})}"
      />
    </div>
    <div
      v-if="type === 'devices.capabilities.range' &&
        (instance?.includes('bright'))"
      :class="`service-capability__control --range --bright`"
    >
      <label for="range">
        {{ $t(type) }}
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
import ThermostatInput from "~/components/Service/ThermostatInput.vue"
import { useUserStore } from "~/store/user"
import { useGroupsStore } from "~/store/groups"

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
const emit = defineEmits(['update-bool-val'])
const toggleSwitchIco = useIcoByDeviceType(props.deviceType)
const devicesStore = useDevicesStore()
const capabilitySource = ref({ ...props })
const capability = ref(capabilitySource)
const isMounted = ref(false)
const hue = ref(Number(capability.value.hsv?.h))
const saturation = ref(Number(capability.value.hsv?.s))
const rgb = computed(() => hsvToRgb(Number(hue.value), saturation.value / 100, capability.value.hsv.v / 100))

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
const groupStore = useGroupsStore()
function updateDevice (val:{type:string, value:any}) {
  const mainActionProps = {
    clientId: groupStore.clientId,
    deviceId: props.deviceId,
    chanel: props.chanel,
  }
  console.log(mainActionProps)
  switch (val.type) {
    case 'open':
      // @ts-ignore
      // throttledAction('changeOpenClose', { ...mainActionProps, open: val.value })
      emit('update-bool-val')
      break
    case 'devices.capabilities.on_off':
      // @ts-ignore
      // throttledAction('changeOnOf', { ...mainActionProps, onOffStatus: val.value })
      emit('update-bool-val')
      break
    case 'devices.capabilities.range':
      if (props.instance && props.instance === 'threshold_temperature') {
      // @ts-ignore
        throttledAction('changeTemperature', { ...mainActionProps, temperature: val.value })
      }
      if ((props.instance && props.instance === 'brightness') || capability.value?.hsv?.v || props.instance === 'hsv') {
      // @ts-ignore
        throttledAction('changeBrightness', { ...mainActionProps, brightness: val.value })
      }
      break
    case 'devices.capabilities.color_setting':
      // @ts-ignore
      throttledAction('changeRGB', { ...mainActionProps, ...val.value })
      break
  }
}
const hsvToRgb = (hue:number, saturation:number, value:number) => {
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

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})
watch(props, (newVal) => {
  capabilitySource.value = { ...newVal }
}, { deep: true })

</script>


<style lang="scss">
@import "assets/styles/components/service-capability";
</style>

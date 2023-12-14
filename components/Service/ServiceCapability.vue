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
      <vue3-slider v-model="capability.value" min="10" max="40" orientation="circular" height="40" width="80%" circle-offset="210" :tooltip="true" />
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
const slider = useNuxtApp().$slider
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
      // console.log('UPDATe', val.value)
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
input[type="range"].color{
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 40px; /* Specified height */
  background: linear-gradient(to right, red 0%, #ff0 17%, lime 33%, cyan 50%, blue 66%, #f0f 83%, red 100%);; /* Grey background */
  outline: none; /* Remove outline */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
  border-radius: 1em;
  &::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    width: 25px; /* Set a specific slider handle width */
    height: 25px; /* Slider handle height */
    background: transparent; /* Green background */
    cursor: pointer; /* Cursor on hover */
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    width: 25px; /* Set a specific slider handle width */
    height: 25px; /* Slider handle height */
    background: transparent; /* Green background */
    cursor: pointer; /* Cursor on hover */
  }
}
.color-input.user{
  width: 100%;
  .saturation-area{
    display: none;
  }
  .slider{
    height: 40px;
  }
  .slider-container{
    border-radius: 1em;
  }
  .slider-pointer{
    height: 20px;
    width: 20px;
  }
  .box,
  .slider-pointer,
  .slider-active-area,
  //.slider-canvas{
  //  filter: brightness(var(--bright));
  //  cursor: crosshair;
  //}
  .saturation-pointer{
    //display: none;
  }
  .text-input-container{
    color: black;
  }
  .box{
    width: 100%;
    border-radius: 1em;
    background: transparent;
    margin-inline:auto;
    .transparent{
    background: transparent;
    }
    &.active {
      .inner{
        transform: scale(1);
      }
    }
  }
  .picker-popup{
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: auto;
    width: 100%;
    background: transparent;
    box-shadow: none;
    top: 0!important;
    .slider{
      width: 98%;
    }
  }
}
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


.c-rng {
  --rng-focus: #064374;
  --rng-lower: #6495ED;
  --rng-upper: #CFD8DC;
  --rng-percent: 0%;
  --rng-percent-upper: 80%;

  --rng-bdrs: .375rem;
  --rng-bgi: linear-gradient(to right, var(--rng-lower) var(--rng-percent), var(--rng-upper) var(--rng-percent));
  --rng-h: 0.75rem;
  --rng-m: 2rem 0;
  --rng-w: 100%;

  --rng-label-c: #333;
  --rng-label-fz: 0.75rem;
  --rng-label-off: 0.25rem;

  --rng-thumb-bdrs: 50%;
  --rng-thumb-bxsh: none;
  --rng-thumb-bxsh--focus: inset 0 0 0 0.25rem var(--rng-focus);
  --rng-thumb-bgc: #0960A5;
  --rng-thumb-h: 2rem;
  --rng-thumb-w: 2rem;
  --rng-thumb-z: 1;

  background-image: var(--rng-bgi);
  border-radius: var(--rng-bdrs);
  box-sizing: border-box;
  font-family: inherit;
  height: var(--rng-h);
  margin: var(--rng-m);
  outline: none;
  position: relative;
  width: var(--rng-w);
}
/*
=====
THUMB
=====
*/
.c-rng::-moz-range-thumb {
  background-color: var(--rng-thumb-bgc);
  border-radius: var(--rng-thumb-bdrs);
  box-shadow: var(--rng-thumb-bxsh);
  color: #000;
  cursor: ew-resize;
  height: var(--rng-thumb-h);
  margin-top: calc(0px - ((var(--rng-thumb-h) - var(--rng-h)) / 2));
  position: relative;
  width: var(--rng-thumb-w);
  z-index: var(--rng-thumb-z);
}
.c-rng::-webkit-slider-thumb {
  background-color: var(--rng-thumb-bgc);
  border-radius: var(--rng-thumb-bdrs);
  box-shadow: var(--rng-thumb-bxsh);
  cursor: ew-resize;
  height: var(--rng-thumb-h);
  margin-top: calc(0px - ((var(--rng-thumb-h) - var(--rng-h)) / 2));
  position: relative;
  width: var(--rng-thumb-w);
  z-index: var(--rng-thumb-z);
}
.c-rng:focus::-webkit-slider-thumb {
  box-shadow: var(--rng-thumb-bxsh--focus);
}
/*
=====
TRACK
=====
*/
.c-rng::-moz-range-track {
  background: transparent;
  background-size: 100%;
  border-radius: var(--rng-bdrs);
  box-sizing: border-box;
  height: var(--rng-h);
}
.c-rng::-webkit-slider-runnable-track {
  background: transparent;
  background-size: 100%;
  border-radius: var(--rng-bdrs);
  box-sizing: border-box;
  height: var(--rng-h);
}
.c-rng,
.c-rng::-webkit-slider-runnable-track,
.c-rng::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
}
/*
======
LABELS
======
*/
.c-rng::after,
.c-rng::before {
  color: var(--rng-label-c);
  font-size: var(--rng-label-fz);
  line-height: 1;
  position: absolute;
  top: calc(var(--rng-h) + var(--rng-label-off));
  z-index: -1;
}
.c-rng[data-range*="labels"]::after {
  content: attr(max);
  right: 0;
}
.c-rng[data-range*="labels"]::before {
  content: attr(min);
}
.c-rng--labels-above .c-rng::after,
.c-rng--labels-above .c-rng::before {
  top: -1rem; /* TODO */
}

/*
======
OUTPUT
======
*/
.c-rng__output {
  --rng-output-bgc: #444;
  --rng-output-c: #EEE;
  --rng-output-p: 0.25rem 0 0 0;
  --rng-output-t: 0.25rem;
  --rng-output-w: 2rem;

  background-color: var(--rng-output-bgc);
  color: var(--rng-output-c);
  display: inline-block;
  font-family: sans-serif;
  font-size: 0.675rem;
  left: calc(1% * var(--rng-unit) - ((var(--rng-thumb-w) / 100) * var(--rng-unit)));
  padding: var(--rng-output-p);
  position: relative;
  text-align: center;
  top: var(--rng-output-t);
  width: var(--rng-output-w);
}
.c-rng__output::after {
  border-left: calc(var(--rng-output-w) / 2) solid transparent;
  border-right: calc(var(--rng-output-w) / 2) solid transparent;
  border-top: calc(var(--rng-output-w) / 3) solid var(--rng-output-bgc);
  content: "";
  height: 0;
  left: 0;
  position: absolute;
  top: 100%;
  width: 0;
}
/*
=======
WRAPPER
=======
*/
.c-rng__wrapper .c-rng {
  bottom: 1rem;
  left: 0;
  margin: 0;
  position: absolute;
}
.c-rng__wrapper .c-rng__output {
  position: absolute;
  top: 0;
}
.c-rng__wrapper {
  --rng-ticks-fill: #B0B0B0;
  flex: 1;
  height: 4rem; /* TODO */
  margin-bottom: 1rem;
  position: relative;
}
/*
=====
MULTI
=====
*/
.c-rng__multi [data-range*="lower"] {
  --rng-bgi: linear-gradient(to right, var(--rng-upper) var(--rng-percent), var(--rng-lower) var(--rng-percent), var(--rng-lower) var(--rng-percent-upper), var(--rng-upper) var(--rng-percent-upper));
}
.c-rng__multi [data-range*="upper"] {
  background: none;
}
/*
========
CIRCULAR
========
*/
.c-rng--circular {
  --circle-bgc: #FFF;
  --circle-size: 200px;
  --track-bgc: hsl(219, 20%, 85%);
  --track-fill: cornflowerblue;
  --thumb-size: 30px;

  --gradient-start: 0deg;
  --gradient-end: 0deg;

  background-image: conic-gradient(var(--track-bgc) 0, var(--track-bgc) var(--gradient-start), var(--track-fill) var(--gradient-start), var(--track-fill) var(--gradient-end), var(--track-bgc) var(--gradient-end), var(--track-bgc));
  border-radius: 50%;
  display: inline-block;
  height: var(--circle-size);
  margin: 0.25rem;
  position: relative;
  touch-action: none;
  width: var(--circle-size);
}
.c-rng--circular::before {
  align-items: center;
  background-color: var(--circle-bgc);
  border-radius: 50%;
  content: attr(data-value);
  display: flex;
  font-family: ui-sans-serif, ui-system, sans-serif;
  font-size: 2rem;
  height: calc(var(--circle-size) - (var(--thumb-size) * 2));
  justify-content: center;
  left: var(--thumb-size);
  position: absolute;
  top: var(--thumb-size);
  width: calc(var(--circle-size) - (var(--thumb-size) * 2));
}
.c-rng--circular::after {
  background-color: var(--track-fill);
  border-radius: 50%;
  content: "";
  height: var(--thumb-size);
  position: absolute;
  left: calc(50% - (var(--thumb-size) / 2));
  width: var(--thumb-size);
}
.c-rng--circular-output {
  background: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--thumb-size);
  margin-top: calc(var(--thumb-size) / -2);
  transform: rotate(var(--angle));
  transform-origin: center left;
  width: 50%;
  z-index: 1;
}
.c-rng--circular-output::before {
  background-color: var(--thumb-bgc, #FFF);
  border: var(--thumb-bdw, 2px) solid var(--track-fill);
  border-radius: 50%;
  box-shadow: var(--thumb-bxsh, none);
  box-sizing: border-box;
  content: "";
  cursor: grab;
  display: inline-block;
  height: var(--thumb-size);
  position: absolute;
  right: 0;
  width: var(--thumb-size);
}
.c-rng--circular-output:focus {
  --thumb-bxsh: inset 0 0 0 2px #FFF, inset 0 0 0 10px var(--track-fill);
  outline: none;
}
/*
======
TICKS
======
*/
.c-rng--ticks {
  fill: var(--rng-ticks-fill);
  bottom: 0;
  height: 1rem; /* TODO */
  left: 0;
  position: absolute;
  width: calc(100% - var(--rng-thumb-w));
  margin-left: calc(var(--rng-thumb-w) / 2);
}
.c-rng--ticks rect:first-of-type {
  transform: translateX(1px);
}
.c-rng--ticks rect:last-of-type {
  transform: translateX(-1px);
}
.c-rng--ticks-above .c-rng--ticks {
  bottom: auto;
  top: 1.25rem;
}
.c-rng--ticks-full .c-rng--ticks {
  --rng-ticks-fill: #ffccd5; /* TODO! */
  height: 2.5rem;
}

/* Modifiers */
.c-rng--grey {
  --rng-focus: #A0A0A0;
  --rng-lower: #B0B0B0;
  --rng-upper: #DEDEDE;
  --rng-h: 8px;
  --rng-thumb-bgc: #FFF;
  --rng-thumb-bxsh: 1px 2px 4px 1px rgba(0, 0, 0, .25);
}
.c-rng--pink {
  --rng-focus: #E6002A;
  --rng-lower: #FF91A6;
  --rng-upper: #FFE0E5;
  --rng-h: 4px;
  --rng-thumb-bdrs: 0.25rem;
  --rng-thumb-bgc: #FF2F56;
  --rng-thumb-h: 2rem;
  --rng-thumb-w: 1rem;
  --rng-ticks-fill: #ffccd5;
}
.c-rng--hue {
  --rng-value: 0;
  --rng-bgi: linear-gradient(to right, red, #ff8000, #ff0, #80ff00, lime, #00ff80, cyan, #007fff, blue, #7f00ff, #f0f, #ff0080, red);
  --rng-thumb-bgc: hsl(var(--rng-value), 100%, 50%);
  --rng-thumb-bxsh--focus: inset 0 0 0 0.125rem rgba(255, 255, 255, 0.8), 0 0 0 0.125rem hsl(var(--rng-value), 100%, 25%);
  --rng-thumb-bxsh: inset 0 0 0 0.125rem hsl(var(--rng-value), 100%, 30%);
}
.c-rng--icons {
  --ico-audio: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 32"><path d="M27.814 28.814c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 2.739-2.739 4.247-6.38 4.247-10.253s-1.508-7.514-4.247-10.253c-0.586-0.586-0.586-1.536 0-2.121s1.536-0.586 2.121 0c3.305 3.305 5.126 7.7 5.126 12.374s-1.82 9.069-5.126 12.374c-0.293 0.293-0.677 0.439-1.061 0.439zM22.485 25.985c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 4.094-4.094 4.094-10.755 0-14.849-0.586-0.586-0.586-1.536 0-2.121s1.536-0.586 2.121 0c2.55 2.55 3.954 5.94 3.954 9.546s-1.404 6.996-3.954 9.546c-0.293 0.293-0.677 0.439-1.061 0.439v0zM17.157 23.157c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 2.534-2.534 2.534-6.658 0-9.192-0.586-0.586-0.586-1.536 0-2.121s1.535-0.586 2.121 0c3.704 3.704 3.704 9.731 0 13.435-0.293 0.293-0.677 0.439-1.061 0.439z"></path><path d="M13 30c-0.26 0-0.516-0.102-0.707-0.293l-7.707-7.707h-3.586c-0.552 0-1-0.448-1-1v-10c0-0.552 0.448-1 1-1h3.586l7.707-7.707c0.286-0.286 0.716-0.372 1.090-0.217s0.617 0.519 0.617 0.924v26c0 0.404-0.244 0.769-0.617 0.924-0.124 0.051-0.254 0.076-0.383 0.076z"></path></svg>');
  --ico-mute: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 32"><path d="M13 30c-0.26 0-0.516-0.102-0.707-0.293l-7.707-7.707h-3.586c-0.552 0-1-0.448-1-1v-10c0-0.552 0.448-1 1-1h3.586l7.707-7.707c0.286-0.286 0.716-0.372 1.090-0.217s0.617 0.519 0.617 0.924v26c0 0.404-0.244 0.769-0.617 0.924-0.124 0.051-0.254 0.076-0.383 0.076z"></path></svg>');
  align-items: center;
  display: flex;
  width: 100%;
}
.c-rng--tomato {
  --circle-bgc: #FFF;
  --track-bgc: hsl(9, 20%, 85%);
  --track-fill: tomato;
}
.c-rng--darkcyan {
  --circle-bgc: #FFF;
  --track-bgc: hsl(180, 20%, 80%);
  --track-fill: darkcyan;
}
[data-icon] {
  --icon-bgc: #B0B0B0;
  --icon-w: 2rem;
  background-color: var(--icon-bgc);
  height: var(--icon-w);
  margin-top: 0.5rem;
  mask: no-repeat center/var(--icon-w) var(--icon);
  -webkit-mask: no-repeat center/var(--icon-w) var(--icon);
  width: var(--icon-w);
}
[data-icon="audio"] { --icon: var(--ico-audio); margin-left: 1rem }
[data-icon="mute"] { --icon: var(--ico-mute); }
</style>

<template>
  <div :class="`service`" @click="isCapabilitiesShow = !isCapabilitiesShow">
    <div :class="`on-of-teleported --${id}`" />
    <div class="service-info">
      <div :class="`service-ico-wrapper ${isDeviceOn || isDeviceOpen === true?'--active':''}`">
        <span :class="`mdi mdi-${ico?.name}`" />
      </div>
      <div :class="`service-name ${isTooBigLength && 'marquee'}`">
        <span>
          {{ name }}
        </span>
      </div>
    </div>
    <div v-if="capabilities?.length" v-show="isCapabilitiesShow" class="service-capabilities-list-wrapper">
      <the-modal
        :is-shown="isCapabilitiesShow"
        transition-fade-name="fade"
        transition-content-name="translate"
        bg-color=""
        place=".layout"
        backdrop-filter="blur(5px)"
      >
        <template #inner>
          <div ref="target" class="service-capabilities-modal">
            <div class="service-capabilities-modal__header">
              {{ name }}
            </div>
            <div class="service-capabilities-modal__body">
              <service-capabilities-structure>
                <template
                  v-for="item in capabilities"
                  :key="item.type"
                  #[item.type]
                >
                  <service-capability
                    :device-id="id.replace(/_ch[0-9]*/gm,'')"
                    :chanel="id.replace(/^[a-zA-Z0-9_.-]*_ch/gm,'')"
                    :instance="item.instance"
                    :range="item.range"
                    :reportable="item.reportable"
                    :retrievable="item.retrievable"
                    :type="item.type"
                    :device-type="type"
                  />
                </template>
              </service-capabilities-structure>
            </div>
          </div>
        </template>
      </the-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheModal from "~/components/shared/TheModal.vue"
import useIcoByDeviceType from "~/composables/useIcoByDeviceType"

export type Service = {
  id:string
  groupId:string|number
  name: string
  type:string
  capabilities?:{
    type: string
    retrievable: boolean
    reportable: boolean
    value: string
    instance: string
    range: {
      min: number
      max: number
      precision: number
    }
    hsv: {
      h: number
      s: number
      v: number
    }
  }[]
}
const props = defineProps<Service>()
const isTooBigLength = ref(false)
const isCapabilitiesShow = ref(false)
const isDeviceOn = ref(props.capabilities?.find(el => el.type === 'devices.capabilities.on_off')?.value)
const isDeviceOpen = ref(props.capabilities?.find(el => el.instance === 'open')?.value)
const target = ref(null)
const ico = useIcoByDeviceType(props.type)
onClickOutside(target, () => {
  isCapabilitiesShow.value = false
})
const newTempIco = () => {
  if (props.type.includes('devices.types.sensor')) {
    return 'access-point'
  }
  switch (props.type) {
    case 'devices.types.switch':
      return 'power-plug-outline'
    case 'devices.types.openable.lock':
      return 'lock'
    case 'devices.types.light':
      return 'lightbulb-variant-outline'
    case 'devices.types.thermostat':
      return 'home-thermometer-outline'
    case 'devices.types.openable.valve':
      return 'water-outline'
    default:
      return 'block-helper'
  }
}
function validateNameLength () {
  const element = document.querySelector('#service' + props.groupId + '_' + props.id)
  if (element) {
    const elementWidth = element.clientWidth
    const elementString = element.querySelector('.service-name')
    if (elementString) {
      const fontSize = Number.parseInt(window.getComputedStyle(elementString).fontSize) ?? 35
      if (fontSize * 1.3 < elementString?.clientHeight) {
        console.log('#service-' + props.id, fontSize * 1.3)
        isTooBigLength.value = true
      }
    }
  }
}
onMounted(() => {
  setTimeout(() => {
    // пока оставлю, не нравится реализация
    // validateNameLength()
  }, 1)
})

watch(props, (value) => {
  isDeviceOn.value = value.capabilities?.find(el => el.type === 'devices.capabilities.on_off')?.value
  isDeviceOpen.value = value.capabilities?.find(el => el.instance === 'open')?.value
}, { deep: true })
</script>

<style lang="scss">
@import "assets/styles/transitions.scss";

.service{
  cursor: pointer;
  width: min(30%, 186px);
  //padding: 8px 12px;
  padding-inline: 8px;
  padding-top: 20px;
  display: block;
  aspect-ratio: 1 / 1;
  border-radius: 24px;
  background: $bg-primary;
  box-shadow: 0px 0px 27px 0px $service-shadow-color;
  position: relative;
  @media screen and (max-width: 768px) {
    width: 45%;
    display: flex;
    flex-direction: column;
    aspect-ratio: auto;
    padding-bottom: 20px;
  }
  @media screen and (max-width: 560px) {
    width: 100%;

  }
  .on-of-teleported{
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
    position: relative;
    top: -5px;
    right: 4px;
  }
  .service-ico-wrapper{
    width: 88px;
    height: 88px;
    background-size: contain;
    background-repeat: no-repeat;
    display: block;
    margin-inline: auto;
    .mdi{
      font-size: 100px;
      transition: color .51s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.--active{
      .mdi{
        color: $color-active;
      }
    }
  }
  .service-info{
    //display: flex;
    //flex-direction: column;
    //justify-content: center;
    //align-items: center;
    width: 100%;
    //gap: 16px;
    .service-name {
      @include tool-item;
      text-align: center;
      margin-top: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow-y: hidden;
      &.marquee {
        overflow: hidden;
        width: 100%;
        position: relative;
        height: 1.1em;
          span {
            position: absolute;
            width: max-content;
            display: inline-block;
            animation: marquee 5s linear infinite alternate;
          }
      }
      @keyframes marquee {
        0%   { transform: translate(10%, 0); }
        100% { transform: translate(-40%, 0); }
      }
    }
  }
  .service-capabilities-list-wrapper{
    display: block;
    position: absolute;
    background: transparent;
    inset: 25px;
  }
}
.service-capabilities-modal{
  border-radius: 25px;
  padding: 24px;
  position: relative;
  width: clamp(21%, 300px, 95%);
  height: 80%;
  background: $bg-primary;
  &__toggle{
    position: absolute;
    top: 22px;
    right: 36px;
    z-index: 101;
    cursor: pointer;
  }
  &__header{
      @include capabilities-modal-header;
      text-align: center;
  }
  &__body{
    display: flex;
    flex-direction: column;
    gap:10px;
  }
}
</style>

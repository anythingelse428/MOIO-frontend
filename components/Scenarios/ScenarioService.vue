<template>
  <div ref="service" :class="`service --scenario ${selected&&'--active'}`" role="button" @mousedown.left="handleLeftMouse()">
    <div class="service-info">
      <div class="service-ico-wrapper">
        <icon :name="ico" size="30" />
      </div>
      <div class="service-name">
        <span>
          {{ name }}
        </span>
      </div>
    </div>
    <div v-if="isMounted && capabilities?.length >= 1 && !isPreview" class="service-capabilities-list-wrapper">
      <the-modal
        v-if="isMounted"
        :is-shown="isCapabilitiesShow"
        transition-fade-name="fade"
        transition-content-name="translate"
        bg-color=""
        backdrop-filter="blur(5px)"
      >
        <template #inner>
          <div ref="target" class="service-capabilities-modal" role="dialog">
            <div class="service-capabilities-modal__header">
              <span>
                {{ name }}
              </span>
            </div>
            <div class="service-capabilities-modal__body">
              <service-capabilities-structure>
                <template
                  v-for="item in capabilities"
                  :key="item.type"
                  #[item.type]
                >
                  <scenario-service-capability
                    :device-id="id.replace(/_ch[0-9]*/gm,'')"
                    :chanel="id.replace(/^[a-zA-Z0-9_.-]*_ch/gm,'')"
                    :instance="item.instance"
                    :range="item.range"
                    :reportable="item.reportable"
                    :retrievable="item.retrievable"
                    :type="item.type"
                    :device-type="type"
                    :hsv="item.hsv"
                    :value="item.value"
                    :icon="ico"
                    @update-bool-val="e=>{emit('update-capability',e)}"
                  />
                </template>
              </service-capabilities-structure>
            </div>
          </div>
        </template>
      </the-modal>
    </div>
    <icon
      v-if="!isPreview"
      name="delete"
      color="#D15151"
      size="20"
      class="--delete"
      @click="emit('left-mouse-click',props)"
    />
  </div>
</template>

<script setup lang="ts">
import { onLongPress } from '@vueuse/core'
import ScenarioServiceCapability from './ScenarioServiceCapability.vue'
import TheModal from "~/components/shared/TheModal.vue"
import useIcoByDeviceType from "~/composables/useIcoByDeviceType"
import { useGroupsStore } from "~/store/groups"
import Icon from "~/components/shared/Icon.vue"
import type { ServiceProps } from "~/components/Service/TheService.vue"

export type ScenarioService = {
  isPreview?:boolean
  selected?:boolean
}

const props = defineProps<ScenarioService & ServiceProps>()
const emit = defineEmits(['left-mouse-click', 'update-capability'])
const isMounted = ref(false)
const service = ref<HTMLDivElement | null>(null)
const isCapabilitiesShow = ref(false)
const target = ref(null)
const ico = props.deviceIcon?.name ?? useIcoByDeviceType(props.type).name
const isDeleteModalShow = ref(false)
const groupStore = useGroupsStore()

onClickOutside(target, (event) => {
  if (event.target instanceof HTMLElement && event.target?.classList?.value?.includes('modal__content')) {
    isCapabilitiesShow.value = false
    isDeleteModalShow.value = false
  }
})
function handleLeftMouse () {
  if (props.isPreview) {
    emit('left-mouse-click', props)
  }
  if (!props.isPreview) {
    isCapabilitiesShow.value = true
  }
}

onLongPress(service, () => {
  isCapabilitiesShow.value = true
}, { delay: 400 })



onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })
  }, 100)
})
onUnmounted(() => {
  window.removeEventListener('contextmenu', () => {})
})
</script>

<style lang="scss">
@import "assets/styles/components/service-capabilities-modal";
@import "assets/styles/components/scenario-service";
</style>

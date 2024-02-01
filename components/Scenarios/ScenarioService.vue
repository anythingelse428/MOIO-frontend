<template>
  <div ref="service" :class="`service ${selected&&'--active'}`" role="button">
    <div class="service-info" @mousedown.left="handleLeftMouse()">
      <div class="service-ico-wrapper">
        <span :class="`mdi mdi-${ico?.name}`" />
      </div>
      <div class="service-name">
        <span>
          {{ name }}
        </span>
      </div>
    </div>
    <div v-if="isMounted && capabilities && capabilities?.length>=1 && !isPreview" v-show="isCapabilitiesShow" class="service-capabilities-list-wrapper">
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
            <div class="mdi mdi-pencil" role="button" @click="isEdit=!isEdit" />
            <div class="service-capabilities-modal__header">
              <form v-if="isEdit" class="service-capabilities-modal__header --edited" @submit.prevent="setNewDeviceName()">
                <input v-model="newDeviceName" type="text">
                <button type="submit" class="service-capabilities-modal__submit-name">
                  <span class="mdi mdi-check" />
                </button>
              </form>
              <span v-show="!isEdit">
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
                    @update-bool-val="e=>emit('update-capability',e)"
                  />
                </template>
              </service-capabilities-structure>
              <!--              <div class="service-capabilities-modal__footer">-->
              <!--                <button class="service-capabilities-modal__action" @click="isDeleteModalShow = true">-->
              <!--                  Удалить устройство-->
              <!--                </button>-->
              <!--                <the-modal :is-shown="isDeleteModalShow" transition-content-name="translate" backdrop-filter="blur(5px)">-->
              <!--                  <template #inner>-->
              <!--                    <div ref="deleteModal" class="delete-device-modal" role="dialog">-->
              <!--                      <div class="delete-device-modal__header">-->
              <!--                        Вы уверерны, что хотите удалить устройство {{ name }}?-->
              <!--                      </div>-->
              <!--                      <div class="delete-device-modal__prompt">-->
              <!--                        <div class="delete-device-modal__prompt-item &#45;&#45;danger" role="button" @click="deleteDevice()">-->
              <!--                          Удалить-->
              <!--                        </div>-->
              <!--                        <div class="delete-device-modal__prompt-item" role="button" @click="isDeleteModalShow = false">-->
              <!--                          Отмена-->
              <!--                        </div>-->
              <!--                      </div>-->
              <!--                    </div>-->
              <!--                  </template>-->
              <!--                </the-modal>-->
              <!--              </div>-->
            </div>
          </div>
        </template>
      </the-modal>
    </div>
    <span v-if="!isPreview" class="mdi mdi-delete" @click="emit('left-mouse-click',props)" />
  </div>
</template>

<script setup lang="ts">
import { onLongPress } from '@vueuse/core'
import ScenarioServiceCapability from './ScenarioServiceCapability.vue'
import TheModal from "~/components/shared/TheModal.vue"
import useIcoByDeviceType from "~/composables/useIcoByDeviceType"
import { useDevicesStore } from "~/store/devices"
import { useGroupsStore } from "~/store/groups"
import { useCategoriesStore } from "~/store/categories"

export type Service = {
  id:string
  groupId:string|number
  name: string
  type:string
  isPreview?:boolean
  selected?:boolean
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
const emit = defineEmits(['left-mouse-click', 'update-capability'])
const isMounted = ref(false)
const service = ref<HTMLDivElement | null>(null)
const isCapabilitiesShow = ref(false)
const target = ref(null)
const ico = useIcoByDeviceType(props.type)
const isEdit = ref(false)
const isDeleteModalShow = ref(false)
const newDeviceName = ref(props.name)
const deviceStore = useDevicesStore()
const groupStore = useGroupsStore()
const categoriesStore = useCategoriesStore()

onClickOutside(target, (event) => {
  if (event.target?.className?.includes('modal__content')) {
    isCapabilitiesShow.value = false
    isDeleteModalShow.value = false
  }
})
function handleLeftMouse () {
  if (props.isPreview === true) {
    emit('left-mouse-click', props)
  }
  if (props.isPreview === false) {
    isCapabilitiesShow.value = true
  }
}

onLongPress(service, () => {
  isCapabilitiesShow.value = true
}, { delay: 400 })

async function setNewDeviceName () {
  await deviceStore.changeName(props.id, newDeviceName.value)
  isEdit.value = false
  if (Number.isInteger(Number(props.groupId))) {
    await categoriesStore.getDevicesByCategoryId(props.groupId, groupStore.currentHome)
  } else {
    await groupStore.getGroupById(groupStore.currentGroup.id)
  }
}

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

</style>

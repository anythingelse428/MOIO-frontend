<template>
  <div ref="service" :class="`service`" @mousedown.left="turnOnDevice()" @mousedown.right="isCapabilitiesShow = true">
    <div class="service-info">
      <div :class="`service-ico-wrapper ${isDeviceOn === true || isDeviceOpen === true || String(isDeviceOpen)?.indexOf('open') >-1 ? '--active':''}`">
        <span :class="`mdi mdi-${ico?.name}`" />
      </div>
      <div class="service-name">
        <span>
          {{ name }}
        </span>
      </div>
    </div>
  </div>
  <div v-if="isMounted&&capabilities&&capabilities?.length>=1" v-show="isCapabilitiesShow" class="service-capabilities-list-wrapper">
    <the-modal
      v-if="isMounted"
      :is-shown="isCapabilitiesShow"
      transition-fade-name="fade"
      transition-content-name="translate"
      bg-color=""
      backdrop-filter="blur(5px)"
    >
      <template #inner>
        <div ref="target" class="service-capabilities-modal">
          <div class="mdi mdi-pencil" @click="isEdit=!isEdit" />
          <div class="service-capabilities-modal__header">
            <form v-if="isEdit" class="service-capabilities-modal__header --edited" @submit.prevent="setNewDeviceName()">
              <input v-model="newDeviceName" type="text">
              <input type="submit" value="Сохранить">
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
                <service-capability
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
                  @update-bool-val="turnOnDevice()"
                />
              </template>
            </service-capabilities-structure>
          </div>
          <div class="service-capabilities-modal__footer">
            <button class="service-capabilities-modal__action" @click="isDeleteModalShow = true">
              Удалить устройство
            </button>
            <the-modal :is-shown="isDeleteModalShow" transition-content-name="translate" backdrop-filter="blur(5px)">
              <template #inner>
                <div ref="deleteModal" class="delete-device-modal">
                  <div class="delete-device-modal__header">
                    Вы уверерны, что хотите удалить устройство {{ name }}?
                  </div>
                  <div class="delete-device-modal__prompt">
                    <div class="delete-device-modal__prompt-item --danger" @click="deleteDevice()">
                      Удалить
                    </div>
                    <div class="delete-device-modal__prompt-item" @click="isDeleteModalShow = false">
                      Отмена
                    </div>
                  </div>
                </div>
              </template>
            </the-modal>
          </div>
        </div>
      </template>
    </the-modal>
  </div>
</template>

<script setup lang="ts">
import { onLongPress } from '@vueuse/core'

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
const isMounted = ref(false)
const service = ref<HTMLDivElement | null>(null)
const isCapabilitiesShow = ref(false)
const isDeviceOn = ref(props.capabilities?.find(el => el.type === 'devices.capabilities.on_off')?.value)
const isDeviceOpen = ref(props.capabilities?.find(el => el.instance === 'open' || el.type === 'devices.types.openable.garage')?.value)
const target = ref(null)
const deleteModal = ref(null)
const ico = useIcoByDeviceType(props.type)
const isEdit = ref(false)
const isDeleteModalShow = ref(false)
const newDeviceName = ref(props.name)
const deviceStore = useDevicesStore()
const groupStore = useGroupsStore()
const categoriesStore = useCategoriesStore()

onClickOutside(target, (event) => {
  isCapabilitiesShow.value = false
  isDeleteModalShow.value = false
}, { ignore: [deleteModal] })
onClickOutside(deleteModal, () => {
  isDeleteModalShow.value = false
})

onLongPress(service, () => {
  isCapabilitiesShow.value = true
}, { delay: 400 })

async function turnOnDevice () {
  const oldValue:boolean|string = props.capabilities?.find(el => el.type.includes('on_off') || (el.type.includes('range') && el.instance.includes('open')))?.value
  const newValue = oldValue === false || String(oldValue)?.includes('close')
  service.value.classList.add('--pending')
  service.value.setAttribute('disabled', 'true')
  await deviceStore.changeOnOf({ clientId: 'relay', deviceId: props.id.replace(/_ch[0-9]*/gm, ''), chanel: props.id.replace(/^[a-zA-Z0-9_.-]*_ch/gm, ''), onOfStatus: newValue })
  setTimeout(async () => {
    // TODO дождаться сокетов, переписать логику
    // 1. шлем запрос
    // 2. получаем ответ (сейчас время ответа задано таймаутом, должен быть сокет)
    // 3. получив ответ снимаем скелетон
    if (typeof props.groupId === 'string' && !Number.isInteger(Number(props.groupId))) {
      await groupStore.getGroupById(props.groupId)
    }
    if (Number.isInteger(Number(props.groupId))) {
      await categoriesStore.getDevicesByCategoryId(props.groupId, groupStore.currentHome)
    }
    service.value.classList.remove('--pending')
    service.value.setAttribute('disabled', 'false')
  }, 3000)
}
async function deleteDevice () {
  await deviceStore.deleteDevice(props.id)
}
async function setNewDeviceName () {
  await deviceStore.changeName(props.id, newDeviceName.value)
  isEdit.value = false
  if (Number.isInteger(Number(props.groupId))) {
    await categoriesStore.getDevicesByCategoryId(props.groupId, groupStore.currentHome)
  } else {
    await groupStore.getGroupById(groupStore.currentGroup.id)
  }
}

watch(props, (value) => {
  isDeviceOn.value = value.capabilities?.find(el => el.type === 'devices.capabilities.on_off')?.value
  isDeviceOpen.value = value.capabilities?.find(el => el.instance === 'open')?.value
}, { deep: true })

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
@import "assets/styles/components/service";
@import "assets/styles/components/service-capabilities-modal";
@import "assets/styles/components/service-delete-modal";

</style>

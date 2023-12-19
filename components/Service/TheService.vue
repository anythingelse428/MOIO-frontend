<template>
  <div :class="`service`" @click="isCapabilitiesShow = true">
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
import TheModal from "~/components/shared/TheModal.vue"
import useIcoByDeviceType from "~/composables/useIcoByDeviceType"
import { useDevicesStore } from "~/store/devices"
import { useGroupsStore } from "~/store/groups"
import { useCategoriesStore } from "~/store/categories"
const isMounted = ref(false)
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
const isDeviceOpen = ref(props.capabilities?.find(el => el.instance === 'open' || el.type === 'devices.types.openable.garage')?.value)
const target = ref(null)
const deleteModal = ref(null)
const ico = useIcoByDeviceType(props.type)
const isEdit = ref(false)
const isDeleteModalShow = ref(false)
const newDeviceName = ref(props.name)
const deviceStore = useDevicesStore()

onClickOutside(target, (event) => {
  isCapabilitiesShow.value = false
  isDeleteModalShow.value = false
}, { ignore: [deleteModal] })
onClickOutside(deleteModal, () => {
  isDeleteModalShow.value = false
})
onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})
const router = useRouter()

async function deleteDevice () {
  await deviceStore.deleteDevice(props.id)
}
deviceStore.$onAction(({ after, store }) => {
  store.$onAction((c) => {
    if (c?.name.indexOf('changeName') > -1 || c?.name.indexOf('deleteDevice') > -1) {
      // return updateService()
    }
  })
})
function setNewDeviceName () {
  deviceStore.changeName(props.id, newDeviceName.value)
  isEdit.value = false
}

watch(props, (value) => {
  isDeviceOn.value = value.capabilities?.find(el => el.type === 'devices.capabilities.on_off')?.value
  isDeviceOpen.value = value.capabilities?.find(el => el.instance === 'open')?.value
}, { deep: true })
</script>

<style lang="scss">
@import "assets/styles/components/service";
@import "assets/styles/components/service-capabilities-modal";
@import "assets/styles/components/service-delete-modal";

</style>

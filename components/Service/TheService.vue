<template>
  <div :class="`service`" @click="isCapabilitiesShow = !isCapabilitiesShow">
    <div :class="`on-of-teleported --${id}`" />
    <div class="service-info">
      <div :class="`service-ico-wrapper ${isDeviceOn === true || isDeviceOpen === true || isDeviceOpen?.indexOf('open') >-1 ? '--active':''}`">
        <span :class="`mdi mdi-${ico?.name}`" />
      </div>
      <div :class="`service-name ${isTooBigLength && 'marquee'}`">
        <span>
          {{ name }}
        </span>
      </div>
    </div>
    <div v-if="isMounted&&capabilities&&capabilities?.length>=1" v-show="isCapabilitiesShow" class="service-capabilities-list-wrapper">
      <the-modal
        v-if="isMounted"
        :is-shown="isCapabilitiesShow"
        transition-fade-name="fade"
        transition-content-name="translate"
        bg-color=""
        place=".layout"
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
                  />
                </template>
              </service-capabilities-structure>
            </div>
            <div class="service-capabilities-modal__footer">
              <button class="service-capabilities-modal__action" @click="isDeleteModalShow = true">
                Удалить устройство
              </button>
              <the-modal :is-shown="isDeleteModalShow" place=".layout" transition-content-name="translate" backdrop-filter="blur(5px)">
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
const groupStore = useGroupsStore()
const categoryStore = useCategoriesStore()
onClickOutside(target, (event) => {
  if (event.srcElement?.className !== 'delete-device-modal__prompt-item') {
    isCapabilitiesShow.value = false
    isDeleteModalShow.value = false
  }
})
onClickOutside(deleteModal, () => {
  isDeleteModalShow.value = false
})
onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})
const router = useRouter()
async function updateService () {
  const path = router.currentRoute.value.fullPath
  if (path.includes('/group')) {
    await groupStore.getDevicesByGroupId(router.currentRoute.value.params.id)
  }
  if (path.includes('/category')) {
    await categoryStore.getDevicesByCategoryId(router.currentRoute.value.params.id, groupStore.currentHome)
  }
}
async function deleteDevice () {
  await deviceStore.deleteDevice(groupStore.currentHome)
}
deviceStore.$onAction(({ after, store }) => {
  store.$onAction((c) => {
    if (c?.name.indexOf('changeName') > -1 || c?.name.indexOf('deleteDevice') > -1) {
      return updateService()
    }
    if (props.id.includes(c.args[0]?.deviceId) && (c?.name.includes('OnOf') || c?.name.includes('OpenClose'))) {
      for (const k of Object.keys(groupStore.devices)) {
        if (groupStore.devices[k].find(el => el.id.includes(props.id))?.capabilities?.find(el => el.type.includes('on_of'))?.value) {
          groupStore.devices[k].find(el => el.id.includes(props.id)).capabilities.find(el => el.type.includes('on_of')).value = !groupStore.devices[k].find(el => el.id.includes(props.id))?.capabilities.find(el => el.type.includes('on_of'))?.value
        }
      }
    }
  })
})
function setNewDeviceName () {
  deviceStore.changeName(props.id, newDeviceName.value)
  updateService()
  isEdit.value = false
}


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
.delete-device-modal{
  border-radius: 25px;
  padding: 36px 16px;
  position: relative;
  overflow-y: auto;
  background: $bg-primary;
  display: flex;
  flex-direction: column;
  max-width: min(95%,395px);
  &__header {
    @include capabilities-modal-header;
    text-align: center;
    display: inline-block;
    right: 0;
    left: 0;
    color: $color-active;
  }
  &__prompt{
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
  }
  &__prompt-item{
    cursor: pointer;
    display: inline-block;
    padding: 8px 12px;
    width: fit-content;
    @include capabilities-modal-header;
    background: $color-active;
    border-radius: 16px;
    &.--danger{
      background: #D15151;
    }
  }
}
.service-capabilities-modal{
  border-radius: 25px;
  padding: 24px;
  position: relative;
  width: clamp(21%, 300px, 95%);
  height: 85vh;
  overflow-y: auto;
  background: $bg-primary;
  display: flex;
  flex-direction: column;
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
    display: inline-block;
    position: absolute;
    right: 0;
    left: 0;
    &.--edited{
      display: flex;
      width: calc(100% - (24px * 2) - 32px);
      justify-content: space-between;
      margin-inline: auto;
      input{
        background: $bg-primary;
        outline: none;
        border: none;
        font-size: 20px;
        margin-left: 12px;
        border-bottom: 1px solid;
        &[type="submit"]{
          background: $color-active;
          padding-inline: 12px;
          border-radius: 8px;
          border: 0;
          margin-left: 12px;
        }
      }
    }
  }
  .mdi.mdi-pencil{
    font-size: 24px;
    cursor: pointer;
    display: inline-block;
    position: relative;
    z-index: 2;
    width: fit-content;
  }
  &__body{
    display: flex;
    flex-direction: column;
    gap:10px;
  }
  &__footer{
    display: flex;
    min-height: 260px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
    bottom: 0;
    position: relative;
    flex: 1;
  }

  &__action {
    background: $device-action;
    width: 100%;
    border: none;
    outline: none;
    text-align: center;
    @include capabilities-modal-header;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
  }
}
</style>

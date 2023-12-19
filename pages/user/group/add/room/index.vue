<template>
  <div class="add-group">
    <h1 class="add-group__header">
      Добавить комнату
    </h1>
    <form method="post" class="add-group__form" @submit.prevent="addGroup()">
      <div class="add-group__input-group">
        <label for="group" class="add-group__label">Введите название комнаты</label>
        <input id="group" v-model="name"  type="text" name="group" class="add-group__input" required placeholder="Название комнаты">
      </div>
      <div v-if="existingFloors()?.length" class="add-group__input-group">
        <label for="floor" class="add-group__label">Выберите этаж</label>
        <div v-for="floors in existingFloors()" :key="floors.id" class="add-group__input-wrapper">
          <input id="floor" v-model="floor" :value="floors.id" type="radio" name="floor" class="add-group__input">
          <span class="floor-label">{{ floors.name }}</span>
        </div>
      </div>
      <div v-if="existingHouses()?.length" class="add-group__input-group">
        <label for="house" class="add-group__label">Выберите дом </label>
        <div v-for="houses in existingHouses()" :key="houses.id" class="add-group__input-wrapper">
          <input id="house" v-model="house" :value="houses.id" type="radio" name="house" class="add-group__input">
          <span class="floor-label">{{ houses.name }}</span>
        </div>

      </div>
      <div v-if="house?.length>10" class="add-group-available-devices">
        <h2 class="add-group-available-devices__header">
          {{existingDevices?.length?
          'Доступные устройства':
            'Устройства уже распределены по комнатам или не найдены'
          }}
        </h2>
        <div class="add-group-available-devices__list" v-if="existingDevices?.length>0">
          <div
            v-for="device in existingDevices"
            :key="device.id"
            class="add-group-available-devices__list-item"
          >
            <label for="device">{{ device?.name }}</label>
            <div class="add-group-available-devices__list-item-checkbox-wrapper">
              <input id="device" type="checkbox" name="device" @change="(e)=>setDevices(e,{id:device.id,name:device.name})" :checked="devices.findIndex(el=>el.id === device.id)>-1">
              <span class="add-group-available-devices__list-item-checkbox-mask" />
            </div>
          </div>
        </div>
      </div>
        <div class="add-group__preview-wrapper">
      <div class="add-group__preview" v-if="previewData.name.length">
        <div class="add-group__preview-section">
          <div class="add-group__preview-section-title">
            Название комнаты
          </div>
          <div class="add-group__preview-section-value">
          {{previewData.name}}
          </div>
        </div>
        <div class="add-group__preview-section">
          <div class="add-group__preview-section-title">
            Устройства комнаты
          </div>
          <div class="add-group__preview-section-value" v-if="previewData.devices?.length">
            <div class="add-group__preview-section-device" v-for="item in previewData.devices" :key="item.id">
              {{item?.name}}
            <span class="mdi mdi-delete" @click="(e)=>setDevices(e,{id:item.id,name:item.name})"></span>
            </div>
          </div>
          <div class="add-group__preview-section-value" v-else>
            Нет выбранных устройств
          </div>
        </div>
        </div>
      </div>
      <div class="add-group__submit-wrapper">
        <input type="submit" class="add-group__submit" value="Добавить">
      </div>
    </form>
  </div>
</template>


<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"
import { useDevicesStore } from "~/store/devices"
import { useUserStore } from "~/store/user"

const name = ref('')
const floor = ref()
const house = ref('Выбрать')
const devices = ref<{ id: string, name:string }[]>([])
const existingFloors = ref()
const existingHouses = ref()
const existingDevices = ref()
const homeData = ref()
const groupStore = useGroupsStore()
existingFloors.value = () => groupStore.floors
existingHouses.value = () => groupStore.uppperGroups.filter(el=>el.groupCreatorId === useUserStore().id)
let previewData = ref({
  name: name,
  devices: devices
})

function setDevices (e:Event, data:{ id: string, name:string }) {
  const isChecked = (<HTMLInputElement>event.target)?.checked
  const isSelected = devices.value?.find(el=>el?.id === data.id)
  if (isChecked && !isSelected){
    devices.value?.push(data)
  }
  if (!isChecked && isSelected){
    const idx = devices.value.findIndex(el=>el.id === data.id)
    devices.value?.splice(idx,1)
  }
}
async function getDevicesByGroupId () {
  existingDevices.value = []
  await groupStore.getDevicesByGroupId(house.value)
  for (const category of Object.values(groupStore.devices)) {
    existingDevices.value.push(...category)
  }
}
async function addGroup () {
  const devicesArrayId = devices.value.map(el=>el.id)
  const parent = floor.value||house.value
  const response = await groupStore.addRoom(name.value,parent,devicesArrayId)
  console.log(devicesArrayId)
}
watch(house, () => {
  getDevicesByGroupId()
})
</script>
<style lang="scss">
@import "assets/styles/page/_user-add-room";
</style>

<template>
  <div class="add-group">
    <h1 class="add-group__header">
      Добавить этаж
    </h1>
    <form method="post" class="add-group__form" @submit.prevent="addGroup()">
      <div class="add-group__input-group">
        <label for="group" class="add-group__label">Введите название этажа</label>
        <input id="group" v-model="name"  type="text" name="group" class="add-group__input" required placeholder="Название комнаты">
      </div>
      <div v-if="existingHouses.length" class="add-group__input-group">
        <label for="house" class="add-group__label">Выберите дом </label>
        <custom-select :options="selectData" :current-value="house" @custom-select="(e)=>house = e" select-name="Выберите дом"></custom-select>
      </div>
      <div v-if="house?.length>10 && previewData.name.length" class="add-group-available-devices">
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
                <input id="device" type="checkbox" name="device" @change="(e)=>setItem(e, devices, {id:device.id,name:device.name})" :checked="devices.findIndex(el=>el.id === device.id)>-1">
                <span class="add-group-available-devices__list-item-checkbox-mask" />
              </div>
            </div>
          </div>
      </div>
      <div v-if="house?.length>10 && previewData.name.length" class="add-group-available-devices">
        <h2 class="add-group-available-devices__header">
          {{existingRooms?.length?
            'Доступные комнаты':
            'Комнаты уже распределены по этажам или не найдены'
          }}
        </h2>
       <div class="add-group-available-devices__list" v-if="existingRooms?.length>0">
        <div
            v-for="room in existingRooms"
            :key="room.id"
            class="add-group-available-devices__list-item"
        >
          <label for="device">{{ room?.name }}</label>
          <div class="add-group-available-devices__list-item-checkbox-wrapper">
            <input id="device" type="checkbox" name="device" @change="(e)=>setItem(e, rooms,{id:room.id,name:room.name})" :checked="rooms.findIndex(el=>el.id === room.id)>-1">
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
              Устройства этажа
            </div>
            <div class="add-group__preview-section-value" v-if="previewData.devices?.length">
              <div class="add-group__preview-section-device" v-for="item in previewData.devices" :key="item.id">
                {{item?.name}}
              <span class="mdi mdi-delete" @click="(e)=>setItem(e,devices,{id:item.id,name:item.name})"></span>
              </div>
            </div>
            <div class="add-group__preview-section-value" v-else>
              Нет выбранных устройств
            </div>
          </div>
          <div class="add-group__preview-section">
            <div class="add-group__preview-section-title">
              Комнаты на этаже
            </div>
            <div class="add-group__preview-section-value" v-if="previewData.rooms?.length">
              <div class="add-group__preview-section-device" v-for="item in previewData.rooms" :key="item.id">
                {{item?.name}}
              <span class="mdi mdi-delete" @click="(e)=>setItem(e,rooms,{id:item.id,name:item.name})"></span>
              </div>
            </div>
            <div class="add-group__preview-section-value" v-else>
              Нет выбранных комнат
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
import { useUserStore } from "~/store/user"
import CustomSelect from "~/components/shared/CustomSelect.vue"
import type { Ref } from "vue"

const groupStore = useGroupsStore()
const name = ref('')
const house = ref(groupStore.currentHome)
const devices = ref<{ id: string, name:string }[]>([])
const rooms = ref<{ id: string, name:string }[]>([])
const existingRooms = ref<{id:string,name:string}[]>()
const existingHouses = ref()
const existingDevices = ref()
const upperGroups = ref(groupStore.uppperGroups)
existingHouses.value =  upperGroups.value.filter(el=>el.groupCreatorId === useUserStore().id)
const selectData = ref(existingHouses.value.reduce((acc:{description:string,value:string}[], curr)=>[...acc,{description:curr.name,value:curr.id}],[]))
const previewData = ref({
  name: name,
  devices: devices,
  rooms: rooms
})
async function getRoomsByHomeId(){
  const {inverseParent} = await groupStore.getGroupById(house.value)
  existingRooms.value = inverseParent.map(el=>{return {
    id: el.id,
    name: el.name,
  }})
}
getRoomsByHomeId()
function setItem (e:Event, target:any, data:{ id: string, name:string }) {
  const isChecked = (<HTMLInputElement>event.target)?.checked
  const isSelected = target?.find(el=>el?.id === data.id)
  if (isChecked && !isSelected){
    target?.push(data)
  }
  if (!isChecked && isSelected){
    const idx = target.findIndex(el=>el.id === data.id)
    target?.splice(idx,1)
  }
}
async function getDevicesByGroupId () {
  existingDevices.value = []
  const { devices } = await groupStore.getGroupById(house.value)
  existingDevices.value = devices
}
getDevicesByGroupId()
async function addGroup () {
  const devicesArrayId = devices.value.map(el=>el.id)
  const roomsArrayId = rooms.value.map(el=>el.id)
  await groupStore.addRoom(name.value,2, house.value,devicesArrayId.length>0?devicesArrayId:undefined,roomsArrayId.length>0?roomsArrayId:undefined)
//   TODO отправить пользователя в свежесозаднную комнату. Будет сделано после рефакторинга бека
}
watch(house, () => {
  getDevicesByGroupId()
  selectData.value = existingHouses.value.reduce((acc:{description:string,value:string}[], curr)=>[...acc,{description:curr.name,value:curr.id}],[])
})
</script>
<style lang="scss">
@import "assets/styles/page/_user-add-room";
</style>

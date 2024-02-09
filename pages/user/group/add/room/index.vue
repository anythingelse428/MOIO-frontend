<template>
  <div class="add-group">
    <loader-screen :is-loading="isLoading"/>
    <h1 class="add-group__header">
      Добавить комнату
    </h1>
    <form method="post" class="add-group__form" @submit.prevent="addGroup()">
      <div class="add-group__input-group">
        <label for="group" class="add-group__label">Введите название комнаты</label>
        <input id="group" v-model="name"  type="text" name="group" class="add-group__input" required placeholder="Название комнаты">
      </div>
      <div v-if="existingHouses?.length" class="add-group__input-group">
        <label for="house" class="add-group__label">Выберите дом </label>
        <custom-select :options="selectData" :current-value="house" @custom-select="(e)=>house = e" select-name="Выберите дом"></custom-select>
      </div>
      <div v-if="existingFloors?.length>0" class="add-group__input-group">
        <label for="floor" class="add-group__label">Выберите этаж</label>
        <div v-for="floors in existingFloors" :key="floors.id" class="add-group__input-wrapper">
          <input id="floor" v-model="floor" :value="floors.id" type="radio" name="floor" class="add-group__input">
          <span class="floor-label">{{ floors.name }}</span>
        </div>
      </div>
      <div v-if="house?.length>1 && name.length" class="add-group-available-devices">
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
              <input id="device" type="checkbox" name="device" @change="(e)=>setItem(e,devices,{id:device.id,name:device.name})" :checked="devices.findIndex(el=>el.id === device.id)>-1">
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
              <icon
                  name="delete"
                  color="#D15151"
                  size="20"
                  @click="(e)=>setItem(e,devices,{id:item.id,name:item.name})"
              />

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
import { useUserStore } from "~/store/user"
import CustomSelect from "~/components/shared/CustomSelect.vue"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import Icon from "~/components/shared/Icon.vue"

const groupStore = useGroupsStore()
const isLoading = ref(false)
const {floors, uppperGroups} = storeToRefs(groupStore)
const name = ref('')
const floor = ref()
const house = ref(groupStore.currentHome)
const devices = ref<{ id: string, name:string }[]>([])
const existingFloors = ref(floors)
const existingHouses = ref()
const existingDevices = ref()
existingFloors.value = floors
existingHouses.value = uppperGroups.value.filter(el=>el.groupCreatorId === useUserStore().id)
let previewData = ref({
  name: name,
  devices: devices
})
const selectData = ref(existingHouses.value.reduce((acc:{description:string,value:string}[], curr)=>[...acc,{description:curr.name,value:curr.id}],[]))

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
  isLoading.value = true
  existingDevices.value = []
  await groupStore.getDevicesByGroupId(house.value)
  for (const category of Object.values(groupStore.devices)) {
    existingDevices.value.push(...category)
  }
  isLoading.value = false
}
getDevicesByGroupId()
async function addGroup () {
  isLoading.value = true
  const devicesArrayId = devices.value.map(el=>el.id)
  const parent = floor.value||house.value
  await groupStore.addRoom(name.value,3,parent,devicesArrayId,undefined)
  isLoading.value = false
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

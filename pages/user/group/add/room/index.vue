<template>
  <div class="add-group">
    <h1 class="add-group__header">
      Добавить комнату
    </h1>
    <form method="post" class="add-group__form" @submit.prevent="addGroup()">
      <div class="add-group__input-group">
        <label for="group" class="add-group__label">Введите название команты</label>
        <input id="group" v-model="name" type="text" name="group" class="add-group__input" required placeholder="Название комнаты">
      </div>
      <div v-if="existingFloors()?.length" class="add-group__input-group">
        <label for="floor" class="add-group__label">Выберите этаж</label>
        <div v-for="floors in existingFloors()" :key="floors.id" class="add-group__input-wrapper">
          <input id="floor" v-model="floor" :value="floors.id" type="radio" name="floor" class="add-group__input" required>
          <span class="floor-label">{{ floors.name }}</span>
        </div>
      </div>
      <div v-if="existingHouses()?.length" class="add-group__input-group">
        <label for="floor" class="add-group__label">Выберите дом </label>
        <select v-model="house" class="add-group__select">
          <option v-for="houses in existingHouses()" :key="houses.id" :value="houses.id">
            {{ houses.name }}
          </option>
        </select>
      </div>
      <div v-if="existingDevices?.length" class="add-group-available-devices">
        <h2 class="add-group-available-devices__header">
          Доступные устройства
        </h2>
        <div class="add-group-available-devices__list">
          <div
            v-for="device in existingDevices"
            :key="device.id"
            class="add-group-available-devices__list-item"
          >
            <label for="device">{{ device?.name }}</label>
            <div class="add-group-available-devices__list-item-checkbox-wrapper">
              <input id="device" type="checkbox" name="device" @input="(e)=>setDevices(e,device.id)">
              <span class="add-group-available-devices__list-item-checkbox-mask" />
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

const name = ref('')
const floor = ref()
const house = ref('Выбрать')
const devices = ref([])
const existingFloors = ref()
const existingHouses = ref()
const existingDevices = ref()
const homeData = ref()
const groupStore = useGroupsStore()
existingFloors.value = () => groupStore.floors
existingHouses.value = () => groupStore.houses

function setDevices (e:Event, id:string) {
  const isChecked = (<HTMLInputElement>event.target).checked
  const isSelected = devices.value.find(el=>el === id)
  if (isChecked && !isSelected){
    devices.value.push(id)
  }
  if (!isChecked && isSelected){
    const idx = devices.value.findIndex(el=>el === id)
    devices.value.splice(idx,1)
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
  const response = await groupStore.addGroup(name.value)
  console.log(response)
}
watch(house, () => {
  getDevicesByGroupId()
})
</script>

<style lang="scss">
.add-group{
  &__header{
    @include section-header;
    width: 100%;
    text-align: center;
  }
  &__form{
    margin-top:40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap:40px;
  }
  &__input-group{
    display: flex;
    align-items: flex-start;
    gap: 24px 8px;
    flex-wrap: wrap;
    width: min(95%, 387px);
    align-content: flex-start;
  }
  &__label{
    @include tool-item;
    font-weight: 400;
    width: 100%;
  }
  &__input{
    width: 100%;
    &[type="text"]{
      @include tool-item;
      font-weight: 600;
      border: none;
      outline: none;
      background-color: $settings-color;
      padding: 12px 20px;
      border-radius: 16px;
    }
    &-wrapper{
        padding: 8px 16px;
      position: relative;
        background-color: $settings-color;
        border-radius: 15px;
      .floor-label{
      box-shadow: 0px 0px 6 px 0px $color-active;
        font-size: 24px;
        font-weight: 400;
        position: relative;
        inset: 0;
      }
    }
    &[type="radio"]{
      position: absolute;
      inset: 0;
      opacity: 0;
      z-index: 1;
    }
    &[type="radio"]:checked ~ .floor-label{
      background: $color-active;
    }
  }
  &__select{
    background: $settings-color;
    color: $color-primary;
    padding: 12px;
    border-radius: 15px;
    width: 100%;
  }
  &__submit-wrapper{
    width: 100%;
  }
  &__submit{
    display: block;
    margin-inline: auto;
    font-size: 25px;
    font-weight: 600;
    padding: 4px 12px;
    background: $color-active;
    border: 0;
    color: $bg-primary;
    border-radius: 15px;
  }
  .add-group-available-devices{
    width: 100%;
    display: flex;
    flex-direction: column;
    &__header{
      text-align: center;
      @include header-submenu-item;
    }
    &__list{
      width: min(100%,678px);
    }
  }
}
</style>

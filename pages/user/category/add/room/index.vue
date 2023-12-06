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
      <div class="add-group-available-devices" />
      <input type="submit" class="add-group__submit" value="Добавить группу">
    </form>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"
import { useDevicesStore } from "~/store/devices"

const name = ref('')
const floor = ref()
const house = ref('Выбрать')
const existingFloors = ref()
const existingHouses = ref()
const existingDevices = ref()
const homeData = ref()
const groupStore = useGroupsStore()
const devicesStore = useDevicesStore()
existingFloors.value = () => groupStore.floors
existingHouses.value = () => groupStore.houses
await devicesStore.getAllDevices()
existingDevices.value = devicesStore.devices
async function addGroup () {
  const response = await groupStore.addGroup(name.value)
  console.log(response)
}
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
      position: relative;
      .floor-label{
      box-shadow: 0px 0px 6 px 0px $color-active;
        font-size: 24px;
        font-weight: 400;
        position: relative;
        padding: 8px 16px;
        inset: 0;
        background-color: $settings-color;
        border-radius: 15px;
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
}
</style>

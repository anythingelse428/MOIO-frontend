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
          <span class="floor-label">{{ floors.name }}</span>
          <input id="floor" v-model="floor" :value="floors.id" type="radio" name="floor" class="add-group__input" required>
        </div>
      </div>
      <div v-if="existingHouses()?.length" class="add-group__input-group">
        <label for="floor" class="add-group__label">Выберите дом</label>
        <select v-model="house">
          <option v-for="houses in existingHouses()" :key="houses.id" :value="houses.id">
            {{ houses.name }}
          </option>
        </select>
      </div>
      <input type="submit" class="add-group__submit" value="Добавить группу">
    </form>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"

const name = ref('')
const floor = ref()
const house = ref()
const existingFloors = ref()
const existingHouses = ref()
const homeData = ref()
const groupStore = useGroupsStore()
existingFloors.value = () => groupStore.floors
existingHouses.value = () => groupStore.houses
console.log(groupStore.floors)
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
    flex-direction: column;
    align-items: start;
    gap:8px;
  }
  &__label{
    @include tool-item;
    font-weight: 400;
  }
  &__input{
    &[type="text"]{
      @include tool-item;
      font-weight: 400;
      border: none;
      outline: none;
      background-color: $settings-color;
    }
    &-wrapper{
      width: 56px;
      height: 47px;
      position: relative;
      .floor-label{
        background-color: $settings-color;
        font-size: 24px;
        font-weight: 400;
        position: absolute;
        inset: 0;
        border-radius: 15px;
      }
    }
    &[type="radio"]{
      position: relative;
      inset: 0;
      opacity: 0;
    }
    &[type="radio"]:checked ~ .floor-label{
      background: $color-active;
    }
  }
}
</style>

<template>
  <div class="header-content">
    <button class="header-button" @click="isAddMenuShow = !isAddMenuShow">
      <span class="mdi mdi-plus-circle-outline" />
      <transition name="fade">
        <header-menu v-show="isAddMenuShow" ref="addMenu" :items="addMenuItems" @click="isAddMenuShow=false" />
      </transition>
    </button>
    <div class="header-content__menu-container">
      <button class="header-button" @click="isSettingsMenuShow = !isSettingsMenuShow">
        <span class="mdi mdi-dots-horizontal" />
      </button>
      <transition name="fade">
        <header-menu v-show="isSettingsMenuShow" ref="settingsMenu" :items="[...settingsMenuItems,...houses]" @click="isSettingsMenuShow=false" />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"

const addMenuItems = [
  {
    ico: "plus-box-outline",
    title: "Добавить сценарий",
    url: '/user/group/add',
  },
  {
    icon: "home-automation",
    name: "Добавить автоматизацию",
    url: '/user/group/add',
  },
  {
    icon: "cube-outline",
    name: "Добавить комнату",
    url: '/user/group/add/room',
  },
  {
    icon: "account-outline",
    name: "Добавить людей",
    url: '/user/group/add',
  },
]
const settingsMenuItems = [
  {
    icon: "information",
    name: "Обогреватель (офис) нет связи",
    url: '/',
  },
  {
    icon: "cog",
    name: "Настройки дома",
    url: '/',
  },
]
const groupsStore = useGroupsStore()
await groupsStore.getHouses()
let houses = groupsStore.houses
groupsStore.$onAction(({ after }) => {
  after(() => {
    houses = groupsStore.houses
  })
})
const isAddMenuShow = ref(false)
const isSettingsMenuShow = ref(false)
const addMenu = ref(null)
const settingsMenu = ref(null)
onClickOutside(addMenu, (e) => {
  isAddMenuShow.value = false
})
onClickOutside(settingsMenu, (e) => {
  isSettingsMenuShow.value = false
})
</script>

<style lang="scss">
@import "assets/styles/layouts/_header";
</style>

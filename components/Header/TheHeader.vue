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

const groupsStore = useGroupsStore()
const { houses } = storeToRefs(groupsStore)
const route = useRoute()
const addMenuItems = [
  {
    ico: "aside/automation",
    title: "Добавить сценарий",
    url: '/#',
  },
  {
    icon: "aside/automation",
    name: "Добавить автоматизацию",
    url: '/automation/create',
  },
  {
    icon: "header/scenario",
    name: "Добавить сценарий",
    url: '/scenarios/create',
  },
  {
    icon: "aside/room",
    name: "Добавить комнату",
    url: '/user/group/add/room',
  },
  {
    icon: "aside/floor",
    name: "Добавить этаж",
    url: '/user/group/add/floor',
  },
  {
    icon: "header/home",
    name: "Добавить дом",
    url: '/user/group/add/house',
  },
]
// {
//   icon: "information",
//       name: "Обогреватель (офис) нет связи",
//     url: '/',
// },
// {
//   icon: "cog",
//       name: "Настройки дома",
//     url: '/',
// },
const settingsMenuItems = []
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

watch(() => route.fullPath, () => {
  isSettingsMenuShow.value = false
  isAddMenuShow.value = false
})
</script>

<style lang="scss">
@import "assets/styles/layouts/_header";
</style>

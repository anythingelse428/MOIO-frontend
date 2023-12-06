<template>
  <div class="header-content">
    <button class="header-button" @click="isAddMenuShow = !isAddMenuShow">
      <span class="mdi mdi-plus-circle-outline" />
      <transition name="fade">
        <header-menu v-show="isAddMenuShow" ref="addMenu" :items="addMenuItems" />
      </transition>
    </button>
    <div class="header-content__menu-container">
      <button class="header-button" @click="isSettingsMenuShow = !isSettingsMenuShow">
        <span class="mdi mdi-dots-horizontal" />
      </button>
      <transition name="fade">
        <header-menu v-show="isSettingsMenuShow" ref="settingsMenu" :items="settingsMenuItems" />
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
settingsMenuItems.push(...groupsStore.houses)
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
@import "~/assets/styles/transitions";
@import "~/assets/styles/vars/functions";
.scheme-dark{
  .header-content{
    background-color: rgb(0 0 0 / 30%);
  }
}
.scheme-light{
  .header-content{
    background-color: rgb(255 255 255 / 30%);
  }
}
.header-content{
  position: relative;
  width: 100%;
  z-index: 10;
  display: flex;
  justify-content: end;
  padding: 16px 28px;
  align-items: center;
  gap: 20px;
  backdrop-filter: blur(2px);
  &__menu-container{
    position: relative;
  }
  .header-button{
    cursor: pointer;
    display: block;
    position: relative;
    background: transparent;
    outline: none;
    border: none;
    .mdi{
      font-size: 40px;
    }
  }
}
</style>

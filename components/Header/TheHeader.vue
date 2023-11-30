<template>
  <div class="header-content">
    <button class="header-button"  @click="isAddMenuShow = !isAddMenuShow">
      <span class="mdi mdi-plus-circle-outline" />
      <transition name="fade">
        <header-menu ref="addMenu" v-show="isAddMenuShow" :items="addMenuItems" />
      </transition>
    </button>
    <div class="header-content__menu-container">
      <button class="header-button" @click="isSettingsMenuShow = !isSettingsMenuShow">
        <span class="mdi mdi-dots-horizontal" />
      </button>
      <transition name="fade">
        <header-menu ref="settingsMenu" v-show="isSettingsMenuShow" :items="settingsMenuItems" />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const addMenuItems = [
  {
    ico: "plus-box-outline",
    title: "Добавить сценарий",
  },
  {
    ico: "home-automation",
    title: "Добавить автоматизацию",
  },
  {
    ico: "cube-outline",
    title: "Добавить комнату",
  },
  {
    ico: "account-outline",
    title: "Добавить людей",
  },
]
const settingsMenuItems = [
  {
    ico: "information",
    title: "Обогреватель (офис) нет связи",
  },
  {
    ico: "cog",
    title: "Настройки дома",
  },
  {
    ico: "home",
    title: "Дом1",
  },
  {
    ico: "home",
    title: "Дом2",
  },
]
const isAddMenuShow = ref(false)
const isSettingsMenuShow = ref(false)
const addMenu = ref(null)
const settingsMenu = ref(null)

onClickOutside(addMenu,(e)=>isAddMenuShow.value = false)
onClickOutside(settingsMenu,(e)=>isSettingsMenuShow.value = false)
</script>

<style lang="scss">
@import "~/assets/styles/transitions.scss";
.header-content{
  position: relative;
  width: 100%;
  z-index: 10;
  display: flex;
  justify-content: end;
  padding-inline: 28px;
  padding-top: 16px;
  align-items: center;
  gap: 20px;
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

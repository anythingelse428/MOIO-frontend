<template>
  <div class="header-content">
    <div class="header-content__menu-container">
      <button ref="addMenuTrigger" class="header-button" @click="isAddMenuShow = !isAddMenuShow">
        <icon name="header/plus-circle-outline" size="40" />
      </button>
      <transition name="fade">
        <header-menu v-show="isAddMenuShow" ref="addMenu" :items="isHouseEditable ? [...addMenuItems, ...ownerAddMenuItems] : [...addMenuItems]" @click="isAddMenuShow=false" />
      </transition>
    </div>
    <div class="header-content__menu-container">
      <button ref="settingsMenuTrigger" class="header-button" @click="isSettingsMenuShow = !isSettingsMenuShow">
        <icon name="header/dots-horizontal" size="40" />
      </button>
      <transition name="fade">
        <header-menu v-show="isSettingsMenuShow" ref="settingsMenu" :items="[...settingsMenuItems,...houses]" @click="isSettingsMenuShow=false" />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"
import Icon from "~/components/shared/Icon.vue"
import { useUserStore } from "~/store/user"

const groupsStore = useGroupsStore()
const { id } = useUserStore()
const { houses } = storeToRefs(groupsStore)
const route = useRoute()
const isHouseEditable = ref(groupsStore.uppperGroups.find(el => el.id === groupsStore.currentHome)?.groupCreatorId === id)
const addMenuItems = [
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
]
const ownerAddMenuItems = [
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
  }]
const settingsMenuItems = []
const isAddMenuShow = ref(false)
const isSettingsMenuShow = ref(false)
const addMenu = ref(null)
const settingsMenu = ref(null)
const settingsMenuTrigger = ref(null)
const addMenuTrigger = ref(null)

onClickOutside(addMenu, (e) => {
  if (isAddMenuShow.value) {
    isAddMenuShow.value = false
  }
}, { ignore: [addMenuTrigger] })
onClickOutside(settingsMenu, (e) => {
  if (isSettingsMenuShow.value) {
    isSettingsMenuShow.value = false
  }
}, { ignore: [settingsMenuTrigger] })

watch(() => route.fullPath, () => {
  isSettingsMenuShow.value = false
  isAddMenuShow.value = false
})
watch(() => groupsStore.currentHome, () => {
  isHouseEditable.value = groupsStore.uppperGroups.find(el => el.id === groupsStore.currentHome)?.groupCreatorId === id
})
</script>

<style lang="scss">
@import "assets/styles/layouts/_header";
</style>

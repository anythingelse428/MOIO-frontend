<template>
  <keep-alive>
    <div class="layout --default">
      <header class="header">
        <the-header />
      </header>
      <aside>
        <the-aside />
      </aside>
      <main>
        <slot />
      </main>
    </div>
  </keep-alive>
</template>
<script setup lang="ts">
import TheAside from '~/components/Aside/TheAside.vue'
import TheHeader from '~/components/Header/TheHeader.vue'
import { useUserStore } from "~/store/user"
import { useGroupsStore } from "~/store/groups"
import type { ServiceProps } from "~/components/Service/TheService.vue"
import { useCategoriesStore } from "~/store/categories"

const userStore = useUserStore()
const groupStore = useGroupsStore()
const categoriesStore = useCategoriesStore()
const route = useRoute()
await userStore.init()
await groupStore.getHouses()
// Сокеты
const { $bus } = useNuxtApp()
const restBaseUrl = useRuntimeConfig().public.REST_BASE_TARGET
const socket = await useSocket(restBaseUrl + "/chat")
let isChanged = false

socket.connection.on("UpdateSensorState", (message:string) => {
  // console.log("UpdateSensorState", message)
  useNotification("info", message)
})
socket.connection.on("UpdateDeviceState", (message:ServiceProps) => {
  // console.log("UpdateDeviceState", message)
  isChanged = false
  changeCapability(message)
  $bus.emit('device-update-emit', message)
})
socket.connection.on("UpdateConfig", (message:ServiceProps) => {
  // console.log("UpdateConfig", message)
  useNotification("info", `Обновлено состояние устройства ${message.name}`)
})
function changeCapability (message:ServiceProps, group = groupStore.currentGroup) {
  const isCategory = route.path.includes('category/')
  if (isCategory && !isChanged) {
    for (const category of Object.keys(categoriesStore.devicesInCategory)) {
      const deviceIdx = categoriesStore.devicesInCategory[category].findIndex(el => el.id === message.id)
      if (deviceIdx > -1) {
        categoriesStore.devicesInCategory[category][deviceIdx].capabilities = message.capabilities
        isChanged = true
      }
    }
    return
  }
  if (group.id === message.groupId) {
    const deviceIdx = group.devices.findIndex(el => el.id === message.id)
    group.devices[deviceIdx].capabilities = message.capabilities
    isChanged = true
    return
  }
  if (group.inverseParent && !isChanged) {
    for (let i = 0; i < group.inverseParent.length; i++) {
      changeCapability(message, group.inverseParent[i])
    }
  }
}

</script>
<style lang="scss">
@import "assets/styles/layouts/default-layout";
</style>

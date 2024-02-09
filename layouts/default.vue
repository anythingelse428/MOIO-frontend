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
import { consola } from "consola"
import TheAside from '~/components/Aside/TheAside.vue'
import TheHeader from '~/components/Header/TheHeader.vue'
import { useUserStore } from "~/store/user"
import { useGroupsStore } from "~/store/groups"
import type { Service } from "~/components/Service/TheService.vue"
import { useCategoriesStore } from "~/store/categories"
import type { IGroupResponseItem } from "~/api/group/getAll"

const userStore = useUserStore()
const groupStore = useGroupsStore()
const categoriesStore = useCategoriesStore()
const route = useRoute()
await userStore.init()
await groupStore.getHouses()
// Сокеты
const { $bus } = useNuxtApp()
const socket = await useSocket("http://176.119.157.248:7033/chat")
socket.connection.on("UpdateSensorState", (message:string) => {
  console.log("UpdateSensorState", message)
  useNotification("info", message)
})
socket.connection.on("UpdateDeviceState", (message:Service) => {
  console.log("UpdateDeviceState", message)
  changeCapability(message)
  $bus.emit('device-update-emit', message)
})
socket.connection.on("UpdateConfig", (message:string) => {
  console.log("UpdateConfig", message)
  useNotification("info", message)
})
function changeCapability (message:Service, group = groupStore.currentGroup) {
  const isCategory = route.path.includes('category/')
  if (isCategory) {
    for (const category of Object.keys(categoriesStore.devicesInCategory)) {
      const deviceIdx = categoriesStore.devicesInCategory[category].findIndex(el => el.id === message.id)
      if (deviceIdx > -1) {
        categoriesStore.devicesInCategory[category][deviceIdx].capabilities = message.capabilities
        break
      }
    }
    return
  }
  if (group.id === message.groupId) {
    const deviceIdx = group.devices.findIndex(el => el.id === message.id)
    group.devices[deviceIdx].capabilities = message.capabilities
    return
  }
  group.inverseParent.forEach((el) => {
    changeCapability(message, el)
  })
}

</script>
<style lang="scss">
@import "assets/styles/layouts/default-layout";
</style>

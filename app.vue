<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">

import { useRuntimeConfig } from "#app"
import { useUserStore } from '~/store/user'
import { useDevicesStore } from '~/store/devices'
import useAsyncQuery from '~/composables/useAsyncQuery'
import { useGroupsStore } from "~/store/groups"

const user = useUserStore()
// const groups = useGroupsStore()
// const devices = useDevicesStore()
const colorMode = useColorScheme()
onMounted(() => {
  colorMode?.colorSchemeInit()
})
user.init()
const socket = useSocket("http://192.168.1.64:7033/chat")
socket.connection.on("ReceiveMessage", (message:string) => {
  useNotification("info", message)
})
// groups.getAll()
// console.log(groups.floors)
// devices.getAllDevices()
// const conn = useSocket()
// console.log(conn)
// //
// conn.onopen = () => {
//   console.log(123)
// }

</script>
<style>

</style>

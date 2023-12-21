<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">

import { useUserStore } from '~/store/user'

const user = useUserStore()
const colorMode = useColorScheme()
onMounted(() => {
  colorMode?.colorSchemeInit()
})
if (user.accessToken) {
  await user.init()
}
// Сокеты
// const socket = useSocket("http://192.168.1.64:7033/chat")
// socket.connection.on("ReceiveMessage", (message:string) => {
//   useNotification("info", message)
// })
// const conn = useSocket()
// console.log(conn)
// //
// conn.onopen = () => {
//   console.log(123)
// }

</script>
<style>

</style>

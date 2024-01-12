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
const socket = await useSocket("http://85.208.208.54:7033/chat")
socket.connection.on('ReceiveMessage', (data:any) => {
  alert(data)
  console.log(data)
})
socket.connection.on('TrySend', (data:any) => {
  alert(data)
  console.log(data)
})
socket.connection.on('ReceivedMessage', (data:any) => {
  alert(data)
  console.log(data)
})
socket.connection.on('SendMessage', (data:any) => {
  alert(data)
  console.log(data)
})
socket.connection.on('Send', (data:any) => {
  alert(data)
  console.log(data)
})
socket.connection.onclose((e) => {
  useNotification("info", e)
})
socket.connection.onreconnected(() => {
  useNotification("info", 'reconn')
})
socket.connection.stream('SendMessage', (data) => {
  useNotification("info", data)
})
socket.connection.send('SendTest', [1, 2, 3])
socket.connection.send('SendMessage', ['Message', 'SendMessage'])
socket.connection.on('SendTest', (data) => {
  useNotification("info", data)
})
console.log(
  // conn id
  socket.connection.connectionId,
)
socket.connection.send('DeleteFromGroup', 'asd')
// const conn = useSocket()
// console.log(conn)
// //
// conn.onopen = () => {
//   console.log(123)
// }

</script>
<style>

</style>

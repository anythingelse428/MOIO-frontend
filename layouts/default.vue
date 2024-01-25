<template>
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
</template>
<script setup lang="ts">
import TheAside from '~/components/Aside/TheAside.vue'
import TheHeader from '~/components/Header/TheHeader.vue'
import { useUserStore } from "~/store/user"
import { useGroupsStore } from "~/store/groups"

const userStore = useUserStore()
const groupStore = useGroupsStore()
await userStore.init()
await groupStore.getHouses()
// Сокеты
const socket = await useSocket("http://176.119.157.248:7033/chat")
socket.connection.on("ReceiveMessage", (message:string) => {
  useNotification("info", message)
})
// const conn = useSocket()
// console.log(conn)
// //
// conn.onopen = () => {
//   console.log(123)
// }
</script>
<style lang="scss">
@import "assets/styles/layouts/default-layout";
</style>

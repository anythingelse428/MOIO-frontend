<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">

import { useUserStore } from '~/store/user'
import { useDevicesStore } from '~/store/devices'
import useAsyncQuery from '~/composables/useAsyncQuery'
import { useGroupsStore } from "~/store/groups"

const user = useUserStore()
// const groups = useGroupsStore()
// const devices = useDevicesStore()

user.init()
// groups.getAll()
// console.log(groups.floors)
// devices.getAllDevices()

const colorMode = useColorMode()
console.log(colorMode.preference)
console.log(localStorage.getItem('nuxt-color-mode'))
onMounted(() => {
  colorMode.value = localStorage.getItem('nuxt-color-mode') || 'dark'
})
</script>
<style>

</style>

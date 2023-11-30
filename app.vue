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
const groups = useGroupsStore()
// const devices = useDevicesStore()

user.init()
groups.getAll()
// devices.getAllDevices()


</script>
<style>

</style>

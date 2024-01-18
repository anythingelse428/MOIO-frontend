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


</script>
<style>

</style>

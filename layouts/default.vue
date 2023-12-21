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

</script>
<style lang="scss">
@import "assets/styles/layouts/default-layout";
</style>

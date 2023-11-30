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

const userStore = useUserStore()
userStore.init()

</script>
<style lang="scss">
.layout.--default{
    main{
      padding-top: 60px;
      position: fixed;
      overflow-y: auto;
      background: linear-gradient(180deg, $main-bg-gradient-start 0%, $main-bg-gradient-end 36.46%);
      width: calc(100% - 284px);
      right: 0;
      bottom: 0;
      top: 0;
      @media screen and (max-width: 1200px) {
        width: 100%;
        padding-top: 80px;
      }
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        background: $bg-primary;
      }
      &::-webkit-scrollbar-thumb {
        background: #2a2a29;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    }
}
</style>

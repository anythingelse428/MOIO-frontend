<template>
  <div class="layout --auth">
    <ClientOnly>
      <main>
        <slot />
      </main>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import TheAside from '~/components/Aside/TheAside.vue'
</script>
<style lang="scss">
.layout.--auth{
    main{
      background: linear-gradient(180deg, $main-bg-gradient-start 0%, $main-bg-gradient-end 31.94%);
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
}
</style>

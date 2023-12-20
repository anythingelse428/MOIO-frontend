<template>
  <div class="layout --auth">
    <ClientOnly>
      <main>
        <slot />
      </main>
    </ClientOnly>
  </div>
</template>
<style lang="scss">
@import "assets/styles/layouts/auth-layout";
</style>

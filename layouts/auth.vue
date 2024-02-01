<template>
  <div class="layout --auth">
    <ClientOnly>
      <main>
        <img src="~/assets/imgs/logo.svg" width="194" height="80">
        <slot />
      </main>
    </ClientOnly>
  </div>
</template>
<style lang="scss">
@import "assets/styles/layouts/auth-layout";
img{
  position: absolute;
  top: 10px;
  z-index: 0;
}
</style>

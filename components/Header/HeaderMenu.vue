<template>
  <div class="header-menu">
    <nuxt-link v-for="item in items" :key="item.icon+item.name" :to="item?.url||'/'">
      <div :class="`header-menu__item ${item?.active?'--active':''}`">
        <span :class="`mdi mdi-${item.icon}`" />
        <span class="header-menu__item-title">{{ item.name }}</span>
      </div>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
export interface HeaderMenuProps {
  items:{
    icon:string,
    name:string,
    url?:string
    active?:boolean
  }[]
}

const props = defineProps<HeaderMenuProps>()
</script>

<style lang="scss">

</style>


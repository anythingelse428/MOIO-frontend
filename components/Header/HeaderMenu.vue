<template>
  <div class="header-menu">
    <nuxt-link v-for="item in items" :key="item.icon+item.name" :to="item?.url||'/'">
      <div :class="`header-menu__item ${item?.active?'--active':''}`">
        <icon :name="item.icon" size="28" />
        <span class="header-menu__item-title">{{ item.name }}</span>
      </div>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import type { TUiIconNames } from "#build/types/ui-icon"
import Icon from "~/components/shared/Icon.vue"

export interface HeaderMenuProps {
  items:{
    icon:TUiIconNames,
    name:string,
    url?:string
    active?:boolean
  }[]
}

const props = defineProps<HeaderMenuProps>()
</script>

<style lang="scss">

</style>


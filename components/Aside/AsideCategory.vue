<template>
  <div class="aside-category">
    <h1 class="aside-category__header">
      {{ categoryHeader }}
    </h1>
    <div class="aside-category__items">
      <aside-item
        v-for="item in categoryItems"
        :id="item?.id"
        :key="item.url"
        :title="item.name"
        :icon="item.icon"
        :url="item.url"
        :editable="item?.editable"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AsideItem from '~/components/Aside/AsideItem.vue'

export type AsideCategory = {
  categoryHeader:string,
  categoryItems:
      {
        icon: string,
        name: string,
        url: string
        editable?:boolean
        id?:number|string
      }[]
}
const props = defineProps<AsideCategory>()
</script>

<style lang="scss">

</style>

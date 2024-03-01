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
        :is-editable="item?.isEditable"
        :type-id="item?.typeId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AsideItem from '~/components/Aside/AsideItem.vue'
import type { TUiIconNames } from "#build/types/ui-icon"

export type AsideCategory = {
  categoryHeader:string,
  categoryItems:
      {
        icon: TUiIconNames,
        name: string,
        url: string
        isEditable?:boolean
        id?:number|string
        typeId?:number
      }[]
}

const props = defineProps<AsideCategory>()
</script>

<style lang="scss">

</style>

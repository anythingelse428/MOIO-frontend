<template>
  <div class="aside-category">
    <h1 class="aside-category__header">
      {{ categoryHeader }}
    </h1>
    <div class="aside-category__items">
      <aside-item
        v-for="item in categoryItems"
        :key="item.url"
        :title="item.title"
        :icon="item.icon"
        :url="item.url"
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
        title: string,
        url: string
      }[]
}
const props = defineProps<AsideCategory>()
</script>

<style lang="scss">
.aside-category{
  &__header{
    @include aside-header;
    margin-left: 24px;
    color: $aside-header;
  }
  &__items{
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>

<template>
  <NuxtLink v-if="title" :to="url">
    <div class="aside-item">
      <span :class="`mdi mdi-${icon}`" />
      <h2 class="aside-item__title">
        {{ title }}
      </h2>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">

export type AsideItem = {
  icon:string,
  url:string,
  title:string
}
const props = defineProps<AsideItem>()

</script>

<style lang="scss">
.aside-item{
  display: flex;
  gap: 30px;
  align-items: center;
  padding: 0px 24px;
  &:hover{
    .mdi,
    .aside-item__title{
      color: $color-active;
    }
  }
  .mdi{
    font-size: 32px;
  }
  &__title{
    @include aside-item
  }
}
</style>

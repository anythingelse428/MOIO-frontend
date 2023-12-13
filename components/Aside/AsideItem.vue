<template>
  <div class="aside-item">
    <NuxtLink v-if="title" class="aside-item__link" :to="url">
      <span :class="`mdi mdi-${icon}`" />
      <h2 class="aside-item__title">
        {{ title }}
      </h2>
    </NuxtLink>
    <div v-if="editable" class="aside-item__edit-btn" role="button" @click.prevent="router.push({path:'/user/group/edit/room/'+id})">
      <span class="mdi mdi-pencil" />
    </div>
  </div>
</template>

<script setup lang="ts">
export type AsideItem = {
  icon:string,
  url:string,
  title:string
  editable?:boolean
  id?:number|string
}
const props = defineProps<AsideItem>()
const router = useRouter()
</script>

<style lang="scss">
.aside-item{
  display: flex;
  //gap: 30px;
  align-items: center;
  padding: 0px 24px;
  &__link{
    display: flex;
    align-items: center;
    gap: 30px;
    &:hover{
      .mdi,
      .aside-item__title{
        color: $color-active;
      }
    }
  }
  .mdi{
    font-size: 32px;
  }
  .aside-item__edit-btn{
    cursor: pointer;
    margin-inline-start: auto;
    .mdi.mdi-pencil{
      font-size: 24px;
    }
    &:hover{
      .mdi{
        color: $color-active;
      }
    }
  }
  &__title{
    @include aside-item
  }
}
</style>

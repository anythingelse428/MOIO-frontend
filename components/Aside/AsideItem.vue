<template>
  <div v-if="title.length>1 && url.length" class="aside-item">
    <NuxtLink class="aside-item__link" :to="url">
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

</style>

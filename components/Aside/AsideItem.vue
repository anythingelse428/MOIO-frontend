<template>
  <div v-if="title.length>1 && url.length" class="aside-item">
    <NuxtLink class="aside-item__link" :to="url">
      <icon :name="icon" size="28" />
      <h2 class="aside-item__title">
        {{ title }}
      </h2>
    </NuxtLink>
    <div v-if="editable" class="aside-item__edit-btn" role="button" @click.prevent="router.push({path:'/user/group/edit/'+editPostfix+id})">
      <icon name="pencil" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/shared/Icon.vue"
import type { TUiIconNames } from "#build/types/ui-icon"

export type AsideItem = {
  icon:TUiIconNames,
  url:string,
  title:string
  editable?:boolean
  id?:number|string
  typeId?:number
}

const props = defineProps<AsideItem>()
const router = useRouter()
let editPostfix = 'room/'
if (props?.typeId === 2) {
  editPostfix = 'floor/'
}
if (props?.typeId === 1) {
  editPostfix = 'house/'
}
</script>

<style lang="scss">

</style>

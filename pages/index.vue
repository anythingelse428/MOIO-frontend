<template>
  <div class="group">
    <loader-screen :is-loading="isLoading" />
    <group-list
      v-if="group?.name"
      :id="groupStore.currentHome"
      :name="group?.name"
      :devices="group.devices"
      :inverse-parent="group?.inverseParent"
      :hide-empty="true"
      :type-id="1"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"

import { useGroupsStore } from "~/store/groups"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import type { IGroupResponseItem } from "~/api/group/getAll"
import type { ServiceProps } from "~/components/Service/TheService.vue"

export interface IGroupData {
 name: string
 devices: IGroupResponseItem['devices'],
 inverseParent: IGroupResponseItem['inverseParent']
}

const isLoading = ref(true)
const groupStore = useGroupsStore()
const { group } = storeToRefs(groupStore)

onMounted(async () => {
  try {
    isLoading.value = true
    await groupStore.getAll()
    await groupStore.getGroupById(groupStore.currentHome)
    isLoading.value = false
  } catch {
  }
})
</script>

<style lang="scss">
@import "assets/styles/page/user-group";
</style>

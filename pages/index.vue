<template>
  <div class="group">
    <loader-screen :is-loading="isLoading" />
    <group-list
      v-if="currentGroup?.name"
      :id="groupStore.currentHome"
      :name="currentGroup?.name"
      :devices="currentGroup.devices"
      :inverse-parent="currentGroup?.inverseParent"
      :hide-empty="true"
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
const { currentGroup } = storeToRefs(groupStore)

onMounted(async () => {
  try {
    isLoading.value = true
    await groupStore.getGroupById(groupStore.currentHome)
    isLoading.value = false
  } catch {
  }
})
</script>

<style lang="scss">
@import "assets/styles/page/user-group";
</style>

<template>
  <div class="main-page">
    <div class="group">
      <loader-screen :is-loading="isLoading" />
      <group-list
        :id="groupStore.currentHome"
        :name="groupData.name"
        :devices="groupData.devices"
        :inverse-parent="groupData?.inverseParent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"

import { useGroupsStore } from "~/store/groups"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import type { IGroupResponseItem } from "~/api/group/getAll"

export interface IGroupData {
 name: string
 devices: IGroupResponseItem['devices'],
 inverseParent: IGroupResponseItem['inverseParent']
}

const isLoading = ref(true)
const groupData = ref<IGroupData>({ name: '', devices: [], inverseParent: [] })
const groupStore = useGroupsStore()
const { currentGroup } = storeToRefs(groupStore)


watch(currentGroup, (newVal, oldValue) => {
  if (oldValue && !newVal.id.includes(groupStore.currentHome)) {
    const idx = groupData.value.inverseParent.findIndex(el => el.id === newVal.id)
    groupData.value.inverseParent[idx] = newVal
  } else {
    groupData.value = newVal
  }
}, { deep: true, immediate: true })

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
@import "assets/styles/page/_index";
</style>

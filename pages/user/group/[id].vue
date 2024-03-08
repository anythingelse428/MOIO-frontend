<template>
  <div class="group">
    <loader-screen :is-loading="isLoading" />
    <group-list
      v-if="currentGroup?.name"
      :id="groupId"
      :name="currentGroup?.name"
      :devices="currentGroup?.devices"
      :inverse-parent="currentGroup?.inverseParent"
      :hide-empty="true"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"

import { useGroupsStore } from "~/store/groups"
import type { IGroupResponseItem } from "~/api/group/getAll"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

export interface IGroupData {
  name: string
  devices: IGroupResponseItem['devices'],
  inverseParent: IGroupResponseItem['inverseParent']
}

const groupStore = useGroupsStore()
const { currentGroup } = storeToRefs(groupStore)
const route = useRoute()
const groupId = route.params.id as string
const isLoading = ref(true)

async function fetchGroups () {
  isLoading.value = true
  await groupStore.getGroupById(groupId)
  isLoading.value = false
}

if (groupStore.currentHome !== groupId && groupStore.uppperGroups?.find(el => el.id === groupId)?.typeId === 1) {
  groupStore.setCurrentHome(groupId)
  useNotification('info', 'Просматриваемый дом изменен')
}

watch(route, () => {
  fetchGroups()
}, { deep: true, immediate: true })


// onMounted(async () => {
//   try {
//     isLoading.value = true
//     await groupStore.getGroupById(groupId)
//     isLoading.value = false
//   } catch {
//   }
// })

</script>

<style lang="scss">
@import "assets/styles/page/user-group";
</style>

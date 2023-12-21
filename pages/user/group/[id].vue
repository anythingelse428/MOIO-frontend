<template>
  <div class="group">
    <loader-screen :is-loading="isLoading" />
    <group-list
      :id="groupId"
      :name="groupData.name"
      :devices="groupData.devices"
      :inverse-parent="groupData?.inverseParent"
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
const groupData = ref<IGroupData>({ name: '', devices: [], inverseParent: [] })
const isLoading = ref(true)

async function fetchGroups () {
  isLoading.value = true
  groupData.value = { name: '', devices: [], inverseParent: [] }
  await groupStore.getGroupById(groupId)
  groupData.value = currentGroup.value
  isLoading.value = false
}
await fetchGroups()

if (groupStore.currentHome !== groupId && groupStore.uppperGroups.find(el => el.id === groupId)?.typeId === 1) {
  groupStore.setCurrentHome(groupId)
  useNotification('info', 'Просматриваемый дом изменен')
}

watch(route, () => {
  fetchGroups()
}, { deep: true, immediate: true })
watch(currentGroup, (newVal, oldValue) => {
  if (oldValue && !newVal.id.includes(groupId)) {
    const idx = groupData.value.inverseParent.findIndex(el => el.id === newVal.id)
    groupData.value.inverseParent[idx] = newVal
  } else {
    groupData.value = newVal
  }
}, { deep: true, immediate: true })

onMounted(async () => {
  try {
    isLoading.value = true
    await groupStore.getGroupById(groupId)
    isLoading.value = false
  } catch {
  }
})

</script>

<style lang="scss">
@import "assets/styles/page/_user-group";
</style>

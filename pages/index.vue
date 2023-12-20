<template>
  <div class="group">
    <group-list
      :id="groupStore.currentHome"
      :name="groupData.name"
      :devices="groupData.devices"
      :inverse-parent="groupData?.inverseParent"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { awaitExpression } from "@babel/types"
import useAsyncQuery from '~/composables/useAsyncQuery'
import TheService from '~/components/Service/TheService.vue'
import ServiceGroup from '~/components/Service/ServiceGroup.vue'
import { useCategoriesStore } from "~/store/categories"
import { useGroupsStore } from "~/store/groups"
import { useDevicesStore } from "~/store/devices"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import type { IGroupResponseItem } from "~/api/group/getAll"
export interface IGroupData {
 name: string
 devices: IGroupResponseItem['devices'],
 inverseParent: IGroupResponseItem['inverseParent']
}
const isMounted = ref(false)
onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})
const route = useRoute()
const groupData = ref<IGroupData>({ name: '', devices: [], inverseParent: [] })
const groupStore = useGroupsStore()
const devicesStore = useDevicesStore()
const { currentGroup } = storeToRefs(groupStore)
async function fetchGroups () {
  groupData.value = { name: '', devices: [], inverseParent: [] }
  await groupStore.getGroupById(groupStore.currentHome)
  groupData.value = currentGroup.value
}

fetchGroups()
watch(route, () => {
  fetchGroups()
}, { deep: true, immediate: true })
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
    await groupStore.getGroupById(groupStore.currentHome)
    // debugger
  } catch {
  }
})
</script>

<style lang="scss">
@import "assets/styles/page/_index";
</style>

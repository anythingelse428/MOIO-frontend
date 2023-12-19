<template>
  <div class="group">
    <loader-screen :is-loading="groupData && groupData?.name && groupData.name.length===0 && isMounted" />
    <group-list
      :name="groupData.name"
      :devices="groupData.devices"
      :inverse-parent="groupData?.inverseParent"
    />
  </div>
</template>

<script setup lang="ts">
import useAsyncQuery from '~/composables/useAsyncQuery'
import TheService from '~/components/Service/TheService.vue'
import ServiceGroup from '~/components/Service/ServiceGroup.vue'
import { useCategoriesStore } from "~/store/categories"
import { useGroupsStore } from "~/store/groups"
import { useDevicesStore } from "~/store/devices"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
const isMounted = ref(false)
onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})
const route = useRoute()
const groupData = ref({ name: '', devices: [], inverseParent: [] })
const groupStore = useGroupsStore()
const devicesStore = useDevicesStore()
async function fetchGroups () {
  groupData.value = { name: '', devices: [], inverseParent: [] }
  const { name, devices, inverseParent } = await groupStore.getGroupById(groupStore.currentHome)
  groupData.value = {
    name,
    devices,
    inverseParent,
  }
}

devicesStore.$onAction(({ after, store }) => {
  store.$onAction((c) => {
    if (c?.name.indexOf('changeName') > -1 || c?.name.indexOf('deleteDevice') > -1) {
      fetchGroups()
    }
  })
})
fetchGroups()
watch(route, () => {
  fetchGroups()
}, { deep: true, immediate: true })
onMounted(async () => {
  try {
    await groupStore.getDevicesByGroupId(groupStore.currentHome)
    // debugger
  } catch {
  }
})
</script>

<style lang="scss">
@import "assets/styles/page/_index";
</style>

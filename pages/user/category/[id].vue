<template>
  <div class="group">
    <h1 class="group__header">
      {{ groupData?.name }}
    </h1>
    <div v-if="groupData?.groups" class="subgroup-list">
      <div v-for="group in Object.keys(groupData.groups)" :key="group" class="subgroup-item">
        <h2 class="subgroup-item__header">
          {{ group }}
        </h2>
        <div v-if="groupData.groups[group]?.length" class="subgroup-item__service-list">
          <the-service
            v-for="service in groupData.groups[group]"
            :id="service.id"
            :key="service.groupId"
            group-id=""
            :name="service.name"
            :type="service.type"
            :capabilities="service?.capabilities"
          />
        </div>
        <div v-else class="subgroup-item__service-list --empty">
          В этой группе нет устройств
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAsyncQuery from '~/composables/useAsyncQuery'
import TheService from '~/components/Service/TheService.vue'
import ServiceGroup from '~/components/Service/ServiceGroup.vue'
import { useCategoriesStore } from "~/store/categories"
import { useDevicesStore } from "~/store/devices"
import { useGroupsStore } from "~/store/groups"

const route = useRoute()
const id = route.params.id
const groupData = ref()
const categoryStore = useCategoriesStore()
const devicesStore = useDevicesStore()
const groupStore = useGroupsStore()
async function fetchGroups () {
  await categoryStore.getAll()
  await categoryStore.getDevicesByCategoryId(id, groupStore.currentHome)
  groupData.value = {
    name: categoryStore.categoryById(id)?.name,
    groups: categoryStore.devices,
  }
}
fetchGroups()

devicesStore.$onAction(({ after, store }) => {
  store.$onAction((c) => {
    if (c?.name.indexOf('changeName') > -1 || c?.name.indexOf('deleteDevice') > -1) {
      fetchGroups()
    }
  })
})
watch(route, () => {
  fetchGroups()
}, { deep: true, immediate: true })

</script>

<style lang="scss">
@import "assets/styles/page/user-group";
</style>

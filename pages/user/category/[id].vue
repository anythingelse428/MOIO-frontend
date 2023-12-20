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
            :group-id="categoryId"
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
import { storeToRefs } from "pinia"
import useAsyncQuery from '~/composables/useAsyncQuery'
import TheService from '~/components/Service/TheService.vue'
import ServiceGroup from '~/components/Service/ServiceGroup.vue'
import { useCategoriesStore } from "~/store/categories"
import { useDevicesStore } from "~/store/devices"
import { useGroupsStore } from "~/store/groups"

const route = useRoute()
const categoryId = Number(route.params.id) as number
const groupData = ref()
const categoryStore = useCategoriesStore()
const devicesStore = useDevicesStore()
const groupStore = useGroupsStore()
const { devicesInCategory } = storeToRefs(categoryStore)
async function fetchGroups () {
  await categoryStore.getDevicesByCategoryId(categoryId, groupStore.currentHome)
  groupData.value = {
    name: categoryStore.categoryById(categoryId)?.name,
    groups: categoryStore.devices,
  }
}
fetchGroups()
watch(route, () => {
  fetchGroups()
}, { deep: true, immediate: true })
watch(devicesInCategory, (newVal, oldValue) => {
  if (Object.keys(newVal).length && groupData.value?.groups) {
    groupData.value.groups = newVal
  }
}, { deep: true, immediate: true })
</script>

<style lang="scss">
@import "assets/styles/page/user-group";
</style>

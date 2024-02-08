<template>
  <div class="category">
    <div class="group">
      <loader-screen :is-loading="isLoading" />
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
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"

import TheService from '~/components/Service/TheService.vue'
import { useCategoriesStore } from "~/store/categories"
import { useGroupsStore } from "~/store/groups"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

const categoryStore = useCategoriesStore()
const groupStore = useGroupsStore()
const { devicesInCategory } = storeToRefs(categoryStore)
const route = useRoute()
const categoryId = Number(route.params.id) as number
const groupData = ref()
const isLoading = ref(true)

async function fetchGroups () {
  isLoading.value = true
  await categoryStore.getDevicesByCategoryId(categoryId, groupStore.currentHome)
  groupData.value = {
    name: categoryStore.categoryById(categoryId)?.name,
    groups: categoryStore.devices,
  }
  isLoading.value = false
}
// await fetchGroups()

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
.category {
  .group{
    padding-inline: 80px;
    @media screen and (max-width: 768px){
      padding-inline: 8px;
    }
    .subgroup-item__service-list{
      padding-inline: 40px;
      @media screen and (max-width: 600px){
        padding-inline: 0px;
      }
    }
  }
}
</style>

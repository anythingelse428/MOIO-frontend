<template>
  <div class="group">
    <h1 class="group__header">
      {{ groupData?.name }}
    </h1>
    <div v-if="groupData?.groups && !groupData.groups?.code" class="">
      <div v-for="group in Object.keys(groupData.groups)" :key="group">
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
import { useGroupsStore } from "~/store/groups"
import { useDevicesStore } from "~/store/devices"

const route = useRoute()
const id = route.params.id
const groupData = ref({ name: '', groups: [] })
const groupStore = useGroupsStore()
const devicesStore = useDevicesStore()
async function fetchGroups () {
  // await groupStore.getAll()
  groupData.value = { name: '', groups: [] }
  const { name } = await groupStore.getGroupById(id)
  const devices = await groupStore.getDevicesByGroupId(id)
  groupData.value = {
    name,
    groups: devices,
  }
}

if (groupStore.currentHome !== id && groupStore.uppperGroups.find(el => el.id === id)?.typeId === 1) {
  groupStore.setCurrentHome(id)
  useNotification('info', 'Просматриваемый дом изменен')
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

</script>

<style lang="scss">
.group{
  padding-inline: 80px;
  &__header{
    @include section-header;
  }
  &__list{
    margin-top: 60px;
  }
}
.subgroup-item{
  &__header {
    @include header-submenu-item;
    font-weight: 600;
    margin-top: 40px;
  }
  &__service-list{
    margin-top: 40px;
    display: flex;
    flex-wrap: wrap;
    gap:40px;
    &.--empty{
      font-size: 24px;
    }
  }
}
</style>

<template>
  <div class="group">
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

const route = useRoute()
const id = route.params.id
const groupData = ref({ name: '', devices: [], inverseParent: [] })
const groupStore = useGroupsStore()
const devicesStore = useDevicesStore()
async function fetchGroups () {
  groupData.value = { name: '', devices: [] }
  const { name, devices, inverseParent } = await groupStore.getGroupById(id)
  groupData.value = {
    name,
    devices,
    inverseParent,
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

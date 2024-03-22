<template>
  <div class="group">
    <loader-screen :is-loading="fetchGroup.pending.value" />
    <group-list
      v-if="group?.name"
      :id="groupId"
      :is-group-page="true"
      :name="group?.name"
      :devices="group?.devices"
      :inverse-parent="group?.inverseParent"
      :hide-empty="true"
      :type-id="group?.typeId"
      :can-edit="canEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useGroupsStore } from "~/store/groups"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

const groupStore = useGroupsStore()
const { group } = storeToRefs(groupStore)
const route = useRoute()
const groupId = route.params.id as string
const canEdit = ref(groupStore.canEdit)
const fetchGroup = await useAsyncData(
  'group',
  () => groupStore.getGroupById(groupId),
  {
    watch: [route],
    deep: false,
  },
)


if (groupStore.currentHome !== groupId && groupStore.upGroups?.find(el => el.id === groupId)?.typeId === 1) {
  groupStore.setCurrentHome(groupId)
  useNotification('info', 'Просматриваемый дом изменен')
}

</script>

<style lang="scss">
@import "assets/styles/page/user-group";
</style>

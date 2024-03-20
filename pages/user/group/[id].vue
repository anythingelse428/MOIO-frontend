<template>
  <div class="group">
    <loader-screen :is-loading="isLoading" />
    <group-list
      v-if="currentGroup?.name"
      :id="groupId"
      :is-group-page="true"
      :name="currentGroup?.name"
      :devices="currentGroup?.devices"
      :inverse-parent="currentGroup?.inverseParent"
      :hide-empty="true"
      :type-id="currentGroup?.typeId"
      :can-edit="canEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useGroupsStore } from "~/store/groups"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import { useUserStore } from "~/store/user"

const userStore = useUserStore()
const groupStore = useGroupsStore()
const { currentGroup } = storeToRefs(groupStore)
const route = useRoute()
const groupId = route.params.id as string
const isLoading = ref(false)
const canEdit = ref(userStore.userInfo.id === currentGroup.value.groupCreatorId)
async function fetchGroups () {
  isLoading.value = true
  await groupStore.getGroupById(groupId)
  canEdit.value = userStore.userInfo.id === currentGroup.value.groupCreatorId
  isLoading.value = false
}

if (groupStore.currentHome !== groupId && groupStore.upperGroups?.find(el => el.id === groupId)?.typeId === 1) {
  groupStore.setCurrentHome(groupId)
  useNotification('info', 'Просматриваемый дом изменен')
}


watch(route, () => {
  fetchGroups()
}, { deep: true, immediate: true })

</script>

<style lang="scss">
@import "assets/styles/page/user-group";
</style>

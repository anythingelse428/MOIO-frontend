<template>
  <div class="group">
    <loader-screen :is-loading="isLoading" />
    <group-list
      v-if="group?.name"
      :id="groupStore.currentHome"
      :name="group?.name"
      :devices="group.devices"
      :inverse-parent="group?.inverseParent"
      :hide-empty="true"
      :type-id="1"
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
const { group } = storeToRefs(groupStore)
const isLoading = ref(true)
const canEdit = ref(userStore.userInfo.id === group.value.groupCreatorId)

onMounted(async () => {
  isLoading.value = true
  await groupStore.getAll()
  await groupStore.getGroupById(groupStore.currentHome)
  canEdit.value = userStore.userInfo.id === group.value.groupCreatorId
  isLoading.value = false
})
</script>

<style lang="scss">
@import "assets/styles/page/user-group";
</style>

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

const groupStore = useGroupsStore()
const { group, canEdit, home } = storeToRefs(groupStore)
const groupsFetch = await useAsyncData('allGroups', () => groupStore.getAll(), { deep: false })
const groupFetch = await useAsyncData('groupById', () => groupStore.getGroupById(home.value), { deep: false })
const isLoading = computed(() => (groupsFetch.status.value !== 'idle' && groupsFetch.pending.value) || (groupFetch.status.value !== 'idle' && groupFetch.pending.value))
</script>

<style lang="scss">
@import "assets/styles/page/user-group";
</style>

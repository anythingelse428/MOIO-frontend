<template>
  <div class="scenarios">
    <h1 class="scenarios-header">
      Создание сценария
    </h1>
    <group-list
      :id="data.id"
      :devices="data?.devices"
      :inverse-parent="data.inverseParent"
      :name="data?.name"
      :hide-empty="true"
    />
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"

const groupStore = useGroupsStore()
const data = await groupStore.getGroupById(groupStore.currentHome)
</script>

<style lang="scss">
.scenarios {
  .group__header{
    font-size: 25px;
    font-weight: 400;
    width: 100%;
    text-align: center;
  }
}
</style>

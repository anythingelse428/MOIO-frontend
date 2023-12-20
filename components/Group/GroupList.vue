<!--Групп пока нет, не знаю как будут приходить-->

<template>
  <div v-if="name" class="group-list">
    <h1 class="group__header">
      {{ name }}
    </h1>
    <div v-if="devices.length" class="subgroup-item__service-list">
      <the-service
        v-for="device in devices"
        :id="device.id"
        :key="device.id"
        :group-id="id"
        :name="device.name"
        :type="device.type"
        :capabilities="device?.capabilities"
      />
    </div>
    <div v-if="inverseParent?.length" class="group-list --child">
      <group-list v-for="group in inverseParent" :id="group.id" :key="group.name" :devices="group.devices" :name="group.name" :inverse-parent="group?.inverseParent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAllDevicesResponse } from "~/api/device/getAll"
import TheService from "~/components/Service/TheService.vue"

export interface GroupList {
  name:string,
  id:string|number
  devices:IAllDevicesResponse[],
  inverseParent?: GroupList[]
}
const props = defineProps<GroupList>()
</script>

<style lang="scss">
.--child{
  margin-left: 2em;
}
.group__header,
.subgroup-item__service-list{
  margin-top: 1em;
}
</style>

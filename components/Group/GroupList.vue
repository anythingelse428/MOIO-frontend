<template>
  <div v-if="name" class="group-list">
    <h1 v-if="!hideEmpty" class="group__header">
      {{ name }}
    </h1>
    <h1 v-if="hideEmpty && devices.length>0" class="group__header">
      {{ name }}
    </h1>
    <div v-if="devices.length&&isScenarios" class="subgroup-item__service-list">
      <scenario-service
        v-for="device in devices"
        :id="device.id"
        :key="device.id"
        :group-id="id"
        :name="device.name"
        :type="device.type"
        :capabilities="device?.capabilities"
        :is-preview="true"
        :selected="device?.selected"
        @left-mouse-click="e=>emit('get-data',{...e,groupId:id})"
      />
    </div>
    <div v-if="devices.length&&!isScenarios" class="subgroup-item__service-list">
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
      <group-list
        v-for="group in inverseParent"
        :id="group.id"
        :key="group.name"
        :hide-empty="hideEmpty"
        :devices="group.devices"
        :name="group.name"
        :inverse-parent="group?.inverseParent"
        :is-scenarios="isScenarios"
        @get-data="e=>emit('get-data',{...e,groupId:group.id})"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAllDevicesResponse } from "~/api/device/getAll"
import TheService from "~/components/Service/TheService.vue"
import ScenarioService from "~/components/Scenarios/ScenarioService.vue"

export interface GroupList {
  name:string,
  id:string|number
  devices:IAllDevicesResponse[],
  inverseParent?: GroupList[],
  hideEmpty?:boolean
  isScenarios?:boolean
}

const props = defineProps<GroupList>()
const emit = defineEmits(['get-data'])
</script>

<style lang="scss">
.--child{
  margin-left: calc(32px);
}
.group__header,
.subgroup-item__service-list{
  margin-top: 1em;
  &::first-letter{
    text-transform: capitalize;
  }
}
</style>

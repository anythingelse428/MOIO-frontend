<template>
  <div v-if="name" :class="`group-list  ${isCollapsed?'--collapsed':''}`">
    <h1 v-if="!hideEmpty" class="group__header" @click="isCollapsed = !isCollapsed">
      {{ name }}
      <icon v-show="!isCollapsed&&devices?.length>0" name="chevron-right" size="40" />
    </h1>
    <h1 v-if="hideEmpty && devices?.length>0" class="group__header">
      {{ name }}
    </h1>
    <div v-if="devices?.length&&isScenarios" class="subgroup-item__service-list">
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
    <transition v-show="isCollapsed" name="fade">
      <div v-if="devices?.length&&!isScenarios" class="subgroup-item__service-list">
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
    </transition>
    <div v-if="inverseParent?.length" :class="`group-list --child ${isCollapsed?'--collapsed':''}`">
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
import Icon from "~/components/shared/Icon.vue"

export interface GroupList {
  name?:string,
  id:string|number
  devices?:IAllDevicesResponse[],
  inverseParent?: GroupList[],
  hideEmpty?:boolean
  isScenarios?:boolean
}

const props = defineProps<GroupList>()
const emit = defineEmits(['get-data'])
const isCollapsed = ref(true)
</script>

<style lang="scss">
@import 'assets/styles/utils/transitions';
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
//@keyframes collapse {
//  50% {
//    opacity: 0.5;
//  }
//  80%{
//    opacity: 0;
//  }
//  99% {
//    display: none;
//  }
//}
</style>

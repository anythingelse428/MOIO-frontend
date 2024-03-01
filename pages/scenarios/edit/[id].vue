фывфыв<template>
  <div class="scenarios-create">
    <loader-screen :is-loading="isLoading" />
    <h1 class="scenarios-create__header">
      Редактирование сценария
    </h1>
    <div class="scenarios-create__search">
      <label for="scenario-name">
        Введите название сценария
      </label>
      <input v-model="scenarioName" type="text" placeholder="Название сценария">
    </div>
    <div class="scenarios-create__selected-list">
      <h2 class="scenarios-create__selected-list-header">
        Выбранные устройства
      </h2>
      <div
        class="scenarios-create__selected-list-group"
      >
        <div class="scenarios-create__selected-list-group-devices">
          <scenario-service
            v-for="service in selectedDevice"
            :id="service.id"
            :key="service.id"
            :is-preview="false"
            :name="service.name"
            :capabilities="service.capabilities"
            :type="service.type"
            :group-id="''"
            :device-icon="service.deviceIcon??useIcoByDeviceType(service.type)"
            @left-mouse-click="e=>{selectDevice({...e,id:service.id});toggleSelected(service.id, data)}"
            @update-capability="e=>{setCapability(e)}"
          />
        </div>
      </div>
    </div>
    <div class="scenarios-create__available">
      <h2 class="scenarios-create__available-header">
        Доступные устройства
      </h2>
      <div class="scenarios-create__search">
        <label for="search-group">Поиск комнаты</label>
        <input id="search-group" v-model="searchGroupInput" type="search" placeholder="Комната">
      </div>
      <div v-if="filterGroups(data, searchGroupInput)?.id" class="scenarios-create__available-list">
        <group-list
          :id="filterGroups(data, searchGroupInput).id"
          :devices="filterGroups(data, searchGroupInput)?.devices"
          :inverse-parent="filterGroups(data, searchGroupInput).inverseParent"
          :name="filterGroups(data, searchGroupInput)?.name"
          :hide-empty="true"
          :is-scenarios="true"
          :hide-sensors="true"
          @get-data="e=>{selectDevice(e);toggleSelected(e.id, data)}"
        />
      </div>
      <div v-else class="scenarios-create__available-list --empty">
        <h2>Группа не найдена</h2>
      </div>
    </div>
    <div class="scenarios-create__save">
      <button class="scenarios-create__submit" @click="updateScenario()">
        Сохранить
      </button>
      <button class="scenarios-create__submit --delete" @click="deleteScenario()">
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"
import type { ServiceProps } from "~/components/Service/TheService.vue"
import ScenarioService from "~/components/Scenarios/ScenarioService.vue"
import type { IGroupResponseItem } from "~/api/group/getById"
import type { GroupList } from "~/components/Group/GroupList.vue"
import { useScenarioStore } from "~/store/scenario"
import type { IScenarioUpdateProps } from "~/api/scenarios/update"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

export interface ICapability {
  deviceId: string;
  chanel:string
  id:string
  deviceType:null | string
  hsv?: { h:any, s:any, v:any }
  instance:string
  range?:{min: number|null, max: number|null, precision: number|null}
  reportable:boolean
  retrievable:boolean
  type: string
  value:any
}
const isLoading = ref(true)
const groupStore = useGroupsStore()
const data = ref(await groupStore.getGroupById(groupStore.currentHome))
isLoading.value = false
// const selectedDevice = ref<{ [key:string]: Service[] }>({})
const selectedDevice = ref<ServiceProps[]>([])
const capabilities = ref<{ [key: string]: ServiceProps['capabilities'][] }>({})
const roomsName:{[key:string]:string} = {}
const scenarioName = ref('')
const searchGroupInput = ref('')
const devicesForRemove = ref<string[]>([])
function filterGroups (data:IGroupResponseItem, groupName:string) {
  if (groupName.length === 0) {
    // console.log('ddddddd', data)
    return data
  }
  if (data.name?.toLowerCase()?.includes(groupName.toLowerCase())) {
    return data
  }
  for (let i = 0; i < data?.inverseParent?.length; i++) {
    if (data.inverseParent[i].name?.toLowerCase()?.includes(groupName.toLowerCase())) {
      return data.inverseParent[i]
    }
    filterGroups(data.inverseParent[i], groupName)
  }
}

function selectDevice (service:ServiceProps) {
  const isDeviceExist = selectedDevice.value?.findIndex(el => el.id === service.id)
  if (isDeviceExist > -1) {
    selectedDevice.value.splice(isDeviceExist, 1)
    delete capabilities.value[service.id]
    devicesForRemove.value.push(service.id)
  } else {
    const removeIdx = devicesForRemove.value.findIndex(el => el === service.id)
    devicesForRemove.value.splice(removeIdx, 1)
    if (selectedDevice.value?.length > 0) {
      selectedDevice.value.push(service)
    } else {
      selectedDevice.value = [service]
    }
    capabilities.value[service.id] = service.capabilities
  }
}
function toggleSelected (id:string, data:IGroupResponseItem) {
  let idx = data.devices.findIndex(el => el.id === id)
  if (idx > -1) {
    data.devices[idx].selected = !data.devices[idx].selected
    return idx
  }
  if (data.inverseParent?.length > 0) {
    for (let i = 0; i < data.inverseParent.length; i++) {
      if (idx > -1) { break }
      idx = toggleSelected(id, data.inverseParent[i])
    }
  }
  return idx
}
function setCapability (data:ICapability) {
  const id = data.id ?? data?.deviceId
  const capabilityIdx = capabilities.value[id + '_ch' + data.chanel]?.findIndex(el => el.type === data.type)
  if (data.instance.includes('bright')) {
    const colorCapabilityIdx = capabilities.value[id + '_ch' + data.chanel]?.findIndex(el => el.type.includes('color'))
    if (colorCapabilityIdx > -1) {
      capabilities.value[id + '_ch' + data.chanel][colorCapabilityIdx] = { ...capabilities.value[id + '_ch' + data.chanel][colorCapabilityIdx], hsv: { ...capabilities.value[id + '_ch' + data.chanel][colorCapabilityIdx].hsv, v: Number(data.value) } }
    }
  }
  capabilities.value[id + '_ch' + data.chanel][capabilityIdx] = { ...capabilities.value[id + '_ch' + data.chanel][capabilityIdx], value: data.value, hsv: data.hsv, range: data.range }
}

function getRoomsName (data:IGroupResponseItem) {
  roomsName[data?.id as string] = data.name
  for (let i = 0; i < data.inverseParent?.length; i++) {
    getRoomsName(data.inverseParent[i])
  }
}
getRoomsName(data.value)
const router = useRoute()
const scenarioStore = useScenarioStore()
async function getData () {
  isLoading.value = true
  const response = await scenarioStore.getById(router.params.id as string)
  isLoading.value = false
  selectedDevice.value = response?.devicesScenarios ?? []
  scenarioName.value = response?.name as string
  selectedDevice.value?.forEach((el) => {
    toggleSelected(el.id, data.value)
    if (capabilities.value[el.id]) {
      capabilities.value[el.id].push(...el.capabilities)
    } else {
      capabilities.value[el.id] = el.capabilities
    }
  })
}
getData()
async function updateScenario () {
  if (!scenarioName.value.length) {
    useNotification("error", "Введите название сценария")
    return
  }
  if (!Object.entries(capabilities.value).length) {
    useNotification("error", "Не выбрано ни одного устройства")
    return
  }
  isLoading.value = true
  const updateData:IScenarioUpdateProps = {
    id: router.params.id as string,
    name: scenarioName.value,
    devicesValueStates: capabilities.value,
    removeDevicesId: devicesForRemove.value,
  }
  await scenarioStore.updateScenario(updateData)
  isLoading.value = false
}

async function deleteScenario () {
  await scenarioStore.deleteScenario(router.params.id as string)
}
</script>

<style lang="scss">
@import "assets/styles/page/scenarios-create";
</style>

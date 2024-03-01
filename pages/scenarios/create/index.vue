<template>
  <div class="scenarios-create">
    <loader-screen :is-loading="isLoading" />
    <h1 class="scenarios-create__header">
      Создание сценария
    </h1>
    <div class="scenarios-create__search">
      <label for="scenario-name">
        Введите название сценария
      </label>
      <input v-model="scenarioName" type="text" placeholder="Название сценария" required>
    </div>
    <div class="scenarios-create__selected-list">
      <h2 class="scenarios-create__selected-list-header">
        Выбранные устройства
      </h2>
      <div
        v-for="groupId in Object.keys(selectedDevice)"
        :key="groupId"
        class="scenarios-create__selected-list-group"
      >
        <h3 class="scenarios-create__selected-list-group-header">
          {{ roomsName[groupId] }}
        </h3>
        <div class="scenarios-create__selected-list-group-devices">
          <scenario-service
            v-for="service in selectedDevice[groupId]"
            :id="service.id"
            :key="service.id"
            :is-preview="false"
            :name="service.name"
            :capabilities="service.capabilities"
            :type="service.type"
            :group-id="service.groupId"
            :device-icon="service.deviceIcon"
            @left-mouse-click="e=>{selectDevice(e);toggleSelected(service.id, data)}"
            @update-capability="e=>{setCapability(e);}"
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
      <div v-if="filteredGroups.length" class="scenarios-create__available-list">
        <group-list
          v-for="groups in filteredGroups"
          :id="groups.id"
          :key="groups.id"
          :devices="groups?.devices"
          :inverse-parent="groups.inverseParent"
          :name="groups?.name"
          :hide-empty="true"
          :hide-sensors="true"
          :is-scenarios="true"
          @get-data="e=>{selectDevice(e);toggleSelected(e.id, data)}"
        />
      </div>
      <div v-else class="scenarios-create__available-list --empty">
        <h2>Группа не найдена</h2>
      </div>
    </div>
    <div class="scenarios-create__save">
      <button class="scenarios-create__submit" @click="createScenario()">
        Сохранить
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
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

export interface ICapability {
  chanel:string
  deviceId:string
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
const selectedDevice = ref<{ [key:string]: ServiceProps[] }>({})
const capabilities = ref<{ [key: string]: ServiceProps['capabilities'][] }>({})
const roomsName:{[key:string]:string} = {}
const scenarioName = ref()
const searchGroupInput = ref('')
const flatGroupsArray = ref<IGroupResponseItem[]>([])
const filteredGroups = computed(() => flatGroupsArray.value.filter(el => el.name?.toLowerCase().includes(searchGroupInput.value.toLowerCase())))
function expandGroups (groups:IGroupResponseItem):IGroupResponseItem[] {
  if (groups?.devices?.length) {
    flatGroupsArray.value.push({ ...groups, inverseParent: [] })
  }
  if (groups?.inverseParent?.length) {
    for (const group of groups?.inverseParent) {
      if (group?.id) {
        expandGroups(group)
      }
    }
  }
  return flatGroupsArray.value
}
expandGroups(data.value)

function selectDevice (service:ServiceProps) {
  const isDeviceExist = selectedDevice.value[service.groupId]?.findIndex(el => el.id === service.id)
  if (isDeviceExist > -1) {
    selectedDevice.value[service.groupId].splice(isDeviceExist, 1)
    delete capabilities.value[service.id]
  } else {
    if (selectedDevice.value[service.groupId]?.length > 0) {
      selectedDevice.value[service.groupId].push(service)
    } else {
      selectedDevice.value[service.groupId] = [service]
    }
    capabilities.value[service.id] = service.capabilities?.map((el) => {
      return { value: el.value, type: el.type, hsv: el.hsv }
    })
  }
}
function toggleSelected (id:string, data:IGroupResponseItem) {
  let idx = data.devices.findIndex(el => el.id === id)
  if (idx > -1) {
    data.devices[idx].selected = !data.devices[idx].selected
    return idx
  }
  if (data.inverseParent.length > 0) {
    for (let i = 0; i < data.inverseParent.length; i++) {
      if (idx > -1) { break }
      idx = toggleSelected(id, data.inverseParent[i])
    }
  }
  return idx
}
function setCapability (data:ICapability) {
  const capabilityIdx = capabilities.value[data.deviceId + '_ch' + data.chanel].findIndex(el => el.type === data.type)
  capabilities.value[data.deviceId + '_ch' + data.chanel][capabilityIdx] =
      { ...capabilities.value[data.deviceId + '_ch' + data.chanel][capabilityIdx], value: data.value, hsv: data.hsv, range: data.range }
  if (data.instance?.includes('bright')) {
    const colorCapabilityIdx = capabilities.value[data.deviceId + '_ch' + data.chanel]?.findIndex(el => el.type.includes('color'))
    if (colorCapabilityIdx > -1) {
      capabilities.value[data.deviceId + '_ch' + data.chanel][colorCapabilityIdx] = { ...capabilities.value[data.deviceId + '_ch' + data.chanel][colorCapabilityIdx], hsv: { ...capabilities.value[data.deviceId + '_ch' + data.chanel][colorCapabilityIdx].hsv, v: Number(data.value) } }
    }
  }
}

function getRoomsName (data:IGroupResponseItem) {
  roomsName[data?.id as string] = data.name
  for (let i = 0; i < data.inverseParent?.length; i++) {
    getRoomsName(data.inverseParent[i])
  }
}
getRoomsName(data.value)

async function createScenario () {
  if (!scenarioName.value.length) {
    useNotification('error', 'Введите название сценария')
    return
  }
  if (!Object.entries(capabilities.value).length) {
    useNotification('error', 'Не выбраны устройства')
    return
  }
  isLoading.value = true
  await useScenarioStore().createScenario({ name: scenarioName.value, devicesValueStates: capabilities.value })
  isLoading.value = false
}
</script>

<style lang="scss">
@import "assets/styles/page/scenarios-create";

</style>

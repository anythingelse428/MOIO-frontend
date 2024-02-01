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
      <input v-model="scenarioName" type="text" placeholder="Название сценария">
    </div>
    <div class="scenarios-create__selected-list">
      <h2 class="scenarios-create__selected-list-header">
        Выбранные устройства
      </h2>
      <!--        v-for="groupId in Object.keys(selectedDevice)"-->
      <!--        :key="groupId"-->
      <div
        class="scenarios-create__selected-list-group"
      >
        <!--        <h3 class="scenarios-create__selected-list-group-header">-->
        <!--          {{ roomsName[groupId] }}-->
        <!--        </h3>-->
        <div class="scenarios-create__selected-list-group-devices">
          <scenario-service
            v-for="service in selectedDevice"
            :id="service.id"
            :key="service.id"
            :is-preview="false"
            :name="service.name"
            :capabilities="service.capabilities"
            :type="service.type"
            :group-id="service.groupId"
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
import type { Service } from "~/components/Service/TheService.vue"
import ScenarioService from "~/components/Scenarios/ScenarioService.vue"
import type { IGroupResponseItem } from "~/api/group/getById"
import type { GroupList } from "~/components/Group/GroupList.vue"
import { useScenarioStore } from "~/store/scenario"
import type { IScenarioUpdateProps } from "~/api/scenarios/update"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
export interface ICapability {
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
const isLoading = ref(false)
const groupStore = useGroupsStore()
const data = ref(await groupStore.getGroupById(groupStore.currentHome))
isLoading.value = true
// const selectedDevice = ref<{ [key:string]: Service[] }>({})
const selectedDevice = ref<Service[]>([])
const capabilities = ref<{ [key: string]: Service['capabilities'][] }>({})
const roomsName:{[key:string]:string} = {}
const scenarioName = ref('')
const searchGroupInput = ref('')
const devicesForRemove = ref<string[]>([])
function filterGroups (data:IGroupResponseItem, groupName:string) {
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

function selectDevice (service:Service) {
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
  if (data.inverseParent.length > 0) {
    for (let i = 0; i < data.inverseParent.length; i++) {
      if (idx > -1) { break }
      idx = toggleSelected(id, data.inverseParent[i])
    }
  }
  return idx
}
function setCapability (data:ICapability) {
  const id = data.id ?? data.deviceId
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
  isLoading.value = false
  const response = await scenarioStore.getById(router.params.id as string)
  selectedDevice.value = response?.devicesScenarios
  scenarioName.value = response?.name
  selectedDevice.value.forEach((el) => {
    toggleSelected(el.id, data.value)
    if (capabilities.value[el.id]) {
      capabilities.value[el.id].push(...el.capabilities)
    } else {
      capabilities.value[el.id] = el.capabilities
    }
  })
  isLoading.value = true
}
getData()
async function updateScenario () {
  const updateData:IScenarioUpdateProps = {
    id: router.params.id as string,
    name: scenarioName.value,
    devicesValueStates: capabilities.value,
    removeDevicesId: devicesForRemove.value,
  }
  await scenarioStore.updateScenario(updateData)
}

async function deleteScenario () {
  await scenarioStore.deleteScenario(router.params.id as string)
}
</script>

<style lang="scss">
.scenarios-create {
  padding: 0 96px 100px;
  @media screen and (max-width: 700px) {
    padding: 0 20px 100px;
  }
  .group__header{
    font-size: 25px;
    font-weight: 400;
    width: 100%;
    text-align: center;
  }
  .group-list{
    margin-top: 36px;
    margin-inline: 0;
    &.--child{
      margin-left: 0;
    }
    .subgroup-item__service-list {
      display: flex;
      flex-wrap: wrap;
      gap:28px;
      justify-content: center;
    }
  }
  .service{
    width: calc(25% - 22px);
    min-width: 200px;
    padding: 14px 8px;
    aspect-ratio: auto;
    border-radius: 12px;
    background: $settings-color;
    border: 1px solid transparent;
    &.--active {
      box-shadow: 0px 0px 16px 0px $color-active;
      border: 1px solid $color-active;
    }
    &:not(.--active){
      box-shadow: none;
    }
    .service-info{
      display: flex;
      .service-name{
        margin-top: 0;
        font-size: 16px;
        font-weight: 700;
        margin-left: 22px;
      }
      .service-ico-wrapper {
        width: 26px;
        height: 38px;
        display: flex;
        align-items: center;
        margin: 0;
        .mdi{
          font-size: 28px;
        }
      }
    }
    .mdi.mdi-delete {
      position: absolute;
      bottom: 12px;
      right: 16px;
      font-size: 16px;
      color: #D15151;
    }
  }
  .scenarios-create__header{
    font-size: 40px;
    font-weight: 600;
    color: $color-primary;
    text-align: center;
  }
  &__search{
    display: flex;
    flex-direction: column;
    gap:12px;
    width: min(95%, 346px);
    margin-inline: auto;
    margin-top: 48px;
    label{
      font-size: 20px;
      font-weight: 400;
      color: $color-primary;
      text-align: center;
    }
    input {
      border-radius: 16px;
      background: $settings-color;
      padding: 8px 16px;
      display: inline-block;
      outline: none;
      border: none;
      font-size: 20px;
      text-align: center;
      color: $color-active;
      &::placeholder{
        color: $color-active;

      }
    }
  }
  &__selected-list {
    display: flex;
    flex-direction: column;
    margin-top: 60px;
    &-header{
      width: 100%;
      font-size: 24px;
      font-weight: 400;
      color: $color-primary;
    }
  }
  &__selected-list-group{
    display: flex;
    flex-wrap: wrap;
    padding-inline: 1.25em;
    gap: 20px;
    &-header {
      font-size: 20px;
      font-weight: 400;
      color: $color-primary;
      width: 100%;
      margin-top: 16px;
    }
    &-devices{
      display: flex;
      flex-wrap: wrap;
      gap:28px 30px;
      padding-inline: 1em;
      margin-top: 24px;
    }
  }
  &__available{
    &-header{
      width: 100%;
      font-size: 30px;
      font-weight: 400;
      text-align: center;
      margin-top: 48px;
    }
    .scenarios-create__search{
      margin-top: 24px;
    }
    &-list{
      margin-top: 28px;
      &.--empty{
        text-align: center;
      }
    }
  }
  &__save{
    margin-top: 180px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap:32px;
    .scenarios-create__submit{
      display: block;
      width: fit-content;
      font-size: 24px;
      font-weight: 600;
      color: $color-accent;
      background: $color-active;
      padding: 4px 14px;
      border-radius: 16px;
      border: 0;
      cursor: pointer;
      &.--delete{
        background: #D15151;
      }
    }
  }

}
</style>

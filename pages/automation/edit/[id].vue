<template>
  <div class="automation">
    <loader-screen :is-loading="isLoading" />
    <h1 class="automation__header">
      Настройка автоматизации
    </h1>
    <form class="automation__params" method="post" @submit.prevent="update()">
      <div class="automation__params-main">
        <div class="automation__param">
          <div class="automation__param-label">
            Название автоматизации
          </div>
          <input
            v-model="name"
            class="automation__param-input"
            type="text"
            autocomplete="false"
            required
          >
        </div>
      </div>
      <div class="automation__conditions-container">
        <h2 class="automation__subheader">
          Условия
        </h2>

        <ui-modal
          :is-shown="isConditionModalShow"
          transition-content-name="translate"
          backdrop-filter="blur(5px)"
          width="536px"
          @click-outside="isConditionModalShow=false"
        >
          <template #inner>
            <automation-add-condition
              @hide-modal="isConditionModalShow=false"
              @add-condition="e=>{setCondition(newConditions.length + oldConditions.length + 1,e,undefined);isConditionModalShow = false}"
            />
          </template>
        </ui-modal>
        <div v-for="(item,i) in oldConditions" :key="item.id" class="automation__conditions">
          <automation-condition
            :type="item.type"
            :time="item.type === 'time' ? item.value.time : undefined"
            :time-range="item.type === 'time-range' ? item.value.timeRange : undefined"
            :automation-condition="item.type === 'temperature' ? item.value.automationCondition : undefined"
            :temperature-range="item.type === 'temperature' ? item.value.temperatureRange : undefined"
            :sensors="sensors"
            :device-id="item.type === 'sensor' || item.type === 'temperature' ? item.value.deviceId : undefined"
            :editable="false"
            :idx="i+1"
          />
          <ui-button
            class-name="delete-outline"
            class="automation__conditions-delete"
            rounded="12px"
            margin-inline="0"
            @click.prevent="deleteCondition(item.id)"
          >
            Удалить
          </ui-button>
        </div>
        <div v-for="(item,i) in newConditions" :key="item.id+i" class="automation__conditions">
          <automation-condition
            :type="item.type"
            :time="item.type === 'time' ? item.value.time : undefined"
            :time-range="item.type === 'time-range' ? item.value.timeRange : undefined"
            :automation-condition="item.type === 'temperature' ? item.value.automationCondition : undefined"
            :temperature-range="item.type === 'temperature' ? item.value.temperatureRange : undefined"
            :sensors="sensors"
            :device-id="item.type === 'sensor' || item.type === 'temperature' ? item.value.deviceId : undefined"
            :editable="true"
            :idx="i+oldConditions.length+1"
            @select-option="e=>setCondition(item.id, e?.type, e.value)"
          />
          <ui-button
            class-name="delete-outline"
            class="automation__conditions-delete"
            rounded="12px"
            margin-inline="0"
            @click.prevent="deleteCondition(item.id)"
          >
            Удалить
          </ui-button>
          <ui-modal
            :is-shown="isTemperatureModalShow"
            width="432px"
            backdrop-filter="blur(3px)"
            transition-content-name="translate"
            transition-fade-name="fade"
          >
            <template #inner>
              <AutomationSelectRangeModal
                :name="sensors.find(el=>el.id === item.value.deviceId)?.name || ''"
                :range="sensors.find(el=>el.id === item.value.deviceId)?.range"
                @save-automation-condition="e=>{applyAutomationCondition(item.id, e)}"
                @save-temperature-range="e=>{applyTemperatureRangeCondition(item.id, e)}"
              />
            </template>
          </ui-modal>
        </div>
      </div>
      <ui-button
        rounded="16px"
        class="automation__add-condition"
        @click.prevent="setShowConditionalModal()"
      >
        Добавить условие
      </ui-button>

      <div class="scenarios">
        <h2 class="automation__subheader">
          Сценарий
        </h2>
        <ui-any-list-item
          v-for="scenario in existingScenarios"
          :key="scenario.id"
          :class="`scenario-item ${scenarios.findIndex(el=>el===scenario.id)>-1?'--active':''}`"
          @click="selectScenarios(scenario.id)"
        >
          <template #title>
            {{ scenario.name }}
          </template>
        </ui-any-list-item>
      </div>
      <div class="automation__submit-container">
        <ui-button
          margin-inline="0"
          class="automation__delete"
          rounded="16px"
          class-name="delete"
          @click.prevent="deleteAutomation()"
        >
          Удалить
        </ui-button>
        <ui-button
          type="submit"
          rounded="16px"
          margin-inline="0"
        >
          Сохранить
        </ui-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import UiModal from "~/components/ui/UiModal.vue"
import { useScenarioStore } from "~/store/scenario"
import { useAutomationStore } from "~/store/autmation"

import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import type { IAutomationUpdateProps } from "~/api/automations/update"
import { useGroupsStore } from "~/store/groups"
import { type IGroupResponseItem } from "~/api/group/getById"
import type { ServiceProps } from "~/components/Service/TheService.vue"
import { type IAutomationValue } from "~/api/automations/create"
import type { AutomationConditionTypes } from "~/components/Automation/AutomationCondition.vue"
import type { IAutomationSensor } from "~/pages/automation/create/index.vue"

const route = useRoute()
const isLoading = ref(true)
const groupStore = useGroupsStore()
const automationStore = useAutomationStore()

const id = route.params.id
const name = ref('')

const oldConditions = ref<{value:IAutomationValue, type:AutomationConditionTypes, id:string}[]>([])
const newConditions = ref<{value:IAutomationValue, type:AutomationConditionTypes, id:number}[]>([])
const removeCondition = ref<string[]>([])

const scenarios = ref<string[]>([])
const existingScenarios = await useScenarioStore().getAll()
isLoading.value = false

const runByAllConditions = ref(true)

const isTemperatureModalShow = ref(false)
const isConditionModalShow = ref(false)
const sensors = ref<IAutomationSensor[]>([])

function setShowConditionalModal () {
  if (sensors.value.length > 0 && oldConditions.value.filter(el => el.type === 'time').length === 0 && newConditions.value.filter(el => el.type === 'time').length === 0) {
    isConditionModalShow.value = true
    return
  }
  newConditions.value.push({
    type: 'time',
    id: oldConditions.value.length + newConditions.value.length + 1,
    value: { time: `${new Date().getHours()}:${new Date().getMinutes()}` },
  })
}
function applyTemperatureRangeCondition (conditionId:number, range:Exclude<IAutomationValue["temperatureRange"], undefined>) {
  const id = newConditions.value.findIndex(el => el.id === conditionId)
  if (typeof range?.min !== "undefined" && typeof range?.max !== "undefined" && id > -1) {
    newConditions.value[id].value.temperatureRange = { ...range }
    newConditions.value[id].value.automationCondition = undefined
  }
  isTemperatureModalShow.value = false
}
function applyAutomationCondition (conditionId:number, automationCondition:Exclude<IAutomationValue["automationCondition"], undefined>) {
  const id = newConditions.value.findIndex(el => el.id === conditionId)
  if (typeof automationCondition?.condition !== "undefined" && typeof automationCondition?.value !== "undefined" && id > -1) {
    newConditions.value[id].value.automationCondition = { ...automationCondition }
    newConditions.value[id].value.temperatureRange = undefined
  }
  isTemperatureModalShow.value = false
}
function selectOnlySensors (group:IGroupResponseItem, arr:ServiceProps[] = []) {
  arr.push(...group.devices.filter(el => el.id.includes('_sen') || el.type.includes('temp') || el.type.includes('therm')))
  group.inverseParent?.forEach(el => selectOnlySensors(el, arr))
  return arr
}

sensors.value = selectOnlySensors(await groupStore.getGroupById(groupStore.currentHome)).map((el) => {
  return {
    id: el.id,
    name: el.name,
    type: el.type,
    range: el.capabilities?.find(el => el.type.includes('range'))?.range,
  }
})

function deleteCondition (id:any) {
  if (!Number.isSafeInteger(id)) {
    const oldConditionIdx = oldConditions.value.findIndex(el => el.id === id)
    removeCondition.value.push(oldConditions.value[oldConditionIdx].id)
    oldConditions.value.splice(
      oldConditionIdx,
      1,
    )
    return
  }
  newConditions.value.splice(newConditions.value.findIndex(el => el.id === id), 1)
}
function setCondition (id:number, type:AutomationConditionTypes, value?:any) {
  const isSensorCondition = type === 'sensor' || type === 'temperature'
  const sensorProps = (id:string) => isSensorCondition ? sensors.value.find(el => el.id === id) : undefined
  const isTemperatureSensor = (id:string) => isSensorCondition ? sensorProps(id)?.type?.includes('temp') || sensorProps(id)?.type?.includes('therm') : undefined
  const isConditionExist = newConditions.value.findIndex(el => el.id === id)

  if (isTemperatureSensor(value || '') && newConditions.value[isConditionExist]?.value?.deviceId === value) {
    isTemperatureModalShow.value = true
    return
  }

  const isSensorConditionExist = newConditions.value.find(el => el.type === 'sensor' || el.type === 'temperature') || oldConditions.value.find(el => el.type === 'sensor' || el.type === 'temperature')
  const validInitialTime = `${new Date().getHours()}:${new Date().getMinutes()}`

  if (isConditionExist > -1) {
    if (!isSensorCondition) {
      if (isSensorConditionExist) {
        newConditions.value[isConditionExist].value = {
          timeRange: value,
        }
        newConditions.value[isConditionExist].type = 'time-range'
        return
      }
      newConditions.value[isConditionExist].value = { time: value }
      newConditions.value[isConditionExist].type = 'time'
      return
    }
    if (isSensorCondition) {
      newConditions.value[isConditionExist].value = {
        deviceId: value,
      }
      newConditions.value[isConditionExist].type = isTemperatureSensor(value || '') ? 'temperature' : 'sensor'
      if (isTemperatureSensor(value || '')) {
        isTemperatureModalShow.value = true
      }
      newConditions.value.forEach((el) => {
        if (el.type === 'time') { el.type = 'time-range' }
      })
      return
    }
  }
  if (isConditionExist === -1) {
    if (!isSensorCondition) {
      if (isSensorConditionExist) {
        newConditions.value.push({
          id: newConditions.value.length + oldConditions.value.length + 1,
          type: 'time-range',
          value: {
            timeRange: {
              startTime: validInitialTime,
              endTime: validInitialTime,
            },
          },
        })
        return
      }
      newConditions.value.push({
        id: newConditions.value.length + oldConditions.value.length + 1,
        type: 'time',
        value: { time: validInitialTime },
      })
      return
    }
    if (isSensorCondition) {
      newConditions.value.push({
        id: newConditions.value.length + oldConditions.value.length + 1,
        type: isTemperatureSensor(sensors.value[0].id) ? 'temperature' : 'sensor',
        value: { deviceId: sensors.value[0].id },
      })
      if (isTemperatureSensor(sensors.value[0].id)) {
        isTemperatureModalShow.value = true
      }
    }
  }
}

function selectScenarios (id:string) {
  const isScenarioExist = scenarios.value.findIndex(el => el === id)
  if (isScenarioExist > -1) {
    scenarios.value.splice(isScenarioExist, 1)
    return
  }
  scenarios.value.push(id)
}
async function update () {
  if (!name.value.length) {
    useNotification("error", "Введите название автоматизации")
    return
  }
  if (name.value.length > 30) {
    useNotification("error", "Название автоматизации не должно превышать 30 символов")
    return
  }
  if (!newConditions.value.length && !oldConditions.value.length) {
    useNotification("error", "Не выбрано условие активации")
    return
  }
  if (!scenarios.value.length) {
    useNotification("error", "Не выбран сценарий")
    return
  }
  isLoading.value = true
  let isSensorsValid = true
  const newTriggersArr:IAutomationUpdateProps['newTriggers'] = []

  for (const iAutomationValue of newConditions.value) {
    const isSensorCondition = iAutomationValue.type === 'sensor' || iAutomationValue.type === 'temperature'
    if (!iAutomationValue.value.deviceId && isSensorCondition) {
      isSensorsValid = false
      useNotification('error', 'Не выбран датчик для условия с датчиком')
      break
    }
    if (isSensorCondition) {
      newTriggersArr.push({ ...iAutomationValue.value })
    }
    if (iAutomationValue.type === 'time') {
      newTriggersArr.push({ time: new Date(`2077 ${iAutomationValue.value.time}`).toISOString() })
    }
    if (iAutomationValue.type === 'time-range') {
      newTriggersArr.push({
        timeRange: {
          startTime: new Date(`2077 ${iAutomationValue.value.timeRange?.startTime}`).toISOString(),
          endTime: new Date(`2077 ${iAutomationValue.value.timeRange?.endTime}`).toISOString(),
        },
      })
    }
  }

  newConditions.value.forEach((el) => {
    if (!el.value.deviceId && (el.type === 'sensor' || el.type === 'temperature')) {
      isSensorsValid = false
      useNotification('error', 'Не выбран датчик для условия с датчиком')
    }
    if (el.type === 'time') {
      return
    }
    return el.value
  })

  const automationData:IAutomationUpdateProps = {
    id: id as string,
    name: name.value,
    scenarios: scenarios.value.map((el, id) => {
      return {
        scenarioId: el,
        orderId: id,
      }
    }),
    newTriggers: newTriggersArr,
    removeTriggersIds: removeCondition.value,
    allConditions: runByAllConditions.value,
  }
  isSensorsValid && await automationStore.update(automationData)
  // console.log(automationData, response)
  isLoading.value = false
}

async function getData () {
  isLoading.value = true
  const response = await automationStore.getById(id as string)
  isLoading.value = false
  const getValidTimePart = (part:string|number) => String(part).length === 1 ? '0' + part : part
  if (!response?.id?.length || !response?.name?.length) {
    useRouter().push('/automation')
  }
  scenarios.value = response.scenarios.map(el => el.scenarioId)
  name.value = response.name
  response.triggers?.time?.forEach((el) => {
    const timePoint = new Date(`2077 ${el.time} UTC`)
    oldConditions.value.push({
      id: el.automationTriggerId,
      type: "time",
      value: {
        time:
            `${getValidTimePart(timePoint.getHours())}:${getValidTimePart(timePoint.getMinutes())}`,
      },
    })
  })
  response.triggers?.rangeTime?.forEach((el) => {
    const startTime = new Date(`2077 ${el.startTime} UTC`)
    const endTime = new Date(`2077 ${el.endTime} UTC`)
    oldConditions.value.push({
      id: el.automationTriggerId,
      type: "time-range",
      value: {
        timeRange: {
          startTime: `${getValidTimePart(startTime.getHours())}:${getValidTimePart(startTime.getMinutes())}`,
          endTime: `${getValidTimePart(endTime.getHours())}:${getValidTimePart(endTime.getMinutes())}`,
        },
      },
    })
  })
  response.triggers?.sensors?.forEach((el) => {
    oldConditions.value.push({
      id: el.automationTriggerId,
      type: el.condition || el.temperatureRange ? 'temperature' : 'sensor',
      value: {
        deviceId: el.id,
        temperatureRange: el.temperatureRange,
        automationCondition: el.condition,
      },
    })
  })
}
getData()

async function deleteAutomation () {
  isLoading.value = true
  await automationStore.deleteAutomation(id as string)
  isLoading.value = false
}
</script>

<style lang="scss">
@import "assets/styles/page/automation-create";
</style>

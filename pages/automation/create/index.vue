<template>
  <div class="automation">
    <loader-screen :is-loading="isLoading" />
    <h1 class="automation__header">
      Настройка автоматизации
    </h1>
    <form class="automation__params" method="post" @submit.prevent="create()">
      <div class="automation__params-main">
        <div class="automation__param">
          <div class="automation__param-label">
            Название автоматизации
          </div>
          <input v-model="name" class="automation__param-input" type="text" autocomplete="false" required>
        </div>
      </div>
      <div class="automation__conditions-container">
        <h2 class="automation__subheader">
          Условия
        </h2>
        <ui-modal
          width="536px"
          :is-shown="isConditionModalShow"
          transition-content-name="translate"
          backdrop-filter="blur(5px)"
          @click-outside="isConditionModalShow = false"
        >
          <template #inner>
            <automation-add-condition
              @hide-modal="isConditionModalShow=false"
              @add-condition="e=>{
                setCondition(conditions.length + 1, e ,undefined);
                isConditionModalShow = false
              }"
            />
          </template>
        </ui-modal>
        <div
          v-for="(item, i) in conditions"
          :key="item.id"
          class="automation__conditions"
        >
          <automation-condition
            :type="item.type"
            :time="item.type === 'time' ? item.value.time : undefined"
            :time-range="item.type === 'time-range' ? item.value.timeRange : undefined"
            :automation-condition="item.type === 'temperature' ? item.value.automationCondition : undefined"
            :temperature-range="item.type === 'temperature' ? item.value.temperatureRange : undefined"
            :sensors="sensors"
            :device-id="item.type === 'sensor' || item.type === 'temperature' ? item.value.deviceId : undefined"
            :idx="i + 1"
            @select-option="e=>setCondition(item.id, item.type, e.value)"
          />
          <ui-button
            margin-inline="0"
            class-name="delete-outline"
            rounded="12px"
            class="automation__conditions-delete"
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
        @click.prevent="setShowConditionalModal"
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
        <ui-button type="submit" rounded="16px">
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
import type { IAutomationCreateProps, IAutomationValue } from "~/api/automations/create"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import { useGroupsStore } from "~/store/groups"
import type { IGroupResponseItem } from "~/api/group/getById"
import type { ICapability, ServiceProps } from "~/components/Service/TheService.vue"
import type { AutomationConditionTypes } from "~/components/Automation/AutomationCondition.vue"

export interface IAutomationSensor {
  id:string
  name:string
  type:string
  range?:ICapability["range"]
}
const isLoading = ref(false)
const isConditionModalShow = ref(false)
const isTemperatureModalShow = ref(false)
const conditions = ref<{value:IAutomationValue, type:AutomationConditionTypes, id:number}[]>([])
const groupStore = useGroupsStore()
const scenarios = ref<string[]>([])
const name = ref('')
const sensors = ref<IAutomationSensor[]>([])
const scenarioStore = useScenarioStore()
const automationStore = useAutomationStore()
const existingScenarios = await scenarioStore.getAll()
function setShowConditionalModal () {
  if (sensors.value.length > 0 && conditions.value.filter(el => el.type === 'time').length === 0) {
    isConditionModalShow.value = true
    return
  }
  conditions.value.push({
    type: 'time',
    id: conditions.value.length + 1,
    value: { time: `${new Date().getHours()}:${new Date().getMinutes()}` },
  })
}

function deleteCondition (id:number) {
  conditions.value.splice(
    conditions.value.findIndex(el => el.id === id),
    1,
  )
  const isSensorConditionExist = conditions.value.find(el => el.type === 'sensor' || el.type === 'temperature')
  if (!isSensorConditionExist) {
    conditions.value.forEach((el) => {
      if (el.type === 'time-range') {
        el.type = 'time'
      }
    })
  }
}
function applyTemperatureRangeCondition (conditionId:number, range:Exclude<IAutomationValue["temperatureRange"], undefined>) {
  const id = conditions.value.findIndex(el => el.id === conditionId)
  if (typeof range?.min !== "undefined" && typeof range?.max !== "undefined" && id > -1) {
    conditions.value[id].value.temperatureRange = { ...range }
    conditions.value[id].value.automationCondition = undefined
  }
  isTemperatureModalShow.value = false
}
function applyAutomationCondition (conditionId:number, automationCondition:Exclude<IAutomationValue["automationCondition"], undefined>) {
  const id = conditions.value.findIndex(el => el.id === conditionId)
  if (typeof automationCondition?.condition !== "undefined" && typeof automationCondition?.value !== "undefined" && id > -1) {
    conditions.value[id].value.automationCondition = { ...automationCondition }
    conditions.value[id].value.temperatureRange = undefined
  }
  isTemperatureModalShow.value = false
}
function setCondition (id:number, type:AutomationConditionTypes, value?:any) {
  const isSensorCondition = type === 'sensor' || type === 'temperature'
  const sensorProps = (id:string) => isSensorCondition ? sensors.value.find(el => el.id === id) : undefined
  const isTemperatureSensor = (id:string) => isSensorCondition ? sensorProps(id)?.type?.includes('temp') || sensorProps(id)?.type?.includes('therm') : undefined
  const isConditionExist = conditions.value.findIndex(el => el.id === id)

  if (isTemperatureSensor(value || '') && conditions.value[isConditionExist]?.value?.deviceId === value) {
    isTemperatureModalShow.value = true
    return
  }

  const isSensorConditionExist = conditions.value.find(el => el.type === 'sensor' || el.type === 'temperature')
  const validInitialTime = `${new Date().getHours()}:${new Date().getMinutes()}`


  if (isConditionExist > -1) {
    if (!isSensorCondition) {
      if (isSensorConditionExist) {
        conditions.value[isConditionExist].value = {
          timeRange: value,
        }
        conditions.value[isConditionExist].type = 'time-range'
        return
      }
      conditions.value[isConditionExist].value = { time: value }
      conditions.value[isConditionExist].type = 'time'
      return
    }
    if (isSensorCondition) {
      conditions.value[isConditionExist].value = {
        deviceId: value,
      }
      conditions.value[isConditionExist].type = isTemperatureSensor(value || '') ? 'temperature' : 'sensor'
      if (isTemperatureSensor(value || '') && conditions.value[isConditionExist].value?.deviceId === value) {
        isTemperatureModalShow.value = true
      }
      conditions.value.forEach((el) => {
        if (el.type === 'time') { el.type = 'time-range' }
      })
      return
    }
  }
  if (isConditionExist === -1) {
    if (!isSensorCondition) {
      if (isSensorConditionExist) {
        conditions.value.push({
          id: conditions.value.length + 1,
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
      conditions.value.push({
        id: conditions.value.length + 1,
        type: 'time',
        value: { time: validInitialTime },
      })
      return
    }
    if (isSensorCondition) {
      conditions.value.push({
        id: conditions.value.length + 1,
        type: isTemperatureSensor(sensors.value[0].id) ? 'temperature' : 'sensor',
        value: { deviceId: sensors.value[0].id },
      })
      nextTick(() => {
        if (isTemperatureSensor(sensors.value[0].id) && conditions.value[conditions.value.length - 1].value.deviceId === value) {
          isTemperatureModalShow.value = true
        }
      })
    }
  }
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
function selectScenarios (id:string) {
  const isScenarioExist = scenarios.value.findIndex(el => el === id)
  if (isScenarioExist > -1) {
    scenarios.value.splice(isScenarioExist, 1)
    return
  }
  scenarios.value.push(id)
}

async function create () {
  if (!name.value?.length) {
    useNotification("error", "Введите название автоматизации")
    return
  }
  if (name.value.length > 30) {
    useNotification("error", "Название автоматизации не должно превышать 30 символов")
    return
  }
  if (!conditions.value?.length) {
    useNotification("error", "Не выбрано условие активации")
    return
  }
  if (!scenarios.value?.length) {
    useNotification("error", "Не выбран сценарий")
    return
  }
  isLoading.value = true
  let isSensorsValid = true
  const automationData:IAutomationCreateProps = {
    name: name.value,
    value: conditions.value.map((el) => {
      if ((el.type === "sensor" || el.type === "temperature") && !el.value?.deviceId?.length) {
        useNotification('error', `Не выбран датчик для условия ${el.id}`)
        isSensorsValid = false
      }
      if (el.type === 'time') {
        el.value.time = new Date(`2077 ${el.value.time}`).toISOString()
      }
      if (el.type === 'time-range') {
        el.value.timeRange = {
          startTime: new Date(`2077 ${el.value.timeRange?.startTime}`).toISOString(),
          endTime: new Date(`2077 ${el.value.timeRange?.endTime}`).toISOString(),
        }
      }
      return unref(el.value)
    }),
    scenariosOrder: scenarios.value.map((el, id) => {
      return {
        scenarioId: el,
        orderId: id,
      }
    }),
  }
  isSensorsValid && await automationStore.create(automationData)
  isLoading.value = false
}
</script>

<style lang="scss">
@import "assets/styles/page/automation-create";
</style>

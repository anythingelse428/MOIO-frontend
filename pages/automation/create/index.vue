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
          <input v-model="name" class="automation__param-input" type="text" autocomplete="false">
        </div>
      </div>
      <div class="automation__conditions-container">
        <h2 class="automation__subheader">
          Условия
        </h2>
        <div class="automation__run-conditions">
          <div class="automation__description">
            Автоматизация выполнится если:
          </div>
          <div :class="`automation__run-condition  ${!runByAllConditions ? ' --active' : ''}`">
            <label for="run_condition" class="automation__run-condition-description">
              Если срабатывает одно условие
            </label>
            <input
              id="run_condition" type="radio" name="run_condition" :checked="!runByAllConditions" @input="runByAllConditions=false"
            >
          </div>
          <div :class="`automation__run-condition ${runByAllConditions ? ' --active' : ''}`">
            <label for="run_condition" class="automation__run-condition-description">Если срабатывают все условия</label>
            <input
              id="run_condition" type="radio" name="run_condition" :checked="runByAllConditions" @input="runByAllConditions=true"
            >
          </div>
        </div>

        <the-modal :is-shown="showConditionModal" transition-content-name="translate" backdrop-filter="blur(5px)">
          <template #inner>
            <automation-add-condition @hide-modal="showConditionModal=false" @add-condition="e=>{conditions.push({type:e,id:conditions.length+1});showConditionModal = false}" />
          </template>
        </the-modal>
        <div v-for="item in conditions" :key="item.id" class="automation__conditions">
          <button @click.prevent="deleteCondition(item.id)">
            Удалить нахуй условие ебаное
          </button>
          <automation-condition :type="item.type" :sensors="sensors" :idx="item.id" @select-option="e=>addConditionInArr(item.id, e?.type, e.value)" />
        </div>
      </div>
      <button class="automation__add-condition" @click.prevent="showConditionModal = true">
        Добавить условие
      </button>
      <div class="scenarios">
        <h2 class="automation__subheader">
          Сценарий
        </h2>
        <div v-for="scenario in existingScenarios" :key="scenario.id" :class="`scenario-item ${scenarios.findIndex(el=>el===scenario.id)>-1?'--active':''}`" @click="selectScenarios(scenario.id)">
          {{ scenario.name }}
        </div>
      </div>
      <input type="submit" value="Добавить">
    </form>
  </div>
</template>

<script setup lang="ts">
import TheModal from "~/components/shared/TheModal.vue"
import { useScenarioStore } from "~/store/scenario"
import { useAutomationStore } from "~/store/autmation"
import type { IAutomationCreateProps } from "~/api/automations/create"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import { useGroupsStore } from "~/store/groups"
import type { IAllDevicesResponse } from "~/api/device/getAll"
import type { IGroupResponseItem } from "~/api/group/getById"
import type { Service } from "~/components/Service/TheService.vue"

const isLoading = ref(false)
const conditions = ref<{type:'sensor'|'time', id:number}[]>([])
const runByAllConditions = ref(true)
const showConditionModal = ref(false)
const acceptedConditions = ref<{id:number, type:'sensor'|'time', value:string}[]>([])
const groupStore = useGroupsStore()
const scenarios = ref<string[]>([])
const name = ref('')
const sensors = ref<Service[]>([])
const existingScenarios = await useScenarioStore().getAll()
function deleteCondition (id:number) {
  acceptedConditions.value.splice(
    acceptedConditions.value.findIndex(el => el.id === id),
    1,
  )
  conditions.value.splice(
    conditions.value.findIndex(el => el.id === id),
    1,
  )
}
function addConditionInArr (id:number, type:'sensor'|'time', value:string) {
  const isConditionExist = acceptedConditions.value.findIndex(el => el.id === id)
  const timeOffset = Date()?.match(/GMT.\d\d:\d\d/gm) as string[]
  if (isConditionExist > -1 && type === 'time') {
    acceptedConditions.value[isConditionExist].value = `2077-01-24T${value}:00${timeOffset[0].replace('GMT', '')}`
    return
  }
  if (isConditionExist > -1 && type === 'sensor') {
    const elInValueExist = acceptedConditions.value[isConditionExist].value?.includes(value)
    if (elInValueExist) {
      acceptedConditions.value[isConditionExist].value = ''
      return
    }
    acceptedConditions.value[isConditionExist].value = value
    return
  }
  if (isConditionExist === -1 && type === "time") {
    acceptedConditions.value.push({ id, type, value: `2077-01-24T${value}:00${timeOffset[0].replace('GMT', '')}` })
  }
  if (isConditionExist === -1 && type === "sensor") {
    acceptedConditions.value.push({ id, type, value })
  }
}

function selectOnlySensors (group:IGroupResponseItem, arr:Service[] = []) {
  arr.push(...group.devices.filter(el => el.id.includes('_sen')))
  group.inverseParent.forEach(el => selectOnlySensors(el, arr))
  return arr
}

sensors.value = selectOnlySensors(await groupStore.getGroupById(groupStore.currentHome)).map((el) => {
  return {
    id: el.id,
    name: el.name,
    type: el.type,
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
const automationStore = useAutomationStore()
async function create () {
  isLoading.value = true
  const automationData:IAutomationCreateProps = {
    name: name.value,
    code: 'string',
    value: acceptedConditions.value.map(el => el.value),
    scenariosOrder: scenarios.value.map((el, id) => {
      return {
        scenarioId: el,
        orderId: id,
      }
    }),
    allConditions: runByAllConditions.value,
  }
  const response = await automationStore.create(automationData)
  isLoading.value = false
}
</script>

<style lang="scss">
@import "assets/styles/page/automation-create";
</style>

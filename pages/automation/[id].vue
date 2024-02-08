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
            <automation-add-condition @hide-modal="showConditionModal=false" @add-condition="e=>{newConditions.push({type:e,id:oldConditions.length+1});showConditionModal = false}" />
          </template>
        </the-modal>
        <div v-for="(item,i) in oldConditions" :key="item.id" class="automation__conditions">
          <button @click.prevent="deleteCondition(item.id)">
            Удалить нахуй условие ебаное {{ item.id }}
          </button>
          <automation-condition :type="item.type" :curr-time="item.value" :sensors="sensors" :editable="false" :idx="i+1" @select-option="e=>addConditionInArr(item.id, e?.type, e.value)" />
        </div>
        <div v-for="(item,i) in newConditions" :key="item.id" class="automation__conditions">
          <button @click.prevent="deleteCondition(item.id)">
            Удалить нахуй условие ебаное {{ item.id }}
          </button>
          <automation-condition :type="item.type" :curr-time="item.value" :sensors="sensors" :editable="true" :idx="i+oldConditions.length+1" @select-option="e=>addConditionInArr(item.id, e?.type, e.value)" />
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
      <button class="delete" @click.prevent="deleteAutomation()">
        DELETE
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import TheModal from "~/components/shared/TheModal.vue"
import { useScenarioStore } from "~/store/scenario"
import { useAutomationStore } from "~/store/autmation"

import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import type { IAutomationUpdateProps } from "~/api/automations/update"

const route = useRoute()
const id = route.params.id
const isLoading = ref(true)

const oldConditions = ref<{type:'sensor'|'time', id:any, value:string}[]>([])
const newConditions = ref<{type:'sensor'|'time', id:any, value:string}[]>([])
const removeCondition = ref<string[]>([])
const scenarios = ref<string[]>([])
const removeScenarios = ref<string[]>([])

const runByAllConditions = ref(true)
const showConditionModal = ref(false)
const sensors = ref<{id:string, name:string}[]>([])
const name = ref('')
const existingScenarios = await useScenarioStore().getAll()
isLoading.value = false

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
function addConditionInArr (id:string, type:'sensor'|'time', value:string) {
  const isConditionExist = newConditions.value.findIndex(el => el.id === id)
  const timeOffset = Date()?.match(/GMT.\d\d:\d\d/gm) as string[]
  if (isConditionExist > -1 && type === 'time') {
    newConditions.value[isConditionExist].value = `2077-01-24T${value}:00${timeOffset[0].replace('GMT', '')}`
    return
  }
  if (isConditionExist > -1 && type === 'sensor') {
    const elInValueExist = oldConditions.value[isConditionExist].value?.includes(value)
    if (elInValueExist) {
      newConditions.value[isConditionExist].value = ''
      return
    }
    newConditions.value[isConditionExist].value = value
    return
  }
  if (isConditionExist === -1 && type === "time") {
    newConditions.value.push({ id, type, value: `2077-01-24T${value}:00${timeOffset[0].replace('GMT', '')}` })
  }
  if (isConditionExist === -1 && type === "sensor") {
    newConditions.value.push({ id, type, value })
  }
}

function selectScenarios (id:string) {
  const isScenarioExist = scenarios.value.findIndex(el => el === id)
  if (isScenarioExist > -1) {
    removeScenarios.value.push(scenarios.value[isScenarioExist])
    scenarios.value.splice(isScenarioExist, 1)
    return
  }
  scenarios.value.push(id)
}
const automationStore = useAutomationStore()
async function create () {
  isLoading.value = true
  const automationData:IAutomationUpdateProps = {
    id: id as string,
    name: name.value,
    addScenarios: scenarios.value.map((el, id) => {
      return {
        scenarioId: el,
        orderId: id,
      }
    }),
    newTrigger: newConditions.value.map(el => el.value),
    removeScenariosIdList: removeScenarios.value,
    removeTriggersIdList: removeCondition.value,
    allConditions: runByAllConditions.value,
  }
  const response = await automationStore.update(automationData)
  console.log(automationData, response)
  isLoading.value = false
}

async function getData () {
  isLoading.value = true
  const response = await automationStore.getById(id as string)
  scenarios.value = response.scenarios.map(el => el.scenarioId)
  name.value = response.name
  response.triggers.time.forEach((el) => {
    const time = new Date(`7/07/2077 ${el.time} UTC`)
    oldConditions.value.push({ id: el.automationTriggerId, type: "time", value: `${time.getHours()}:${time.getMinutes()}` })
  })
  response.triggers.sensors.forEach((el) => {
    oldConditions.value.push({ id: el.automationTriggerId, type: 'sensor', value: el.sensor })
  })
  isLoading.value = false
}
getData()

async function deleteAutomation () {
  const r = await automationStore.deleteAutomation(id as string)
}
</script>

<style lang="scss">
@import "assets/styles/page/automation-create";
</style>

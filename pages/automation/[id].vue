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
          <div :class="`automation__run-condition  ${!runByAllConditions ? ' --active' : ''}`" @click="runByAllConditions=false">
            <label for="run_condition" class="automation__run-condition-description">
              Если срабатывает одно условие
            </label>
          </div>
          <div :class="`automation__run-condition ${runByAllConditions ? ' --active' : ''}`" @click="runByAllConditions=true">
            <label for="run_condition" class="automation__run-condition-description">Если срабатывают все условия</label>
          </div>
        </div>

        <the-modal :is-shown="showConditionModal" transition-content-name="translate" backdrop-filter="blur(5px)">
          <template #inner>
            <automation-add-condition @hide-modal="showConditionModal=false" @add-condition="e=>{newConditions.push({type:e,id:oldConditions.length+newConditions.length+1});showConditionModal = false}" />
          </template>
        </the-modal>
        <div v-for="(item,i) in oldConditions" :key="item.id" class="automation__conditions">
          <automation-condition
            :type="item.type"
            :curr-sensor="item.type==='sensor'?item.value:undefined"
            :curr-time="item.type==='time'?item.value as string:undefined"
            :editable="false"
            :idx="i+1"
          />
          <button class="automation__conditions-delete" @click.prevent="deleteCondition(item.id)">
            Удалить
          </button>
        </div>
        <div v-for="(item,i) in newConditions" :key="item.id+i" class="automation__conditions">
          <automation-condition
            :type="item.type"
            :curr-sensor="item.type === 'sensor'?{id:item.value,name:'',type:''}:undefined"
            :curr-time="item.type === 'time'?item.value:undefined"
            :sensors="sensors"
            :editable="true"
            :idx="i+oldConditions.length+1"
            @select-option="e=>addCondition(item.id, e?.type, e.value)"
          />
          <button class="automation__conditions-delete" @click.prevent="deleteCondition(item.id)">
            Удалить
          </button>
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
      <div class="automation__submit-container">
        <button class="automation__delete" @click.prevent="deleteAutomation()">
          Удалить
        </button>
        <input type="submit" value="Сохранить" class="automation__submit">
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import TheModal from "~/components/shared/TheModal.vue"
import { useScenarioStore } from "~/store/scenario"
import { useAutomationStore } from "~/store/autmation"

import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import type { IAutomationUpdateProps } from "~/api/automations/update"
import { useGroupsStore } from "~/store/groups"
import { type IGroupResponseItem } from "~/api/group/getById"
import type { ServiceProps } from "~/components/Service/TheService.vue"

const route = useRoute()
const isLoading = ref(true)
const groupStore = useGroupsStore()

const id = route.params.id
const name = ref('')

const oldConditions = ref<{type:'sensor'|'time', id:any, value:string|{ id: string, name: string, type:string }}[]>([])
const newConditions = ref<{type:'sensor'|'time', id:any, value:string}[]>([])
const removeCondition = ref<string[]>([])

const scenarios = ref<string[]>([])
const existingScenarios = await useScenarioStore().getAll()
isLoading.value = false

const runByAllConditions = ref(true)

const showConditionModal = ref(false)
const sensors = ref<{id:string, name:string, type:string}[]>([])


function selectOnlySensors (group:IGroupResponseItem, arr:ServiceProps[] = []) {
  arr.push(...group.devices.filter(el => el.id.includes('_sen')))
  group.inverseParent?.forEach(el => selectOnlySensors(el, arr))
  return arr
}

sensors.value = selectOnlySensors(await groupStore.getGroupById(groupStore.currentHome)).map((el) => {
  return {
    id: el.id,
    name: el.name,
    type: el.type,
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
function addCondition (id:string, type:'sensor'|'time', value:string) {
  const isConditionExist = newConditions.value.findIndex(el => el.id === id)
  if (isConditionExist > -1) {
    if (type === 'time') {
      newConditions.value[isConditionExist].value = value
      return
    }
    if (type === 'sensor') {
      newConditions.value[isConditionExist].value = value
      return
    }
  }
  if (isConditionExist === -1) {
    if (type === "time") {
      newConditions.value.push({ id, type, value })
    }
    if (type === "sensor") {
      newConditions.value.push({ id, type, value })
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
const automationStore = useAutomationStore()
async function update () {
  if (!name.value.length) {
    useNotification("error", "Введите название автоматизации")
    return
  }
  if (!newConditions.value.length && removeCondition.value.length === oldConditions.value.length) {
    useNotification("error", "Не выбрано условие активации")
    return
  }
  if (!scenarios.value.length) {
    useNotification("error", "Не выбран сценарий")
    return
  }
  isLoading.value = true
  const timeOffset = Date()?.match(/GMT.\d\d?\d\d/gm) as string[]
  const validTimeOffset = timeOffset[0].replace('GMT', '').substring(0, 3) + ':' + timeOffset[0].replace('GMT', '').substring(3)
  const automationData:IAutomationUpdateProps = {
    id: id as string,
    name: name.value,
    scenarios: scenarios.value.map((el, id) => {
      return {
        scenarioId: el,
        orderId: id,
      }
    }),
    newTrigger: newConditions.value.map((el) => {
      if (el.value.match(/\d\d:\d\d/)) {
        return `2077-01-24T${el.value}:00${validTimeOffset}`
      }
      return el.value
    }),
    removeTriggersIdList: removeCondition.value,
    allConditions: runByAllConditions.value,
  }
  const response = await automationStore.update(automationData)
  // console.log(automationData, response)
  isLoading.value = false
}

async function getData () {
  isLoading.value = true
  const response = await automationStore.getById(id as string)
  isLoading.value = false
  if (!response?.id?.length || !response?.name?.length) {
    window.history.back()
  }
  scenarios.value = response.scenarios.map(el => el.scenarioId)
  name.value = response.name
  runByAllConditions.value = response.allConditions
  response.triggers.time.forEach((el) => {
    const time = new Date(`7/07/2077 ${el.time} UTC`)
    const hours = String(time.getHours()).length === 1 ? `0${time.getHours()}` : time.getHours()
    const minutes = String(time.getMinutes()).length === 1 ? `0${time.getMinutes()}` : time.getMinutes()
    oldConditions.value.push({ id: el.automationTriggerId, type: "time", value: `${hours}:${minutes}` })
  })
  response.triggers.sensors.forEach((el) => {
    oldConditions.value.push({ id: el.automationTriggerId, type: 'sensor', value: { id: el.id, name: el.name, type: el.type } })
  })
}
getData()

async function deleteAutomation () {
  const r = await automationStore.deleteAutomation(id as string)
}
</script>

<style lang="scss">
@import "assets/styles/page/automation-create";
</style>

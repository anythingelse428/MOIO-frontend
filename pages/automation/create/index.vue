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
          <div :class="`automation__run-condition  ${!runByAllConditions ? ' --active' : ''}`" @click="runByAllConditions=false">
            <label for="run_condition-1" class="automation__run-condition-description">
              Если срабатывает одно условие
            </label>
          </div>
          <div :class="`automation__run-condition ${runByAllConditions ? ' --active' : ''}`" @click="runByAllConditions=true">
            <label for="run_condition" class="automation__run-condition-description">Если срабатывают все условия</label>
          </div>
        </div>

        <the-modal :is-shown="showConditionModal" transition-content-name="translate" backdrop-filter="blur(5px)">
          <template #inner>
            <automation-add-condition @hide-modal="showConditionModal=false" @add-condition="e=>{acceptedConditions.push({type:e,id:conditions.length+1});showConditionModal = false}" />
          </template>
        </the-modal>
        <div v-for="item in acceptedConditions" :key="item.id" class="automation__conditions">
          <automation-condition :type="item.type" :sensors="sensors" :curr-sensor="{id: item?.value, name:'', type:'sensor'}" :idx="item.id" @select-option="e=>addConditionInArr(item.id, e?.type, e.value)" />
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
        <input class="automation__submit" type="submit" value="Сохранить">
      </div>
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
import type { IGroupResponseItem } from "~/api/group/getById"
import type { ServiceProps } from "~/components/Service/TheService.vue"

const isLoading = ref(false)
const runByAllConditions = ref(true)
const showConditionModal = ref(false)
const acceptedConditions = ref<{id:number, type:'sensor'|'time', value:string}[]>([])
const groupStore = useGroupsStore()
const scenarios = ref<string[]>([])
const name = ref('')
const sensors = ref<ServiceProps[]>([])
const existingScenarios = await useScenarioStore().getAll()
function deleteCondition (id:number) {
  acceptedConditions.value.splice(
    acceptedConditions.value.findIndex(el => el.id === id),
    1,
  )
}
function addConditionInArr (id:number, type:'sensor'|'time', value:string) {
  const isConditionExist = acceptedConditions.value.findIndex(el => el.id === id)
  const timeOffset = Date()?.match(/GMT.\d\d?\d\d/gm) as string[]
  const validTimeOffset = timeOffset[0].replace('GMT', '').substring(0, 3) + ':' + timeOffset[0].replace('GMT', '').substring(3)
  if (isConditionExist > -1 && type === 'time') {
    acceptedConditions.value[isConditionExist].value = `2077-01-24T${value}:00${validTimeOffset}`
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
    acceptedConditions.value.push({ id, type, value: `2077-01-24T${value}:00${validTimeOffset}` })
  }
  if (isConditionExist === -1 && type === "sensor") {
    acceptedConditions.value.push({ id, type, value })
  }
}

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

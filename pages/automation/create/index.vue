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
        <div v-if="sensors?.length" class="automation__run-conditions">
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

        <ui-modal :is-shown="showConditionModal" transition-content-name="translate" backdrop-filter="blur(5px)">
          <template #inner>
            <automation-add-condition @hide-modal="showConditionModal=false" @add-condition="e=>{addCondition(conditions.length + 1,e,undefined); showConditionModal = false}" />
          </template>
        </ui-modal>
        <div v-for="item in conditions" :key="item.id" class="automation__conditions">
          <automation-condition
            :type="item.type"
            :curr-time="item.type === 'time' ? item.value : undefined"
            :sensors="sensors"
            :curr-sensor="item.type === 'sensor' ? {id: item?.value ?? '', name:'', type:'sensor'} : undefined"
            :idx="item.id ?? conditions.length + 1"
            @select-option="e=>addCondition(item.id, item.type, e.value)"
          />
          <button class="automation__conditions-delete" @click.prevent="deleteCondition(item.id)">
            Удалить
          </button>
        </div>
      </div>
      <button class="automation__add-condition" @click.prevent="setShowConditionalModal()">
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
import UiModal from "~/components/ui/UiModal.vue"
import { useScenarioStore } from "~/store/scenario"
import { useAutomationStore } from "~/store/autmation"
import type { IAutomationCreateProps } from "~/api/automations/create"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import { useGroupsStore } from "~/store/groups"
import type { IGroupResponseItem } from "~/api/group/getById"
import type { ServiceProps } from "~/components/Service/TheService.vue"

const isLoading = ref(false)
const runByAllConditions = ref(false)
const showConditionModal = ref(false)
const conditions = ref<{id:number, type:'sensor'|'time', value:string}[]>([])
const groupStore = useGroupsStore()
const scenarios = ref<string[]>([])
const name = ref('')
const sensors = ref<ServiceProps[]>([])
const existingScenarios = await useScenarioStore().getAll()
function setShowConditionalModal () {
  if (sensors.value.length > 0) {
    showConditionModal.value = true
    return
  }
  conditions.value.push({ type: 'time', id: conditions.value.length + 1, value: Date() })
}
function deleteCondition (id:number) {
  conditions.value.splice(
    conditions.value.findIndex(el => el.id === id),
    1,
  )
}
function addCondition (id:number, type:'sensor'|'time', value:string) {
  const isConditionExist = conditions.value.findIndex(el => el.id === id)
  const timeOffset = Date()?.match(/GMT.\d\d?\d\d/gm) as string[]
  const validTimeOffset = timeOffset[0]
    .replace('GMT', '')
    .substring(0, 3) + ':' + timeOffset[0]
    .replace('GMT', '').substring(3)

  if (isConditionExist > -1) {
    if (type === 'time') {
      conditions.value[isConditionExist].value = `2077-01-24T${value}:00${validTimeOffset}`
      return
    }
    if (type === 'sensor') {
      conditions.value[isConditionExist].value = value
      return
    }
  }
  if (isConditionExist === -1) {
    if (type === 'time') {
      conditions.value.push({ id: conditions.value.length + 1, type, value: Date()?.replace('2077-01-24T', '').replace(/^\+(\d{2})(:?\d{2})?$/, '') })
      return
    }
    if (type === 'sensor') {
      conditions.value.push({ id: conditions.value.length + 1, type, value: sensors.value[0].id })
    }
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
  if (!name.value?.length) {
    useNotification("error", "Введите название автоматизации")
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
      if (el.type === "sensor" && !el.value?.length) {
        useNotification('error', `Не выбран датчик для условия ${el.id}`)
        isSensorsValid = false
      }
      return el.value
    }),
    scenariosOrder: scenarios.value.map((el, id) => {
      return {
        scenarioId: el,
        orderId: id,
      }
    }),
    allConditions: runByAllConditions.value,
  }
  isSensorsValid && await automationStore.create(automationData)
  isLoading.value = false
}
</script>

<style lang="scss">
@import "assets/styles/page/automation-create";
</style>

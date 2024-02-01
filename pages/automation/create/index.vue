<template>
  <div class="automation">
    <h1 class="automation__header">
      Настройка автоматизации
    </h1>
    <div class="automation__params">
      <div class="automation__params-main">
        <div class="automation__param">
          <div class="automation__param-label">
            Название автоматизации
          </div>
          <input class="automation__param-input" type="text">
        </div>
        <div class="automation__param">
          <div class="automation__param-label">
            Активность автоматизации
          </div>
          <div class="automation__param-input">
            <span>Вкл. автоматизацию</span>
            <toggle-switch @check="''" />
          </div>
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
          <automation-condition :type="item.type" :sensors="sensors" :idx="item.id" @select-option="e=>addConditionInArr(item.id, e?.type, e.value)" />
        </div>
      </div>
      <button class="automation__add-condition" @click="showConditionModal = true">
        Добавить условие
      </button>
    </div>
    <div class="scenarios">
      <h2 class="automation__subheader">
        Сценарий
      </h2>
      <div v-for="scenario in existingScenarios" :key="scenario.id" :class="`scenario-item ${scenarios.findIndex(el=>el===scenario.id)>-1?'--active':''}`" @click="selectScenarios(scenario.id)">
        {{ scenario.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToggleSwitch from "~/components/shared/ToggleSwitch.vue"
import TheModal from "~/components/shared/TheModal.vue"
import { useScenarioStore } from "~/store/scenario"

const conditions = ref<{type:'sensor'|'time', id:any}[]>([])
const runByAllConditions = ref(true)
const showConditionModal = ref(false)
const acceptedConditions = ref<{id:any, type:'sensor'|'time', value:string|string[]}[]>([])
const sensors = ref<{id:string, name:string}[]>([
  { id: '123VASdca', name: 'Sen1' },
  { id: '234fSdca', name: 'Sen2' },
  { id: '3VASdvvxa', name: 'Sen3' },
  { id: '4eq223VASdca', name: 'Sen4' },
  { id: '5eq223VASdca', name: 'Sen5' },
  { id: '6eq223VASdca', name: 'Sen6' },
])
const scenarios = ref<string[]>([])
const existingScenarios = await useScenarioStore().getAll()
function addConditionInArr (id:any, type:'sensor'|'time', value:string|string[]) {
  const isConditionExist = acceptedConditions.value.findIndex(el => el.id === id)
  if (isConditionExist > -1 && type === 'time') {
    acceptedConditions.value[isConditionExist].value = value
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
    acceptedConditions.value.push({ id, type, value })
  }
  if (isConditionExist === -1 && type === "sensor") {
    acceptedConditions.value.push({ id, type, value })
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

</script>

<style lang="scss">
@import "assets/styles/page/automation-create";
</style>

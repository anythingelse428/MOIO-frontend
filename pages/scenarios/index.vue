<template>
  <div class="scenarios">
    <loader-screen :is-loading="isLoading" />
    <h1 class="scenarios__header">
      Сценарии
    </h1>
    <div class="scenarios-available">
      <h2 class="scenarios-available__header">
        Список доступных сценариев
      </h2>
      <div class="scenarios-available__list">
        <div v-for="scenario in scenarios" :key="scenario.id" class="scenarios-available__list-item" @click="executeScenario(scenario.id)">
          {{ scenario.name }}
          <div class="scenarios-available__list-item-edit">
            <icon name="pencil" role="link" @click.stop="redirect(`scenarios/edit/${scenario.id}`)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useScenarioStore } from "~/store/scenario"
import type { IAllScenariosResponse } from "~/api/scenarios/getAll"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import Icon from "~/components/shared/Icon.vue"

const isLoading = ref(true)
const scenarios = ref<IAllScenariosResponse[]>([])
const scenarioStore = useScenarioStore()
scenarios.value = await scenarioStore.getAll() as IAllScenariosResponse[]
isLoading.value = false

async function executeScenario (id:string) {
  isLoading.value = true
  await scenarioStore.executeScenario(id)
  isLoading.value = false
}
function redirect (to:string) {
  useRouter().push(to)
}
</script>

<style lang="scss">
@import "assets/styles/page/scenarios";
</style>

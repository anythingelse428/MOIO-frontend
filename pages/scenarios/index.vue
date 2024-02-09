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

import router from "#app/plugins/router"
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
.scenarios {
  &__header{
    font-size: 40px;
    font-weight: 600;
    text-align: center;
  }
  .scenarios-available{
    &__header {
      font-size: 20px;
      font-weight: 600;
      margin-top: 32px;
      text-align: center;
    }
    &__list{
      padding-inline: min(200px, 20%);
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
      gap:48px;
      &-item{
        display: block;
        background: $settings-color;
        padding: 20px;
        position: relative;
        font-size: 20px;
        font-weight: 600;
        height: 120px;
        width: calc(50% - 40px);
        border-radius: 12px;
        cursor: pointer;
        .ui-icon {
          position: absolute;
          color: $color-active!important;
          right: 24px;
          bottom: 20px;
          font-size: 28px!important;
        }
      }
    }
  }
}
</style>

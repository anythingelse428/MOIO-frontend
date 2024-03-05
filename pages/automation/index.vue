<template>
  <div class="scenarios">
    <loader-screen :is-loading="isLoading" />
    <h1 class="scenarios__header">
      Автоматизации
    </h1>
    <div class="scenarios-available">
      <h2 class="scenarios-available__header">
        Список доступных автоматизаций
      </h2>
      <div class="scenarios-available__list">
        <div v-for="scenario in scenarios" :key="scenario.id" class="scenarios-available__list-item" @click.stop="redirect(`automation/${scenario.id}`)">
          <div class="scenarios-available__list-item-name">
            {{ scenario.name }}
          </div>
          <div class="scenarios-available__list-item-edit">
            <icon name="pencil" role="link" @click.stop="redirect(`automation/${scenario.id}`)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { IAllScenariosResponse } from "~/api/scenarios/getAll"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import { useAutomationStore } from "~/store/autmation"
import Icon from "~/components/shared/Icon.vue"

const isLoading = ref(true)
const scenarios = ref<IAllScenariosResponse[]>([])
const scenarioStore = useAutomationStore()
scenarios.value = await scenarioStore.getAll() as IAllScenariosResponse[]
isLoading.value = false


function redirect (to:string) {
  useRouter().push(to)
}
</script>

<style lang="scss">
@import "assets/styles/page/scenarios";
</style>

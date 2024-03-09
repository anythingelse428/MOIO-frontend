<template>
  <div class="automation-add-condition">
    <div class="automation-add-condition__header">
      Добавить условие
      <ui-icon name="close" role="button" color="#fff" @click="emit('hide-modal')" />
    </div>
    <form class="automation-add-condition__form" @submit.prevent="emit('add-condition', condition)">
      <div class="automation-add-condition__conditions">
        <div :class="`automation-add-condition__condition ${condition==='time'&&'--active'}`" @click="condition='time'">
          <ui-icon name="service/devices/clock-time-three-outline" size="100" />
          <div class="automation-add-condition__condition-name">
            Время
          </div>
        </div>
        <div :class="`automation-add-condition__condition ${condition==='sensor'&&'--active'}`" @click="condition='sensor'">
          <ui-icon name="service/sensor/leak" size="100" />
          <div class="automation-add-condition__condition-name">
            Датчик
          </div>
        </div>
      </div>
      <ui-button type="submit" rounded="16px" class="automation-add-condition__submit" padding="8px 12px">
        Добавить
      </ui-button>
    </form>
  </div>
</template>

<script setup lang="ts">
import UiIcon from "~/components/ui/UiIcon.vue"

const emit = defineEmits(['add-condition', 'hide-modal'])
const condition = ref<'sensor'|'time'>('time')
</script>

<style lang="scss">
@import "assets/styles/components/automation-add-condition-modal";
</style>

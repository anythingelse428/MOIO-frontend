<template>
  <div class="automation-add-condition">
    <div class="automation-add-condition__header">
      Добавить условие
      <icon name="close" role="button" color="#fff" @click="emit('hide-modal')" />
    </div>
    <form class="automation-add-condition__form" @submit.prevent="emit('add-condition', condition)">
      <div class="automation-add-condition__conditions">
        <div :class="`automation-add-condition__condition ${condition==='time'&&'--active'}`" @click="condition='time'">
          <icon name="service/devices/clock-time-three-outline" size="100" />
          <div class="automation-add-condition__condition-name">
            Время
          </div>
        </div>
        <div :class="`automation-add-condition__condition ${condition==='sensor'&&'--active'}`" @click="condition='sensor'">
          <icon name="service/sensor/leak" size="100" />
          <div class="automation-add-condition__condition-name">
            Датчик
          </div>
        </div>
      </div>
      <input type="submit" value="Добавить" class="automation-add-condition__submit">
    </form>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/shared/Icon.vue"

const emit = defineEmits(['add-condition', 'hide-modal'])
const condition = ref<'sensor'|'time'>('time')
</script>

<style lang="scss">
@import "assets/styles/components/automation-add-condition-modal";
</style>

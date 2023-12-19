<template>
  <div class="automation">
    <h1 class="automation-header">
      Автоматизации
    </h1>
    <h2 class="automation-subheader">
      Настройте аксессуары, чтобы они реагировали на изменения в доме
    </h2>
    <div class="automation-items">
      <automation-item
        v-for="item in automations"
        :id="item.id"
        :key="item.id"
        :automation-name="item.automationName"
        :device-type="item.deviceType"
        :activation-event="item.activationEvent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

const automations = ref([
  {
    id: 0,
    automationName: 'Ванная Свет',
    deviceType: 'Свет',
    activationEvent: 'Включать при движении',
  },
  {
    id: 1,
    automationName: 'Кухня Лампочка',
    deviceType: 'Свет',
    activationEvent: 'Включать вечером',
  },
  {
    id: 2,
    automationName: 'Прихожая Свет',
    deviceType: 'Свет',
    activationEvent: 'Включать ночью',
  },
])
</script>

<style lang="scss">
@import "assets/styles/page/automation";
</style>

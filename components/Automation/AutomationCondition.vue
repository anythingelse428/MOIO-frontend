<template>
  <div class="automation-condition">
    <h2 class="automation-condition__header">
      Условие {{ idx }}
    </h2>
    <div class="automation-condition__body">
      <div class="automation-condition__description">
        {{ type==='sensor'?'Сценарий выполняется если сработал датчик':'Время начала активности автоматизации:' }}
      </div>
      <div v-if="type==='time'" class="automation-condition__value">
        <input id="" v-model="time" type="time" name=""> часов
      </div>
      <div v-if="type==='sensor'" class="automation-condition__sensors">
        <div
          v-for="sensor in sensors"
          :key="sensor.id"
          class="automation-condition__sensor"
          @click="emits('select-option',{type,value:sensor.id})"
        >
          <span class="mdi mdi-leak" />
          <input type="checkbox">
          <span class="mask" />
          {{ sensor.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AutomationConditionProps {
  idx:number|string
  type:'sensor'|'time'
  sensors?:{
    id:string,
    name:string,
  }[]
}
const props = defineProps<AutomationConditionProps>()
const emits = defineEmits(['select-option'])
const time = ref('')
watch(time, (newVal) => {
  emits('select-option', { type: 'time', value: newVal })
})
</script>

<style lang="scss">
.automation-condition {
  margin-top: 32px;
  &__header{
    font-size: 24px;
    font-weight: 600;
  }
  &__description{
    margin-top: 24px;
  }
  &__value{
    margin-top: 20px;
    width: 212px;
    border-radius: 16px;
    border: 1px solid $color-active;
    padding: 20px 24px;
    input[type="time"]{
      background: $color-active;
      border-radius: 16px;
      padding: 10px 8px;
      color: $color-accent;
      border: 0;
    }
  }
  &__sensors{
    display: flex;
    gap:28px;
    flex-wrap: wrap;
  }
  &__sensor{
    background: $settings-color;
    margin-top: 20px;
    border-radius: 12px;
    width: max(192px, calc(25% - 28px));
    padding: 8px 12px;
    display: flex;
    min-height: 76px;
    gap: 14px;
    position: relative;
    input{
     cursor: pointer;
      position: absolute;
      inset: 0;
      opacity: 0;
      z-index: 2;
    }
    .mask {
      position: absolute;
      inset: 0;
      border-radius: 12px;
      border: 1px solid transparent;
    }
    input:checked + .mask{
      border: 1px solid $color-active;
      box-shadow: 0px 0px 16px 0px $color-active;
    }
    .mdi {
      margin: auto 0;
      font-size: 36px;
    }
  }
}
</style>

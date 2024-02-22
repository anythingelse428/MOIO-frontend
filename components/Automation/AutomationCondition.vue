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
        {{ Date().match(/GMT.\d\d?\d\d/gm)[0] }}
        <input v-model="time" type="time" name="" :disabled="Number(editable) === 0"> часов
      </div>
      <div v-if="type==='sensor'" class="automation-condition__sensors">
        <div
          v-for="sensor in sensors"
          :key="sensor.id"
          class="automation-condition__sensor"
          @click="editable&&emit('select-option',{type,value:sensor.id})"
        >
          <icon :name="useIcoByDeviceType(sensor.type).name" size="28" />
          <span :class="`mask ${sensor.id === currSensor.id&&' --active'}`" />
          {{ sensor.name }}
        </div>
        <div v-if="currSensor?.id&&!editable" class="automation-condition__sensor">
          <icon :name="useIcoByDeviceType(currSensor.type).name" size="28" />
          <span class="mask --active" />
          {{ currSensor.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/shared/Icon.vue"

export interface AutomationConditionProps {
  idx:number|string
  type:'sensor'|'time'
  sensors?:{
    id:string,
    name:string,
    type:string
  }[],
  currTime?:string,
  currSensor?:{
    id:string
    name:string
    type:string
  }
  editable?:boolean
}
const props = withDefaults(defineProps<AutomationConditionProps>(), { currTime: `${new Date().getHours()}:${new Date().getMinutes()}`, currSensor: { id: '', name: '', type: '' }, editable: true })
const emit = defineEmits(['select-option'])
const time = computed({
  get () {
    if (props.currTime.includes('2077-01-24T')) {
      return props.currTime.replace('2077-01-24T', '').replace(/.\d\d?\d\d/, '')
    }
    return props.currTime
  },
  set (val) {
    emit('select-option', { type: 'time', value: val })
  },
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
    input[type="radio"] {
      cursor: pointer;
      position: absolute;
      inset: 0;
      opacity: 0.5;
      z-index: 10;
    }
    .mask {
      position: absolute;
      inset: 0;
      border-radius: 12px;
      border: 1px solid transparent;
      z-index: 0;
      &.--active{
        border: 1px solid $color-active;
        box-shadow: 0px 0px 16px 0px $color-active;
        -webkit-box-shadow: 0px 0px 16px 0px $color-active;
      }
    }
    .mdi {
      margin: auto 0;
      font-size: 36px;
    }
  }
}
</style>

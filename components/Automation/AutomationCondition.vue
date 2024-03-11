<template>
  <div class="automation-condition">
    <h2 class="automation-condition__header">
      Условие {{ idx }}
    </h2>
    <div class="automation-condition__body">
      <div class="automation-condition__description">
        {{ type==='sensor'?'Сценарий выполняется если сработал датчик':'Время начала активности автоматизации:' }}
      </div>
      <div v-if="type==='time'" class="automation-condition__value" @click="openTimeSelect">
        {{ Date().match(/GMT.\d\d?\d\d/gm)[0] }}
        <input
          ref="timeInput"
          v-model="time"
          type="time"
          name=""
          :disabled="Number(editable) === 0"
          @keydown.enter.stop="false"
          @keydown.enter.prevent="false"
        > часов
      </div>
      <div v-if="type==='sensor'" class="automation-condition__sensors">
        <div
          v-for="sensor in sensors"
          :key="sensor.id"
          class="automation-condition__sensor"
          @click="editable&&emit('select-option',{type:'sensor',value:sensor.id})"
        >
          <ui-icon :name="useIcoByDeviceType(sensor.type).name" size="28" />
          <span :class="`mask ${sensor.id === currSensor.id&&' --active'}`" />
          {{ sensor.name }}
        </div>
        <div v-if="currSensor?.id&&!editable" class="automation-condition__sensor">
          <ui-icon :name="useIcoByDeviceType(currSensor.type).name" size="28" />
          <span class="mask --active" />
          {{ currSensor.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiIcon from "~/components/ui/UiIcon.vue"

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
const props = withDefaults(defineProps<AutomationConditionProps>(), { currTime: undefined, currSensor: undefined, editable: true })
const emit = defineEmits(['select-option'])
const time = props.type === 'time' && computed({
  get () {
    const timezoneOffsetRegex = /(\+|-)?(\d{2}):(\d{2})/
    const match = props.currTime?.replace('2077-01-24T', '').match(timezoneOffsetRegex)
    if (match) {
      return match[0]
    }
    return props.currTime?.replace('2077-01-24T', '')
  },
  set (value) {
    emit('select-option', { type: 'time', value })
  },
})
const timeInput = ref<InstanceType<typeof HTMLInputElement>>()
function openTimeSelect () {
  if (props.editable || typeof props.editable === 'undefined') {
    timeInput.value?.showPicker()
  }
}
onMounted(() => {
  props.type === 'time' && emit('select-option', { type: 'time', value: props.currTime })
})
</script>

<style lang="scss">
@import "assets/styles/components/automation-condition";
</style>

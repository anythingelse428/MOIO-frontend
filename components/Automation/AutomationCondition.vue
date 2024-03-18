<template>
  <div class="automation-condition">
    <h2 class="automation-condition__header">
      Условие {{ idx }}
    </h2>
    <div class="automation-condition__body">
      <div class="automation-condition__description">
        {{ !type.includes('time')
          ? 'Сценарий выполняется если сработал датчик'
          : 'Время начала активности автоматизации:'
        }}
      </div>
      <div
        v-if="type===AutomationConditionTypesEnum.time"
        class="automation-condition__time"
        @click="openTimeSelect"
      >
        <div class="automation-condition__time-offset">
          {{ Date().match(/GMT.\d\d?\d\d/gm)[0] }}
        </div>
        <div class="automation-condition__time-value">
          <input
            ref="timeInput"
            v-model="timePoint"
            type="time"
            :disabled="Number(editable) === 0"
            @keydown.enter.stop="false"
            @keydown.enter.prevent="false"
          > часов
        </div>
      </div>
      <div
        v-if="type === AutomationConditionTypesEnum.timeRange"
        class="automation-condition__time"
        @click="openTimeSelect"
      >
        <div class="automation-condition__time-offset">
          {{ Date().match(/GMT.\d\d?\d\d/gm)[0] }}
        </div>
        <div class="automation-condition__time-value">
          <input
            ref="timeInput"
            v-model="timeStart"
            type="time"
            name=""
            :disabled="Number(editable) === 0"
            @keydown.enter.stop="false"
            @keydown.enter.prevent="false"
          >
          -
          <input
            ref="timeInput"
            v-model="timeEnd"
            type="time"
            name=""
            :disabled="Number(editable) === 0"
            @keydown.enter.stop="false"
            @keydown.enter.prevent="false"
          >
          часов
        </div>
      </div>
      <div
        v-if="type === AutomationConditionTypesEnum.sensor ||
          type === AutomationConditionTypesEnum.temperature"
        class="automation-condition__sensors"
      >
        <div
          v-for="sensor in sensors"
          :key="sensor.id"
          :class="`automation-condition__sensor ${editable?'--editable':''}`"
          @click="editable&&emit('select-option',{type, value:sensor.id})"
        >
          <ui-icon
            :name="useIcoByDeviceType(sensor.type).name"
            size="28"
          />
          <span :class="`mask ${sensor.id === deviceId &&' --active'}`" />
          <div class="automation-condition__sensor-info">
            {{ sensor.name }}
            <div
              v-if="(temperatureRange||automationCondition) && sensor.id === deviceId"
              class="automation-condition__sensor-value"
            >
              {{ temperatureRange&&temperatureRange.min + '°C-' + temperatureRange.max + '°C' }}
              {{ automationCondition&&automationCondition.value + '°C' }}
            </div>
          </div>
          <span
            v-if="automationCondition && sensor.id === deviceId"
            class="automation-condition__sensor-condition"
          >
            {{ conditionSymbols[automationCondition.condition] }}
          </span>
        </div>
        <div v-if="typeof timeRange !== 'undefined'" class="automation-condition__sensor-time-range">
          <div class="automation-condition__time">
            <input
              ref="timeInputStart"
              v-model="timeStart"
              type="time"
              name=""
              :disabled="Number(editable) === 0"
              @keydown.enter.stop="false"
              @keydown.enter.prevent="false"
            >
            -
            <input
              ref="timeInputEnd"
              v-model="timeEnd"
              type="time"
              name=""
              :disabled="Number(editable) === 0"
              @keydown.enter.stop="false"
              @keydown.enter.prevent="false"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiIcon from "~/components/ui/UiIcon.vue"
import type { ICapability, ServiceProps } from "~/components/Service/TheService.vue"
import type { IAutomationValue } from "~/api/automations/create"

enum AutomationConditionTypesEnum {
  sensor='sensor',
  temperature='temperature',
  time='time',
  timeRange='time-range',
}
export type AutomationConditionTypes = AutomationConditionTypesEnum
export interface AutomationConditionProps {
  idx:number|string
  type:AutomationConditionTypes
  sensors?:{
    id:string,
    name:string,
    type:string
    range?:ICapability["range"]
  }[],
  editable?:boolean
}
const props = withDefaults(defineProps<AutomationConditionProps & IAutomationValue>(),
  {
    timeRange: undefined,
    currTime: undefined,
    currSensor: undefined,
    editable: true,
    deviceId: undefined,
    temperatureRange: undefined,
    automationCondition: undefined,
    range: undefined,
  },
)
const emit = defineEmits(['select-option', 'add-sensor-condition'])
const conditionSymbols = ['<', '>', '=']
const timeInput = ref<InstanceType<typeof HTMLInputElement>>()
const timeInputStart = ref<InstanceType<typeof HTMLInputElement>>()
const timeInputEnd = ref<InstanceType<typeof HTMLInputElement>>()
const timePoint = props.type === 'time' && computed({
  get () {
    return props.time
  },
  set (value) {
    emit('select-option', { type: 'time', value })
  },
})
const timeEnd = props.type === 'time-range' && computed({
  get () {
    return props.timeRange?.endTime ?? '00:00'
  },
  set (value) {
    console.log(value)
    emit('select-option', {
      type: 'time-range',
      value: {
        startTime: props.timeRange?.startTime ?? '00:00',
        endTime: value,
      },
    })
  },
})
const timeStart = props.type === 'time-range' && computed({
  get () {
    return props.timeRange?.startTime ?? '00:00'
  },
  set (value) {
    console.log(value)
    emit('select-option', {
      type: 'time-range',
      value: {
        startTime: value,
        endTime: props.timeRange?.endTime ?? '00:00',
      },
    })
  },
})
function openTimeSelect () {
  if (props.editable) {
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

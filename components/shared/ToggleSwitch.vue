<template>
  <div :class="`toggle-switch-wrapper${verticalLarge?'--vertical-large':''}`">
    <label v-if="verticalLarge" for="toggle-switch">Вкл.</label>
    <div :class="`toggle-switch ${verticalLarge?'--vertical-large':''}`">
      <input id="toggle-switch" v-model="currentValue" type="checkbox" class="toggle-switch__checkbox">
      <div class="toggle-switch__button">
        <div class="toggle-switch__button-icon">
          <icon v-if="verticalLarge" :name="ico" size="40" />
        </div>
      </div>
      <div class="toggle-switch__layer" />
    </div>
    <label v-if="verticalLarge" for="toggle-switch">Выкл.</label>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/shared/Icon.vue"
import type { TUiIconNames } from "#build/types/ui-icon"
export interface IToggleSwitchProps {
  checked:boolean
  verticalLarge:boolean
  ico?:TUiIconNames
}
const props = withDefaults(defineProps<IToggleSwitchProps>(), { ico: 'service/help' })
const emit = defineEmits(['check'])
const currentValue = computed({
  get () {
    return props.checked
  },
  set (value) {
    emit('check', value)
  },
})
</script>

<style lang="scss">
@import "assets/styles/components/toggle-switch";
.toggle-switch {
  &__button {
    z-index: 2;
    &-icon {
      position: absolute;
      width: 20px;
      height: 10px;
      padding: 9px 4px;
      background-color: $color-active;
      border-radius: 50%;
      transition: all 0.3s;
      will-change: background-color, color;
      font-size: 20px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $thumb-color!important;
    }
  }
}
</style>
